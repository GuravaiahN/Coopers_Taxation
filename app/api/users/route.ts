import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import User from '@/lib/models/User';
import { authenticateUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const user = await authenticateUser(req);
    
    // Connect to database
    await connectToDatabase();

    // Get user profile
    const userProfile = await User.findById(user.userId)
      .select('name email phone mobile role image createdAt');

    if (!userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userProfile._id,
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone,
        mobile: userProfile.mobile,
        role: userProfile.role,
        image: userProfile.image,
        createdAt: userProfile.createdAt
      }
    });

  } catch (error) {
    console.error('User update error:', error);
    
    if (error instanceof Error && (error.message === 'No token provided' || error.message === 'Invalid token')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to retrieve user profile' 
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Authenticate user
    const user = await authenticateUser(req);
    
    // Connect to database
    await connectToDatabase();
    
    const { name, phone, mobile } = await req.json();

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      {
        ...(name && { name: name.trim() }),
        ...(phone && { phone: phone.trim() }),
        ...(mobile && { mobile: mobile.trim() })
      },
      { new: true }
    ).select('name email phone mobile role image');

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        mobile: updatedUser.mobile,
        role: updatedUser.role,
        image: updatedUser.image
      }
    });

  } catch (error) {
    console.error('Update user profile error:', error);
    
    if (error instanceof Error && (error.message === 'No token provided' || error.message === 'Invalid token')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to update user profile' 
    }, { status: 500 });
  }
}