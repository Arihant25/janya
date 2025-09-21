import { NextRequest } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getUserFromRequest, createResponse, createErrorResponse } from '@/lib/auth';
import { geminiService } from '@/lib/gemini';
import { JournalEntry } from '@/types/database';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { id } = await params;

    const db = await getDb();
    const entry = await db
      .collection('journalEntries')
      .findOne({
        _id: new ObjectId(id),
        userId: user._id
      });

    if (!entry) {
      return createErrorResponse('Journal entry not found', 404);
    }

    // Transform entry to match frontend interface
    const formattedEntry = {
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
    };

    return createResponse({ entry: formattedEntry });
  } catch (error) {
    console.error('Get entry error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { id } = await params;

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

    // Check if entry exists and belongs to user
    const existingEntry = await db.collection('journalEntries').findOne({
      _id: new ObjectId(id),
      userId: user._id
    });

    if (!existingEntry) {
      return createErrorResponse('Journal entry not found', 404);
    }

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

    const updateData = {
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
      updatedAt: new Date()
    };

    await db.collection('journalEntries').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return createResponse({
      message: 'Journal entry updated successfully',
      entry: { ...updateData, _id: id }
    });
  } catch (error) {
    console.error('Update entry error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { id } = await params;

    const db = await getDb();

    // Check if entry exists and belongs to user
    const existingEntry = await db.collection('journalEntries').findOne({
      _id: new ObjectId(id),
      userId: user._id
    });

    if (!existingEntry) {
      return createErrorResponse('Journal entry not found', 404);
    }

    // Delete the journal entry
    await db.collection('journalEntries').deleteOne({ _id: new ObjectId(id) });

    // Update user stats (decrement counts)
    await updateUserStatsAfterDeletion(db, user._id, existingEntry.mood);

    // TODO: Update user persona/AI model when a journal entry is deleted
    // This should involve:
    // 1. Re-analyzing remaining journal entries to update mood patterns
    // 2. Updating the AI recommendation engine based on new data
    // 3. Recalculating user insights and personality traits
    // 4. Adjusting the chatbot's understanding of the user's current state
    // 5. Updating any cached embeddings or ML model weights
    // Implementation should consider:
    // - Batch processing for performance if many entries are deleted
    // - Graceful degradation if AI services are unavailable
    // - Privacy implications of data retention/deletion

    return createResponse({
      message: 'Journal entry deleted successfully'
    });
  } catch (error) {
    console.error('Delete entry error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

async function updateUserStatsAfterDeletion(db: any, userId: ObjectId, deletedMood: string) {
  const stats = await db.collection('userStats').findOne({ userId });

  if (stats) {
    const moodDistribution = { ...stats.moodDistribution };
    if (moodDistribution[deletedMood] && moodDistribution[deletedMood] > 0) {
      moodDistribution[deletedMood] -= 1;
      if (moodDistribution[deletedMood] === 0) {
        delete moodDistribution[deletedMood];
      }
    }

    await db.collection('userStats').updateOne(
      { userId },
      {
        $set: {
          totalEntries: Math.max(0, stats.totalEntries - 1),
          moodDistribution,
          updatedAt: new Date()
        }
      }
    );
  }
}