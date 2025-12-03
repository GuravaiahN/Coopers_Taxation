import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { email, makeAdmin } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    const updateData = makeAdmin 
      ? { role: 'admin', isAdmin: true }
      : { role: 'user', isAdmin: false };
    
    const user = await User.findOneAndUpdate(
      { email },
      updateData,
      { new: true, select: '-password' }
    );
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: `User ${makeAdmin ? 'promoted to' : 'demoted from'} admin`,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin
      }
    });
    
  } catch (error) {
    console.error('Make admin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}