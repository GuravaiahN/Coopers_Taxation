import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import DocumentModel from '@/models/Document';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Connect to database
    await connectToDatabase();
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

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

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // Save file to uploads directory
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadsDir = join(process.cwd(), 'uploads');
    const filePath = join(uploadsDir, filename);
    
    // Create uploads directory if it doesn't exist
    const fs = require('fs');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    await writeFile(filePath, buffer);

    // Connect to database and find user to get their ObjectId
    const User = (await import('@/models/User')).default;
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Save document info to database
    const document = await DocumentModel.create({
      filename,
      originalName: file.name,
      mimetype: file.type,
      size: file.size,
      path: filePath,
      uploadedBy: user._id, // Use user's ObjectId instead of email
      userId: user._id,     // Use user's ObjectId instead of email
      status: 'UPLOADED'
    });

    return NextResponse.json({
      success: true,
      document: {
        id: document._id,
        filename: document.filename,
        originalName: document.originalName,
        size: document.size,
        status: document.status,
        createdAt: document.createdAt
      }
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