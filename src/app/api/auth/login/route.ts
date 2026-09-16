import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { comparePassword, setAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Instant match for built-in demo credentials
    if ((normalizedEmail === 'admin@example.com' || normalizedEmail === 'admin@autogreen.ai') && password === 'admin123') {
      const user = {
        _id: '507f1f77bcf86cd799439011',
        name: 'AutoGreen Admin',
        email: normalizedEmail,
        role: 'admin' as const,
        points: 500,
      };
      await setAuthCookie({
        userId: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      });
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
    }

    if ((normalizedEmail === 'student@example.com' || normalizedEmail === 'user@example.com' || normalizedEmail === 'student@autogreen.ai') && password === 'student123') {
      const user = {
        _id: '507f1f77bcf86cd799439012',
        name: 'Demo Student / Operator',
        email: normalizedEmail,
        role: 'user' as const,
        points: 250,
      };
      await setAuthCookie({
        userId: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      });
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
    }

    let user = null;
    try {
      await connectToDatabase();
      user = await User.findOne({ email: normalizedEmail });
    } catch (dbErr) {
      console.warn('Database connection unavailable:', dbErr);
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    } else {
      const isMatch = await comparePassword(password, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }
    }

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
    console.error('Login error:', error);
    const msg = error instanceof Error ? error.message : 'Login failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
