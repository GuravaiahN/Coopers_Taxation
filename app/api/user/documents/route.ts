import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../utils/db'
import DocumentModel from '../../../../models/Document'
import { requireAuth } from '../../../../utils/sessionAuth'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    // Verify user authentication using NextAuth session
    const session = await requireAuth(req)
    await connectToDatabase()
    
    // Fetch user's documents
    const documents = await DocumentModel.find({ userId: session.id })
      .sort({ createdAt: -1 })
      .lean()
    
    return NextResponse.json({ documents })
  } catch (error) {
    console.error('Error fetching user documents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}