import { NextRequest } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { verifyPassword, generateToken, createResponse, createErrorResponse } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return createErrorResponse('Email and password are required');
    }

    const db = await getDb();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return createErrorResponse('Invalid credentials');
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return createErrorResponse('Invalid credentials');
    }

    const token = generateToken(user._id.toString());

    return createResponse({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        preferences: user.preferences,
        musicPlatform: user.musicPlatform
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}