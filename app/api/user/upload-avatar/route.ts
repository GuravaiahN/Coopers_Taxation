import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/utils/db';
import User from '@/models/User';
import { requireAuth } from '@/utils/sessionAuth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<Response> {
  try {
    // Verify user authentication using NextAuth session
    const session = await requireAuth(request);

    await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const data = await request.formData();
    const file = data.get('avatar') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type (only images)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type. Please upload an image.' }, { status: 400 });
    }

    // Limit file size (5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'avatars',
    });

    const stream = bucket.openUploadStream(file.name, {
      metadata: { 
        contentType: file.type,
        uploadedBy: session.email,
        uploadDate: new Date()
      },
    });

    const bytes = await file.arrayBuffer();
    stream.end(Buffer.from(bytes));

    const fileId = await new Promise<string>((resolve, reject) => {
      stream.on('finish', () => {
        resolve(stream.id.toString());
      });
      stream.on('error', reject);
    });

    // Update the user's image field in the database
    await User.updateOne(
      { _id: session.id },
      { $set: { image: fileId } }
    );

    return NextResponse.json({ 
      success: true, 
      imageId: fileId,
      message: 'Avatar uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized - Please login') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to upload avatar' },
      { status: 500 }
    );
  }
}