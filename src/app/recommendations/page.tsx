'use client';

import { useState, useEffect } from 'react';
import { Book, Music, Activity, Heart, Star, Play, ExternalLink, ChevronRight, Sparkles } from 'lucide-react';

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
  link?: string;
  rating: number;
}

const mockRecommendations: Recommendation[] = [
  // Books
  {
    id: 'book-1',
    type: 'book',
    title: 'The Power of Now',
    description: 'A guide to spiritual enlightenment and mindfulness',
    author: 'Eckhart Tolle',
    mood: 'calm',
    rating: 4.8,
    link: 'https://example.com'
  },
  {
    id: 'book-2',
    type: 'book',
    title: 'Atomic Habits',
    description: 'An easy & proven way to build good habits & break bad ones',
    author: 'James Clear',
    mood: 'motivated',
    rating: 4.9,
    link: 'https://example.com'
  },
  {
    id: 'book-3',
    type: 'book',
    title: 'The Midnight Library',
    description: 'A novel about life, death, and all the lives in between',
    author: 'Matt Haig',
    mood: 'thoughtful',
    rating: 4.7,
    link: 'https://example.com'
  },
  // Music
  {
    id: 'music-1',
    type: 'music',
    title: 'Weightless',
    description: 'Scientifically designed to reduce anxiety by 65%',
    artist: 'Marconi Union',
    duration: '8:08',
    mood: 'anxious',
    rating: 4.6,
    link: 'https://spotify.com'
  },
  {
    id: 'music-2',
    type: 'music',
    title: 'Claire de Lune',
    description: 'Beautiful classical piece for contemplation',
    artist: 'Claude Debussy',
    duration: '4:35',
    mood: 'calm',
    rating: 4.9,
    link: 'https://spotify.com'
  },
  {
    id: 'music-3',
    type: 'music',
    title: 'Good as Hell',
    description: 'Uplifting pop anthem to boost your mood',
    artist: 'Lizzo',
    duration: '2:39',
    mood: 'happy',
    rating: 4.5,
    link: 'https://spotify.com'
  },
  // Activities
  {
    id: 'activity-1',
    type: 'activity',
    title: 'Morning Meditation',
    description: '10-minute guided mindfulness session',
    duration: '10 min',
    difficulty: 'Easy',
    mood: 'stressed',
    rating: 4.7
  },
  {
    id: 'activity-2',
    type: 'activity',
    title: 'Nature Walk',
    description: 'Peaceful walk in a nearby park or nature area',
    duration: '30 min',
    difficulty: 'Easy',
    mood: 'sad',
    rating: 4.8
  },
  {
    id: 'activity-3',
    type: 'activity',
    title: 'Dance Workout',
    description: 'High-energy dance session to boost endorphins',
    duration: '20 min',
    difficulty: 'Medium',
    mood: 'low energy',
    rating: 4.6
  },
  {
    id: 'activity-4',
    type: 'activity',
    title: 'Journaling Exercise',
    description: 'Gratitude journaling to shift perspective',
    duration: '15 min',
    difficulty: 'Easy',
    mood: 'negative',
    rating: 4.9
  }
];

interface RecommendationCardProps {
  recommendation: Recommendation;
  onClick: (recommendation: Recommendation) => void;
}

