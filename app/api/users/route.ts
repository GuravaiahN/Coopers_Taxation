import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import { connectToDatabase } from '@/utils/db';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest) => {
  try {
    // Check authentication first
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user.role !== 'admin' && !session.user.isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const url = new URL(req.url);
    const exportAll = url.searchParams.get('export') === 'all'; // Consistent flag
    const page = parseInt(url.searchParams.get('page') || '1', 10); // Default to page 1
    const limit = parseInt(url.searchParams.get('limit') || '10', 10); // Default to 10 items per page
    const skip = (page - 1) * limit;

    if (exportAll) {
      // Fetch all registered users for export
      const users = await User.find(
        {},
        { name: 1, email: 1, phone: 1, role: 1, createdAt: 1 }
      ).sort({ createdAt: -1 }); // Sort by newest first
      return NextResponse.json({ success: true, users: users });
    } else {
      const totalUsers = await User.countDocuments();
      const users = await User.find(
        {},
        { name: 1, email: 1, phone: 1, role: 1, createdAt: 1 }
      )
        .sort({ createdAt: -1 }) // Sort by newest first
        .skip(skip)
        .limit(limit);

      return NextResponse.json({
        success: true,
        users: users,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
      });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
};