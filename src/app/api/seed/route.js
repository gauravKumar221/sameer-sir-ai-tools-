import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed';

// =============================================
// SEED DATABASE API Route — GET /api/seed
// =============================================
// Calling this URL fills the database with demo data.
// Useful for first-time setup or resetting demo content.

export async function GET() {
  try {
    await seedDatabase();
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with demo users, courses, and generated PDFs.',
    });
  } catch (error) {
    console.error('Seed error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to seed database';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
