import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Coupon from '@/models/Coupon';

// =============================================
// VALIDATE COUPON API Route — POST /api/coupons/validate
// =============================================
// Checks if a coupon code is valid and calculates the discount.
// Used on the checkout page when user enters a coupon code.

export async function POST(req) {
  try {
    const { code, orderAmount } = await req.json();

    // Both fields are required
    if (!code || typeof orderAmount !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Coupon code and order amount are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the coupon in database
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

    // Check if coupon has expired
    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return NextResponse.json(
        { success: false, error: 'This coupon has expired' },
        { status: 400 }
      );
    }

    // Check if usage limit is reached
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { success: false, error: 'Coupon usage limit reached' },
        { status: 400 }
      );
    }

    // Check minimum order amount
    if (orderAmount < coupon.minOrderAmount) {
      return NextResponse.json(
        {
          success: false,
          error: `Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon`,
        },
        { status: 400 }
      );
    }

    // Calculate the discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (orderAmount * coupon.discountValue) / 100;
      // Cap at maxDiscount if set
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      // Flat discount
      discount = coupon.discountValue;
    }

    // Discount can't exceed the order amount
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
  } catch (error) {
    console.error('Coupon validation error:', error);
    const msg = error instanceof Error ? error.message : 'Coupon validation failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
