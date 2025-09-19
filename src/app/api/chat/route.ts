import { NextRequest } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getUserFromRequest, createResponse, createErrorResponse } from '@/lib/auth';
import { geminiService } from '@/lib/gemini';
import { ChatMessage } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const db = await getDb();
    const messages = await db
      .collection('chatMessages')
      .find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return createResponse({ messages: messages.reverse() });
  } catch (error) {
    console.error('Get chat messages error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { message } = await request.json();

    if (!message) {
      return createErrorResponse('Message is required');
    }

    const db = await getDb();
    
    // Get user's journal context for AI
    const recentEntries = await db
      .collection('journalEntries')
      .find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    // Get recent chat messages for context
    const recentMessages = await db
      .collection('chatMessages')
      .find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    // Generate AI response
    const aiResponse = await geminiService.generateChatResponse(
      message,
      recentEntries,
      recentMessages
    );

    const chatMessage: Omit<ChatMessage, '_id'> = {
      userId: user._id,
      message,
      response: aiResponse,
      context: recentEntries.slice(0, 3).map(entry => entry._id.toString()),
      createdAt: new Date()
    };

    const result = await db.collection('chatMessages').insertOne(chatMessage);

    return createResponse({
      message: 'Chat message sent successfully',
      chatMessage: { ...chatMessage, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Chat error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}