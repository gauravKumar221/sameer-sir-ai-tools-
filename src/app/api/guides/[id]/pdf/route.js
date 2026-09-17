import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/db';
import Guide from '@/models/Guide';
import User from '@/models/User';
import { getSessionFromCookies } from '@/lib/auth';
import { getPdfBuffer } from '@/lib/storage';

// =============================================
// STREAM PDF API Route — GET /api/guides/[id]/pdf
// =============================================
// Streams the actual PDF file to the browser.
// This is the most security-critical route!
//
// Authorization rules:
// - Admin: can view all PDFs
// - Purchased users: can view full PDF
// - Non-purchased users: can only view preview (if allowed)
// - Everyone else: 403 Forbidden

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const fileIndex = parseInt(searchParams.get('fileIndex') || '0', 10);
    const isPreview = searchParams.get('preview') === 'true';

    await connectToDatabase();

    // Find the guide
    let guide;
    if (mongoose.Types.ObjectId.isValid(id)) {
      guide = await Guide.findById(id);
    } else {
      guide = await Guide.findOne({ slug: id });
    }

    if (!guide) {
      return new NextResponse('Guide not found', { status: 404 });
    }

    // Check if the guide has PDF files
    if (!guide.pdfFiles || guide.pdfFiles.length === 0) {
      return new NextResponse('No PDF files associated with this course', { status: 404 });
    }

    // Get the specific PDF file (or default to first one)
    const targetFile = guide.pdfFiles[fileIndex] || guide.pdfFiles[0];
    if (!targetFile || !targetFile.fileKey) {
      return new NextResponse('PDF file key missing', { status: 404 });
    }

    // ----- AUTHORIZATION CHECK -----
    const session = await getSessionFromCookies();
    let isAuthorized = false;

    if (session) {
      if (session.role === 'admin') {
        isAuthorized = true; // Admins can view everything
      } else {
        // Check if user has purchased this guide
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

    // If not purchased, only allow preview mode
    if (!isAuthorized) {
      if (isPreview && guide.previewPages > 0) {
        isAuthorized = true; // Preview mode allowed
      } else {
        return new NextResponse(
          JSON.stringify({ error: 'Unauthorized: Course purchase required to access full PDF' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // ----- READ & STREAM THE PDF -----
    // Read the PDF from secure (non-public) storage
    const pdfBuffer = await getPdfBuffer(targetFile.fileKey);

    if (!pdfBuffer) {
      return new NextResponse('PDF file not found in secure storage', { status: 404 });
    }

    // Convert Buffer to Uint8Array for the response
    const uint8Array = new Uint8Array(pdfBuffer);

    // Return the PDF with strict security headers
    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': uint8Array.byteLength.toString(),
        'Content-Disposition': 'inline; filename="protected-document.pdf"', // View in browser, don't download
        'Cache-Control': 'private, no-cache, no-store, must-revalidate, max-age=0', // Never cache
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Content-Type-Options': 'nosniff',        // Prevent MIME type sniffing
        'X-Frame-Options': 'SAMEORIGIN',             // Only allow embedding on same domain
        'X-Robots-Tag': 'noindex, nofollow, noarchive', // Don't let search engines index
      },
    });
  } catch (error) {
    console.error('PDF streaming error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
