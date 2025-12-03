import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import mongoose from 'mongoose';
import { connectToDatabase } from '../../../lib/db';
import User from '@/models/User';
import { authOptions } from '../../../utils/authOptions';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<Response> {
  // Get the user's session
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  await connectToDatabase();
  const db = mongoose.connection.db;

  if (!db) {
    return new Response('Database connection failed', { status: 500 });
  }

  const data = await request.formData();
  const file = data.get('avatar') as File | null;

  if (!file) {
    return new Response('No file uploaded', { status: 400 });
  }

  // Validate file type (e.g., allow only images)
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return new Response('Unsupported file type', { status: 400 });
  }

  // Limit file size (e.g., 5MB)
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    return new Response('File size exceeds limit', { status: 400 });
  }

  const bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: 'avatars',
  });

  try {
    const stream = bucket.openUploadStream(file.name, {
      metadata: { contentType: file.type },
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
      { email: session.user.email },
      { $set: { image: fileId } }
    );

    return new Response(JSON.stringify({ success: true, imageId: fileId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}