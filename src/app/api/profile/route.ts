import { NextRequest } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getUserFromRequest, createResponse, createErrorResponse } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const db = await getDb();
    
    // Get user stats
    const stats = await db.collection('userStats').findOne({ userId: user._id });
    
    // Get achievements
    const achievements = await db
      .collection('achievements')
      .find({ userId: user._id })
      .sort({ unlockedAt: -1 })
      .toArray();

    const userProfile = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      musicPlatform: user.musicPlatform,
      joinDate: user.createdAt,
      preferences: user.preferences,
      stats: stats || {
        totalEntries: 0,
        currentStreak: 0,
        longestStreak: 0,
        moodDistribution: {},
        favoriteThemes: []
      },
      achievements
    };

    return createResponse({ profile: userProfile });
  } catch (error) {
    console.error('Get profile error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const updates = await request.json();
    const allowedUpdates = ['name', 'avatar', 'musicPlatform', 'preferences'];
    const validUpdates = Object.keys(updates).filter(key => allowedUpdates.includes(key));
    
    if (validUpdates.length === 0) {
      return createErrorResponse('No valid updates provided');
    }

    const updateData: any = { updatedAt: new Date() };
    validUpdates.forEach(key => {
      updateData[key] = updates[key];
    });

    const db = await getDb();
    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: updateData }
    );

    return createResponse({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}