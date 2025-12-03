import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import ContactModel from '@/models/Contact';
import { requireAdmin } from '@/utils/sessionAuth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<Response> {
  try {
    // Verify admin authentication
    await requireAdmin(request);

    await connectToDatabase();

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