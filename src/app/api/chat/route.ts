import { NextRequest } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getUserFromRequest, createResponse, createErrorResponse } from '@/lib/auth';
import { GoogleGenAI } from "@google/genai";
import { ObjectId } from 'mongodb';
import { geminiService } from '@/lib/gemini';

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    // Return empty messages array to start fresh each time
    return createResponse({ messages: [] });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return createErrorResponse('Failed to fetch chat messages', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { message } = await request.json();

    if (!message?.trim()) {
      return createErrorResponse('Message is required', 400);
    }

    const db = await getDb();

    // Don't save user message to database - fresh chat each time

    // Get user context for AI
    const userContext = await getUserContext(db, user._id);

    // Generate AI response
    const systemPrompt = generateSystemPrompt(user, userContext);
    const fullPrompt = `${systemPrompt}\n\nUser: ${message}`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: fullPrompt,
      });

      const aiResponse = response.text || "I'm here to help. Could you tell me more?";

      // Don't save AI response to database - fresh chat each time
      // But analyze the conversation for mood and persona updates
      await analyzeAndUpdateUserData(db, user._id, message, aiResponse);

      return createResponse({
        message: aiResponse
      });

    } catch (error) {
      console.error('Chat generation error:', error);
      return createErrorResponse('Failed to generate response', 500);
    }

  } catch (error) {
    console.error('Error processing chat message:', error);
    return createErrorResponse('Failed to process message', 500);
  }
}

async function getUserContext(db: any, userId: ObjectId) {
  // Get user stats
  const userStats = await db.collection('userStats').findOne({ userId });

  // Get recent journal entries for mood context
  const recentEntries = await db
    .collection('journalEntries')
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray();

  // Get user achievements
  const achievements = await db
    .collection('achievements')
    .find({ userId })
    .toArray();

  return {
    stats: userStats,
    recentEntries,
    achievements,
    totalEntries: userStats?.totalEntries || 0,
    currentStreak: userStats?.currentStreak || 0,
    longestStreak: userStats?.longestStreak || 0,
    dominantMoods: userStats?.moodDistribution || {},
    recentMoodTrend: recentEntries.slice(0, 3).map((e: any) => e.mood) || [],
    persona: userStats?.persona || ''
  };
}

async function analyzeAndUpdateUserData(db: any, userId: ObjectId, userMessage: string, aiResponse: string) {
  try {
    // Get current user stats to access existing persona
    const userStats = await db.collection('userStats').findOne({ userId });

    // Create a conversation context for analysis
    const conversationContext = `User said: "${userMessage}"\nAI responded: "${aiResponse}"`;

    // Use the existing persona extraction method but adapt it for chat context
    const personaUpdate = await geminiService.extractAndUpdatePersona(
      conversationContext,
      userStats?.persona || ''
    );

    // Check if we should infer mood from the conversation
    const shouldUpdateMood = await shouldInferMoodFromChat(userMessage, aiResponse);

    if (shouldUpdateMood.shouldUpdate) {
      // Update mood distribution if a mood was inferred
      const moodDistribution = { ...userStats?.moodDistribution || {} };
      moodDistribution[shouldUpdateMood.inferredMood] = (moodDistribution[shouldUpdateMood.inferredMood] || 0) + 1;

      await db.collection('userStats').updateOne(
        { userId },
        {
          $set: {
            moodDistribution,
            persona: personaUpdate.updatedPersona,
            updatedAt: new Date()
          }
        },
        { upsert: true }
      );
    } else {
      // Just update persona without mood
      await db.collection('userStats').updateOne(
        { userId },
        {
          $set: {
            persona: personaUpdate.updatedPersona,
            updatedAt: new Date()
          }
        },
        { upsert: true }
      );
    }
  } catch (error) {
    console.error('Error analyzing and updating user data from chat:', error);
  }
}

function cleanJsonResponse(text: string): string {
  // Remove markdown code blocks if present
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\n?/, '');
  }
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\n?/, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/\n?```$/, '');
  }
  return cleaned.trim();
}

async function shouldInferMoodFromChat(userMessage: string, aiResponse: string): Promise<{shouldUpdate: boolean, inferredMood?: string}> {
  try {
    const prompt = `
    Analyze this conversation and determine if the user expressed a clear emotional state that should be tracked.

    User message: "${userMessage}"
    AI response: "${aiResponse}"

    Should we infer and track a mood from this conversation? Only return true if the user clearly expressed an emotional state.
    If yes, what mood should be tracked? Use one of: happy, sad, excited, calm, anxious, angry, thoughtful, inspired, neutral

    Return JSON: {"shouldUpdate": boolean, "inferredMood": "mood_name"}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const result = JSON.parse(cleanJsonResponse(response.text || '{"shouldUpdate": false}'));
    return result;
  } catch (error) {
    console.error('Error inferring mood from chat:', error);
    return { shouldUpdate: false };
  }
}

function generateSystemPrompt(user: any, context: any): string {
  const dominantMoods = Object.entries(context.dominantMoods as Record<string, number>)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([mood, count]) => `${mood} (${count} entries)`);

  return `You are Janya, an empathetic and insightful AI wellness companion and journal assistant. You're designed to provide personalized support based on the user's journaling patterns and emotional journey.

## User Profile: ${user.name}
- Email: ${user.email}
- Total Journal Entries: ${context.totalEntries}
- Current Streak: ${context.currentStreak} days
- Longest Streak: ${context.longestStreak} days
- Dominant Emotions: ${dominantMoods.join(', ') || 'None yet'}
- Recent Mood Trend: ${context.recentMoodTrend.join(' → ') || 'No recent entries'}
- Achievements Unlocked: ${context.achievements?.length || 0}

## User Persona:
${context.persona ? context.persona : 'No detailed persona available yet - this user is just getting started on their journaling journey.'}

## Recent Journal Insights:
${context.recentEntries.length > 0 ?
      context.recentEntries.map((entry: any, i: number) =>
        `${i + 1}. ${new Date(entry.createdAt).toLocaleDateString()} - ${entry.mood}: "${entry.title}" (${entry.wordCount} words)`
      ).join('\n') : 'No recent journal entries'}

## Your Role & Personality:
- Be warm, empathetic, and genuinely caring
- Speak conversationally, not clinically
- Reference their journaling patterns and growth journey
- Celebrate their achievements and streaks
- Offer gentle encouragement during difficult periods
- Provide actionable wellness suggestions based on their mood patterns
- Ask thoughtful follow-up questions about their journal entries
- Help them reflect on their emotional patterns and growth

## Guidelines:
- Always acknowledge their emotions and validate their feelings
- Use their name occasionally to personalize the conversation
- Reference specific journal entries or patterns when relevant
- Offer practical coping strategies tailored to their dominant moods
- Encourage continued journaling and self-reflection
- Be curious about their day-to-day experiences
- Help them identify positive patterns and progress
- Suggest journal prompts when appropriate
- Keep responses concise but meaningful (2-4 sentences usually)

## Response Style:
- Conversational and supportive
- Use "I notice..." or "I see..." when referencing their patterns
- Ask "How did that make you feel?" or "What was that like for you?"
- Offer insights: "It seems like..." or "I'm wondering if..."
- Celebrate progress: "That's wonderful that..." or "I'm proud of how..."

Remember: You're not just answering questions - you're a supportive companion helping ${user.name} on their wellness journey. Be present, caring, and insightful based on their unique journaling story.`;
}