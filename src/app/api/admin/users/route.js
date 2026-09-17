import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Guide from '@/models/Guide';
import { getSessionFromCookies } from '@/lib/auth';

// =============================================
// ADMIN USERS API Route — GET /api/admin/users
// =============================================
// Returns all users for the admin panel.
// Supports search by name or email.
// Also returns all active guides (for granting access).

export async function GET(req) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    // Build filter
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Get users (without password hash) and populate their purchased guides info
    const users = await User.find(filter)
      .select('-passwordHash')                                          // Don't send passwords!
      .populate('purchasedGuides.guideId', 'title slug price coverImage') // Get guide details
      .sort({ createdAt: -1 })
      .exec();

    // Get all active guides (for the "grant access" dropdown)
    const allGuides = await Guide.find({ isActive: true }).select('title _id price slug').exec();

    return NextResponse.json({
      success: true,
      users,
      allGuides,
    });
  } catch (error) {
    console.error('Admin fetch users error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to fetch users';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
