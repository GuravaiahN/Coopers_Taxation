import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../utils/db'
import PaymentModel from '../../../../models/Payment'
import { requireAuth } from '../../../../utils/sessionAuth'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    // Verify user authentication using NextAuth session
    const session = await requireAuth(req)
    await connectToDatabase()
    
    // Fetch user's payments
    const payments = await PaymentModel.find({ userId: session.id })
      .sort({ paymentDate: -1 })
      .lean()
    
    return NextResponse.json({ payments })
  } catch (error) {
    console.error('Error fetching user payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}