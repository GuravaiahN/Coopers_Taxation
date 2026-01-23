import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import mongoose from 'mongoose';
import { connectToDatabase } from '../../../../utils/db';
import Document from '../../../../models/Document';

async function streamToBuffer(stream: any): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });
    stream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    stream.on('error', (err: Error) => {
      reject(err);
    });
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json(
        {
          success: false,
          message: 'Database connection failed',
        },
        { status: 500 }
      );
    }

    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'documents',
    });

    const fileId = params.id;

    try {
      // First try to find the file directly in GridFS
      let file = await db.collection('documents.files').findOne({
        _id: new mongoose.Types.ObjectId(fileId),
      });

      let actualFileId = fileId;

      // If not found, check if this is a Document ID and get the fileId
      if (!file) {
        try {
          const documentRecord = await Document.findById(fileId);
          
          if (documentRecord && documentRecord.fileId) {
            actualFileId = documentRecord.fileId.toString();
            console.log(`Found Document record, using fileId: ${actualFileId}`);
            file = await db.collection('documents.files').findOne({
              _id: new mongoose.Types.ObjectId(actualFileId),
            });
          } else if (documentRecord) {
            console.log('Document record found but no fileId:', documentRecord);
          }
        } catch (docError) {
          console.log('Error finding document record:', docError);
        }
      }

      if (!file) {
        console.error(`File not found for ID: ${fileId}, actualFileId: ${actualFileId}`);
        return NextResponse.json(
          {
            success: false,
            message: 'File not found in GridFS',
          },
          { status: 404 }
        );
      }

      console.log(`Downloading file: ${file.filename} (${actualFileId})`);
      const contentType = file.contentType || 'application/octet-stream';
      const downloadStream = bucket.openDownloadStream(
        new mongoose.Types.ObjectId(actualFileId)
      );

      const fileBuffer = await streamToBuffer(downloadStream);

      return new Response(new Uint8Array(fileBuffer), {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${encodeURIComponent(file.filename || 'document')}"`,
        },
      });
    } catch (error) {
      console.error('Error fetching file:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Error fetching file',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin for file deletion
    if (session.user.role !== 'admin' && !session.user.isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Forbidden - Admin access required for file deletion' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json(
        {
          success: false,
          message: 'Database connection failed',
        },
        { status: 500 }
      );
    }

    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'documents',
    });

    const fileId = params.id;

    try {
      // First, check if this is a Document record ID
      let actualFileId = fileId;
      let file = null;

      try {
        const documentRecord = await Document.findById(fileId);
        
        if (documentRecord && documentRecord.fileId) {
          // This is a Document record, use the fileId
          actualFileId = documentRecord.fileId.toString();
        }
      } catch (docError) {
        // Not a valid Document ID, try as GridFS ID directly
        console.log('Not a Document record, trying as GridFS ID');
      }

      // Check if file exists in GridFS
      file = await db.collection('documents.files').findOne({
        _id: new mongoose.Types.ObjectId(actualFileId),
      });

      if (!file) {
        console.error(`File not found in GridFS for ID: ${actualFileId} (original: ${fileId})`);
        return NextResponse.json(
          {
            success: false,
            message: 'File not found',
          },
          { status: 404 }
        );
      }

      // Delete the file from GridFS
      await bucket.delete(new mongoose.Types.ObjectId(actualFileId));

      // Also delete from Document collection if it exists
      await Document.findOneAndDelete({ 
        $or: [
          { _id: fileId },
          { fileId: actualFileId }
        ]
      });

      return NextResponse.json(
        {
          success: true,
          message: 'File deleted successfully',
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error deleting file:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Error deleting file',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in DELETE handler:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}