import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../utils/db'
import User from '../../../../models/User'
import Document from '../../../../models/Document'
import { requireAdmin } from '../../../../utils/sessionAuth'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    await requireAdmin(request)

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''
    const status = searchParams.get('status') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const skip = (page - 1) * limit

    // Connect to database
    await connectToDatabase()

    // Build query
    const query: any = {}
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ]
    }

    if (role && role !== 'all') {
      query.role = role
    }

    if (status === 'active') {
      query.isActive = true
    } else if (status === 'inactive') {
      query.isActive = false
    }

    // Build sort object
    const sortObj: any = {}
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1

    // Get users with pagination and filtering
    const users = await User.find(query, '-password')
      .sort(sortObj)
      .limit(limit)
      .skip(skip)
      .lean()

    // Get document counts for each user
    const usersWithDocCounts = await Promise.all(
      users.map(async (user) => {
        const docCount = await Document.countDocuments({ userId: user._id });
        return {
          ...user,
          documents: [], // Empty array for now, will be populated when viewing user details
          documentCount: docCount
        };
      })
    );

    const totalUsers = await User.countDocuments(query)
    const totalPages = Math.ceil(totalUsers / limit)

    // Get stats for dashboard
    const totalAllUsers = await User.countDocuments()
    const activeUsers = await User.countDocuments({ isActive: true })
    const adminUsers = await User.countDocuments({ role: 'admin' })

    return NextResponse.json({
      users: usersWithDocCounts,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      stats: {
        total: totalAllUsers,
        active: activeUsers,
        admins: adminUsers,
        inactive: totalAllUsers - activeUsers
      }
    })
  } catch (error) {
    console.error('Admin users error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    await requireAdmin(request)

    const { action, userId, updates } = await request.json()

    // Connect to database
    await connectToDatabase()

    switch (action) {
      case 'update':
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $set: updates },
          { new: true, select: '-password' }
        )
        if (!updatedUser) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }
        return NextResponse.json({ user: updatedUser, message: 'User updated successfully' })

      case 'delete':
        const deletedUser = await User.findByIdAndDelete(userId)
        if (!deletedUser) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }
        return NextResponse.json({ message: 'User deleted successfully' })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Admin users POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}