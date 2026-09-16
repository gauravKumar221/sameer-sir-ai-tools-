import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Guide from '@/models/Guide';
import { getSessionFromCookies } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { page } = await req.json();

    if (!page || typeof page !== 'number' || page < 1) {
      return NextResponse.json({ success: false, error: 'Invalid page number' }, { status: 400 });
    }

    await connectToDatabase();

    let guide;
    if (mongoose.Types.ObjectId.isValid(id)) {
      guide = await Guide.findById(id);
    } else {
      guide = await Guide.findOne({ slug: id });
    }

    if (!guide) {
      return NextResponse.json({ success: false, error: 'Guide not found' }, { status: 404 });
    }

    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const purchaseIndex = user.purchasedGuides.findIndex(
      (p) => p.guideId.toString() === guide._id.toString()
    );

    if (purchaseIndex !== -1) {
      user.purchasedGuides[purchaseIndex].lastReadPage = page;
      await user.save();
    }

    return NextResponse.json({
      success: true,
      lastReadPage: page,
    });
  } catch (error: unknown) {
    console.error('Save progress error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to save progress';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
