import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import User from '@/models/User';
import { requireAdmin } from '@/utils/sessionAuth';

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    await requireAdmin(request);
    
    // Connect to database
    await connectToDatabase();
    
    // Update all users to have isActive: true if not already set
    const result = await User.updateMany(
      { isActive: { $exists: false } },
      { $set: { isActive: true } }
    );
    
    // Also make sure admin user has correct role
    await User.updateMany(
      { email: { $in: ['admin@test.com', 'admin@coopers.com'] } },
      { 
        $set: { 
          role: 'admin', 
          isAdmin: true, 
          isActive: true 
        } 
      }
    );
    
    return NextResponse.json({
      message: 'User data migration completed',
      updated: result.modifiedCount
    });
    
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Migration failed' },
      { status: 500 }
    );
  }
}