//app/api/user-files/route.ts

import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/utils/db';
import RefundRequest from '@/models/RefundRequest';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<Response> {
  try {
    // 1. Establish the database connection first
    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection is not established');
    }

    // 2. Authenticate the user after the database connection is established
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const userEmail = session.user.email;

    // Parse the URL to get query parameters
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    // Ensure the email in query matches the logged-in user's email
    if (!email || email !== userEmail) {
      return new Response(
        JSON.stringify({ success: false, message: 'Forbidden' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'documents',
    });

    // Fetch refund requests/documents related to the user by email
    const refundRequests = await RefundRequest.find({ email }).lean();

    const userFilesWithDetails = await Promise.all(
      refundRequests.map(async (refundRequest) => {
        // Retrieve file details from GridFS using file IDs
        const fileDetails = await Promise.all(
          refundRequest.documents.map(async (doc: { _id: string }) => {
            const objectId = new mongoose.Types.ObjectId(doc._id);
            const file = await bucket.find({ _id: objectId }).toArray();
            return file[0]
              ? {
                  filename: file[0].filename,
                  _id: doc._id,
                  createdAt: file[0].uploadDate,
                }
              : null;
          })
        );

        // Handle additionalDocuments if present
        const additionalFileDetails = refundRequest.additionalDocuments
          ? await Promise.all(
              refundRequest.additionalDocuments.map(
                async (doc: { _id: string }) => {
                  const objectId = new mongoose.Types.ObjectId(doc._id);
                  const file = await bucket.find({ _id: objectId }).toArray();
                  return file[0]
                    ? {
                        filename: file[0].filename,
                        _id: doc._id,
                        createdAt: file[0].uploadDate,
                      }
                    : null;
                }
              )
            )
          : [];

        return {
          ...refundRequest,
          documents: fileDetails.filter(Boolean),
          additionalDocuments: additionalFileDetails.filter(Boolean),
        };
      })
    );

    return new Response(
      JSON.stringify({ success: true, files: userFilesWithDetails }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error fetching user files:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to fetch files' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}