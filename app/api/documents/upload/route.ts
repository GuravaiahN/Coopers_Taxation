import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../utils/db';
import DocumentModel from '../../../../models/Document';
import { requireAuth } from '../../../../utils/sessionAuth';
import mongoose from 'mongoose';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('Upload API called');
    
    // Verify user authentication
    const session = await requireAuth(request);
    console.log('Session authenticated:', session);
    
    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection is not established');
    }

    const formData = await request.formData();
    const file = formData.get('document') as File;
    const notes = formData.get('notes') as string || '';
    const taxYear = formData.get('taxYear') as string || new Date().getFullYear().toString();
    const clientName = formData.get('clientName') as string || session.name;
    const clientEmail = formData.get('clientEmail') as string || session.email;
    const clientPhone = formData.get('clientPhone') as string || '';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload PDF, JPG, PNG, DOC, or DOCX files.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Create GridFS bucket for file storage
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
        uploadedBy: session.id,
        uploadedAt: new Date(),
        taxYear,
        clientName,
        clientEmail,
        clientPhone
      }
    });

    return new Promise((resolve) => {
      uploadStream.on('error', (error) => {
        console.error('GridFS upload error:', error);
        resolve(NextResponse.json(
          { error: 'Failed to upload file' },
          { status: 500 }
        ));
      });

      uploadStream.on('finish', async () => {
        try {
          // Save document metadata to MongoDB
          const document = new DocumentModel({
            fileId: uploadStream.id,
            originalName: file.name,
            mimeType: file.type,
            size: file.size,
            userId: session.id,
            taxYear,
            notes,
            clientInfo: {
              name: clientName,
              email: clientEmail,
              phone: clientPhone
            },
            status: 'UPLOADED',
            createdAt: new Date()
          });

          await document.save();

          resolve(NextResponse.json({
            success: true,
            message: 'Document uploaded successfully',
            documentId: document._id,
            fileId: uploadStream.id
          }));
        } catch (dbError) {
          console.error('Database save error:', dbError);
          resolve(NextResponse.json(
            { error: 'Failed to save document metadata' },
            { status: 500 }
          ));
        }
      });

      // Write the file buffer to the stream
      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Unauthorized - Please login') {
        return NextResponse.json(
          { 
            error: 'Authentication required. Please log in to upload documents.',
            details: error.message 
          },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Upload failed',
          details: error.message 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error during upload' },
      { status: 500 }
    );
  }
}