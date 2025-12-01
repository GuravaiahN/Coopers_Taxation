import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import Payment from '@/lib/models/Payment';
import { authenticateUser } from '@/lib/auth';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const user = await authenticateUser(req);
    
    // Connect to database
    await connectToDatabase();
    
    const { amount, currency = 'usd', paymentMethodId, serviceId, isCustomAmount = false } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (!paymentMethodId) {
      return NextResponse.json({ error: 'Payment method is required' }, { status: 400 });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
      metadata: {
        userId: user.userId,
        serviceId: serviceId || '',
        isCustomAmount: isCustomAmount.toString()
      }
    });

    // Create payment record in database
    const payment = await Payment.create({
      amount,
      currency,
      status: paymentIntent.status === 'succeeded' ? 'COMPLETED' : 'PENDING',
      stripeId: paymentIntent.id,
      paymentMethod: 'stripe',
      isCustomAmount,
      userId: user.userId,
      serviceId: serviceId || undefined
    });

    return NextResponse.json({
      success: true,
      payment: {
        id: payment._id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        stripeId: payment.stripeId
      },
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        client_secret: paymentIntent.client_secret
      }
    });

  } catch (error) {
    console.error('Payment fetch error:', error);
    
    if (error instanceof Error && (error.message === 'No token provided' || error.message === 'Invalid token')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (error && typeof error === 'object' && 'type' in error && error.type === 'StripeCardError') {
      return NextResponse.json({ 
        error: 'Payment failed: ' + (error instanceof Error ? error.message : 'Card error')
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Payment processing failed' 
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const user = await authenticateUser(req);
    
    // Connect to database
    await connectToDatabase();

    // Get user's payments
    const payments = await Payment.find({ userId: user.userId })
      .populate('serviceId', 'name description')
      .sort({ createdAt: -1 })
      .select('amount currency status paymentMethod isCustomAmount createdAt serviceId');

    return NextResponse.json({
      success: true,
      payments
    });

  } catch (error) {
    console.error('Get payments error:', error);
    
    if (error instanceof Error && (error.message === 'No token provided' || error.message === 'Invalid token')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to retrieve payments' 
    }, { status: 500 });
  }
}