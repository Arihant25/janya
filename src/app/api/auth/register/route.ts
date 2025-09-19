import { NextRequest } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { hashPassword, generateToken, createResponse, createErrorResponse } from '@/lib/auth';
import { User } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return createErrorResponse('Email, password, and name are required');
    }

    const db = await getDb();
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return createErrorResponse('User already exists');
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user: Omit<User, '_id'> = {
      email,
      name,
      password: hashedPassword,
      musicPlatform: null,
      preferences: {
        theme: 'auto',
        notifications: true,
        musicIntegration: true,
        aiAnalysis: true
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('users').insertOne(user);
    
    // Initialize user stats
    await db.collection('userStats').insertOne({
      userId: result.insertedId,
      totalEntries: 0,
      currentStreak: 0,
      longestStreak: 0,
      moodDistribution: {},
      favoriteThemes: [],
      updatedAt: new Date()
    });

    const token = generateToken(result.insertedId.toString());

    return createResponse({
      message: 'User created successfully',
      token,
      user: {
        id: result.insertedId,
        email,
        name,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}