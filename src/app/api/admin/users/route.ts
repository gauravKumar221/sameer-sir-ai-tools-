import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Guide from '@/models/Guide';
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

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter)
      .select('-passwordHash')
      .populate('purchasedGuides.guideId', 'title slug price coverImage')
      .sort({ createdAt: -1 })
      .exec();

    const allGuides = await Guide.find({ isActive: true }).select('title _id price slug').exec();

    return NextResponse.json({
      success: true,
      users,
      allGuides,
    });
  } catch (error: unknown) {
    console.error('Admin fetch users error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to fetch users';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
