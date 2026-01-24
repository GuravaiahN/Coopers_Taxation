import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../../../utils/db'
import DocumentModel from '../../../../../../models/Document'
import { requireAuth } from '../../../../../../utils/sessionAuth'
import mongoose from 'mongoose'
import { Readable } from 'stream'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Download request for document:', params.id)
    
    // Verify user authentication
    const session = await requireAuth(request)
    console.log('Authenticated user:', session.id)
    
    // Connect to database
    await connectToDatabase()
    
    // Find the document
    const document = await DocumentModel.findById(params.id)
    if (!document) {
      console.log('Document not found:', params.id)
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }
    
    console.log('Found document:', {
      id: document._id,
      userId: document.userId,
      originalName: document.originalName,
      fileId: document.fileId
    })
    
    // Check permissions: user can only download their own files
    if (document.userId.toString() !== session.id) {
      console.log('Permission denied: user', session.id, 'tried to access document owned by', document.userId)
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }
    
    // Get GridFS bucket
    const db = mongoose.connection.db
    if (!db) {
      throw new Error('Database connection not available')
    }
    
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'documents'
    })
    
    // Check if file exists in GridFS
    const files = await bucket.find({ _id: document.fileId }).toArray()
    if (files.length === 0) {
      console.log('File not found in GridFS:', document.fileId)
      return NextResponse.json(
        { error: 'File not found in storage' },
        { status: 404 }
      )
    }
    
    console.log('File found in GridFS, streaming download...')
    
    // Create download stream
    const downloadStream = bucket.openDownloadStream(document.fileId)
    
    // Convert Node.js Readable to Web ReadableStream
    const webStream = Readable.toWeb(downloadStream) as ReadableStream<Uint8Array>
    
    // Return file as response
    return new NextResponse(webStream, {
      headers: {
        'Content-Type': document.mimeType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(document.originalName)}"`,
        'Content-Length': document.size.toString()
      }
    })
  } catch (error: any) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Failed to download file', details: error.message },
      { status: 500 }
    )
  }
}
