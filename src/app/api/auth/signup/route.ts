import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Settings from '@/models/Settings';
import { hashPassword, setAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Welcome signup bonus points
    const welcomeBonus = 100;
    const passwordHash = await hashPassword(password);

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

    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };

    await setAuthCookie(tokenPayload);

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
  } catch (error: unknown) {
    console.error('Signup error:', error);
    const msg = error instanceof Error ? error.message : 'Signup failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
