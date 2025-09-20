'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, Image, Mic, MapPin, Palette, Heart, Smile, Frown, Meh, Angry, Zap, Coffee, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import Navigation from '@/app/components/Navigation';
import withAuth from '@/components/withAuth';
import { Journal } from '@/types/theme';
import { apiService } from '@/lib/api';

const moods = {
  happy: { icon: Smile, color: '#FFD700', description: 'Joyful & Content' },
  excited: { icon: Zap, color: '#FF6347', description: 'Energetic & Thrilled' },
  calm: { icon: Heart, color: '#98FB98', description: 'Peaceful & Serene' },
  thoughtful: { icon: Coffee, color: '#9370DB', description: 'Reflective & Contemplative' },
  neutral: { icon: Meh, color: '#808080', description: 'Balanced & Steady' },
  anxious: { icon: Frown, color: '#DDA0DD', description: 'Worried & Tense' },
  sad: { icon: Frown, color: '#4682B4', description: 'Melancholy & Blue' },
  angry: { icon: Angry, color: '#DC143C', description: 'Frustrated & Upset' },
  inspired: { icon: Zap, color: '#ec4899', description: 'Creative & Motivated' }
};

function JournalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [journal, setJournal] = useState<Journal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showActions, setShowActions] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchJournal();
  }, [params.id]);

  const fetchJournal = async () => {
    try {
      setLoading(true);

      // First try to fetch from API
      const data = await apiService.getJournalEntries();
      const foundJournal = data.entries.find((entry: any) => entry.id === params.id);

        if (foundJournal) {
          setJournal(foundJournal);
        } else {
          setError('Journal entry not found');
        }
    } catch (error) {
      console.error('Error fetching journal:', error);
      setError('Failed to load journal entry');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/journal?edit=${params.id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this journal entry? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      await apiService.deleteJournalEntry(params.id as string);
      router.push('/journals');
    } catch (error) {
      console.error('Error deleting journal:', error);
      alert('Failed to delete journal entry. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full animate-spin bg-gradient-to-r from-purple-500 to-pink-500">
              <div className="w-full h-full rounded-full border-4 border-transparent border-t-white" />
            </div>
            <p className="text-gray-600">Loading journal entry...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !journal) {
    return (
      <div>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Entry Not Found</h2>
            <p className="text-gray-600 mb-4">{error || 'The journal entry you are looking for does not exist.'}</p>
            <button
              onClick={() => router.push('/journals')}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Back to Journals
            </button>
          </div>
        </div>
      </div>
    );
  }

  const moodConfig = moods[journal.mood as keyof typeof moods] || moods.neutral;
  const MoodIcon = moodConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                {journal.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{new Date(journal.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{journal.time}</span>
                </div>
              </div>
            </div>

            {/* Actions Menu */}
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreHorizontal size={20} className="text-gray-600" />
              </button>

              {showActions && (
                <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-20 min-w-[160px]">
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                  >
                    <Edit size={16} className="text-gray-600" />
                    <span className="text-gray-700">Edit Entry</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={16} className="text-red-600" />
                    <span className="text-red-700">
                      {deleting ? 'Deleting...' : 'Delete Entry'}
                    </span>
                  </button>
                </div>
              )}

              {/* Backdrop to close menu */}
              {showActions && (
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowActions(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Mood Header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div
                className="p-3 rounded-xl"
                style={{ backgroundColor: moodConfig.color + '20' }}
              >
                <MoodIcon
                  size={24}
                  style={{ color: moodConfig.color }}
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 capitalize">{journal.mood}</h3>
                <p className="text-sm text-gray-600">{moodConfig.description}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm text-gray-500">{journal.wordCount} words</p>
                {journal.location && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <MapPin size={12} />
                    <span>{journal.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Photo */}
          {journal.photo && (
            <div className="px-6 py-4 border-b border-gray-100">
              <img
                src={journal.photo}
                alt="Journal entry photo"
                className="w-full max-h-96 object-cover rounded-xl"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Content */}
          <div className="px-6 py-6">
            <div className="prose max-w-none">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {journal.content || 'No content available for this entry.'}
              </p>
            </div>
          </div>

          {/* Audio */}
          {journal.audioRecording && (
            <div className="px-6 py-4 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Mic size={16} className="text-purple-500" />
                <span className="text-sm font-medium text-gray-700">Voice Recording</span>
              </div>
              <audio
                controls
                className="w-full"
                preload="metadata"
              >
                <source src={journal.audioRecording} type="audio/webm" />
                <source src={journal.audioRecording} type="audio/mp3" />
                <source src={journal.audioRecording} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {/* Tags */}
          {journal.tags && journal.tags.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Palette size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {journal.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* AI Insights */}
          {journal.aiInsights && (
            <div className="px-6 py-4 border-t border-gray-100 bg-purple-50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✨</span>
                </div>
                <span className="text-sm font-medium text-purple-700">AI Insights</span>
              </div>
              <p className="text-sm text-purple-700">{journal.aiInsights}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(JournalDetailPage);