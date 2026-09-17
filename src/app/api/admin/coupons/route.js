import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Coupon from '@/models/Coupon';
import { getSessionFromCookies } from '@/lib/auth';

// =============================================
// ADMIN COUPONS API Route — /api/admin/coupons
// =============================================
// Admin-only routes to manage discount coupons.
// GET = List all coupons
// POST = Create a new coupon
// DELETE = Delete a coupon

// ----- GET: List all coupons -----
export async function GET() {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await connectToDatabase();
    const coupons = await Coupon.find().sort({ createdAt: -1 }).exec();

    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    console.error('Fetch coupons error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to fetch coupons';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// ----- POST: Create a new coupon -----
export async function POST(req) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { code, discountType, discountValue, minOrderAmount, maxDiscount, expiresAt, usageLimit } = await req.json();

    if (!code || !discountValue) {
      return NextResponse.json({ success: false, error: 'Code and discount value are required' }, { status: 400 });
    }

    await connectToDatabase();

    // Check if coupon code already exists
    const existing = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Coupon code already exists' }, { status: 400 });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase().trim(),
      discountType: discountType || 'percentage',
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount) || 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      usageLimit: usageLimit ? Number(usageLimit) : 1000,
      isActive: true,
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    console.error('Create coupon error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to create coupon';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// ----- DELETE: Delete a coupon -----
export async function DELETE(req) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Coupon ID required' }, { status: 400 });
    }

    await connectToDatabase();
    await Coupon.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    console.error('Delete coupon error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to delete coupon';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
