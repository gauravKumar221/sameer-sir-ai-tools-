import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { getSessionFromCookies } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { userId, amount, reason } = await req.json();

    if (!userId || typeof amount !== 'number' || !reason) {
      return NextResponse.json(
        { success: false, error: 'User ID, amount (+ or -), and reason are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const newBalance = Math.max(0, (user.points || 0) + amount);
    user.points = newBalance;

    user.pointsHistory.push({
      type: 'adjusted',
      amount,
      reason: `Admin Adjustment: ${reason.trim()}`,
      date: new Date(),
    });

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Points balance adjusted successfully',
      newBalance: user.points,
    });
  } catch (error: unknown) {
    console.error('Adjust points error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to adjust points';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
