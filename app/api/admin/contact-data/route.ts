import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/utils/db';
import ContactModel from '@/models/Contact';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<Response> {
  try {
    // Verify JWT token for admin access
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userEmail = decoded.email;

    await connectToDatabase();

    // Check if user is admin
    const UserModel = (await import('@/models/User')).default;
    const user = await UserModel.findOne({ email: userEmail });
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const url = new URL(request.url);
    const exportAll = url.searchParams.get('export') === 'all';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    let contactData;
    let totalContacts;

    if (exportAll) {
      // Fetch all contact data for export
      contactData = await ContactModel.find({}).sort({ createdAt: -1 }).lean();
      totalContacts = contactData.length;
    } else {
      // Fetch total count and paginated data
      totalContacts = await ContactModel.countDocuments();
      contactData = await ContactModel.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    }

    return NextResponse.json(
      {
        success: true,
        data: contactData,
        totalPages: Math.ceil(totalContacts / limit),
        currentPage: page,
        totalContacts,
      },
      {
        headers: { 'Cache-Control': 'no-store' },
      }
    );
  } catch (error) {
    console.error('Error fetching contact data:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch contact form data',
      },
      { status: 500 }
    );
  }
}