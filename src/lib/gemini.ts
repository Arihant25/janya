import { GoogleGenAI, Type } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

export class GeminiService {
  private model = "gemini-2.5-flash-lite";

  async analyzeJournalEntry(content: string, mood: string) {
    const prompt = `
    Analyze this journal entry and provide insights:

    Content: "${content}"
    User's mood: ${mood}

    Analyze the sentiment, emotions, themes, and provide meaningful insights about the user's mental state or life based on this entry.
    `;

    try {
      const response = await ai.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              sentiment: {
                type: Type.NUMBER,
                description: "Sentiment score between -1 (very negative) and 1 (very positive)"
              },
              emotions: {
                type: Type.OBJECT,
                properties: {
                  happy: { type: Type.NUMBER, description: "Happiness intensity 0-1" },
                  sad: { type: Type.NUMBER, description: "Sadness intensity 0-1" },
                  anxious: { type: Type.NUMBER, description: "Anxiety intensity 0-1" },
                  excited: { type: Type.NUMBER, description: "Excitement intensity 0-1" },
                  angry: { type: Type.NUMBER, description: "Anger intensity 0-1" },
                  peaceful: { type: Type.NUMBER, description: "Peace intensity 0-1" },
                  grateful: { type: Type.NUMBER, description: "Gratitude intensity 0-1" },
                  overwhelmed: { type: Type.NUMBER, description: "Overwhelm intensity 0-1" }
                },
                additionalProperties: { type: Type.NUMBER },
                description: "Emotion names as keys with intensity 0-1 as values"
              },
              themes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Main themes or topics discussed in the journal entry"
              },
              insights: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "2-3 meaningful insights about the user's mental state or life"
              }
            },
            required: ["sentiment", "emotions", "themes", "insights"],
            propertyOrdering: ["sentiment", "emotions", "themes", "insights"]
          }
        }
      });
      return JSON.parse(response.text || '{}');
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
    Based on this user's recent journal entries and mood patterns, generate personalized ${type} recommendations:

    Recent entries: ${JSON.stringify(recentEntries.slice(0, 5))}

    Generate 3-5 ${type} recommendations that would benefit this user based on their current emotional state and journal content.
    `;

    try {
      const response = await ai.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: {
                  type: Type.STRING,
                  description: "Title or name of the recommendation"
                },
                description: {
                  type: Type.STRING,
                  description: "Brief description of the item"
                },
                reason: {
                  type: Type.STRING,
                  description: "Why this matches the user's current emotional state"
                },
                metadata: {
                  type: Type.OBJECT,
                  properties: {
                    author: { type: Type.STRING, description: "Author or creator" },
                    genre: { type: Type.STRING, description: "Genre or category" },
                    year: { type: Type.STRING, description: "Publication or release year" },
                    duration: { type: Type.STRING, description: "Duration or length" },
                    tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Additional tags" }
                  },
                  additionalProperties: { type: Type.STRING },
                  description: "Additional metadata like author, artist, duration, etc."
                },
                mood: {
                  type: Type.STRING,
                  description: "The mood this recommendation addresses"
                }
              },
              required: ["title", "description", "reason", "mood"],
              propertyOrdering: ["title", "description", "reason", "metadata", "mood"]
            },
            minItems: 3,
            maxItems: 5
          }
        }
      });
      return JSON.parse(response.text || '[]');
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

    Based on the journal entry, extract sentiments, events, feelings, and insights about the user. Then update the existing persona with this new information. The persona should be a comprehensive text description that captures their personality, relationships, goals, challenges, interests, and recent experiences.
    `;

    try {
      const response = await ai.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              extractedInfo: {
                type: Type.OBJECT,
                properties: {
                  sentiments: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Sentiments and emotions the user expressed"
                  },
                  events: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Events or situations that happened to them"
                  },
                  feelings: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "How they feel about what happened"
                  },
                  insights: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Personal insights, preferences, relationships, goals, challenges"
                  }
                },
                required: ["sentiments", "events", "feelings", "insights"]
              },
              updatedPersona: {
                type: Type.STRING,
                description: "Updated comprehensive persona text incorporating old and new information"
              }
            },
            required: ["extractedInfo", "updatedPersona"],
            propertyOrdering: ["extractedInfo", "updatedPersona"]
          }
        }
      });
      return JSON.parse(response.text || '{}');
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
    Based on this journal entry content and mood, suggest a CSS color theme that reflects the emotional tone:

    Content: "${content}"
    Mood: ${mood}

    Generate colors that match the emotional atmosphere of the content.
    `;

    try {
      const response = await ai.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              primary: {
                type: Type.STRING,
                description: "Primary hex color that reflects the mood"
              },
              secondary: {
                type: Type.STRING,
                description: "Secondary hex color that complements the primary"
              },
              background: {
                type: Type.STRING,
                description: "Background hex color appropriate for the theme"
              },
              gradient: {
                type: Type.STRING,
                description: "CSS linear-gradient expression using the colors"
              }
            },
            required: ["primary", "secondary", "background", "gradient"],
            propertyOrdering: ["primary", "secondary", "background", "gradient"]
          }
        }
      });
      return JSON.parse(response.text || '{}');
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