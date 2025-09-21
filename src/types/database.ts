import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  name: string;
  password: string;
  avatar?: string;
  musicPlatform?: 'spotify' | 'apple' | 'youtube' | null;
  preferences: {
    theme: 'auto' | 'light' | 'dark';
    notifications: boolean;
    musicIntegration: boolean;
    aiAnalysis: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface JournalEntry {
  _id?: ObjectId;
  userId: ObjectId;
  title: string;
  content: string;
  mood: 'happy' | 'sad' | 'excited' | 'calm' | 'anxious' | 'angry' | 'thoughtful' | 'inspired' | 'neutral';
  tags: string[];
  theme: string;
  wordCount: number;
  photo?: string; // Base64 encoded photo or URL
  audioRecording?: string; // Base64 encoded audio recording
  weather?: string;
  location?: string;
  aiAnalysis?: {
    sentiment: number;
    emotions: { [emotion: string]: number };
    themes: string[];
    insights: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  _id?: ObjectId;
  userId: ObjectId;
  message: string;
  response: string;
  context?: string[]; // Related journal entry IDs
  createdAt: Date;
}

export interface Recommendation {
  _id?: ObjectId;
  userId: ObjectId;
  type: 'book' | 'music' | 'activity';
  title: string;
  description: string;
  reason: string; // Why this was recommended
  metadata?: {
    author?: string;
    artist?: string;
    genre?: string;
    duration?: string;
    url?: string;
  };
  mood: string;
  clicked: boolean;
  createdAt: Date;
}

export interface Achievement {
  _id?: ObjectId;
  userId: ObjectId;
  achievementId: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
}

export interface UserStats {
  _id?: ObjectId;
  userId: ObjectId;
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
  moodDistribution: { [mood: string]: number };
  favoriteThemes: string[];
  lastEntryDate?: Date;
  persona?: string;
  updatedAt: Date;
}