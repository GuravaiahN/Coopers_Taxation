import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../utils/db'
import User from '../../../../models/User'
import { requireAdmin } from '../../../../utils/sessionAuth'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    await requireAdmin(request)

    // Connect to database
    await connectToDatabase()

    // Get user statistics
    const totalUsers = await User.countDocuments()
    const activeUsers = await User.countDocuments({ status: 'active' })
    const pendingUsers = await User.countDocuments({ status: 'pending' })
    
    // Mock data for other stats (can be replaced with real data from other models)
    const stats = {
      totalUsers,
      activeUsers,
      pendingUsers,
      totalReturns: 423, // This would come from a TaxReturns model
      totalRevenue: 85420, // This would come from a Payments model
      pendingReturns: 12, // This would come from a TaxReturns model with status pending
      monthlyRevenue: 12340,
      completedReturns: 411,
      newUsersThisMonth: Math.floor(totalUsers * 0.15) // Estimate 15% are new this month
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}