const RecommendationCard = ({ recommendation, onClick }: RecommendationCardProps) => {
  const getIcon = () => {
    switch (recommendation.type) {
      case 'book': return <Book size={20} />;
      case 'music': return <Music size={20} />;
      case 'activity': return <Activity size={20} />;
    }
  };

  const getTypeColor = () => {
    switch (recommendation.type) {
      case 'book': return 'from-blue-500 to-indigo-500';
      case 'music': return 'from-purple-500 to-pink-500';
      case 'activity': return 'from-green-500 to-emerald-500';
    }
  };

  return (
    <div 
      onClick={() => onClick(recommendation)}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer border border-gray-100"
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${getTypeColor()}`}>
          <div className="text-white">
            {getIcon()}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-800 truncate">{recommendation.title}</h3>
            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{recommendation.rating}</span>
            </div>
          </div>
          
          {recommendation.author && (
            <p className="text-sm text-gray-500 mb-2">by {recommendation.author}</p>
          )}
          {recommendation.artist && (
            <p className="text-sm text-gray-500 mb-2">by {recommendation.artist}</p>
          )}
          
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {recommendation.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              {recommendation.duration && (
                <span>⏱️ {recommendation.duration}</span>
              )}
              {recommendation.difficulty && (
                <span className={`px-2 py-1 rounded-full text-xs ${
                  recommendation.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  recommendation.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {recommendation.difficulty}
                </span>
              )}
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                {recommendation.mood}
              </span>
            </div>
            {recommendation.link && (
              <ExternalLink size={16} className="text-gray-400" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}

const FilterButton = ({ active, onClick, icon, label, count }: FilterButtonProps) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 ${
      active 
        ? 'bg-purple-100 text-purple-600 border-2 border-purple-300' 
        : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300'
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{count}</span>
  </button>
);

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(mockRecommendations);
  const [activeFilter, setActiveFilter] = useState<'all' | 'book' | 'music' | 'activity'>('all');
  const [userMood, setUserMood] = useState<string>('happy'); // This would come from AI analysis

  const filteredRecommendations = recommendations.filter(rec => 
    activeFilter === 'all' || rec.type === activeFilter
  );

  const getRecommendationCounts = () => ({
    all: recommendations.length,
    book: recommendations.filter(r => r.type === 'book').length,
    music: recommendations.filter(r => r.type === 'music').length,
    activity: recommendations.filter(r => r.type === 'activity').length
  });

  const counts = getRecommendationCounts();

  const handleRecommendationClick = (recommendation: Recommendation) => {
    if (recommendation.link) {
      window.open(recommendation.link, '_blank');
    }
    // Track interaction for AI learning
    console.log('User interacted with:', recommendation);
  };

  const generatePersonalizedRecommendations = () => {
    // This would use AI to generate recommendations based on journal entries
    console.log('Generating personalized recommendations based on mood:', userMood);
  };

  useEffect(() => {
    generatePersonalizedRecommendations();
  }, [userMood]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white bg-opacity-95 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Discover & Grow
            </h1>
            <p className="text-gray-600 text-sm">
              Personalized recommendations based on your journal insights
            </p>
          </div>

          {/* Mood-based Banner */}
          <div className="mt-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl p-4 text-white">
            <div className="flex items-center gap-3">
              <Sparkles size={24} />
              <div>
                <p className="font-medium">Today's Mood: {userMood}</p>
                <p className="text-sm opacity-90">Here are some recommendations for you</p>
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
            <FilterButton
              active={activeFilter === 'all'}
              onClick={() => setActiveFilter('all')}
              icon={<Heart size={18} />}
              label="All"
              count={counts.all}
            />
            <FilterButton
              active={activeFilter === 'book'}
              onClick={() => setActiveFilter('book')}
              icon={<Book size={18} />}
              label="Books"
              count={counts.book}
            />
            <FilterButton
              active={activeFilter === 'music'}
              onClick={() => setActiveFilter('music')}
              icon={<Music size={18} />}
              label="Music"
              count={counts.music}
            />
            <FilterButton
              active={activeFilter === 'activity'}
              onClick={() => setActiveFilter('activity')}
              icon={<Activity size={18} />}
              label="Activities"
              count={counts.activity}
            />
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="space-y-4">
          {filteredRecommendations.length > 0 ? (
            filteredRecommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                onClick={handleRecommendationClick}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400">
                <Sparkles size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                No recommendations yet
              </h3>
              <p className="mb-6 text-gray-600">
                Write more journal entries to get personalized recommendations
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}