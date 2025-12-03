import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/utils/db';
import { requireAdmin } from '@/utils/sessionAuth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    await requireAdmin(request);

    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection is not established');
    }

    const url = new URL(request.url);
    const exportAll = url.searchParams.get('export') === 'all';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';
    const fileType = url.searchParams.get('fileType') || '';
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';
    const skip = (page - 1) * limit;

    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'documents',
    });

    // Import document models
    const DocumentModel = (await import('@/models/Document')).default;

    // Build query
    const query: any = {};
    
    if (search) {
      // If search looks like an email, search by user email
      if (search.includes('@')) {
        // First find user by email
        const UserModel = (await import('@/models/User')).default;
        const user = await UserModel.findOne({ email: { $regex: search, $options: 'i' } }).lean();
        if (user) {
          query.userId = user._id;
        } else {
          // If no user found, set impossible query to return no results
          query._id = null;
        }
      } else {
        // Search in document fields
        query.$or = [
          { originalName: { $regex: search, $options: 'i' } },
          { filename: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { notes: { $regex: search, $options: 'i' } }
        ];
      }
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (fileType && fileType !== 'all') {
      if (fileType === 'pdf') {
        query.mimeType = { $regex: 'pdf', $options: 'i' };
      } else if (fileType === 'image') {
        query.mimeType = { $regex: 'image', $options: 'i' };
      } else if (fileType === 'document') {
        query.mimeType = { $regex: 'application', $options: 'i' };
      }
    }

    // Build sort object
    const sortObj: any = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Fetch document data with search, filtering, and pagination
    const documents = exportAll
      ? await DocumentModel.find(query).populate('userId', 'name email').lean()
      : await DocumentModel.find(query)
          .populate('userId', 'name email')
          .sort(sortObj)
          .skip(skip)
          .limit(limit)
          .lean();

    const totalFiles = await DocumentModel.countDocuments(query);

    // Get stats for dashboard
    const totalAllFiles = await DocumentModel.countDocuments();
    const completedFiles = await DocumentModel.countDocuments({ status: 'COMPLETED' });
    const processingFiles = await DocumentModel.countDocuments({ status: 'PROCESSING' });
    const rejectedFiles = await DocumentModel.countDocuments({ status: 'REJECTED' });

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

    // Paginated response with stats
    return NextResponse.json(
      {
        success: true,
        documents: documentsWithDetails,
        totalPages: Math.ceil(totalFiles / limit),
        currentPage: page,
        totalDocuments: totalFiles,
        stats: {
          total: totalAllFiles,
          completed: completedFiles,
          processing: processingFiles,
          rejected: rejectedFiles,
          uploaded: totalAllFiles - completedFiles - processingFiles - rejectedFiles
        }
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