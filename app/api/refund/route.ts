// /app/api/refund/route.ts

import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/utils/db';
import RefundRequest from '@/models/RefundRequest';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<Response> {
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

  const data = await request.formData();
  const name = data.get('name') as string;
  const email = data.get('email') as string;
  const phone = data.get('phone') as string;
  const message = data.get('message') as string;

  if (!name || !email || !phone || !message) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'All fields are required',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: 'documents',
  });

  try {
    const documentMetadata: { _id: string; filename: string }[] = [];
    const additionalDocumentMetadata: { _id: string; filename: string }[] = [];

    // Upload required documents
    for (let i = 0; i < 13; i++) {
      const file = data.get(`documents-${i}`);
      if (file && file instanceof File) {
        if (file.size > 4 * 1024 * 1024) {
          return new Response(
            JSON.stringify({
              success: false,
              message: `File ${file.name} exceeds the size limit of 4MB.`,
            }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }

        const stream = bucket.openUploadStream(file.name);
        stream.end(Buffer.from(await file.arrayBuffer()));

        await new Promise<void>((resolve, reject) => {
          stream.on('finish', () => {
            documentMetadata.push({
              _id: stream.id.toString(),
              filename: file.name,
            });
            resolve();
          });
          stream.on('error', reject);
        });
      }
    }

    // Upload additional documents
    const additionalFiles = data.getAll('additionalDocuments');
    for (const file of additionalFiles) {
      if (file instanceof File) {
        if (file.size > 4 * 1024 * 1024) {
          return new Response(
            JSON.stringify({
              success: false,
              message: `File ${file.name} exceeds the size limit of 4MB.`,
            }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }

        const stream = bucket.openUploadStream(file.name);
        stream.end(Buffer.from(await file.arrayBuffer()));

        await new Promise<void>((resolve, reject) => {
          stream.on('finish', () => {
            additionalDocumentMetadata.push({
              _id: stream.id.toString(),
              filename: file.name,
            });
            resolve();
          });
          stream.on('error', reject);
        });
      }
    }

    // Save metadata to the database
    const newRefundRequest = new RefundRequest({
      fullName: name,
      email,
      phone,
      message,
      documents: documentMetadata,
      additionalDocuments: additionalDocumentMetadata,
      status: 'pending',
      createdAt: new Date(),
    });

    await newRefundRequest.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Refund request submitted successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing refund request:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to process refund request',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}