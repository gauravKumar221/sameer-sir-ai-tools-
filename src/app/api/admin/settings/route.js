import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Settings from '@/models/Settings';
import { getSessionFromCookies } from '@/lib/auth';

// =============================================
// ADMIN SETTINGS API Route — /api/admin/settings
// =============================================
// Admin-only routes to view and update platform settings.
// GET = Get current settings
// PUT = Update settings

// ----- GET: Get platform settings -----
export async function GET() {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await connectToDatabase();
    let settings = await Settings.findOne();

    // Create default settings if none exist
    if (!settings) {
      settings = await Settings.create({});
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Fetch settings error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to fetch settings';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// ----- PUT: Update platform settings -----
export async function PUT(req) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    await connectToDatabase();

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    // Update only the fields that were provided
    if (body.platformName) settings.platformName = body.platformName.trim();
    if (body.pointsEarnRate !== undefined) settings.pointsEarnRate = Number(body.pointsEarnRate);
    if (body.pointsRedeemRate !== undefined) settings.pointsRedeemRate = Number(body.pointsRedeemRate);
    if (body.razorpayKeyId !== undefined) settings.razorpayKeyId = body.razorpayKeyId;
    if (body.razorpayKeySecret !== undefined) settings.razorpayKeySecret = body.razorpayKeySecret;
    if (body.razorpayEnabled !== undefined) settings.razorpayEnabled = Boolean(body.razorpayEnabled);
    if (body.stripePublishableKey !== undefined) settings.stripePublishableKey = body.stripePublishableKey;
    if (body.stripeSecretKey !== undefined) settings.stripeSecretKey = body.stripeSecretKey;
    if (body.stripeEnabled !== undefined) settings.stripeEnabled = Boolean(body.stripeEnabled);
    if (body.testGatewayEnabled !== undefined) settings.testGatewayEnabled = Boolean(body.testGatewayEnabled);
    if (body.supportEmail) settings.supportEmail = body.supportEmail.trim();

    await settings.save();

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings,
    });
  } catch (error) {
    console.error('Update settings error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to update settings';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
