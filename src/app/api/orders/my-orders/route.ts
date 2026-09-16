import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import { getSessionFromCookies } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const orders = await Order.find({ userId: session.userId })
      .sort({ createdAt: -1 })
      .exec();

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error: unknown) {
    console.error('Fetch my orders error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to fetch orders';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
