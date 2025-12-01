import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/utils/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Verify JWT token for admin access
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userEmail = decoded.email;

    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection is not established');
    }

    // Check if user is admin
    const UserModel = (await import('@/models/User')).default;
    const user = await UserModel.findOne({ email: userEmail });
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const url = new URL(request.url);
    const exportAll = url.searchParams.get('export') === 'all';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'documents',
    });

    // Import document models
    const DocumentModel = (await import('@/models/Document')).default;

    // Fetch document data with pagination
    const documents = exportAll
      ? await DocumentModel.find({}).populate('userId', 'name email').lean()
      : await DocumentModel.find({})
          .populate('userId', 'name email')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean();

    const totalFiles = await DocumentModel.countDocuments();

    // For all documents, fetch file details from GridFS if fileId exists
    const documentsWithDetails = await Promise.all(
      documents.map(async (doc: any) => {
        if (doc.fileId) {
          try {
            const objectId = new mongoose.Types.ObjectId(doc.fileId);
            const files = await bucket.find({ _id: objectId }).toArray();
            const file = files[0];
            
            return {
              ...doc,
              filename: file ? file.filename : 'Unknown file',
              uploadDate: file ? file.uploadDate : doc.createdAt,
              fileSize: file ? file.length : 0,
            };
          } catch (error) {
            console.error('Error fetching file details:', error);
            return {
              ...doc,
              filename: 'File not found',
              uploadDate: doc.createdAt,
              fileSize: 0,
            };
          }
        }
        return doc;
      })
    );

    // Handle export logic
    if (exportAll) {
      return NextResponse.json(
        {
          success: true,
          data: documentsWithDetails,
        },
        {
          headers: { 'Cache-Control': 'no-store' },
        }
      );
    }

    // Paginated response
    return NextResponse.json(
      {
        success: true,
        documents: documentsWithDetails,
        totalPages: Math.ceil(totalFiles / limit),
        currentPage: page,
        totalDocuments: totalFiles,
      },
      {
        headers: { 'Cache-Control': 'no-store' },
      }
    );
  } catch (error) {
    console.error('Error fetching admin files:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}