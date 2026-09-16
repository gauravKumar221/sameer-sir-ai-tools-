import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Coupon from '@/models/Coupon';

export async function POST(req: NextRequest) {
  try {
    const { code, orderAmount } = await req.json();

    if (!code || typeof orderAmount !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Coupon code and order amount are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const coupon = await Coupon.findOne({
      code: code.toUpperCase().trim(),
      isActive: true,
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Invalid or inactive coupon code' },
        { status: 404 }
      );
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return NextResponse.json(
        { success: false, error: 'This coupon has expired' },
        { status: 400 }
      );
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { success: false, error: 'Coupon usage limit reached' },
        { status: 400 }
      );
    }

    if (orderAmount < coupon.minOrderAmount) {
      return NextResponse.json(
        {
          success: false,
          error: `Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon`,
        },
        { status: 400 }
      );
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    // Ensure discount does not exceed orderAmount
    discount = Math.min(discount, orderAmount);

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        calculatedDiscount: Math.round(discount),
      },
    });
  } catch (error: unknown) {
    console.error('Coupon validation error:', error);
    const msg = error instanceof Error ? error.message : 'Coupon validation failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
