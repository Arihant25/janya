import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    // Use Gemini 2.5 Pro model with specific configuration for recommendations
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.8, // Higher creativity for recommendations
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096, // More tokens for detailed recommendations
      },
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Validate JSON array response
    try {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        throw new Error('Response is not an array');
      }
    } catch (parseError) {
      console.error('Invalid JSON response from Gemini:', text);
      throw new Error('Invalid response format from AI');
    }
    
    return NextResponse.json({ recommendations: text });
  } catch (error) {
    console.error('Error in Gemini recommendations:', error);
    
    // Return fallback recommendations
    const fallbackRecommendations = [
      {
        type: 'book',
        title: 'The Power of Now',
        author: 'Eckhart Tolle',
        description: 'A guide to mindfulness and being present',
        mood: 'general wellness',
        tags: ['mindfulness', 'self-help'],
        aiReason: 'A timeless book for emotional balance',
        matchScore: 75
      },
      {
        type: 'music',
        title: 'Weightless',
        artist: 'Marconi Union',
        description: 'Scientifically designed to reduce anxiety',
        duration: '8:08',
        mood: 'calming',
        tags: ['ambient', 'relaxation'],
        aiReason: 'Perfect for stress relief',
        matchScore: 75
      },
      {
        type: 'activity',
        title: 'Deep Breathing Exercise',
        description: 'Simple 4-7-8 breathing technique for relaxation',
        duration: '5 min',
        difficulty: 'Easy',
        mood: 'stress relief',
        tags: ['breathing', 'mindfulness'],
        aiReason: 'Quick stress relief technique',
        matchScore: 75
      }
    ];
    
    return NextResponse.json({ 
      recommendations: JSON.stringify(fallbackRecommendations)
    });
  }
}
