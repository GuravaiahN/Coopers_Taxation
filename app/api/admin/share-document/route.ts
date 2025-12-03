import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { connectToDatabase } from '@/utils/db';
import DocumentModel from '@/models/Document';
import UserModel from '@/models/User';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    if (session.user.role !== 'admin' && !session.user.isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Connect to database
    await connectToDatabase();

    const { documentId, targetUserEmail, action } = await req.json();

    if (!documentId || !targetUserEmail || !action) {
      return NextResponse.json({ 
        error: 'Document ID, target user email, and action are required' 
      }, { status: 400 });
    }

    // Find the target user
    const targetUser = await UserModel.findOne({ email: targetUserEmail });
    if (!targetUser) {
      return NextResponse.json({ error: 'Target user not found' }, { status: 404 });
    }

    // Find the document
    const document = await DocumentModel.findById(documentId);
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    if (action === 'share') {
      // Share document with user
      const updatedDocument = await DocumentModel.findByIdAndUpdate(
        documentId,
        {
          $set: {
            isShared: true,
            sharedBy: new mongoose.Types.ObjectId(session.user.id),
            sharedAt: new Date(),
            userId: targetUser._id, // Transfer ownership
          }
        },
        { new: true }
      );

      return NextResponse.json({
        success: true,
        message: `Document shared with ${targetUserEmail}`,
        document: updatedDocument
      });
    } else if (action === 'copy') {
      // Create a copy of the document for the target user
      const documentCopy = new DocumentModel({
        fileId: document.fileId,
        originalName: document.originalName,
        mimeType: document.mimeType,
        mimetype: document.mimetype,
        size: document.size,
        status: 'COMPLETED',
        userId: targetUser._id,
        sharedBy: new mongoose.Types.ObjectId(session.user.id),
        isShared: true,
        sharedAt: new Date(),
        notes: `Shared by admin from original document: ${document.originalName}`,
      });

      await documentCopy.save();

      return NextResponse.json({
        success: true,
        message: `Document copied to ${targetUserEmail}`,
        document: documentCopy
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Document sharing error:', error);
    return NextResponse.json({ 
      error: 'Failed to share document' 
    }, { status: 500 });
  }
}