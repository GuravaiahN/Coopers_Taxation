import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectToDatabase } from '../../../../../utils/db'
import User from '../../../../../models/User'

export async function GET(request: Request) {
  try {
    // Check authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Verify JWT token
    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET || '');
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (!decodedToken.isAdmin) {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

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