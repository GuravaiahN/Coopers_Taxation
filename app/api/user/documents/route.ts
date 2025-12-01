import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../utils/db'
import DocumentModel from '../../../../models/Document'
import jwt from 'jsonwebtoken'

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()
    
    // Get user from token
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || 
                  req.cookies.get('token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const userId = decoded.userId
    
    // Fetch user's documents
    const documents = await DocumentModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean()
    
    return NextResponse.json(documents)
  } catch (error) {
    console.error('Error fetching user documents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}