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

    console.log(`Download request for ID: ${params.id}`);

    // Get document record
    const document = await Document.findById(params.id);
    
    if (!document) {
      console.error(`Document not found. ID: ${params.id}`);
      return NextResponse.json(
        { success: false, message: 'Document not found' },
        { status: 404 }
      );
    }

    console.log(`Document: ${document.originalName}, fileId: ${document.fileId}, userId: ${document.userId}`);

    // Check access permission
    const isAdmin = session.user?.role === 'admin' || session.user?.isAdmin;
    const isOwner = document.userId?.toString() === session.user?.id;
    
    if (!isAdmin && !isOwner) {
      console.error(`Access denied. User: ${session.user?.id}, Owner: ${document.userId}`);
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      );
    }

    // Verify fileId exists
    if (!document.fileId) {
      console.error(`Document ${params.id} has no fileId - file never persisted`);
      return NextResponse.json(
        { success: false, message: 'File not available - upload failed' },
        { status: 404 }
      );
    }

    // Verify file exists in GridFS
    const gridfsFile = await db.collection('documents.files').findOne({
      _id: new mongoose.Types.ObjectId(document.fileId),
    });

    if (!gridfsFile) {
      console.error(`GridFS file missing. Doc: ${params.id}, fileId: ${document.fileId}`);
      return NextResponse.json(
        { success: false, message: 'File not found in storage' },
        { status: 404 }
      );
    }

    console.log(`Downloading: ${document.originalName}, ${gridfsFile.length} bytes`);

    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(document.fileId));
    const fileBuffer = await streamToBuffer(downloadStream);

    return new Response(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': document.mimeType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(document.originalName)}"`,
      },
    });
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