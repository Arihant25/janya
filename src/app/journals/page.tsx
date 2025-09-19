'use client';

import { useState, useEffect } from 'react';
import { Plus, Calendar, BookOpen, Heart, Star, Sparkles, Search, Filter, Palette, Music, Activity, MessageCircle, User, ChevronRight, Folder, Grid, List } from 'lucide-react';
import { Journal, MOOD_EMOJIS, MOOD_GRADIENTS, THEME_COLORS } from '@/types/theme';
import withAuth from '@/components/withAuth';
import Navigation from '@/app/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Journal folders based on themes/moods
interface JournalFolder {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradient: string;
  journalCount: number;
  lastUpdated: string;
  journals: Journal[];
}

const mockJournals: Journal[] = [
  {
    id: 1,
    title: "A Beautiful Morning",
    date: "2024-01-15",
    time: "08:30 AM",
    mood: "happy",
    preview: "Today was filled with sunshine and positive energy...",
    wordCount: 347,
    abstractArt: MOOD_GRADIENTS.happy,
    theme: "sunny"
  },
  {
    id: 2,
    title: "Reflective Evening",
    date: "2024-01-14",
    time: "09:15 PM",
    mood: "thoughtful",
    preview: "Spent some time thinking about my goals and aspirations...",
    wordCount: 523,
    abstractArt: MOOD_GRADIENTS.thoughtful,
    theme: "contemplative"
  },
  {
    id: 3,
    title: "Challenging Day",
    date: "2024-01-13",
    time: "07:45 PM",
    mood: "anxious",
    preview: "Work was overwhelming today, but I managed to push through...",
    wordCount: 289,
    abstractArt: MOOD_GRADIENTS.anxious,
    theme: "stress"
  },
  {
    id: 4,
    title: "Weekend Adventures",
    date: "2024-01-12",
    time: "06:20 PM",
    mood: "excited",
    preview: "Had an amazing time exploring the city with friends...",
    wordCount: 612,
    abstractArt: MOOD_GRADIENTS.excited,
    theme: "adventure"
  },
  {
    id: 5,
    title: "Quiet Moments",
    date: "2024-01-11",
    time: "10:00 AM",
    mood: "calm",
    preview: "Finding peace in the small moments of everyday life...",
    wordCount: 198,
    abstractArt: MOOD_GRADIENTS.calm,
    theme: "peaceful"
  },
  {
    id: 6,
    title: "Creative Flow",
    date: "2024-01-10",
    time: "02:30 PM",
    mood: "inspired",
    preview: "Ideas are flowing like a river today, feeling so creative...",
    wordCount: 445,
    abstractArt: MOOD_GRADIENTS.inspired,
    theme: "creative"
  }
];

// Organize journals into themed folders
const createFoldersFromJournals = (journals: Journal[]): JournalFolder[] => {
  const folders: { [key: string]: JournalFolder } = {};

  journals.forEach(journal => {
    const folderKey = journal.mood;
    if (!folders[folderKey]) {
      folders[folderKey] = {
        id: folderKey,
        name: folderKey.charAt(0).toUpperCase() + folderKey.slice(1),
        icon: MOOD_EMOJIS[journal.mood] || '📝',
        color: getColorFromMood(journal.mood),
        gradient: journal.abstractArt,
        journalCount: 0,
        lastUpdated: journal.date,
        journals: []
      };
    }
    folders[folderKey].journals.push(journal);
    folders[folderKey].journalCount++;
    if (journal.date > folders[folderKey].lastUpdated) {
      folders[folderKey].lastUpdated = journal.date;
    }
  });

  return Object.values(folders).sort((a, b) => 
    new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  );
};

const getColorFromMood = (mood: string): string => {
  const moodColors: { [key: string]: string } = {
    happy: '#FFD700',
    sad: '#4682B4',
    excited: '#FF6347',
    calm: '#98FB98',
    anxious: '#DDA0DD',
    angry: '#DC143C',
    thoughtful: '#9370DB',
    inspired: '#FF69B4'
  };
  return moodColors[mood] || '#808080';
};

interface FolderCardProps {
  folder: JournalFolder;
  onClick: (folder: JournalFolder) => void;
}

const FolderCard = ({ folder, onClick }: FolderCardProps) => {
  return (
    <div 
      onClick={() => onClick(folder)}
      className="folder-card"
      style={{ '--folder-color': folder.color } as any}
    >
      <div className="folder-icon">
        {folder.icon}
      </div>
      <div className="folder-info">
        <h3>{folder.name}</h3>
        <p>{folder.journalCount} {folder.journalCount === 1 ? 'entry' : 'entries'}</p>
        <p className="text-xs opacity-75">
          Last updated: {new Date(folder.lastUpdated).toLocaleDateString()}
        </p>
      </div>
      <div className="folder-progress">
        <div 
          className="progress-bar"
          style={{ 
            width: `${Math.min((folder.journalCount / 10) * 100, 100)}%`,
            background: folder.color
          }}
        />
      </div>
    </div>
  );
};

interface JournalCardProps {
  journal: Journal;
  onClick: (journal: Journal) => void;
}

