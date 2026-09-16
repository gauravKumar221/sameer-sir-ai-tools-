import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import { getSessionFromCookies } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const gateway = searchParams.get('gateway');

    const filter: Record<string, unknown> = {};

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (gateway && gateway !== 'All') {
      filter.paymentGateway = gateway;
    }

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { guideTitle: { $regex: search, $options: 'i' } },
        { 'customerDetails.email': { $regex: search, $options: 'i' } },
        { 'customerDetails.name': { $regex: search, $options: 'i' } },
      ];
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(100).exec();

    return NextResponse.json({ success: true, orders });
  } catch (error: unknown) {
    console.error('Admin fetch orders error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to fetch orders';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
