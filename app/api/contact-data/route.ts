import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import { connectToDatabase } from '@/utils/db';
import Contact from '@/models/Contact';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<Response> {
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

    const url = new URL(request.url);
    const exportAll = url.searchParams.get('export') === 'all'; // Use consistent flag for export all
    const page = parseInt(url.searchParams.get('page') || '1', 10); // Default to page 1
    const limit = parseInt(url.searchParams.get('limit') || '10', 10); // Default to 10 items per page
    const skip = (page - 1) * limit;

    let contactData;
    let totalContacts;

    if (exportAll) {
      // Fetch all contact data for export
      contactData = await Contact.find({}).sort({ createdAt: -1 }).lean();
      totalContacts = contactData.length;
    } else {
      // Fetch total count and paginated data
      totalContacts = await Contact.countDocuments();
      contactData = await Contact.find({})
        .sort({ createdAt: -1 }) // Sort by newest first
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
        headers: { 'Cache-Control': 'no-store' }, // Prevent caching
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