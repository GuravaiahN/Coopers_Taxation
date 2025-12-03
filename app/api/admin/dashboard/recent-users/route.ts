import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../../utils/db'
import User from '../../../../../models/User'
import { requireAdmin } from '../../../../../utils/sessionAuth'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication using NextAuth session
    await requireAdmin(request)

    await connectToDatabase()
    
    // Get the 5 most recent users
    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt role')
      .lean()
    
    // Transform the data for the frontend
    const formattedUsers = recentUsers.map((user: any) => ({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      status: 'active' // All registered users are considered active
    }))
    
    return NextResponse.json(formattedUsers)
  } catch (error) {
    console.error('Error fetching recent users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent users' },
      { status: 500 }
    )
  }
}