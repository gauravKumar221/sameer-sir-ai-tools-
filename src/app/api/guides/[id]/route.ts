import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/db';
import Guide from '@/models/Guide';
import User from '@/models/User';
import { getSessionFromCookies } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const session = await getSessionFromCookies();
    let isPurchased = false;
    let lastReadPage = 1;
    let isAdmin = false;

    if (session) {
      if (session.role === 'admin') {
        isAdmin = true;
        isPurchased = true;
      } else {
        const user = await User.findById(session.userId);
        if (user) {
          const purchase = user.purchasedGuides.find(
            (p) => p.guideId.toString() === guide._id.toString()
          );
          if (purchase) {
            isPurchased = true;
            lastReadPage = purchase.lastReadPage || 1;
          }
        }
      }
    }

    // Mask the raw fileKeys for client safety
    const safePdfFiles = guide.pdfFiles.map((file) => ({
      fileName: file.fileName,
      fileSize: file.fileSize,
      pageCount: file.pageCount,
      order: file.order,
      // fileKey is omitted!
    }));

    return NextResponse.json({
      success: true,
      guide: {
        id: guide._id,
        title: guide.title,
        slug: guide.slug,
        description: guide.description,
        shortDescription: guide.shortDescription,
        coverImage: guide.coverImage,
        price: guide.price,
        originalPrice: guide.originalPrice,
        category: guide.category,
        tags: guide.tags,
        level: guide.level,
        highlights: guide.highlights,
        previewPages: guide.previewPages,
        isActive: guide.isActive,
        isFeatured: guide.isFeatured,
        rating: guide.rating,
        reviewsCount: guide.reviewsCount,
        salesCount: guide.salesCount,
        pdfFiles: safePdfFiles,
        createdAt: guide.createdAt,
      },
      access: {
        isPurchased,
        isAdmin,
        lastReadPage,
      },
    });
  } catch (error: unknown) {
    console.error('Fetch guide error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to fetch guide';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
