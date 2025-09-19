import { NextRequest } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getUserFromRequest, createResponse, createErrorResponse } from '@/lib/auth';
import { geminiService } from '@/lib/gemini';
import { JournalEntry } from '@/types/database';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const db = await getDb();
    const entries = await db
      .collection('journalEntries')
      .find({ userId: user._id })
      .sort({ createdAt: -1 })
      .toArray();

    return createResponse({ entries });
  } catch (error) {
    console.error('Get entries error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { title, content, mood, tags = [], photo } = await request.json();

    if (!title || !content || !mood) {
      return createErrorResponse('Title, content, and mood are required');
    }

    const db = await getDb();
    
    // Analyze the journal entry with AI
    let aiAnalysis = null;
    let theme = 'default';
    
    if (user.preferences.aiAnalysis) {
      try {
        aiAnalysis = await geminiService.analyzeJournalEntry(content, mood);
        const themeColors = await geminiService.generateThemeColor(content, mood);
        theme = themeColors.gradient;
      } catch (error) {
        console.error('AI analysis failed:', error);
      }
    }

    const entry: Omit<JournalEntry, '_id'> = {
      userId: user._id,
      title,
      content,
      mood: mood as JournalEntry['mood'],
      tags,
      theme,
      wordCount: content.split(' ').length,
      photo,
      aiAnalysis,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('journalEntries').insertOne(entry);

    // Update user stats
    await updateUserStats(db, user._id, mood, tags);

    // Check for achievements
    await checkAchievements(db, user._id);

    return createResponse({
      message: 'Journal entry created successfully',
      entry: { ...entry, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Create entry error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

async function updateUserStats(db: any, userId: ObjectId, mood: string, tags: string[]) {
  const stats = await db.collection('userStats').findOne({ userId });
  
  if (stats) {
    const moodDistribution = { ...stats.moodDistribution };
    moodDistribution[mood] = (moodDistribution[mood] || 0) + 1;

    // Calculate streak
    const today = new Date();
    const lastEntry = stats.lastEntryDate ? new Date(stats.lastEntryDate) : null;
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let currentStreak = stats.currentStreak;
    if (!lastEntry || lastEntry.toDateString() === yesterday.toDateString()) {
      currentStreak = stats.currentStreak + 1;
    } else if (lastEntry.toDateString() !== today.toDateString()) {
      currentStreak = 1;
    }

    await db.collection('userStats').updateOne(
      { userId },
      {
        $set: {
          totalEntries: stats.totalEntries + 1,
          currentStreak,
          longestStreak: Math.max(stats.longestStreak, currentStreak),
          moodDistribution,
          favoriteThemes: [...new Set([...stats.favoriteThemes, ...tags])].slice(0, 10),
          lastEntryDate: today,
          updatedAt: new Date()
        }
      }
    );
  }
}

async function checkAchievements(db: any, userId: ObjectId) {
  const stats = await db.collection('userStats').findOne({ userId });
  const existingAchievements = await db.collection('achievements').find({ userId }).toArray();
  const achievementIds = existingAchievements.map(a => a.achievementId);

  const newAchievements = [];

  // First entry achievement
  if (stats.totalEntries === 1 && !achievementIds.includes('first_entry')) {
    newAchievements.push({
      userId,
      achievementId: 'first_entry',
      title: 'First Entry',
      description: 'Created your first journal entry',
      icon: '🎯',
      rarity: 'common',
      unlockedAt: new Date()
    });
  }

  // Week warrior achievement
  if (stats.currentStreak >= 7 && !achievementIds.includes('week_warrior')) {
    newAchievements.push({
      userId,
      achievementId: 'week_warrior',
      title: 'Week Warrior',
      description: 'Journaled for 7 consecutive days',
      icon: '🔥',
      rarity: 'rare',
      unlockedAt: new Date()
    });
  }

  // Month master achievement
  if (stats.currentStreak >= 30 && !achievementIds.includes('month_master')) {
    newAchievements.push({
      userId,
      achievementId: 'month_master',
      title: 'Month Master',
      description: 'Journaled for 30 consecutive days',
      icon: '🏆',
      rarity: 'epic',
      unlockedAt: new Date()
    });
  }

  if (newAchievements.length > 0) {
    await db.collection('achievements').insertMany(newAchievements);
  }
}