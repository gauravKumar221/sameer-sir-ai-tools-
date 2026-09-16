import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/db';
import Guide from '@/models/Guide';
import User from '@/models/User';
import { getSessionFromCookies } from '@/lib/auth';
import { getPdfBuffer } from '@/lib/storage';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const fileIndex = parseInt(searchParams.get('fileIndex') || '0', 10);
    const isPreview = searchParams.get('preview') === 'true';

    await connectToDatabase();

    let guide;
    if (mongoose.Types.ObjectId.isValid(id)) {
      guide = await Guide.findById(id);
    } else {
      guide = await Guide.findOne({ slug: id });
    }

    if (!guide) {
      return new NextResponse('Guide not found', { status: 404 });
    }

    if (!guide.pdfFiles || guide.pdfFiles.length === 0) {
      return new NextResponse('No PDF files associated with this course', { status: 404 });
    }

    const targetFile = guide.pdfFiles[fileIndex] || guide.pdfFiles[0];
    if (!targetFile || !targetFile.fileKey) {
      return new NextResponse('PDF file key missing', { status: 404 });
    }

    // Authorization check
    const session = await getSessionFromCookies();
    let isAuthorized = false;

    if (session) {
      if (session.role === 'admin') {
        isAuthorized = true;
      } else {
        const user = await User.findById(session.userId);
        if (user) {
          const hasPurchased = user.purchasedGuides.some(
            (p) => p.guideId.toString() === guide._id.toString()
          );
          if (hasPurchased) {
            isAuthorized = true;
          }
        }
      }
    }

    // If not purchased, allow preview only if course allows preview
    if (!isAuthorized) {
      if (isPreview && guide.previewPages > 0) {
        // Authorized for preview mode
        isAuthorized = true;
      } else {
        return new NextResponse(
          JSON.stringify({ error: 'Unauthorized: Course purchase required to access full PDF' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Read secure non-public PDF buffer from storage
    const pdfBuffer = await getPdfBuffer(targetFile.fileKey);

    if (!pdfBuffer) {
      return new NextResponse('PDF file not found in secure storage', { status: 404 });
    }

    // Convert Buffer to ArrayBuffer / Uint8Array for Next.js response stream
    const uint8Array = new Uint8Array(pdfBuffer);

    // Return binary stream with maximum DRM headers
    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': uint8Array.byteLength.toString(),
        'Content-Disposition': 'inline; filename="protected-document.pdf"',
        'Cache-Control': 'private, no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Robots-Tag': 'noindex, nofollow, noarchive',
      },
    });
  } catch (error: unknown) {
    console.error('PDF streaming error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
