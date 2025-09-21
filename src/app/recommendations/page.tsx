'use client';

import { useState, useEffect } from 'react';
import { Book, Music, Activity, Heart, ArrowLeft, RefreshCw, Loader2, Volume2, BookOpen, Search } from 'lucide-react';
import { Card, Button, IconButton, TextField, LinearProgress, Chip, ChipSet, FAB, List, ListItem, Divider } from '@/app/components/MaterialComponents';
import withAuth from '@/components/withAuth';
import Navigation from '@/app/components/Navigation';

// Components
import RecommendationCard from './components/RecommendationCard';
import MoodSummary from './components/MoodSummary';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  date: Date;
  emotions: string[];
  interests: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
}

interface MoodAnalysis {
  primary: string;
  secondary: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  emotions: string[];
  interests: string[];
  stressLevel: number;
  energyLevel: number;
  confidence: number;
}

interface Recommendation {
  id: string;
  type: 'book' | 'music' | 'activity';
  title: string;
  description: string;
  author?: string;
  artist?: string;
  duration?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  mood: string;
  image?: string;
  coverArt?: string;
  link?: string;
  rating: number;
  tags: string[];
  aiReason?: string;
  matchScore: number;
  spotifyId?: string;
  appleId?: string;
  isbn?: string;
  previewUrl?: string;
}

// Helper functions to extract data from existing journal entries
const extractEmotionsFromContent = (content: string): string[] => {
  const emotionWords = {
    'happy': ['happy', 'joy', 'excited', 'cheerful', 'delighted', 'pleased'],
    'sad': ['sad', 'down', 'depressed', 'disappointed', 'upset', 'melancholy'],
    'anxious': ['anxious', 'worried', 'nervous', 'concerned', 'uneasy', 'stressed'],
    'angry': ['angry', 'frustrated', 'annoyed', 'irritated', 'mad', 'furious'],
    'grateful': ['grateful', 'thankful', 'blessed', 'appreciative'],
    'tired': ['tired', 'exhausted', 'drained', 'fatigued', 'weary'],
    'excited': ['excited', 'thrilled', 'enthusiastic', 'pumped', 'energized'],
    'calm': ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil'],
    'confused': ['confused', 'lost', 'uncertain', 'puzzled', 'bewildered'],
    'hopeful': ['hopeful', 'optimistic', 'positive', 'confident', 'encouraged']
  };

  const foundEmotions: string[] = [];
  const lowerContent = content.toLowerCase();

  Object.entries(emotionWords).forEach(([emotion, words]) => {
    if (words.some(word => lowerContent.includes(word))) {
      foundEmotions.push(emotion);
    }
  });

  return foundEmotions.length > 0 ? foundEmotions : ['neutral'];
};

const extractInterestsFromContent = (content: string): string[] => {
  const interestKeywords = {
    'reading': ['reading', 'book', 'novel', 'literature', 'article'],
    'music': ['music', 'song', 'listening', 'playlist', 'concert', 'album'],
    'exercise': ['exercise', 'workout', 'gym', 'running', 'fitness', 'yoga'],
    'nature': ['nature', 'hiking', 'outdoor', 'walk', 'park', 'garden'],
    'meditation': ['meditation', 'mindfulness', 'breathing', 'zen'],
    'productivity': ['productivity', 'work', 'tasks', 'organize', 'planning'],
    'relationships': ['friends', 'family', 'relationships', 'social', 'people'],
    'creativity': ['creative', 'art', 'writing', 'design', 'drawing'],
    'cooking': ['cooking', 'food', 'recipe', 'kitchen', 'baking'],
    'travel': ['travel', 'vacation', 'trip', 'explore', 'adventure'],
    'learning': ['learning', 'study', 'course', 'education', 'skill'],
    'self-care': ['self-care', 'spa', 'bath', 'relax', 'pamper']
  };

  const foundInterests: string[] = [];
  const lowerContent = content.toLowerCase();

  Object.entries(interestKeywords).forEach(([interest, keywords]) => {
    if (keywords.some(keyword => lowerContent.includes(keyword))) {
      foundInterests.push(interest);
    }
  });

  return foundInterests.length > 0 ? foundInterests : ['general wellness'];
};

const analyzeSentiment = (content: string): 'positive' | 'negative' | 'neutral' => {
  const positiveWords = ['happy', 'grateful', 'amazing', 'great', 'wonderful', 'love', 'excited', 'joy', 'beautiful', 'fantastic', 'good', 'better', 'best', 'success', 'achievement'];
  const negativeWords = ['stressed', 'overwhelmed', 'anxious', 'tired', 'worried', 'challenging', 'difficult', 'sad', 'frustrated', 'bad', 'worse', 'worst', 'problem', 'issue'];

  const words = content.toLowerCase().split(' ');
  let positiveCount = 0;
  let negativeCount = 0;

  words.forEach(word => {
    if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
    if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
  });

  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};

