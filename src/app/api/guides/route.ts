import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Guide from '@/models/Guide';
import { seedDatabase } from '@/lib/seed';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Auto-seed if database has no guides yet
    const count = await Guide.countDocuments();
    if (count === 0) {
      console.log('No guides found in DB, auto-seeding sample courses...');
      await seedDatabase();
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const level = searchParams.get('level');
    const sort = searchParams.get('sort') || 'featured';

    const filter: Record<string, unknown> = { isActive: true };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (level && level !== 'All') {
      filter.level = level;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    let query = Guide.find(filter).select('-pdfFiles.fileKey');

    if (sort === 'price-low') {
      query = query.sort({ price: 1 });
    } else if (sort === 'price-high') {
      query = query.sort({ price: -1 });
    } else if (sort === 'newest') {
      query = query.sort({ createdAt: -1 });
    } else if (sort === 'popular') {
      query = query.sort({ salesCount: -1, rating: -1 });
    } else {
      // featured default
      query = query.sort({ isFeatured: -1, rating: -1, createdAt: -1 });
    }

    const guides = await query.exec();

    // Fetch available distinct categories
    const categories = await Guide.distinct('category', { isActive: true });

    return NextResponse.json({
      success: true,
      guides,
      categories: ['All', ...categories],
    });
  } catch (error: unknown) {
    console.error('Fetch guides error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to fetch guides';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
