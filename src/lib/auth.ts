import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db';
import User, { IUser } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secure-pdf-course-secret-jwt-key-2026';
const TOKEN_COOKIE_NAME = 'auth_token';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  name: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function setAuthCookie(payload: TokenPayload) {
  const token = signToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
  return token;
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE_NAME);
}

export async function getSessionFromCookies(): Promise<TokenPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<IUser | null> {
  const session = await getSessionFromCookies();
  if (!session) return null;
  
  await connectToDatabase();
  const user = await User.findById(session.userId);
  return user;
}

export function extractSessionFromRequest(req: NextRequest): TokenPayload | null {
  const token = req.cookies.get(TOKEN_COOKIE_NAME)?.value || 
                req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  return verifyToken(token);
}
