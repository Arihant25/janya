import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

export class GeminiService {
  private model = "gemini-2.5-flash-lite";

  private cleanJsonResponse(text: string): string {
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
      return JSON.parse(this.cleanJsonResponse(text));
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
      return JSON.parse(this.cleanJsonResponse(text));
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

  async extractAndUpdatePersona(journalContent: string, currentPersona: string = '') {
    const prompt = `
    You are analyzing a journal entry to extract information about the user and update their personal profile/persona.

    Journal Entry: "${journalContent}"
    Current Persona: "${currentPersona}"

    Based on the journal entry, extract:
    1. Sentiments and emotions the user expressed
    2. Events or situations that happened to them
    3. How they feel about what happened
    4. Personal insights, preferences, relationships, goals, challenges, patterns in behavior/thinking
    5. Any new information that should be added to their persona

    Then, update the existing persona with this new information. The persona should be a comprehensive text description of the user that captures:
    - Their personality traits and emotional patterns
    - Important relationships and social dynamics
    - Goals, aspirations, and challenges they face
    - How they typically react to different situations
    - Their interests, preferences, and values
    - Recent events and their emotional impact

    Return a JSON object with:
    {
      "extractedInfo": {
        "sentiments": ["sentiment1", "sentiment2"],
        "events": ["event1", "event2"],
        "feelings": ["feeling about event1", "feeling about event2"],
        "insights": ["insight1", "insight2"]
      },
      "updatedPersona": "The updated comprehensive persona text that incorporates both old and new information..."
    }

    Return only valid JSON, no other text.
    `;

    try {
      const response = await ai.models.generateContent({
        model: this.model,
        contents: prompt,
      });
      const text = response.text || '';
      return JSON.parse(this.cleanJsonResponse(text));
    } catch (error) {
      console.error('Error extracting and updating persona:', error);
      return {
        extractedInfo: {
          sentiments: ['reflective'],
          events: ['journal writing'],
          feelings: ['contemplative'],
          insights: ['User is engaging in self-reflection']
        },
        updatedPersona: currentPersona || 'User is beginning their journaling journey and appears thoughtful about their experiences.'
      };
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
      return JSON.parse(this.cleanJsonResponse(text));
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