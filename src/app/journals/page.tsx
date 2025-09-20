'use client';

import { useState, useEffect } from 'react';
import { Journal, MOOD_EMOJIS, MOOD_GRADIENTS } from '@/types/theme';
import withAuth from '@/components/withAuth';
import Navigation from '@/app/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Components
import JournalHeader from './components/JournalHeader';
import QuickStats from './components/QuickStats';
import MoodFilter from './components/MoodFilter';
import FolderGrid from './components/FolderGrid';
import JournalList from './components/JournalList';
import CreateButton from './components/CreateButton';

// Journal folders based on themes/moods
interface JournalFolder {
  id: string;
  name: string;
  color: string;
  gradient: string;
  journalCount: number;
  lastUpdated: string;
  journals: Journal[];
}

const createFoldersFromJournals = (journals: Journal[]): JournalFolder[] => {
  const moodConfig: Record<string, { name: string; color: string; gradient: string }> = {
    happy: { name: 'Joyful Moments', color: '#f59e0b', gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' },
    sad: { name: 'Reflective Times', color: '#3b82f6', gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)' },
    excited: { name: 'High Energy', color: '#ef4444', gradient: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)' },
    calm: { name: 'Peaceful Mind', color: '#10b981', gradient: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)' },
    anxious: { name: 'Working Through', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)' },
    angry: { name: 'Intense Feelings', color: '#f97316', gradient: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)' },
    thoughtful: { name: 'Deep Thoughts', color: '#6366f1', gradient: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)' },
    inspired: { name: 'Creative Flow', color: '#ec4899', gradient: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)' }
  };

  const folders: { [key: string]: JournalFolder } = {};

  journals.forEach(journal => {
    const folderKey = journal.mood;
    const config = moodConfig[folderKey] || { name: 'Other', color: '#6b7280', gradient: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' };

    if (!folders[folderKey]) {
      folders[folderKey] = {
        id: folderKey,
        name: config.name,
        color: config.color,
        gradient: config.gradient,
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

function JournalsPageComponent() {
  const { user } = useAuth();
  const router = useRouter();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMood, setFilterMood] = useState<'all' | Journal['mood']>('all');
  const [viewMode, setViewMode] = useState<'folders' | 'list'>('folders');
  const [selectedFolder, setSelectedFolder] = useState<JournalFolder | null>(null);

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      setLoading(true);

      // Fetch from API
      const response = await fetch('/api/journals');

      if (response.ok) {
        const data = await response.json();
        const formattedJournals = data.entries.map((journal: any) => ({
          id: journal.id,
          title: journal.title,
          date: journal.date,
          time: journal.time,
          mood: journal.mood || 'thoughtful',
          preview: journal.preview || 'No preview available',
          wordCount: journal.wordCount || 0,
          abstractArt: MOOD_GRADIENTS[journal.mood] || MOOD_GRADIENTS.thoughtful,
          theme: journal.mood || 'thoughtful',
          content: journal.content,
          photo: journal.photo,
          audioRecording: journal.audioRecording,
          weather: journal.weather,
          location: journal.location,
          tags: journal.tags || [],
          aiInsights: journal.aiInsights
        }));
        setJournals(formattedJournals);
      } else {
        // Fallback to localStorage for backward compatibility
        const storedJournals = localStorage.getItem('janya-journals');
        if (storedJournals) {
          const parsedJournals = JSON.parse(storedJournals);
          const formattedJournals = parsedJournals.map((journal: any) => ({
            id: journal.id,
            title: journal.title,
            date: journal.createdAt || journal.date,
            time: new Date(journal.createdAt || journal.date).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            }),
            mood: journal.mood || 'thoughtful',
            preview: journal.content?.substring(0, 120) + '...' || 'No preview available',
            wordCount: journal.content?.split(' ').length || 0,
            abstractArt: MOOD_GRADIENTS[journal.mood] || MOOD_GRADIENTS.thoughtful,
            theme: journal.mood || 'thoughtful',
            content: journal.content,
            photo: journal.photo,
            audioRecording: journal.audioBlob, // Note: different field name in localStorage
            weather: journal.weather,
            location: journal.location,
            tags: journal.tags || []
          }));
          setJournals(formattedJournals);
        } else {
          setJournals([]);
        }
      }
    } catch (error) {
      console.error('Error fetching journals:', error);

      // Fallback to localStorage on API error
      try {
        const storedJournals = localStorage.getItem('janya-journals');
        if (storedJournals) {
          const parsedJournals = JSON.parse(storedJournals);
          const formattedJournals = parsedJournals.map((journal: any) => ({
            id: journal.id,
            title: journal.title,
            date: journal.createdAt || journal.date,
            time: new Date(journal.createdAt || journal.date).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            }),
            mood: journal.mood || 'thoughtful',
            preview: journal.content?.substring(0, 120) + '...' || 'No preview available',
            wordCount: journal.content?.split(' ').length || 0,
            abstractArt: MOOD_GRADIENTS[journal.mood] || MOOD_GRADIENTS.thoughtful,
            theme: journal.mood || 'thoughtful',
            content: journal.content,
            photo: journal.photo,
            audioRecording: journal.audioBlob,
            weather: journal.weather,
            location: journal.location,
            tags: journal.tags || []
          }));
          setJournals(formattedJournals);
        } else {
          setJournals([]);
        }
      } catch (localStorageError) {
        console.error('Error reading from localStorage:', localStorageError);
        setJournals([]);
      }
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

  const journalCounts = journals.reduce((acc, journal) => {
    acc[journal.mood] = (acc[journal.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalEntries = journals.length;
  const totalWords = journals.reduce((sum, journal) => sum + (journal.wordCount || 0), 0);
  const currentStreak = 5; // Calculate from actual data
  const avgWordsPerEntry = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0;

  const handleFolderClick = (folder: JournalFolder) => {
    setSelectedFolder(folder);
    setViewMode('list');
  };

  const handleJournalClick = (journal: Journal) => {
    console.log('Opening journal:', journal.id);
    // Navigate to journal detail page
  };

  const handleNewJournal = () => {
    router.push('/journal');
  };

  const handleBackToFolders = () => {
    setSelectedFolder(null);
    setViewMode('folders');
  };

  if (loading) {
    return (
      <div>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full animate-spin"
              style={{ background: 'var(--janya-warm-gradient)' }}>
              <div className="w-full h-full rounded-full border-4 border-transparent border-t-white" />
            </div>
            <p className="text-gray-600">Loading your journals...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <JournalHeader
        title={selectedFolder ? selectedFolder.name : 'My Journals'}
        subtitle={selectedFolder ? `${selectedFolder.journalCount} entries` : 'Your personal reflection space'}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showBack={!!selectedFolder}
        onBack={handleBackToFolders}
      />

      {!selectedFolder && (
        <QuickStats
          totalEntries={totalEntries}
          currentStreak={currentStreak}
          totalWords={totalWords}
          avgWordsPerEntry={avgWordsPerEntry}
        />
      )}

      <MoodFilter
        selectedMood={filterMood}
        onMoodChange={setFilterMood}
        journalCounts={journalCounts}
      />

      {viewMode === 'folders' && !selectedFolder ? (
        <FolderGrid
          folders={folders}
          onFolderClick={handleFolderClick}
        />
      ) : (
        <JournalList
          journals={selectedFolder ? selectedFolder.journals : filteredJournals}
          onJournalClick={handleJournalClick}
        />
      )}

      <CreateButton onClick={handleNewJournal} />
    </div>
  );
}

export default withAuth(JournalsPageComponent);