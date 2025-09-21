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

    // Transform entries to match frontend interface
    const formattedEntries = entries.map((entry: any) => ({
      id: entry._id.toString(),
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      theme: entry.theme,
      photo: entry.photo,
      audioRecording: entry.audioRecording,
      date: entry.createdAt,
      weather: entry.weather,
      location: entry.location,
      tags: entry.tags || [],
      aiInsights: entry.aiAnalysis?.insights?.join(' ') || undefined,
      wordCount: entry.wordCount || 0,
      time: new Date(entry.createdAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      preview: entry.content?.substring(0, 120) + '...' || 'No preview available'
    }));

    return createResponse({ entries: formattedEntries });
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

    const { title, content, mood, tags = [], photo, audioRecording, weather, location } = await request.json();

    // Validate required fields - at least one content type should be present
    const hasTitle = title?.trim();
    const hasContent = content?.trim();
    const hasMood = mood;
    const hasPhoto = photo;
    const hasAudio = audioRecording;

    if (!hasTitle && !hasContent && !hasMood && !hasPhoto && !hasAudio) {
      return createErrorResponse('Please add at least some content to your journal entry');
    }

    const db = await getDb();

    // Analyze the journal entry with AI if content exists
    let aiAnalysis = null;
    let theme = mood || 'neutral';

    if (user.preferences?.aiAnalysis && content?.trim()) {
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
      title: title?.trim() || `Journal Entry - ${new Date().toLocaleDateString()}`,
      content: content?.trim() || '',
      mood: (mood || 'neutral') as JournalEntry['mood'],
      tags,
      theme,
      wordCount: content?.trim() ? content.trim().split(' ').filter((word: string) => word.length > 0).length : 0,
      photo,
      audioRecording,
      weather,
      location,
      aiAnalysis,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('journalEntries').insertOne(entry);

    // Update user stats
    await updateUserStats(db, user._id, mood || 'neutral', tags, content);

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

async function updateUserStats(db: any, userId: ObjectId, mood: string, tags: string[], journalContent: string = '') {
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

    // Update persona if journal content exists
    let updatedPersona = stats.persona;
    if (journalContent.trim()) {
      try {
        const personaUpdate = await geminiService.extractAndUpdatePersona(journalContent, stats.persona || '');
        updatedPersona = personaUpdate.updatedPersona;
      } catch (error) {
        console.error('Error updating persona:', error);
      }
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
          persona: updatedPersona,
          updatedAt: new Date()
        }
      }
    );
  } else {
    // Initialize user stats for first-time users
    const initialMoodDistribution = { [mood]: 1 };

    // Create initial persona if journal content exists
    let initialPersona = '';
    if (journalContent.trim()) {
      try {
        const personaUpdate = await geminiService.extractAndUpdatePersona(journalContent, '');
        initialPersona = personaUpdate.updatedPersona;
      } catch (error) {
        console.error('Error creating initial persona:', error);
      }
    }

    await db.collection('userStats').insertOne({
      userId,
      totalEntries: 1,
      currentStreak: 1,
      longestStreak: 1,
      moodDistribution: initialMoodDistribution,
      favoriteThemes: tags.slice(0, 10),
      lastEntryDate: new Date(),
      persona: initialPersona,
      updatedAt: new Date()
    });
  }
}

async function checkAchievements(db: any, userId: ObjectId) {
  const stats = await db.collection('userStats').findOne({ userId });
  const existingAchievements = await db.collection('achievements').find({ userId }).toArray();
  const achievementIds = existingAchievements.map((a: any) => a.achievementId);

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