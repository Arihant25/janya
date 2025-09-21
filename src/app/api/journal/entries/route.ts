import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getUserFromRequest, createResponse, createErrorResponse } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return createErrorResponse('Date parameter is required', 400);
    }

    const db = await getDb();

    // Parse the date and create start/end of day
    const startOfDay = new Date(date + 'T00:00:00.000Z');
    const endOfDay = new Date(date + 'T23:59:59.999Z');

    const entries = await db
      .collection('journalEntries')
      .find({
        userId: user._id,
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      })
      .sort({ createdAt: 1 })
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
      wordCount: entry.wordCount || 0
    }));

    return createResponse({ entries: formattedEntries });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return createErrorResponse('Failed to fetch journal entries', 500);
  }
}
