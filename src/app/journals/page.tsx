'use client';

import { useState, useEffect } from 'react';
import { Journal, MOOD_EMOJIS, MOOD_GRADIENTS, MoodType } from '@/types/theme';
import { Card, Button, IconButton, TextField, LinearProgress, Chip, FAB } from '@/app/components/MaterialComponents';
import withAuth from '@/components/withAuth';
import Navigation from '@/app/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { apiService } from '@/lib/api';

// Components
import JournalHeader from './components/JournalHeader';
import QuickStats from './components/QuickStats';
import MoodFilter from './components/MoodFilter';
import FolderGrid from './components/FolderGrid';
import JournalList from './components/JournalList';
import JournalGrid from './components/JournalGrid';
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
    happy: { name: 'Joyful Moments', color: 'var(--janya-secondary)', gradient: 'var(--md-sys-color-secondary-container)' },
    sad: { name: 'Reflective Times', color: 'var(--janya-primary)', gradient: 'var(--md-sys-color-primary-container)' },
    excited: { name: 'High Energy', color: 'var(--md-sys-color-error)', gradient: 'var(--md-sys-color-error-container)' },
    calm: { name: 'Peaceful Mind', color: 'var(--janya-accent)', gradient: 'var(--md-sys-color-tertiary-container)' },
    anxious: { name: 'Working Through', color: 'var(--md-sys-color-tertiary)', gradient: 'var(--md-sys-color-tertiary-container)' },
    angry: { name: 'Intense Feelings', color: 'var(--md-sys-color-error)', gradient: 'var(--md-sys-color-error-container)' },
    thoughtful: { name: 'Deep Thoughts', color: 'var(--janya-primary)', gradient: 'var(--md-sys-color-primary-container)' },
    inspired: { name: 'Creative Flow', color: 'var(--janya-secondary)', gradient: 'var(--md-sys-color-secondary-container)' }
  };

  const folders: { [key: string]: JournalFolder } = {};

  journals.forEach(journal => {
    const folderKey = journal.mood;
    const config = moodConfig[folderKey] || { name: 'Other', color: 'var(--md-sys-color-outline)', gradient: 'var(--md-sys-color-surface-variant)' };

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
  const [viewMode, setViewMode] = useState<'folders' | 'list' | 'grid'>('folders');
  const [selectedFolder, setSelectedFolder] = useState<JournalFolder | null>(null);

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      setLoading(true);

      // Fetch from API
      const data = await apiService.getJournalEntries();
      const formattedJournals = data.entries.map((journal: any) => ({
        id: journal.id,
        title: journal.title,
        date: journal.date,
        time: journal.time,
        mood: journal.mood || 'thoughtful',
        preview: journal.preview || 'No preview available',
        wordCount: journal.wordCount || 0,
        abstractArt: MOOD_GRADIENTS[journal.mood as MoodType] || MOOD_GRADIENTS.thoughtful,
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
            abstractArt: MOOD_GRADIENTS[journal.mood as MoodType] || MOOD_GRADIENTS.thoughtful,
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
    router.push(`/journals/${journal.id}`);
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
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--md-sys-color-background)' }}>
          <div className="text-center">
            <LinearProgress className="w-32 mx-auto mb-4" />
            <p style={{ color: 'var(--janya-text-secondary)' }}>Loading your journals...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--md-sys-color-background)' }}>
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
      ) : viewMode === 'grid' ? (
        <JournalGrid
          journals={selectedFolder ? selectedFolder.journals : filteredJournals}
          onJournalClick={handleJournalClick}
        />
      ) : (
        <JournalList
          journals={selectedFolder ? selectedFolder.journals : filteredJournals}
          onJournalClick={handleJournalClick}
        />
      )}

      <FAB
        onClick={handleNewJournal}
        className="fixed bottom-6 right-6"
        style={{ backgroundColor: 'var(--janya-primary)' }}
      >
        <span style={{ color: 'white', fontSize: '24px' }}>+</span>
      </FAB>
    </div>
  );
}

export default withAuth(JournalsPageComponent);