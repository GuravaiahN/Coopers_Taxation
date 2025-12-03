import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/utils/db';
import DocumentModel from '@/models/Document';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check authentication first
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user.role !== 'admin' && !session.user.isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection is not established');
    }

    const url = new URL(request.url);
    const exportAll = url.searchParams.get('export') === 'all'; // Check for export flag
    const page = parseInt(url.searchParams.get('page') || '1', 10); // Default to page 1
    const limit = parseInt(url.searchParams.get('limit') || '10', 10); // Default to 10 items per page
    const skip = (page - 1) * limit;

    // Fetch documents from the Document collection instead of RefundRequest
    const documents = exportAll
      ? await DocumentModel.find({}).populate('userId', 'name email').lean()
      : await DocumentModel.find({})
          .populate('userId', 'name email')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean();

    const totalFiles = await DocumentModel.countDocuments();

    // Transform the documents to match the expected format
    const allUserFilesWithDetails = documents.map((doc: any) => ({
      _id: doc._id,
      userId: doc.userId?._id,
      userName: doc.userId?.name || doc.clientInfo?.name || 'Unknown',
      userEmail: doc.userId?.email || doc.clientInfo?.email || 'Unknown',
      originalName: doc.originalName,
      filename: doc.originalName,
      fileId: doc.fileId,
      size: doc.size,
      mimeType: doc.mimeType || doc.mimetype,
      status: doc.status,
      taxYear: doc.taxYear,
      notes: doc.notes,
      clientInfo: doc.clientInfo,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    }));

    // Handle export logic
    if (exportAll) {
      return NextResponse.json(
        {
          success: true,
          data: allUserFilesWithDetails,
        },
        {
          headers: { 'Cache-Control': 'no-store' }, // Prevent caching
        }
      );
    }

    // Paginated response
    return NextResponse.json(
      {
        success: true,
        users: allUserFilesWithDetails,
        totalPages: Math.ceil(totalFiles / limit),
        currentPage: page,
        totalUsers: totalFiles,
      },
      {
        headers: { 'Cache-Control': 'no-store' }, // Prevent caching
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