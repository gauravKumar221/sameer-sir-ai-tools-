import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Guide from '@/models/Guide';
import Order from '@/models/Order';
import Coupon from '@/models/Coupon';
import Settings from '@/models/Settings';
import { getSessionFromCookies } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Please login to purchase courses' },
        { status: 401 }
      );
    }

    const { guideId, couponCode, redeemPoints, paymentGateway = 'test' } = await req.json();

    if (!guideId) {
      return NextResponse.json(
        { success: false, error: 'Guide ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const guide = await Guide.findById(guideId);
    if (!guide || !guide.isActive) {
      return NextResponse.json({ success: false, error: 'Course guide is unavailable' }, { status: 404 });
    }

    // Check if user already purchased this guide
    const alreadyOwns = user.purchasedGuides.some(
      (p) => p.guideId.toString() === guide._id.toString()
    );
    if (alreadyOwns) {
      return NextResponse.json(
        { success: false, error: 'You already own this course guide' },
        { status: 400 }
      );
    }

    const settings = await Settings.findOne() || {
      pointsEarnRate: 10,
      pointsRedeemRate: 0.5,
    };

    let totalAmount = guide.price;
    let discountAmount = 0;
    let pointsDiscount = 0;
    let pointsToRedeem = 0;

    // 1. Apply Coupon if provided
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase().trim(),
        isActive: true,
      });

      if (coupon) {
        let isEligible = true;
        if (coupon.expiresAt && new Date() > coupon.expiresAt) isEligible = false;
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) isEligible = false;
        if (totalAmount < coupon.minOrderAmount) isEligible = false;

        if (isEligible) {
          if (coupon.discountType === 'percentage') {
            let disc = (totalAmount * coupon.discountValue) / 100;
            if (coupon.maxDiscount && disc > coupon.maxDiscount) {
              disc = coupon.maxDiscount;
            }
            discountAmount = Math.round(disc);
          } else {
            discountAmount = Math.min(coupon.discountValue, totalAmount);
          }
        }
      }
    }

    let remainingAfterCoupon = Math.max(0, totalAmount - discountAmount);

    // 2. Apply Points Redemption if requested
    if (redeemPoints && redeemPoints > 0) {
      const availableUserPoints = user.points || 0;
      pointsToRedeem = Math.min(redeemPoints, availableUserPoints);
      
      // Calculate cash value of points
      const potentialCashDiscount = pointsToRedeem * (settings.pointsRedeemRate || 0.5);
      pointsDiscount = Math.min(potentialCashDiscount, remainingAfterCoupon);
      
      // Adjust points actually needed if order reaches 0
      pointsToRedeem = Math.ceil(pointsDiscount / (settings.pointsRedeemRate || 0.5));
    }

    const finalPayableAmount = Math.max(0, Math.round(remainingAfterCoupon - pointsDiscount));
    
    // Points earned on net amount paid
    const pointsEarned = Math.round((finalPayableAmount * (settings.pointsEarnRate || 10)) / 100);

    const orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create Order Record
    const order = await Order.create({
      orderNumber,
      userId: user._id,
      guideId: guide._id,
      guideTitle: guide.title,
      guideCover: guide.coverImage,
      amount: finalPayableAmount,
      originalPrice: guide.price,
      discountAmount: discountAmount + pointsDiscount,
      pointsRedeemed: pointsToRedeem,
      pointsEarned,
      couponCode: couponCode || '',
      paymentGateway,
      paymentGatewayOrderId: `${paymentGateway.toUpperCase()}_ORDER_${Date.now()}`,
      status: 'pending',
      customerDetails: {
        name: user.name,
        email: user.email,
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        guideTitle: guide.title,
        originalPrice: guide.price,
        couponDiscount: discountAmount,
        pointsDiscount,
        pointsRedeemed: pointsToRedeem,
        pointsEarned,
        amount: finalPayableAmount,
        paymentGateway,
        paymentGatewayOrderId: order.paymentGatewayOrderId,
      },
    });
  } catch (error: unknown) {
    console.error('Create order error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to create order';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
