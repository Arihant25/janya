'use client';

import { useState, useEffect } from 'react';
import { Book, Music, Activity, Heart, ArrowLeft, RefreshCw, Loader2, Volume2, BookOpen, Search, Sparkles, Star, Plus, TrendingUp } from 'lucide-react';
import { Card, Button, IconButton, TextField, LinearProgress, Chip, ChipSet, FAB, List, ListItem, Divider } from '@/app/components/MaterialComponents';
import withAuth from '@/components/withAuth';
import Navigation from '@/app/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';

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
  _id?: string;
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
  reason?: string;
  metadata?: any;
  clicked?: boolean;
}

const analyzeUserMoodFromEntries = (entries: any[]): MoodAnalysis => {
  if (entries.length === 0) {
    return {
      primary: 'neutral',
      secondary: ['calm', 'curious'],
      sentiment: 'neutral',
      emotions: ['neutral', 'calm'],
      interests: ['general wellness'],
      stressLevel: 5,
      energyLevel: 5,
      confidence: 0.5
    };
  }

  // Analyze mood distribution
  const moodCounts = entries.reduce((acc: any, entry) => {
    const mood = entry.mood || 'neutral';
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {});

  const primaryMood = Object.entries(moodCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || 'neutral';

  // Determine overall sentiment
  const positiveMoods = ['happy', 'excited', 'grateful', 'inspired', 'calm'];
  const negativeMoods = ['sad', 'anxious', 'angry', 'frustrated', 'stressed'];

  let positiveCount = 0;
  let negativeCount = 0;

  entries.forEach(entry => {
    if (positiveMoods.includes(entry.mood)) positiveCount++;
    else if (negativeMoods.includes(entry.mood)) negativeCount++;
  });

  let sentiment: 'positive' | 'negative' | 'neutral';
  if (positiveCount > negativeCount) sentiment = 'positive';
  else if (negativeCount > positiveCount) sentiment = 'negative';
  else sentiment = 'neutral';

  return {
    primary: primaryMood,
    secondary: Object.keys(moodCounts).filter(m => m !== primaryMood).slice(0, 3),
    sentiment,
    emotions: [primaryMood, ...Object.keys(moodCounts).filter(m => m !== primaryMood).slice(0, 2)],
    interests: ['general wellness'],
    stressLevel: Math.min(10, Math.max(1, 5 + (negativeMoods.filter(m => Object.keys(moodCounts).includes(m)).length * 2) - (positiveMoods.filter(m => Object.keys(moodCounts).includes(m)).length))),
    energyLevel: Math.min(10, Math.max(1, 5 + (positiveMoods.filter(m => Object.keys(moodCounts).includes(m)).length * 2) - (negativeMoods.filter(m => Object.keys(moodCounts).includes(m)).length))),
    confidence: Math.min(1, entries.length / 3)
  };
};

// API functions
const fetchRecommendations = async (): Promise<Recommendation[]> => {
  try {
    const data = await apiService.getRecommendations();
    return data.recommendations.map((rec: any) => ({
      ...rec,
      id: rec._id?.toString() || rec.id,
      rating: rec.rating || 4.5,
      tags: rec.tags || [],
      matchScore: rec.matchScore || 85,
      aiReason: rec.reason || rec.aiReason,
      coverArt: getCoverArt(rec.type, rec.title),
      link: generateLink(rec)
    }));
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};

const generateRecommendations = async (type: 'book' | 'music' | 'activity'): Promise<void> => {
  try {
    await apiService.generateRecommendations(type);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    throw error;
  }
};

const markRecommendationClicked = async (recommendationId: string): Promise<void> => {
  try {
    await apiService.updateRecommendation(recommendationId, true);
  } catch (error) {
    console.error('Error marking recommendation as clicked:', error);
  }
};

const fetchJournalEntries = async (): Promise<any[]> => {
  try {
    const data = await apiService.getJournalEntries();
    return data.entries || [];
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return [];
  }
};

// Helper functions
const getCoverArt = (type: string, title: string): string => {
  // Generate cover art URLs based on type and title
  const baseUrl = 'https://images.unsplash.com';
  switch (type) {
    case 'book':
      return `${baseUrl}/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop&crop=center`;
    case 'music':
      return `${baseUrl}/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center`;
    case 'activity':
      return `${baseUrl}/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&crop=center`;
    default:
      return `${baseUrl}/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=center`;
  }
};

const generateLink = (rec: any): string => {
  // Generate relevant links based on recommendation type
  switch (rec.type) {
    case 'book':
      return `https://www.goodreads.com/search?q=${encodeURIComponent(rec.title)}`;
    case 'music':
      return `https://open.spotify.com/search/${encodeURIComponent(rec.title + ' ' + (rec.metadata?.artist || ''))}`;
    case 'activity':
      return `https://www.google.com/search?q=${encodeURIComponent(rec.title + ' instructions')}`;
    default:
      return '#';
  }
};

// Main Component
function RecommendationsPageComponent() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'book' | 'music' | 'activity'>('all');
  const [moodAnalysis, setMoodAnalysis] = useState<MoodAnalysis | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [lastAnalyzed, setLastAnalyzed] = useState<Date | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Initialize and analyze mood
  useEffect(() => {
    const initializeRecommendations = async () => {
      setIsLoading(true);
      try {
        // Fetch journal entries and existing recommendations
        const [entries, existingRecs] = await Promise.all([
          fetchJournalEntries(),
          fetchRecommendations()
        ]);

        setJournalEntries(entries);
        setRecommendations(existingRecs);

        // Analyze user mood from entries
        const analysis = analyzeUserMoodFromEntries(entries);
        setMoodAnalysis(analysis);
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
      // Re-fetch everything
      const [entries, recs] = await Promise.all([
        fetchJournalEntries(),
        fetchRecommendations()
      ]);

      setJournalEntries(entries);
      setRecommendations(recs);

      // Re-analyze mood
      const analysis = analyzeUserMoodFromEntries(entries);
      setMoodAnalysis(analysis);
      setLastAnalyzed(new Date());
    } catch (error) {
      console.error('Error refreshing recommendations:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleGenerateRecommendations = async (type: 'book' | 'music' | 'activity') => {
    setIsGenerating(true);
    try {
      await generateRecommendations(type);
      // Refresh to show new recommendations
      await refreshRecommendations();
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesFilter = activeFilter === 'all' || rec.type === activeFilter;
    const matchesSearch = searchQuery === '' ||
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.author && rec.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (rec.artist && rec.artist.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (rec.metadata?.artist && rec.metadata.artist.toLowerCase().includes(searchQuery.toLowerCase())) ||
      rec.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: recommendations.length,
    book: recommendations.filter(r => r.type === 'book').length,
    music: recommendations.filter(r => r.type === 'music').length,
    activity: recommendations.filter(r => r.type === 'activity').length
  };

  const handleRecommendationClick = async (recommendation: Recommendation) => {
    if (expandedCard === recommendation.id) {
      setExpandedCard(null);
    } else {
      setExpandedCard(recommendation.id);
      // Mark as clicked in database
      if (recommendation._id) {
        await markRecommendationClicked(recommendation._id);
      }
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
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--md-sys-color-on-surface)' }}>Loading your discovery page</h3>
            <p className="mb-4" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Analyzing your journal entries to create personalized recommendations</p>
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
                Discover
              </h1>
              <p className="text-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                Personalized recommendations based on your journal insights
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
          {moodAnalysis && journalEntries.length > 0 && (
            <MoodSummary
              moodAnalysis={moodAnalysis}
              todaysEntries={journalEntries}
            />
          )}

          {/* Stats Overview */}
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} style={{ color: 'var(--md-sys-color-primary)' }} />
              <span className="text-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                {recommendations.length} recommendations
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} style={{ color: 'var(--md-sys-color-primary)' }} />
              <span className="text-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                {savedItems.length} saved
              </span>
            </div>
          </div>
        </Card>

        {/* Generate New Recommendations */}
        <Card variant="outlined" className="m-4 p-4">
          <h3 className="font-semibold mb-3" style={{ color: 'var(--md-sys-color-on-surface)' }}>
            Generate New Recommendations
          </h3>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="filled-tonal"
              onClick={() => handleGenerateRecommendations('book')}
              disabled={isGenerating}
              hasIcon
            >
              <BookOpen size={16} />
              Books
            </Button>
            <Button
              variant="filled-tonal"
              onClick={() => handleGenerateRecommendations('music')}
              disabled={isGenerating}
              hasIcon
            >
              <Music size={16} />
              Music
            </Button>
            <Button
              variant="filled-tonal"
              onClick={() => handleGenerateRecommendations('activity')}
              disabled={isGenerating}
              hasIcon
            >
              <Activity size={16} />
              Activities
            </Button>
          </div>
          {isGenerating && (
            <div className="mt-3 flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" style={{ color: 'var(--md-sys-color-primary)' }} />
              <span className="text-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                Generating personalized recommendations...
              </span>
            </div>
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
          ) : journalEntries.length === 0 ? (
            <Card variant="outlined" className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--md-sys-color-surface-container)' }}>
                <Book size={32} style={{ color: 'var(--md-sys-color-on-surface-variant)' }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--md-sys-color-on-surface)' }}>Start your journaling journey</h3>
              <p className="mb-6" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                Write in your journal to get personalized recommendations based on your mood and interests
              </p>
              <Button
                variant="filled"
                onClick={() => window.location.href = '/journal'}
                hasIcon
              >
                <Plus size={16} />
                Create First Entry
              </Button>
            </Card>
          ) : (
            <Card variant="outlined" className="p-8 text-center">
              <div className="w-16 h-16 mb-4 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--md-sys-color-surface-container)' }}>
                <Search size={24} style={{ color: 'var(--md-sys-color-on-surface-variant)' }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--md-sys-color-on-surface)' }}>No matches found</h3>
              <p className="text-sm mb-6" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                Try adjusting your search or generate new recommendations above
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

        {/* Floating Action Button for Quick Actions */}
        <div className="fixed bottom-24 right-6 z-40">
          {showQuickActions && (
            <div className="mb-4 space-y-2">
              <FAB
                variant="secondary"
                size="small"
                onClick={() => {
                  handleGenerateRecommendations('book');
                  setShowQuickActions(false);
                }}
                disabled={isGenerating}
                extended
                label="Books"
              >
                <BookOpen size={16} />
              </FAB>
              <FAB
                variant="secondary"
                size="small"
                onClick={() => {
                  handleGenerateRecommendations('music');
                  setShowQuickActions(false);
                }}
                disabled={isGenerating}
                extended
                label="Music"
              >
                <Music size={16} />
              </FAB>
              <FAB
                variant="secondary"
                size="small"
                onClick={() => {
                  handleGenerateRecommendations('activity');
                  setShowQuickActions(false);
                }}
                disabled={isGenerating}
                extended
                label="Activities"
              >
                <Activity size={16} />
              </FAB>
            </div>
          )}
          <FAB
            variant="primary"
            size="large"
            onClick={() => setShowQuickActions(!showQuickActions)}
            extended
            label={showQuickActions ? "Close" : "Generate"}
            disabled={isGenerating}
          >
            {isGenerating ? <Loader2 size={24} className="animate-spin" /> : <Sparkles size={24} />}
          </FAB>
        </div>
      </div>
    </div>
  );
}

export default withAuth(RecommendationsPageComponent);