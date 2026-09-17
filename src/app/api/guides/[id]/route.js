import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/db';
import Guide from '@/models/Guide';
import User from '@/models/User';
import { getSessionFromCookies } from '@/lib/auth';

// =============================================
// GET SINGLE GUIDE API Route — GET /api/guides/[id]
// =============================================
// Returns details of a single course guide.
// The [id] can be either a MongoDB ObjectId or a slug (URL-friendly name).
// Also checks if the logged-in user has purchased this guide.

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    // Find the guide by ID or by slug
    let guide;
    if (mongoose.Types.ObjectId.isValid(id)) {
      guide = await Guide.findById(id);        // Search by database ID
    } else {
      guide = await Guide.findOne({ slug: id }); // Search by URL slug
    }

    if (!guide) {
      return NextResponse.json({ success: false, error: 'Guide not found' }, { status: 404 });
    }

    // Check if the current user has purchased this guide
    const session = await getSessionFromCookies();
    let isPurchased = false;
    let lastReadPage = 1;
    let isAdmin = false;

    if (session) {
      if (session.role === 'admin') {
        // Admins have access to all guides
        isAdmin = true;
        isPurchased = true;
      } else {
        // Check if this user bought this guide
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

    // SECURITY: Remove the fileKey from response (users shouldn't see storage paths)
    const safePdfFiles = guide.pdfFiles.map((file) => ({
      fileName: file.fileName,
      fileSize: file.fileSize,
      pageCount: file.pageCount,
      order: file.order,
      // fileKey is intentionally NOT included here!
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
  } catch (error) {
    console.error('Fetch guide error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to fetch guide';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
