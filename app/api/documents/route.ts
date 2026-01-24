import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import DocumentModel from '@/models/Document';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    console.log('Document upload started');
    
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('User authenticated:', session.user.email);
    
    // Connect to database
    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log('File received:', file.name, 'Size:', file.size, 'Type:', file.type);

    // Validate file type and size
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Please upload PDF, DOC, DOCX, or image files.' 
      }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return NextResponse.json({ 
        error: 'File size too large. Maximum size is 10MB.' 
      }, { status: 400 });
    }

    // Find user to get their ObjectId
    const User = (await import('@/models/User')).default;
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('User found:', user._id);

    // Create GridFS bucket
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'documents'
    });

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload file to GridFS
    const uploadStream = bucket.openUploadStream(file.name, {
      metadata: {
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        uploadedBy: user._id.toString(),
        uploadedAt: new Date()
      }
    });

    return new Promise((resolve) => {
      uploadStream.on('error', (error) => {
        console.error('GridFS upload error:', error);
        resolve(NextResponse.json(
          { error: 'Failed to upload file to storage' },
          { status: 500 }
        ));
      });

      uploadStream.on('finish', async () => {
        try {
          console.log(`GridFS upload finished. File ID: ${uploadStream.id}`);
          
          // Verify file exists in GridFS
          const gridfsFile = await db.collection('documents.files').findOne({
            _id: uploadStream.id
          });

          if (!gridfsFile) {
            console.error('CRITICAL: GridFS file not found after upload');
            resolve(NextResponse.json(
              { error: 'File upload verification failed' },
              { status: 500 }
            ));
            return;
          }

          console.log(`GridFS verification passed. File size: ${gridfsFile.length} bytes`);

          // Save document metadata to MongoDB
          const document = await DocumentModel.create({
            fileId: uploadStream.id,
            originalName: file.name,
            mimeType: file.type,
            size: file.size,
            uploadedBy: user._id,
            userId: user._id,
            status: 'UPLOADED',
            createdAt: new Date()
          });

          console.log(`Document saved. ID: ${document._id}, fileId: ${uploadStream.id}`);

          resolve(NextResponse.json({
            success: true,
            document: {
              id: document._id,
              filename: document.originalName,
              originalName: document.originalName,
              size: document.size,
              status: document.status,
              createdAt: document.createdAt,
              fileId: uploadStream.id.toString()
            }
          }));
        } catch (dbError) {
          console.error('Database save error:', dbError);
          
          // Clean up GridFS file if document save fails
          try {
            await bucket.delete(uploadStream.id);
            console.log('Cleaned up GridFS file after DB save failure');
          } catch (cleanupError) {
            console.error('Failed to cleanup GridFS file:', cleanupError);
          }
          
          resolve(NextResponse.json(
            { error: 'Failed to save document metadata' },
            { status: 500 }
          ));
        }
      });

      // Write buffer to upload stream
      uploadStream.end(buffer);
    });

  } catch (error) {
    console.error('Document upload error:', error);
    
    return NextResponse.json({ 
      error: 'Failed to upload document' 
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Connect to database
    await connectToDatabase();

    // Find the user to get their ID
    const User = (await import('@/models/User')).default;
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const fileType = searchParams.get('fileType') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query - use the user's ObjectId
    const query: any = { userId: user._id };
    
    if (search) {
      query.$or = [
        { originalName: { $regex: search, $options: 'i' } },
        { filename: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (fileType && fileType !== 'all') {
      if (fileType === 'pdf') {
        query.mimetype = { $regex: 'pdf', $options: 'i' };
      } else if (fileType === 'image') {
        query.mimetype = { $regex: 'image', $options: 'i' };
      } else if (fileType === 'document') {
        query.mimetype = { $regex: 'application', $options: 'i' };
      }
    }

    // Build sort object
    const sortObj: any = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get total count
    const totalDocuments = await DocumentModel.countDocuments(query);

    // Get user's documents with search, filtering, and pagination
    const documents = await DocumentModel.find(query)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('filename originalName size status createdAt isShared description mimetype');

    // Get stats for user using ObjectId instead of email
    const totalUserDocs = await DocumentModel.countDocuments({ userId: user._id });
    const completedDocs = await DocumentModel.countDocuments({ userId: user._id, status: 'COMPLETED' });
    const processingDocs = await DocumentModel.countDocuments({ userId: user._id, status: 'PROCESSING' });
    const sharedDocs = await DocumentModel.countDocuments({ userId: user._id, isShared: true });

    return NextResponse.json({
      success: true,
      documents,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalDocuments / limit),
        totalDocuments,
        hasMore: page * limit < totalDocuments
      },
      stats: {
        total: totalUserDocs,
        completed: completedDocs,
        processing: processingDocs,
        uploaded: totalUserDocs - completedDocs - processingDocs,
        shared: sharedDocs
      }
    });

  } catch (error) {
    console.error('Document fetch error:', error);
    
    return NextResponse.json({ 
      error: 'Failed to retrieve documents' 
    }, { status: 500 });
  }
}