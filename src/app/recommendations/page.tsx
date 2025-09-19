'use client';

import { useState, useEffect } from 'react';
import { Book, Music, Activity, Heart, ArrowLeft, RefreshCw, Loader2, Volume2, BookOpen, Search } from 'lucide-react';

// Components
import RecommendationCard from './components/RecommendationCard';
import TabButton from './components/TabButton';
import MoodSummary from './components/MoodSummary';
import SearchBar from './components/SearchBar';
import LoadingScreen from './components/LoadingScreen';
import EmptyState from './components/EmptyState';

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
export default function RecommendationsPage() {
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

  // Function to get dynamic theme colors based on mood analysis
  const getThemeColors = () => {
    if (!moodAnalysis) return {};

    const moodColorMap = {
      happy: { primary: '#4CAF50', secondary: '#8BC34A', accent: '#FFEB3B' },
      excited: { primary: '#FF9800', secondary: '#FFC107', accent: '#FFEB3B' },
      grateful: { primary: '#9C27B0', secondary: '#BA68C8', accent: '#E1BEE7' },
      calm: { primary: '#03A9F4', secondary: '#81D4FA', accent: '#B3E5FC' },
      reflective: { primary: '#607D8B', secondary: '#90A4AE', accent: '#CFD8DC' },
      thoughtful: { primary: '#3F51B5', secondary: '#7986CB', accent: '#C5CAE9' },
      anxious: { primary: '#FF5722', secondary: '#FF8A65', accent: '#FFCCBC' },
      stressed: { primary: '#F44336', secondary: '#EF5350', accent: '#FFCDD2' },
      sad: { primary: '#2196F3', secondary: '#64B5F6', accent: '#BBDEFB' },
      tired: { primary: '#795548', secondary: '#A1887F', accent: '#D7CCC8' }
    };

    const defaultColors = { primary: '#673AB7', secondary: '#9575CD', accent: '#D1C4E9' };
    return moodColorMap[moodAnalysis.primary as keyof typeof moodColorMap] || defaultColors;
  };

  // Apply theme colors
  useEffect(() => {
    const colors = getThemeColors();
    if (Object.keys(colors).length > 0) {
      document.documentElement.style.setProperty('--janya-primary', colors.primary);
      document.documentElement.style.setProperty('--janya-secondary', colors.secondary);
      document.documentElement.style.setProperty('--janya-accent', colors.accent);
    }
  }, [moodAnalysis]);

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-6 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-[var(--janya-primary)] to-[var(--janya-secondary)] rounded-full flex items-center justify-center">
            <Loader2 size={32} className="text-white animate-spin" />
          </div>
          <h3 className="text-xl font-bold mb-2">Creating your recommendations</h3>
          <p className="text-gray-500 mb-4">Analyzing your journal entries to find the perfect match for your mood today</p>

          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-[var(--janya-primary)] animate-pulse" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (todaysEntries.length === 0) {
    return (
      <div className="min-h-screen p-4 bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-md text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Book size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">No journal entries yet</h3>
          <p className="text-gray-500 mb-6">Write in your journal today to get personalized recommendations based on your mood</p>

          <button
            onClick={() => window.location.href = '/journal'}
            className="w-full py-3 rounded-xl bg-[var(--janya-primary)] text-white font-medium"
          >
            Start Journaling
          </button>

          <p className="mt-4 text-sm text-gray-400">
            Your recommendations will appear here once you've written about your day
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with fixed positioning */}
      <div className="sticky top-0 z-30 bg-white shadow-sm">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <button
            onClick={() => window.history.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>

          <div className="text-center">
            <h1 className="text-lg font-bold">Recommendations</h1>
            <p className="text-xs text-gray-500">Based on today's mood</p>
          </div>

          <button
            onClick={refreshRecommendations}
            disabled={isRefreshing}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100"
          >
            <RefreshCw size={18} className={`text-gray-700 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Mood Summary */}
        {moodAnalysis && (
          <MoodSummary
            moodAnalysis={moodAnalysis}
            todaysEntries={todaysEntries}
          />
        )}

        {/* Search Bar - Moved up to avoid bottom menu overlap */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Tab Navigation */}
        <div className="flex bg-white p-2 border-b border-gray-100">
          <TabButton
            active={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
            icon={<Heart size={16} />}
            label="All"
            count={counts.all}
            color="var(--janya-primary)"
          />
          <TabButton
            active={activeFilter === 'book'}
            onClick={() => setActiveFilter('book')}
            icon={<BookOpen size={16} />}
            label="Books"
            count={counts.book}
            color="#4285F4"
          />
          <TabButton
            active={activeFilter === 'music'}
            onClick={() => setActiveFilter('music')}
            icon={<Volume2 size={16} />}
            label="Music"
            count={counts.music}
            color="#DB4437"
          />
          <TabButton
            active={activeFilter === 'activity'}
            onClick={() => setActiveFilter('activity')}
            icon={<Activity size={16} />}
            label="Activities"
            count={counts.activity}
            color="#0F9D58"
          />
        </div>
      </div>

      {/* Content Area - Added extra padding to avoid bottom menu overlap */}
      <div className="px-4 pt-4 pb-32">
        {filteredRecommendations.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
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
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No matches found</h3>
            <p className="text-gray-500 text-sm mb-6 text-center max-w-xs">
              Try adjusting your search or selecting a different category
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="px-4 py-2 rounded-full text-white text-sm font-medium bg-[var(--janya-primary)]"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Floating Journal Button */}
      <div className="fixed bottom-24 right-4 z-20">
        <button
          onClick={() => window.location.href = '/journal'}
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-white"
          style={{ backgroundColor: 'var(--janya-primary)' }}
        >
          <Book size={20} />
        </button>
      </div>

      {/* Global styles */}
      <style jsx global>{`
        :root {
          --janya-primary: #673AB7;
          --janya-secondary: #9C27B0;
          --janya-accent: #D1C4E9;
          --janya-warm-gradient: linear-gradient(135deg, var(--janya-primary), var(--janya-secondary));
          --janya-text-primary: #1f2937;
          --janya-text-secondary: #4b5563;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-pulse-slow {
          animation: pulse 3s infinite;
        }
      `}</style>
    </div>
  );
}