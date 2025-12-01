import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../utils/db'
import PaymentModel from '../../../../models/Payment'
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
    
    // Fetch user's payments
    const payments = await PaymentModel.find({ userId })
      .sort({ paymentDate: -1 })
      .lean()
    
    return NextResponse.json(payments)
  } catch (error) {
    console.error('Error fetching user payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}