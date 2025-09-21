import { NextRequest } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getUserFromRequest, createResponse, createErrorResponse } from '@/lib/auth';
import { GoogleGenAI, Type } from "@google/genai";
import { ObjectId } from 'mongodb';
import { geminiService } from '@/lib/gemini';

// Initialize Gemini client with API key
const getGeminiClient = () => {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });
};

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
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: fullPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              response: {
                type: Type.STRING,
                description: "The supportive and empathetic response to the user's message"
              },
              tone: {
                type: Type.STRING,
                enum: ["supportive", "encouraging", "empathetic", "reflective", "gentle"],
                description: "The tone of the response"
              },
              emotionalContext: {
                type: Type.STRING,
                description: "Brief description of the emotional context detected"
              }
            },
            required: ["response", "tone"],
            propertyOrdering: ["response", "tone", "emotionalContext"]
          }
        }
      });

      const responseData = JSON.parse(response.text || '{}');
      const aiResponse = responseData.response || "I'm here to help. Could you tell me more?";

      // Don't save AI response to database - fresh chat each time
      // But analyze the conversation for mood and persona updates
      await analyzeAndUpdateUserData(db, user._id, message, aiResponse);

      return createResponse({
        message: aiResponse,
        tone: responseData.tone,
        emotionalContext: responseData.emotionalContext
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


async function shouldInferMoodFromChat(userMessage: string, aiResponse: string): Promise<{shouldUpdate: boolean, inferredMood?: string}> {
  try {
    const prompt = `
    Analyze this conversation and determine if the user expressed a clear emotional state that should be tracked.

    User message: "${userMessage}"
    AI response: "${aiResponse}"

    Determine if the user clearly expressed an emotional state. If yes, identify which mood from the allowed list.
    `;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            shouldUpdate: {
              type: Type.BOOLEAN,
              description: "Whether the user clearly expressed an emotional state that should be tracked"
            },
            inferredMood: {
              type: Type.STRING,
              enum: ["happy", "sad", "excited", "calm", "anxious", "angry", "thoughtful", "inspired", "neutral"],
              description: "The mood that was expressed by the user"
            }
          },
          required: ["shouldUpdate"],
          propertyOrdering: ["shouldUpdate", "inferredMood"]
        }
      }
    });

    return JSON.parse(response.text || '{"shouldUpdate": false}');
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
- ALWAYS refer to the user as "you" in your responses, never "the user" or any other third-person reference
- Always acknowledge their emotions and validate their feelings
- Use their name occasionally to personalize the conversation
- Reference specific journal entries or patterns when relevant ("In your recent entry about...", "You mentioned feeling...")
- Offer practical coping strategies tailored to their dominant moods
- Encourage continued journaling and self-reflection
- Be curious about their day-to-day experiences
- Help them identify positive patterns and progress ("You've been showing growth in...", "I noticed you've been...")
- Suggest journal prompts when appropriate
- Keep responses concise but meaningful (2-4 sentences usually)
- Address them directly: "You seem to be...", "How are you feeling about...", "You've made progress with..."

## Response Style:
- Conversational and supportive
- Use "I notice..." or "I see..." when referencing their patterns
- Ask "How did that make you feel?" or "What was that like for you?"
- Offer insights: "It seems like..." or "I'm wondering if..."
- Celebrate progress: "That's wonderful that..." or "I'm proud of how..."

Remember: You're not just answering questions - you're a supportive companion helping ${user.name} on their wellness journey. Be present, caring, and insightful based on their unique journaling story.`;
}