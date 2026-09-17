import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { savePdfFile } from '@/lib/storage';

// =============================================
// ADMIN UPLOAD PDF API Route — POST /api/admin/guides/upload
// =============================================
// Handles PDF file uploads from the admin panel.
// Only admin users can upload files.
// Files are saved to secure (non-public) storage.

export async function POST(req) {
  try {
    // Only admins can upload
    const session = await getSessionFromCookies();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    // Get the file from the form data
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Only allow PDF files
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      return NextResponse.json({ success: false, error: 'Only PDF files are permitted' }, { status: 400 });
    }

    // Check file size limit: 50MB maximum
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: 'File size exceeds maximum 50MB limit' }, { status: 400 });
    }

    // Convert the file to a Buffer and save it
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save to secure (non-public) storage
    const saved = await savePdfFile(buffer, file.name);

    return NextResponse.json({
      success: true,
      file: {
        fileName: file.name,
        fileKey: saved.fileKey,
        fileSize: saved.fileSize,
        pageCount: 1, // Default page count
      },
    });
  } catch (error) {
    console.error('File upload error:', error);
    const msg = error instanceof Error ? error.message : 'File upload failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
