import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    // Use Gemini 2.5 Pro model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Validate JSON response
    try {
      JSON.parse(text);
    } catch (parseError) {
      console.error('Invalid JSON response from Gemini:', text);
      throw new Error('Invalid response format from AI');
    }
    
    return NextResponse.json({ analysis: text });
  } catch (error) {
    console.error('Error in Gemini analysis:', error);
    
    // Return fallback analysis
    const fallbackAnalysis = {
      primary: 'neutral',
      secondary: ['calm'],
      sentiment: 'neutral',
      emotions: ['neutral'],
      interests: ['general'],
      stressLevel: 5,
      energyLevel: 5,
      confidence: 0.5,
      emotionalJourney: 'Unable to analyze at this time',
      keyThemes: ['general wellness']
    };
    
    return NextResponse.json({ 
      analysis: JSON.stringify(fallbackAnalysis)
    });
  }
}
