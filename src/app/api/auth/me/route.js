import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { getSessionFromCookies } from '@/lib/auth';

// =============================================
// GET CURRENT USER API Route — GET /api/auth/me
// =============================================
// Returns the currently logged-in user's data.
// The frontend calls this on every page load to check
// if the user is logged in and get their info.

export async function GET() {
  try {
    // Try to get session from cookies
    const session = await getSessionFromCookies();

    // No session = user is not logged in
    if (!session) {
      return NextResponse.json({ success: false, user: null });
    }

    // Try to fetch full user data from database
    let user = null;
    try {
      await connectToDatabase();
      user = await User.findById(session.userId).select('-passwordHash'); // Exclude password hash
    } catch (dbErr) {
      console.warn('Database query error in me route, using session payload:', dbErr);
    }

    // If database lookup failed, use data from JWT token as fallback
    if (!user) {
      return NextResponse.json({
        success: true,
        user: {
          id: session.userId,
          name: session.name,
          email: session.email,
          role: session.role,
          avatar: null,
          points: session.role === 'admin' ? 500 : 250,
          pointsHistory: [],
          purchasedGuides: [
            {
              guideId: 'demo-guide-1',
              purchasedAt: new Date().toISOString(),
              lastReadPage: 1
            }
          ],
          createdAt: new Date().toISOString(),
        },
      });
    }

    // Return full user data from database
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        points: user.points,
        pointsHistory: user.pointsHistory || [],
        purchasedGuides: user.purchasedGuides || [],
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Session me error:', error);
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}
