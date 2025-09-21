import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, createResponse, createErrorResponse } from '@/lib/auth';
import { geminiService } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { journalEntries } = await request.json();

    if (!journalEntries || !Array.isArray(journalEntries)) {
      return createErrorResponse('Journal entries are required');
    }

    if (journalEntries.length === 0) {
      // Return default mood analysis for users with no entries
      return createResponse({
        moodAnalysis: {
          primary: 'neutral',
          secondary: ['calm', 'curious'],
          sentiment: 'neutral',
          emotions: ['neutral', 'calm'],
          interests: ['general wellness'],
          stressLevel: 5,
          energyLevel: 5,
          confidence: 0.1,
          emotionalJourney: 'Just starting your journaling journey',
          keyThemes: ['new beginning']
        }
      });
    }

    // Create a comprehensive prompt for mood analysis
    const recentEntries = journalEntries.slice(0, 10); // Last 10 entries
    const entriesText = recentEntries.map((entry: any) =>
      `Entry: ${entry.content || ''}\nMood: ${entry.mood || 'neutral'}\nDate: ${entry.date || 'unknown'}`
    ).join('\n\n');

    const prompt = `
    Analyze these recent journal entries to understand the user's overall mood and emotional patterns.
    In your analysis, refer to the person as "you" when providing insights:

    ${entriesText}

    Based on these entries, provide a comprehensive mood analysis including:
    - Primary mood (the user's dominant emotional state)
    - Secondary moods (2-3 supporting emotional states)
    - Overall sentiment (positive, negative, or neutral)
    - Key emotions present (list of specific emotions)
    - Inferred interests based on content
    - Stress level (1-10 scale where 1 is very calm, 10 is very stressed)
    - Energy level (1-10 scale where 1 is very low energy, 10 is very high energy)
    - Confidence in analysis (0-1 where 0 is not confident, 1 is very confident)
    - Brief emotional journey description (1-2 sentences addressed to the user as "you")
    - Key themes or topics the user writes about most

    Analyze the patterns, recurring themes, and emotional progression across the user's entries.
    `;

    const moodAnalysis = await geminiService.analyzeJournalEntry(entriesText, recentEntries[0]?.mood || 'neutral');

    // Transform the journal analysis into mood analysis format
    const transformedAnalysis = {
      primary: determinePrimaryMood(moodAnalysis.emotions),
      secondary: Object.keys(moodAnalysis.emotions).slice(1, 4),
      sentiment: moodAnalysis.sentiment > 0 ? 'positive' : moodAnalysis.sentiment < 0 ? 'negative' : 'neutral',
      emotions: Object.keys(moodAnalysis.emotions),
      interests: moodAnalysis.themes,
      stressLevel: Math.round(Math.max(1, Math.min(10, (1 - moodAnalysis.sentiment) * 5 + 5))),
      energyLevel: Math.round(Math.max(1, Math.min(10, (moodAnalysis.sentiment + 1) * 5))),
      confidence: Math.min(1, recentEntries.length / 5),
      emotionalJourney: moodAnalysis.insights[0] || 'Your emotional journey is unique and evolving',
      keyThemes: moodAnalysis.themes
    };

    return createResponse({ moodAnalysis: transformedAnalysis });

  } catch (error) {
    console.error('Error analyzing mood:', error);

    // Return fallback analysis
    const fallbackAnalysis = {
      primary: 'neutral',
      secondary: ['calm'],
      sentiment: 'neutral',
      emotions: ['neutral'],
      interests: ['general wellness'],
      stressLevel: 5,
      energyLevel: 5,
      confidence: 0.3,
      emotionalJourney: 'Unable to fully analyze your emotional patterns at this time, but your journey matters',
      keyThemes: ['personal growth']
    };

    return createResponse({ moodAnalysis: fallbackAnalysis });
  }
}

function determinePrimaryMood(emotions: Record<string, number>): string {
  if (!emotions || Object.keys(emotions).length === 0) {
    return 'neutral';
  }

  // Find the emotion with the highest intensity
  const [primaryMood] = Object.entries(emotions)
    .sort(([, a], [, b]) => b - a)[0] || ['neutral', 0];

  return primaryMood;
}