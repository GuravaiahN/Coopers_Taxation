import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    const { amount, serviceType, description } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid amount' },
        { status: 400 }
      );
    }

    // For now, simulate payment processing
    const payment = {
      id: Date.now().toString(),
      amount,
      serviceType,
      description,
      status: 'completed',
      userId: session.user.id,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      payment
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { success: false, message: 'Payment processing failed' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectToDatabase();

    // Return mock payment history for now
    const payments = [
      {
        id: '1',
        amount: 150,
        serviceType: 'Federal Tax Filing',
        status: 'completed',
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        amount: 75,
        serviceType: 'State Tax Filing',
        status: 'completed',
        createdAt: '2024-01-10T14:30:00Z'
      }
    ];

    return NextResponse.json({
      success: true,
      payments
    });

  } catch (error) {
    console.error('Get payments error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve payments' },
      { status: 500 }
    );
  }
}