// Updated to fetch from your existing journals system
const fetchTodaysJournalEntries = async (): Promise<JournalEntry[]> => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Check localStorage first (where your journals are stored)
    const storedJournals = localStorage.getItem('janya-journals');
    if (storedJournals) {
      const journals = JSON.parse(storedJournals);

      // Filter entries for today
      const todaysEntries = journals.filter((entry: any) => {
        const entryDate = new Date(entry.createdAt || entry.date).toISOString().split('T')[0];
        return entryDate === today;
      }).map((entry: any) => ({
        id: entry.id,
        title: entry.title,
        content: entry.content,
        mood: entry.mood || 'neutral',
        date: new Date(entry.createdAt || entry.date),
        emotions: extractEmotionsFromContent(entry.content),
        interests: extractInterestsFromContent(entry.content),
        sentiment: analyzeSentiment(entry.content)
      }));

      return todaysEntries;
    }

    // Fallback to mock data if no stored journals
    return getMockTodaysEntries();
  } catch (error) {
    console.error('Error fetching today\'s journal entries:', error);
    return getMockTodaysEntries();
  }
};

const getMockTodaysEntries = (): JournalEntry[] => {
  const today = new Date();
  return [
    {
      id: 'today-1',
      title: 'Morning Reflections',
      content: 'Woke up feeling a bit anxious about the presentation today. Had some coffee and tried to organize my thoughts. The weather is gloomy which isn\'t helping my mood. I\'ve been listening to some calming music to ease my nerves. Need to find ways to boost my confidence.',
      mood: 'anxious',
      date: today,
      emotions: ['anxious', 'worried', 'nervous'],
      interests: ['music', 'productivity', 'confidence building'],
      sentiment: 'negative'
    },
    {
      id: 'today-2',
      title: 'Lunch Break Thoughts',
      content: 'The presentation went better than expected! Feeling relieved and proud of myself. Decided to treat myself to a good book during lunch. The sun came out which lifted my spirits. Thinking about taking a walk later to celebrate this small win.',
      mood: 'relieved',
      date: today,
      emotions: ['relieved', 'proud', 'happy'],
      interests: ['reading', 'nature walks', 'self-celebration'],
      sentiment: 'positive'
    },
    {
      id: 'today-3',
      title: 'Evening Wind Down',
      content: 'Reflecting on today\'s ups and downs. Started stressed but ended on a high note. Want to practice more mindfulness and maybe try some meditation before bed. Grateful for the support from my colleagues. Planning to read more about personal growth.',
      mood: 'reflective',
      date: today,
      emotions: ['grateful', 'reflective', 'content'],
      interests: ['mindfulness', 'meditation', 'personal development', 'reading'],
      sentiment: 'positive'
    }
  ];
};

const analyzeUserMoodWithAI = async (entries: JournalEntry[]): Promise<MoodAnalysis> => {
  try {
    if (entries.length === 0) {
      return getDefaultMoodAnalysis();
    }

    // Fallback using local analysis
    return createFallbackAnalysis(entries);
  } catch (error) {
    console.error('Error analyzing mood:', error);
    return createFallbackAnalysis(entries);
  }
};

