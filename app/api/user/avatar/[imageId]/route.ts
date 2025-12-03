import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/utils/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { imageId: string } }
): Promise<Response> {
  try {
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

    const file = await db.collection('avatars.files').findOne({
      _id: new mongoose.Types.ObjectId(fileId),
    });

    if (!file) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Avatar not found',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const contentType = file.contentType || 'image/jpeg';
    const downloadStream = bucket.openDownloadStream(
      new mongoose.Types.ObjectId(fileId)
    );

    // Convert stream to ReadableStream for Response
    const stream = new ReadableStream({
      start(controller) {
        downloadStream.on('data', (chunk) => {
          controller.enqueue(chunk);
        });

        downloadStream.on('end', () => {
          controller.close();
        });

        downloadStream.on('error', (error) => {
          console.error('Error downloading avatar:', error);
          controller.error(error);
        });
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        'Content-Disposition': `inline; filename="${file.filename}"`,
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