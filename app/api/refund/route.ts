import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import RefundRequest from '@/lib/models/RefundRequest';

export async function POST(req: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase();
    
    const { fullName, email, phone, message, documents, additionalDocuments } = await req.json();

    // Validate required fields
    if (!fullName || !email || !phone || !message) {
      return NextResponse.json({ 
        error: 'All fields (fullName, email, phone, message) are required' 
      }, { status: 400 });
    }

    // Create refund request
    const refundRequest = await RefundRequest.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      message: message.trim(),
      documents: documents || [],
      additionalDocuments: additionalDocuments || [],
      status: 'pending'
    });

    return NextResponse.json({
      success: true,
      message: 'Refund request submitted successfully',
      refundRequest: {
        id: refundRequest._id,
        fullName: refundRequest.fullName,
        email: refundRequest.email,
        phone: refundRequest.phone,
        message: refundRequest.message,
        status: refundRequest.status,
        createdAt: refundRequest.createdAt
      }
    });

  } catch (error) {
    console.error('Refund request error:', error);
    
    return NextResponse.json({ 
      error: 'Failed to submit refund request' 
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const email = searchParams.get('email');
    
    let query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    if (email) {
      query.email = email.toLowerCase();
    }

    // Get refund requests
    const refundRequests = await RefundRequest.find(query)
      .sort({ createdAt: -1 })
      .select('fullName email phone message status documents additionalDocuments createdAt');

    return NextResponse.json({
      success: true,
      refundRequests
    });

  } catch (error) {
    console.error('Get refund requests error:', error);
    
    return NextResponse.json({ 
      error: 'Failed to retrieve refund requests' 
    }, { status: 500 });
  }
}