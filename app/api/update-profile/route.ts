import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import User from '@/models/User';
import { authOptions } from '../../../utils/authOptions';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { phone, name } = await request.json();

  try {
    const updateData: any = {};
    if (phone) updateData.phone = phone;
    if (name) updateData.name = name;

    await User.updateOne({ email: session.user.email }, { $set: updateData });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}