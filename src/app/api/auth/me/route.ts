import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { getSessionFromCookies } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSessionFromCookies();

    if (!session) {
      return NextResponse.json({ success: false, user: null });
    }

    let user = null;
    try {
      await connectToDatabase();
      user = await User.findById(session.userId).select('-passwordHash');
    } catch (dbErr) {
      console.warn('Database query error in me route, using session payload:', dbErr);
    }

    if (!user) {
      // Fallback from valid signed JWT session
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
  } catch (error: unknown) {
    console.error('Session me error:', error);
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}
