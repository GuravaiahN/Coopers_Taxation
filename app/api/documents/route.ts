import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import DocumentModel from '@/models/Document';
import { authenticateUser } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const user = await authenticateUser(req);
    
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

    // Save document info to database
    const document = await DocumentModel.create({
      filename,
      originalName: file.name,
      mimetype: file.type,
      size: file.size,
      path: filePath,
      uploadedBy: user.userId,
      userId: user.userId,
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
    
    if (error instanceof Error && (error.message === 'No token provided' || error.message === 'Invalid token')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to upload document' 
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const user = await authenticateUser(req);
    
    // Connect to database
    await connectToDatabase();

    // Get user's documents
    const documents = await DocumentModel.find({ userId: user.userId })
      .sort({ createdAt: -1 })
      .select('filename originalName size status createdAt isShared description');

    return NextResponse.json({
      success: true,
      documents
    });

  } catch (error) {
    console.error('Document fetch error:', error);
    
    if (error instanceof Error && (error.message === 'No token provided' || error.message === 'Invalid token')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to retrieve documents' 
    }, { status: 500 });
  }
}