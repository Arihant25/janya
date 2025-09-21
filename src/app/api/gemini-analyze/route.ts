import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });
    
    const text = response.text || '';
    
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
