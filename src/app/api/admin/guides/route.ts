import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
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
    const category = searchParams.get('category');

    const filter: Record<string, unknown> = {};
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const guides = await Guide.find(filter).sort({ createdAt: -1 }).exec();
    return NextResponse.json({ success: true, guides });
  } catch (error: unknown) {
    console.error('Admin fetch guides error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to fetch guides';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      description,
      shortDescription,
      coverImage,
      price,
      originalPrice,
      category,
      tags = [],
      level = 'All Levels',
      previewPages = 2,
      isActive = true,
      isFeatured = false,
      pdfFiles = [],
      highlights = [],
    } = body;

    if (!title || !description || !price || !category) {
      return NextResponse.json(
        { success: false, error: 'Title, description, price, and category are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Generate unique slug
    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (await Guide.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const guide = await Guide.create({
      title: title.trim(),
      slug,
      description: description.trim(),
      shortDescription: (shortDescription || description.slice(0, 150)).trim(),
      coverImage: coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category: category.trim(),
      tags: Array.isArray(tags) ? tags : tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      level,
      previewPages: Number(previewPages),
      isActive: Boolean(isActive),
      isFeatured: Boolean(isFeatured),
      pdfFiles: pdfFiles || [],
      highlights: Array.isArray(highlights) ? highlights : [],
    });

    return NextResponse.json({ success: true, guide });
  } catch (error: unknown) {
    console.error('Admin create guide error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to create guide';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
