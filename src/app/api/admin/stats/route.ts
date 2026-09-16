import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import Guide from '@/models/Guide';
import { getSessionFromCookies } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    await connectToDatabase();

    // 1. Core KPIs
    const totalUsers = await User.countDocuments();
    const totalGuides = await Guide.countDocuments();
    const activeGuides = await Guide.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    const successfulOrders = await Order.find({ status: 'success' });

    const totalRevenue = successfulOrders.reduce((sum, ord) => sum + (ord.amount || 0), 0);
    const totalPointsDistributed = successfulOrders.reduce((sum, ord) => sum + (ord.pointsEarned || 0), 0);

    // 2. Today and this month revenue
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayOrders = successfulOrders.filter((o) => new Date(o.createdAt) >= startOfToday);
    const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

    const monthOrders = successfulOrders.filter((o) => new Date(o.createdAt) >= startOfMonth);
    const monthRevenue = monthOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

    // 3. Category distribution
    const categoryStats = await Guide.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalSales: { $sum: '$salesCount' } } },
      { $sort: { totalSales: -1 } },
    ]);

    // 4. Recent 7-14 days revenue points for charts
    const dailyRevenueMap: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyRevenueMap[key] = 0;
    }

    successfulOrders.forEach((ord) => {
      const d = new Date(ord.createdAt);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (key in dailyRevenueMap) {
        dailyRevenueMap[key] += ord.amount || 0;
      }
    });

    const revenueChartData = Object.entries(dailyRevenueMap).map(([date, revenue]) => ({
      date,
      revenue,
    }));

    // 5. Recent 5 orders
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).exec();

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        todayRevenue,
        monthRevenue,
        totalOrders,
        totalUsers,
        totalGuides,
        activeGuides,
        totalPointsDistributed,
      },
      categoryStats,
      revenueChartData,
      recentOrders,
    });
  } catch (error: unknown) {
    console.error('Admin stats error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to fetch admin stats';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