const createFallbackAnalysis = (entries: JournalEntry[]): MoodAnalysis => {
  const allEmotions = entries.flatMap(e => e.emotions);
  const allInterests = entries.flatMap(e => e.interests);
  const sentiments = entries.map(e => e.sentiment);

  const emotionCounts = allEmotions.reduce((acc, emotion) => {
    acc[emotion] = (acc[emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const primaryEmotion = Object.entries(emotionCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'neutral';

  const positiveCount = sentiments.filter(s => s === 'positive').length;
  const negativeCount = sentiments.filter(s => s === 'negative').length;

  let overallSentiment: 'positive' | 'negative' | 'neutral';
  if (positiveCount > negativeCount) overallSentiment = 'positive';
  else if (negativeCount > positiveCount) overallSentiment = 'negative';
  else overallSentiment = 'neutral';

  const stressEmotions = ['stressed', 'anxious', 'overwhelmed', 'worried'];
  const energyEmotions = ['happy', 'excited', 'motivated', 'energized'];

  const stressLevel = Math.min(10, 3 + (allEmotions.filter(e => stressEmotions.includes(e)).length * 2));
  const energyLevel = Math.max(1, Math.min(10, 5 + energyEmotions.filter(e => allEmotions.includes(e)).length - stressEmotions.filter(e => allEmotions.includes(e)).length));

  return {
    primary: primaryEmotion,
    secondary: Object.keys(emotionCounts).filter(e => e !== primaryEmotion).slice(0, 3),
    sentiment: overallSentiment,
    emotions: [...new Set(allEmotions)],
    interests: [...new Set(allInterests)],
    stressLevel,
    energyLevel,
    confidence: Math.min(1, entries.length / 3)
  };
};

const getDefaultMoodAnalysis = (): MoodAnalysis => ({
  primary: 'neutral',
  secondary: ['calm', 'curious'],
  sentiment: 'neutral',
  emotions: ['neutral', 'calm'],
  interests: ['general wellness'],
  stressLevel: 5,
  energyLevel: 5,
  confidence: 0.5
});

const generateAIRecommendations = async (moodAnalysis: MoodAnalysis, journalEntries: JournalEntry[]): Promise<Recommendation[]> => {
  try {
    // Generate mock recommendations based on mood analysis
    const mockRecommendations: Recommendation[] = [
      {
        id: '1',
        type: 'book',
        title: 'The Power of Now',
        description: 'A guide to spiritual enlightenment that helps you focus on the present moment.',
        author: 'Eckhart Tolle',
        mood: moodAnalysis.primary,
        rating: 4.6,
        tags: ['mindfulness', 'self-help', 'spirituality'],
        aiReason: `Perfect for your ${moodAnalysis.primary} mood today. This book will help you find peace and clarity.`,
        matchScore: 92,
        coverArt: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop&crop=center'
      },
      {
        id: '2',
        type: 'music',
        title: 'Weightless',
        artist: 'Marconi Union',
        duration: '8:10',
        description: 'Scientifically designed to reduce anxiety and promote relaxation.',
        mood: moodAnalysis.primary,
        rating: 4.8,
        tags: ['ambient', 'relaxing', 'instrumental'],
        aiReason: `This track is specifically designed to calm your mind, perfect for your current ${moodAnalysis.primary} state.`,
        matchScore: 95,
        coverArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center'
      },
      {
        id: '3',
        type: 'activity',
        title: '5-Minute Breathing Exercise',
        description: 'A simple breathing technique to center yourself and reduce stress.',
        duration: '5 min',
        difficulty: 'Easy',
        mood: moodAnalysis.primary,
        rating: 4.7,
        tags: ['breathing', 'meditation', 'quick'],
        aiReason: `Based on your journal entries showing ${moodAnalysis.primary} feelings, this breathing exercise will help restore balance.`,
        matchScore: 88
      }
    ];

    return mockRecommendations;
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    return [];
  }
};

// Main Component
function RecommendationsPageComponent() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'book' | 'music' | 'activity'>('all');
  const [moodAnalysis, setMoodAnalysis] = useState<MoodAnalysis | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [todaysEntries, setTodaysEntries] = useState<JournalEntry[]>([]);
  const [lastAnalyzed, setLastAnalyzed] = useState<Date | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [savedItems, setSavedItems] = useState<string[]>([]);

  // Initialize and analyze mood
  useEffect(() => {
    const initializeRecommendations = async () => {
      setIsLoading(true);
      try {
        // Fetch today's journal entries
        const entries = await fetchTodaysJournalEntries();
        setTodaysEntries(entries);

        if (entries.length === 0) {
          setIsLoading(false);
          return;
        }

        // Analyze user mood
        const analysis = await analyzeUserMoodWithAI(entries);
        setMoodAnalysis(analysis);

        // Generate recommendations
        const aiRecommendations = await generateAIRecommendations(analysis, entries);
        setRecommendations(aiRecommendations);
        setLastAnalyzed(new Date());

        // Load saved items from localStorage
        const saved = localStorage.getItem('janya-saved-recommendations');
        if (saved) {
          setSavedItems(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error initializing recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeRecommendations();
  }, []);

  const refreshRecommendations = async () => {
    setIsRefreshing(true);
    try {
      // Re-fetch today's entries
      const freshEntries = await fetchTodaysJournalEntries();
      setTodaysEntries(freshEntries);

      if (freshEntries.length === 0) {
        setRecommendations([]);
        setMoodAnalysis(null);
        setIsRefreshing(false);
        return;
      }

      // Re-analyze mood
      const freshAnalysis = await analyzeUserMoodWithAI(freshEntries);
      setMoodAnalysis(freshAnalysis);

      // Generate new recommendations
      const newRecommendations = await generateAIRecommendations(freshAnalysis, freshEntries);
      setRecommendations(newRecommendations);
      setLastAnalyzed(new Date());
    } catch (error) {
      console.error('Error refreshing recommendations:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesFilter = activeFilter === 'all' || rec.type === activeFilter;
    const matchesSearch = searchQuery === '' ||
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.author && rec.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (rec.artist && rec.artist.toLowerCase().includes(searchQuery.toLowerCase())) ||
      rec.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: recommendations.length,
    book: recommendations.filter(r => r.type === 'book').length,
    music: recommendations.filter(r => r.type === 'music').length,
    activity: recommendations.filter(r => r.type === 'activity').length
  };

  const handleRecommendationClick = (recommendation: Recommendation) => {
    if (expandedCard === recommendation.id) {
      setExpandedCard(null);
    } else {
      setExpandedCard(recommendation.id);
    }
  };

  const toggleSaveItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedItems(prev => {
      const newSaved = prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id];

      localStorage.setItem('janya-saved-recommendations', JSON.stringify(newSaved));
      return newSaved;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--md-sys-color-surface)' }}>
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <Card variant="filled" className="w-full max-w-md p-6 text-center mx-4">
            <div className="mb-6">
              <LinearProgress indeterminate />
            </div>
            <div className="mb-6">
              <Loader2 size={32} className="mx-auto animate-spin" style={{ color: 'var(--md-sys-color-primary)' }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--md-sys-color-on-surface)' }}>Creating your recommendations</h3>
            <p className="mb-4" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Analyzing your journal entries to find the perfect match for your mood today</p>
          </Card>
        </div>
      </div>
    );
  }

  if (todaysEntries.length === 0) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--md-sys-color-surface)' }}>
        <Navigation />
        <div className="p-4 flex items-center justify-center h-[calc(100vh-120px)]">
          <Card variant="elevated" className="w-full max-w-md p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--md-sys-color-surface-container)' }}>
              <Book size={32} style={{ color: 'var(--md-sys-color-on-surface-variant)' }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--md-sys-color-on-surface)' }}>No journal entries yet</h3>
            <p className="mb-6" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Write in your journal today to get personalized recommendations based on your mood</p>

            <Button
              variant="filled"
              className="w-full"
              onClick={() => window.location.href = '/journal'}
            >
              Start Journaling
            </Button>

            <p className="mt-4 text-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              Your recommendations will appear here once you've written about your day
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--md-sys-color-surface)' }}>
      <Navigation />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card variant="filled" className="m-4 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                Recommendations
              </h1>
              <p className="text-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                Based on today's mood
              </p>
            </div>

            <IconButton
              variant="filled-tonal"
              onClick={refreshRecommendations}
              disabled={isRefreshing}
            >
              <RefreshCw size={20} className={isRefreshing ? "animate-spin" : ""} />
            </IconButton>
          </div>

          {/* Mood Summary */}
          {moodAnalysis && (
            <MoodSummary
              moodAnalysis={moodAnalysis}
              todaysEntries={todaysEntries}
            />
          )}
        </Card>

        {/* Search and Filters */}
        <Card variant="outlined" className="m-4 p-4">
          {/* Search Bar */}
          <div className="mb-4">
            <TextField
              variant="outlined"
              label="Search recommendations"
              value={searchQuery}
              onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
              className="w-full"
              hasLeadingIcon
            >
              <div slot="leading-icon" className="flex items-center justify-center">
                <Search size={20} />
              </div>
            </TextField>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2">
            <Chip
              variant="filter"
              label={`All (${counts.all})`}
              selected={activeFilter === 'all'}
              onClick={() => setActiveFilter('all')}
            />
            <Chip
              variant="filter"
              label={`Books (${counts.book})`}
              selected={activeFilter === 'book'}
              onClick={() => setActiveFilter('book')}
            />
            <Chip
              variant="filter"
              label={`Music (${counts.music})`}
              selected={activeFilter === 'music'}
              onClick={() => setActiveFilter('music')}
            />
            <Chip
              variant="filter"
              label={`Activities (${counts.activity})`}
              selected={activeFilter === 'activity'}
              onClick={() => setActiveFilter('activity')}
            />
          </div>
        </Card>

        {/* Content */}
        <div className="m-4 mb-32">
          {filteredRecommendations.length > 0 ? (
            <div className="space-y-4">
              {filteredRecommendations.map((recommendation) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  onClick={handleRecommendationClick}
                  isExpanded={expandedCard === recommendation.id}
                  isSaved={savedItems.includes(recommendation.id)}
                  onSave={toggleSaveItem}
                />
              ))}
            </div>
          ) : (
            <Card variant="outlined" className="p-8 text-center">
              <div className="w-16 h-16 mb-4 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--md-sys-color-surface-container)' }}>
                <Search size={24} style={{ color: 'var(--md-sys-color-on-surface-variant)' }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--md-sys-color-on-surface)' }}>No matches found</h3>
              <p className="text-sm mb-6" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                Try adjusting your search or selecting a different category
              </p>
              <Button
                variant="filled"
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}

export default withAuth(RecommendationsPageComponent);