import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Guide from '@/models/Guide';
import Order from '@/models/Order';
import Coupon from '@/models/Coupon';
import { getSessionFromCookies } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const {
      orderId,
      paymentId = `PAY_${Date.now()}`,
      signature = 'SIG_VERIFIED_SUCCESS',
      gateway = 'test',
    } = await req.json();

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    await connectToDatabase();

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    if (order.status === 'success') {
      return NextResponse.json({
        success: true,
        message: 'Order was already processed successfully',
        order,
      });
    }

    const user = await User.findById(order.userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const guide = await Guide.findById(order.guideId);
    if (!guide) {
      return NextResponse.json({ success: false, error: 'Guide not found' }, { status: 404 });
    }

    // 1. Update Order Status
    order.status = 'success';
    order.paymentGatewayPaymentId = paymentId;
    order.paymentGatewaySignature = signature;
    order.paymentGateway = gateway;
    await order.save();

    // 2. Grant User Access to Guide (if not already granted)
    const isAlreadyOwned = user.purchasedGuides.some(
      (p) => p.guideId.toString() === guide._id.toString()
    );

    if (!isAlreadyOwned) {
      user.purchasedGuides.push({
        guideId: guide._id,
        orderId: order._id,
        purchasedAt: new Date(),
        lastReadPage: 1,
      });
    }

    // 3. Handle Points: Deduct redeemed points + Award earned points
    if (order.pointsRedeemed > 0) {
      user.points = Math.max(0, (user.points || 0) - order.pointsRedeemed);
      user.pointsHistory.push({
        type: 'redeemed',
        amount: order.pointsRedeemed,
        reason: `Redeemed for Order #${order.orderNumber}`,
        date: new Date(),
      });
    }

    if (order.pointsEarned > 0) {
      user.points = (user.points || 0) + order.pointsEarned;
      user.pointsHistory.push({
        type: 'earned',
        amount: order.pointsEarned,
        reason: `Earned from purchase of "${guide.title}"`,
        date: new Date(),
      });
    }

    await user.save();

    // 4. Increment Guide salesCount
    guide.salesCount = (guide.salesCount || 0) + 1;
    await guide.save();

    // 5. Increment coupon usedCount if coupon applied
    if (order.couponCode) {
      await Coupon.updateOne(
        { code: order.couponCode },
        { $inc: { usedCount: 1 } }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and access granted successfully',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        guideId: guide._id,
        guideTitle: guide.title,
        amount: order.amount,
        status: order.status,
      },
      pointsUpdated: {
        currentBalance: user.points,
        pointsEarned: order.pointsEarned,
        pointsRedeemed: order.pointsRedeemed,
      },
    });
  } catch (error: unknown) {
    console.error('Verify payment error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to verify payment';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
