import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Guide from '@/models/Guide';
import Order from '@/models/Order';
import { getSessionFromCookies } from '@/lib/auth';

// =============================================
// ADMIN GRANT/REVOKE ACCESS API Route — POST /api/admin/users/grant-access
// =============================================
// Allows admin to manually grant or revoke a user's access to a course.
// action: "grant" = give free access, "revoke" = remove access

export async function POST(req) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { userId, guideId, action } = await req.json(); // action: 'grant' or 'revoke'

    // Validate input
    if (!userId || !guideId || !['grant', 'revoke'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'User ID, Guide ID, and valid action (grant/revoke) are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Find the guide
    const guide = await Guide.findById(guideId);
    if (!guide) {
      return NextResponse.json({ success: false, error: 'Guide not found' }, { status: 404 });
    }

    if (action === 'grant') {
      // Check if user already has access
      const alreadyHas = user.purchasedGuides.some(
        (p) => p.guideId.toString() === guide._id.toString()
      );

      if (!alreadyHas) {
        // Create a free order record (for audit trail)
        const order = await Order.create({
          orderNumber: `ORD-ADMIN-GRANT-${Date.now()}`,
          userId: user._id,
          guideId: guide._id,
          guideTitle: guide.title,
          guideCover: guide.coverImage,
          amount: 0,                    // Free! Admin granted it
          originalPrice: guide.price,
          discountAmount: guide.price,   // Full discount
          pointsRedeemed: 0,
          pointsEarned: 0,
          paymentGateway: 'test',
          paymentGatewayPaymentId: 'ADMIN_MANUAL_GRANT',
          status: 'success',
          customerDetails: {
            name: user.name,
            email: user.email,
          },
        });

        // Give user access
        user.purchasedGuides.push({
          guideId: guide._id,
          orderId: order._id,
          purchasedAt: new Date(),
          lastReadPage: 1,
        });

        await user.save();
      }
    } else if (action === 'revoke') {
      // Remove the guide from user's purchased list
      user.purchasedGuides = user.purchasedGuides.filter(
        (p) => p.guideId.toString() !== guide._id.toString()
      );
      await user.save();
    }

    return NextResponse.json({
      success: true,
      message: `Course ${action === 'grant' ? 'granted to' : 'revoked from'} user successfully`,
    });
  } catch (error) {
    console.error('Grant/revoke access error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to modify user access';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
