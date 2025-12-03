import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import { connectToDatabase } from '@/utils/db';
import { requireAdmin } from '@/utils/sessionAuth';
import Document from '@/models/Document';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication using consistent method
    const session = await requireAdmin(request);
    
    // Connect to database
    await connectToDatabase();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const targetUserEmail = formData.get('targetUserEmail') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!targetUserEmail) {
      return NextResponse.json(
        { error: 'Target user email is required' },
        { status: 400 }
      );
    }

    // Find target user
    const targetUser = await User.findOne({ email: targetUserEmail });
    if (!targetUser) {
      return NextResponse.json(
        { error: 'Target user not found' },
        { status: 404 }
      );
    }

    // Find admin user for metadata
    const adminUser = await User.findById(session.id);
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin user not found' },
        { status: 404 }
      );
    }

    // Use existing mongoose connection for GridFS
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'documents' });

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload file to GridFS
    const uploadStream = bucket.openUploadStream(file.name, {
      contentType: file.type,
      metadata: {
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        uploadedBy: adminUser._id,
        userId: targetUser._id,
        uploadDate: new Date()
      }
    });

    // Create a promise to handle the upload
    const uploadPromise = new Promise((resolve, reject) => {
      uploadStream.on('finish', resolve);
      uploadStream.on('error', reject);
    });

    // Write buffer to stream
    uploadStream.write(buffer);
    uploadStream.end();

    // Wait for upload to complete
    await uploadPromise;

    // Create document record
    const document = new Document({
      filename: file.name,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      userId: targetUser._id,
      uploadedBy: adminUser._id,
      fileId: uploadStream.id,
      uploadDate: new Date()
    });

    await document.save();

    return NextResponse.json({
      message: `Document "${file.name}" successfully uploaded to ${targetUser.name} (${targetUser.email})`,
      documentId: document._id,
      targetUser: {
        name: targetUser.name,
        email: targetUser.email
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}