const JournalCard = ({ journal, onClick }: JournalCardProps) => {
  return (
    <div 
      onClick={() => onClick(journal)}
      className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer border border-gray-100"
      style={{ borderColor: THEME_COLORS.border.light }}
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-2xl relative overflow-hidden shadow-lg">
          <div 
            className="absolute inset-0"
            style={{ background: journal.abstractArt }}
          />
          <div className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-sm" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg">{MOOD_EMOJIS[journal.mood]}</span>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-gray-800 truncate">{journal.title}</h3>
          </div>
          
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {journal.preview}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{new Date(journal.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen size={12} />
                <span>{journal.wordCount} words</span>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}

const StatCard = ({ icon: Icon, label, value, color }: StatCardProps) => {
  return (
    <div className="stat-card">
      <Icon className="text-xl" style={{ color }} />
      <div className="stat-info">
        <h4>{label}</h4>
        <p>{value}</p>
      </div>
    </div>
  );
};

interface BottomTabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomTabBar = ({ activeTab, onTabChange }: BottomTabBarProps) => {
  const tabs = [
    { id: 'journals', icon: BookOpen, label: 'Journals' },
    { id: 'recommendations', icon: Star, label: 'Discover' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around max-w-md mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-purple-100 text-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={20} />
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

function JournalsPageComponent() {
  const { user } = useAuth();
  const router = useRouter();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMood, setFilterMood] = useState<'all' | Journal['mood']>('all');
  const [activeTab, setActiveTab] = useState('journals');
  const [viewMode, setViewMode] = useState<'folders' | 'list'>('folders');
  const [selectedFolder, setSelectedFolder] = useState<JournalFolder | null>(null);

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/journals');
      if (!response.ok) {
        throw new Error('Failed to fetch journals');
      }
      const data = await response.json();
      setJournals(data);
    } catch (error) {
      console.error('Error fetching journals:', error);
    } finally {
      setLoading(false);
    }
  };

  const folders = createFoldersFromJournals(journals);
  
  const filteredJournals = journals.filter(journal => {
    const matchesSearch = journal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         journal.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = filterMood === 'all' || journal.mood === filterMood;
    return matchesSearch && matchesMood;
  });

  const totalEntries = journals.length;
  const totalWords = journals.reduce((sum, journal) => sum + (journal.content?.split(' ').length || 0), 0);
  const currentStreak = 5; // This could be calculated from actual data
  const avgWordsPerEntry = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0;

  const handleFolderClick = (folder: JournalFolder) => {
    setSelectedFolder(folder);
    setViewMode('list');
  };

  const handleJournalClick = (journal: Journal) => {
    // Navigate to individual journal view or edit page
    console.log('Opening journal:', journal._id);
  };

  const handleNewJournal = () => {
    router.push('/journal');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/${tab}`);
  };

  const handleBackToFolders = () => {
    setSelectedFolder(null);
    setViewMode('folders');
  };

  if (loading) {
    return (
      <div>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your journals...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <div className="journals-page">
        {/* Header */}
        <div className="journals-header">
          <div className="header-content">
            <div>
              <h1 className="header-title">
                {selectedFolder ? selectedFolder.name : 'My Journals'}
              </h1>
              <p className="text-sm opacity-75">
                {selectedFolder ? `${selectedFolder.journalCount} entries` : 'Your thoughts, your story'}
              </p>
            </div>
            
            <div className="view-toggle">
              {selectedFolder && (
                <button
                  onClick={handleBackToFolders}
                  className="toggle-button"
                >
                  <Folder size={18} />
                  Folders
                </button>
              )}
              <button
                onClick={() => setViewMode(viewMode === 'folders' ? 'list' : 'folders')}
                className="toggle-button"
                style={{ opacity: viewMode === 'folders' ? 1 : 0.7 }}
              >
                <Grid size={18} />
                {viewMode === 'folders' ? 'Grid' : 'List'}
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-3 mt-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search journals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-purple-300 transition-all duration-300"
              />
            </div>
            <button className="bg-gray-100 p-3 rounded-2xl hover:bg-gray-200 transition-colors">
              <Filter size={18} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* New Journal Button */}
        <button
          onClick={handleNewJournal}
          className="new-folder-button"
        >
          <Plus size={20} className="mr-2" />
          Create New Journal Entry
        </button>

        {/* Quick Stats */}
        <div className="quick-stats">
          <StatCard
            icon={BookOpen}
            label="Total Entries"
            value={totalEntries}
            color={THEME_COLORS.primary.main}
          />
          <StatCard
            icon={Sparkles}
            label="Current Streak"
            value={`${currentStreak} days`}
            color={THEME_COLORS.secondary.main}
          />
          <StatCard
            icon={Palette}
            label="Total Words"
            value={totalWords.toLocaleString()}
            color="#22c55e"
          />
          <StatCard
            icon={Heart}
            label="Avg Words"
            value={avgWordsPerEntry}
            color="#ec4899"
          />
        </div>

        {/* Main Content */}
        {viewMode === 'folders' && !selectedFolder ? (
          <div className="folders-grid">
            {folders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                onClick={handleFolderClick}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {(selectedFolder ? selectedFolder.journals : filteredJournals).length > 0 ? (
              (selectedFolder ? selectedFolder.journals : filteredJournals).map((journal) => (
                <JournalCard
                  key={journal.id}
                  journal={journal}
                  onClick={handleJournalClick}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400">
                  <BookOpen size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  No journals found
                </h3>
                <p className="mb-6 text-gray-600">
                  Start writing your first journal entry
                </p>
                <button
                  onClick={handleNewJournal}
                  className="px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-white bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  Create Your First Entry
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bottom Tab Bar */}
        <BottomTabBar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
}

export default withAuth(JournalsPageComponent);