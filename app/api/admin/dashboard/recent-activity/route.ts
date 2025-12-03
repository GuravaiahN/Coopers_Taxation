import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../../utils/db'
import User from '../../../../../models/User'
import DocumentModel from '../../../../../models/Document'
import PaymentModel from '../../../../../models/Payment'
import { requireAdmin } from '../../../../../utils/sessionAuth'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

interface UserDocument {
  _id: any;
  name: string;
  email: string;
  createdAt: Date;
}

interface DocumentActivity {
  _id: any;
  originalName: string;
  status: string;
  createdAt: Date;
  userId: {
    name: string;
  };
}

interface PaymentActivity {
  _id: any;
  serviceName: string;
  amount: number;
  status: string;
  createdAt: Date;
  userId: {
    name: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication using NextAuth session
    await requireAdmin(request)

    await connectToDatabase()
    
    // Get recent user registrations (last 5)
    const recentRegistrations = await User.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt')
      .lean()
    
    // Get recent document uploads (last 5)
    const recentDocuments = await DocumentModel.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name')
      .lean()
    
    // Get recent payments (last 5)
    const recentPayments = await PaymentModel.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name')
      .lean()
    
    // Combine all activities
    const activities = [
      // User registrations
      ...recentRegistrations.map((user: any) => ({
        _id: `user_${user._id.toString()}`,
        action: 'New user registration',
        user: user.name,
        timestamp: user.createdAt.toISOString(),
        type: 'registration'
      })),
      
      // Document uploads
      ...recentDocuments.map((doc: any) => ({
        _id: `doc_${doc._id.toString()}`,
        action: `Document uploaded: ${doc.originalName}`,
        user: doc.userId?.name || 'Unknown User',
        timestamp: doc.createdAt.toISOString(),
        type: 'upload'
      })),
      
      // Payments
      ...recentPayments.map((payment: any) => ({
        _id: `pay_${payment._id.toString()}`,
        action: `Payment ${payment.status}: $${payment.amount} for ${payment.serviceName}`,
        user: payment.userId?.name || 'Unknown User',
        timestamp: payment.createdAt.toISOString(),
        type: 'payment'
      }))
    ]
    
    // Sort all activities by timestamp and return the 10 most recent
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
    
    return NextResponse.json(sortedActivities)
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent activity' },
      { status: 500 }
    )
  }
}