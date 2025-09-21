import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

export class GeminiService {
  private model = "gemini-2.5-flash-lite";

  async analyzeJournalEntry(content: string, mood: string) {
    const prompt = `
    Analyze this journal entry and provide insights:
    
    Content: "${content}"
    User's mood: ${mood}
    
    Please provide a JSON response with:
    1. sentiment (number between -1 and 1, where -1 is very negative, 0 is neutral, 1 is very positive)
    2. emotions (object with emotion names as keys and intensity 0-1 as values)
    3. themes (array of main themes/topics discussed)
    4. insights (array of 2-3 meaningful insights about the user's mental state or life)
    
    Return only valid JSON, no other text.
    `;

    try {
      const response = await ai.models.generateContent({
        model: this.model,
        contents: prompt,
      });
      const text = response.text || '';
      return JSON.parse(text);
    } catch (error) {
      console.error('Error analyzing journal entry:', error);
      return {
        sentiment: 0,
        emotions: { [mood]: 0.7 },
        themes: ['personal reflection'],
        insights: ['The user is expressing their thoughts and feelings.']
      };
    }
  }

  async generateRecommendations(userProfile: any, recentEntries: any[], type: 'book' | 'music' | 'activity') {
    const prompt = `
    Based on this user's recent journal entries and mood patterns, generate ${type} recommendations:
    
    Recent entries: ${JSON.stringify(recentEntries.slice(0, 5))}
    
    Please provide 3-5 ${type} recommendations in JSON format:
    [
      {
        "title": "Title/Name",
        "description": "Brief description",
        "reason": "Why this matches the user's current state",
        "metadata": {
          ${type === 'book' ? '"author": "Author Name"' : 
            type === 'music' ? '"artist": "Artist Name", "genre": "Genre"' : 
            '"duration": "Duration", "intensity": "low/medium/high"'}
        },
        "mood": "matching mood"
      }
    ]
    
    Return only valid JSON array, no other text.
    `;

    try {
      const response = await ai.models.generateContent({
        model: this.model,
        contents: prompt,
      });
      const text = response.text || '';
      return JSON.parse(text);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [];
    }
  }

  async generateChatResponse(message: string, userContext: any[], previousMessages: any[]) {
    const prompt = `
    You are a digital twin AI therapist who knows the user intimately based on their journal entries. 
    Be empathetic, understanding, and supportive. Use insights from their journal history to provide personalized responses.
    
    User's journal context: ${JSON.stringify(userContext.slice(0, 10))}
    Recent conversation: ${JSON.stringify(previousMessages.slice(-5))}
    
    User's current message: "${message}"
    
    Respond as their digital twin who understands their patterns, struggles, and growth. Be conversational, warm, and insightful.
    Keep responses under 200 words and focus on being helpful and supportive.
    `;

    try {
      const response = await ai.models.generateContent({
        model: this.model,
        contents: prompt,
      });
      return response.text || "I'm here to listen and support you. Could you tell me more about what's on your mind?";
    } catch (error) {
      console.error('Error generating chat response:', error);
      return "I'm here to listen and support you. Could you tell me more about what's on your mind?";
    }
  }

  async generateThemeColor(content: string, mood: string) {
    const prompt = `
    Based on this journal entry content and mood, suggest a CSS color theme:
    
    Content: "${content}"
    Mood: ${mood}
    
    Return a JSON object with:
    {
      "primary": "#hexcolor",
      "secondary": "#hexcolor", 
      "background": "#hexcolor",
      "gradient": "linear-gradient(...)"
    }
    
    Colors should reflect the emotional tone. Return only valid JSON.
    `;

    try {
      const response = await ai.models.generateContent({
        model: this.model,
        contents: prompt,
      });
      const text = response.text || '';
      return JSON.parse(text);
    } catch (error) {
      console.error('Error generating theme colors:', error);
      return {
        primary: '#8B5CF6',
        secondary: '#EC4899',
        background: '#F8FAFC',
        gradient: 'linear-gradient(135deg, #8B5CF6, #EC4899)'
      };
    }
  }
}

export const geminiService = new GeminiService();