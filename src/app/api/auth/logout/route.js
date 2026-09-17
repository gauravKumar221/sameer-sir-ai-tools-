import { NextResponse } from 'next/server';
import { removeAuthCookie } from '@/lib/auth';

// =============================================
// LOGOUT API Route — POST /api/auth/logout
// =============================================
// Simply deletes the auth cookie from the browser.
// After this, the user is no longer logged in.

export async function POST() {
  await removeAuthCookie();
  return NextResponse.json({ success: true, message: 'Logged out successfully' });
}
