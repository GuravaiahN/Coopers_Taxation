import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import User from '@/models/User';
import { requireAuth } from '@/utils/sessionAuth';

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication using NextAuth session
    const session = await requireAuth(request);

    const { name, phone } = await request.json();

    await connectToDatabase();

    // Update user profile
    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    const updatedUser = await User.findByIdAndUpdate(
      session.id,
      { $set: updateData },
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully',
      user: updatedUser 
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized - Please login') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}