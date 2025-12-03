// app/api/avatar/[imageId]/route.ts

import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/utils/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { imageId: string } }
): Promise<Response> {
  await connectToDatabase();
  const db = mongoose.connection.db;

  if (!db) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Database connection failed',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: 'avatars',
  });

  const fileId = params.imageId;

  try {
    const file = await db.collection('avatars.files').findOne({
      _id: new mongoose.Types.ObjectId(fileId),
    });

    if (!file) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'File not found',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const contentType = file.contentType || 'application/octet-stream';
    const downloadStream = bucket.openDownloadStream(
      new mongoose.Types.ObjectId(fileId)
    );

    // Use the Node.js ReadableStream to pipe the data to the response
    const stream = new ReadableStream({
      start(controller) {
        downloadStream.on('data', (chunk) => {
          controller.enqueue(chunk);
        });

        downloadStream.on('end', () => {
          controller.close();
        });

        downloadStream.on('error', (error) => {
          console.error('Error downloading file:', error);
          controller.error(error);
        });
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename=${file.filename}`,
      },
    });
  } catch (error) {
    console.error('Error fetching avatar:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error fetching avatar',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}