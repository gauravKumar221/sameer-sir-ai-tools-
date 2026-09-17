import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { getSessionFromCookies, hashPassword, comparePassword } from '@/lib/auth';

// =============================================
// UPDATE PROFILE API Route — PUT /api/auth/profile
// =============================================
// Allows logged-in users to update their name and/or password.
// To change password, user must provide their current password first.

export async function PUT(req) {
  try {
    // Check if user is logged in
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Get update data from request body
    const { name, currentPassword, newPassword } = await req.json();

    // Find the user in database
    await connectToDatabase();
    const user = await User.findById(session.userId);

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Update name if provided
    if (name) {
      user.name = name.trim();
    }

    // Update password if new password is provided
    if (newPassword) {
      // Must provide current password to change it
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, error: 'Current password is required to set a new password' },
          { status: 400 }
        );
      }

      // Verify the current password is correct
      const isMatch = await comparePassword(currentPassword, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, error: 'Incorrect current password' },
          { status: 400 }
        );
      }

      // New password must be at least 6 characters
      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: 'New password must be at least 6 characters' },
          { status: 400 }
        );
      }

      // Hash and save the new password
      user.passwordHash = await hashPassword(newPassword);
    }

    // Save changes to database
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to update profile';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
