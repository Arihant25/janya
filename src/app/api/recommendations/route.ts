import { NextRequest } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getUserFromRequest, createResponse, createErrorResponse } from '@/lib/auth';
import { geminiService } from '@/lib/gemini';
import { Recommendation } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'book' | 'music' | 'activity' | null;

    const db = await getDb();
    const query: any = { userId: user._id };
    if (type) {
      query.type = type;
    }

    const recommendations = await db
      .collection('recommendations')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    return createResponse({ recommendations });
  } catch (error) {
    console.error('Get recommendations error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { type } = await request.json();

    if (!type || !['book', 'music', 'activity'].includes(type)) {
      return createErrorResponse('Valid type (book, music, activity) is required');
    }

    const db = await getDb();

    // Get user's recent journal entries for context
    const recentEntries = await db
      .collection('journalEntries')
      .find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    if (recentEntries.length === 0) {
      return createErrorResponse('Please create some journal entries first to get personalized recommendations');
    }

    // Generate AI recommendations
    const aiRecommendations = await geminiService.generateRecommendations(
      user,
      recentEntries,
      type
    );

    const recommendations = aiRecommendations.map((rec: any) => ({
      userId: user._id,
      type,
      title: rec.title,
      description: rec.description,
      reason: rec.reason,
      metadata: rec.metadata || {},
      mood: rec.mood,
      clicked: false,
      createdAt: new Date()
    }));

    if (recommendations.length > 0) {
      const result = await db.collection('recommendations').insertMany(recommendations);
      return createResponse({
        message: 'Recommendations generated successfully',
        recommendations: recommendations.map((rec: any, index: number) => ({
          ...rec,
          _id: result.insertedIds[index]
        }))
      });
    } else {
      return createErrorResponse('Failed to generate recommendations');
    }
  } catch (error) {
    console.error('Generate recommendations error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { recommendationId, clicked } = await request.json();

    if (!recommendationId) {
      return createErrorResponse('Recommendation ID is required');
    }

    const db = await getDb();
    await db.collection('recommendations').updateOne(
      { _id: new (await import('mongodb')).ObjectId(recommendationId), userId: user._id },
      { $set: { clicked: !!clicked } }
    );

    return createResponse({ message: 'Recommendation updated successfully' });
  } catch (error) {
    console.error('Update recommendation error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}