import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Settings from '@/models/Settings';
import { hashPassword, setAuthCookie } from '@/lib/auth';

// =============================================
// SIGNUP API Route — POST /api/auth/signup
// =============================================
// Creates a new user account.
// Steps:
// 1. Validate the input (name, email, password)
// 2. Check if email already exists
// 3. Hash the password (for security)
// 4. Create user with welcome bonus points
// 5. Auto-login the user (set cookie)

export async function POST(req) {
  try {
    // Get user info from request body
    const { name, email, password } = await req.json();

    // Validate: all fields are required
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate: password must be at least 6 characters
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if an account with this email already exists
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Give new users 100 welcome bonus points!
    const welcomeBonus = 100;

    // Hash the password (never store plain passwords!)
    const passwordHash = await hashPassword(password);

    // Create the user in the database
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'user',
      points: welcomeBonus,
      pointsHistory: [
        {
          type: 'earned',
          amount: welcomeBonus,
          reason: 'Welcome Signup Bonus',
          date: new Date(),
        },
      ],
      purchasedGuides: [],
    });

    // Auto-login: create JWT token and set cookie
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };

    await setAuthCookie(tokenPayload);

    // Return success with user info
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    const msg = error instanceof Error ? error.message : 'Signup failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
