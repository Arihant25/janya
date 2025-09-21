'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Camera, Save, Mic, MicOff, Heart, Smile, Frown, Meh, Angry, Zap, Coffee, Music, Image as ImageIcon, Type, Sparkles, Sun, Moon, Cloud, CloudRain } from 'lucide-react';
import { Card, Button, IconButton, TextField, LinearProgress, FAB } from '@/app/components/MaterialComponents';
import withAuth from '@/components/withAuth';
import Navigation from '@/app/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';
import { geminiService } from '@/lib/gemini';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  theme: string;
  photo?: string;
  audioRecording?: string;
  date: Date;
  weather?: string;
  location?: string;
  tags: string[];
  aiInsights?: string;
}

interface Mood {
  name: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  pattern: string;
}

const moods: Mood[] = [
  { name: 'happy', icon: Smile, color: 'var(--janya-secondary)', description: 'Joyful & Content' },
  { name: 'excited', icon: Zap, color: 'var(--janya-primary)', description: 'Energetic & Thrilled' },
  { name: 'calm', icon: Heart, color: 'var(--janya-accent)', description: 'Peaceful & Serene' },
  { name: 'thoughtful', icon: Coffee, color: 'var(--md-sys-color-tertiary)', description: 'Reflective & Contemplative' },
  { name: 'neutral', icon: Meh, color: 'var(--md-sys-color-outline)', description: 'Balanced & Steady' },
  { name: 'anxious', icon: Frown, color: 'var(--md-sys-color-secondary)', description: 'Worried & Tense' },
  { name: 'sad', icon: CloudRain, color: 'var(--janya-primary)', description: 'Melancholy & Blue' },
  { name: 'angry', icon: Angry, color: 'var(--md-sys-color-error)', description: 'Frustrated & Upset' }
];

const themes: Theme[] = [
  {
    name: 'Medical Blue',
    colors: {
      primary: 'var(--janya-primary)',
      secondary: 'var(--janya-primary-light)',
      accent: 'var(--janya-accent)',
      background: 'var(--md-sys-color-primary-container)'
    },
    pattern: 'linear-gradient(135deg, var(--janya-primary-light) 0%, var(--md-sys-color-surface) 100%)'
  },
  {
    name: 'Medical Green',
    colors: {
      primary: 'var(--janya-secondary)',
      secondary: 'var(--md-sys-color-secondary-container)',
      accent: 'var(--janya-accent)',
      background: 'var(--md-sys-color-secondary-container)'
    },
    pattern: 'linear-gradient(135deg, var(--md-sys-color-secondary-container) 0%, var(--md-sys-color-surface) 100%)'
  },
  {
    name: 'Clean Accent',
    colors: {
      primary: 'var(--janya-accent)',
      secondary: 'var(--janya-accent-light)',
      accent: 'var(--md-sys-color-tertiary)',
      background: 'var(--md-sys-color-tertiary-container)'
    },
    pattern: 'linear-gradient(135deg, var(--janya-accent-light) 0%, var(--md-sys-color-surface) 100%)'
  },
  {
    name: 'Neutral Clean',
    colors: {
      primary: 'var(--md-sys-color-outline)',
      secondary: 'var(--md-sys-color-surface-variant)',
      accent: 'var(--janya-neutral)',
      background: 'var(--md-sys-color-surface)'
    },
    pattern: 'linear-gradient(135deg, var(--md-sys-color-surface-variant) 0%, var(--md-sys-color-surface) 100%)'
  }
];

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  clear: Moon
};

const VoiceRecorder = ({ onRecordingComplete }: { onRecordingComplete: (audioBlob: Blob) => void }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center w-[150px]">
      <Button
        onClick={isRecording ? stopRecording : startRecording}
        variant={isRecording ? 'filled' : 'outlined'}
        className={`flex items-center w-full transition-all duration-300 ${isRecording ? 'bg-red-500 text-white' : ''
          }`}
      >
        {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
        {isRecording ? 'Stop' : 'Record'}
      </Button>
      {isRecording && (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm" style={{ color: 'var(--janya-text-secondary)' }}>{formatTime(recordingTime)}</span>
        </div>
      )}
    </div>
  );
};

const MoodSelector = ({
  selectedMood,
  onMoodSelect,
}: {
  selectedMood: string;
  onMoodSelect: (mood: string) => void;
}) => (
  <Card className="p-4">
    <h3 className="font-medium mb-3" style={{ color: 'var(--janya-text-primary)' }}>
      How are you feeling?
    </h3>
    <div className="flex flex-wrap gap-2 justify-between">
      {moods.map((mood) => {
        const IconComponent = mood.icon;
        const isSelected = selectedMood === mood.name;
        return (
          <button
            key={mood.name}
            type="button"
            onClick={() => onMoodSelect(mood.name)}
            className={`flex flex-col items-center justify-center rounded-lg border transition-all duration-200 shadow-sm px-2 py-2 w-20 h-20 focus:outline-none ${isSelected
              ? 'scale-105 ring-2 ring-offset-2'
              : 'hover:bg-[rgba(0,0,0,0.03)]'
              }`}
            style={{
              borderColor: isSelected ? mood.color : 'var(--md-sys-color-outline-variant)',
              background: isSelected ? mood.color : 'var(--md-sys-color-surface)',
              boxShadow: isSelected ? '0 2px 8px 0 rgba(0,0,0,0.08)' : undefined,
              color: isSelected ? 'white' : mood.color,
            }}
            aria-label={mood.description}
          >
            <IconComponent
              size={28}
              style={{
                color: isSelected ? 'white' : mood.color,
                marginBottom: 4,
              }}
            />
            <span
              className="text-xs capitalize font-medium"
              style={{
                color: isSelected ? 'white' : 'var(--janya-text-secondary)',
                letterSpacing: 0.2,
              }}
            >
              {mood.name}
            </span>
          </button>
        );
      })}
    </div>
    {selectedMood && (
      <div className="text-center mt-4">
        <span className="inline-block text-xs px-3 py-1 rounded-full" style={{
          background: 'var(--md-sys-color-surface-variant)',
          color: 'var(--janya-text-secondary)',
        }}>
          {moods.find((m) => m.name === selectedMood)?.description}
        </span>
      </div>
    )}
  </Card>
);

const PhotoUpload = ({ onPhotoSelect }: { onPhotoSelect: (file: File) => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onPhotoSelect(file);
    }
  };

  return (
    <div className="flex items-center w-[150px]">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        variant="outlined"
        className="flex flex-row items-center gap-2 w-full"
      >
        <Camera size={18} />
        <p>Add Photo</p>
      </Button>
    </div>
  );
};

const AIInsights = ({ content, mood }: { content: string; mood: string }) => {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    if (!content.trim() || !mood) return;

    setLoading(true);
    try {
      const analysis = await geminiService.analyzeJournalEntry(content, mood);
      const insight = analysis.insights?.[0] || "Your thoughts reveal your unique perspective and emotional journey.";
      setInsights(insight);
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsights("Your journal entry reflects your personal growth and self-awareness.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (content.length > 100 && mood) {
      generateInsights();
    }
  }, [content, mood]);

  if (!insights && !loading) return null;

  return (
    <Card
      className="p-4 border"
      style={{
        backgroundColor: 'var(--md-sys-color-tertiary-container)',
        borderColor: 'var(--md-sys-color-tertiary)'
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={16} style={{ color: 'var(--md-sys-color-tertiary)' }} />
        <span className="text-sm font-medium" style={{ color: 'var(--md-sys-color-on-tertiary-container)' }}>
          AI Insights
        </span>
      </div>
      {loading ? (
        <div className="flex items-center gap-2">
          <LinearProgress className="flex-1" />
          <span className="text-sm ml-2" style={{ color: 'var(--md-sys-color-on-tertiary-container)' }}>
            Analyzing your thoughts...
          </span>
        </div>
      ) : (
        <p className="text-sm" style={{ color: 'var(--md-sys-color-on-tertiary-container)' }}>
          {insights}
        </p>
      )}
    </Card>
  );
};

function JournalPageComponent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditing = Boolean(editId);

  const [entry, setEntry] = useState<Partial<JournalEntry>>({
    title: '',
    content: '',
    mood: '',
    theme: 'Medical Blue',
    date: new Date(),
    tags: []
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [weather, setWeather] = useState<string>('sunny');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Get current weather (mock implementation)
    const weathers = ['sunny', 'cloudy', 'rainy', 'clear'];
    setWeather(weathers[Math.floor(Math.random() * weathers.length)]);

    // Load entry for editing if editId is present
    if (isEditing && editId) {
      loadEntryForEditing(editId);
    }
  }, [isEditing, editId]);

  useEffect(() => {
    setWordCount(entry.content?.split(' ').filter(word => word.length > 0).length || 0);
  }, [entry.content]);

  const loadEntryForEditing = async (entryId: string) => {
    setLoading(true);
    try {
      const data = await apiService.getJournalEntry(entryId);
      const journalEntry = data.entry;

      setEntry({
        title: journalEntry.title,
        content: journalEntry.content,
        mood: journalEntry.mood,
        theme: journalEntry.theme || 'Medical Blue',
        date: new Date(journalEntry.date),
        tags: journalEntry.tags || [],
        location: journalEntry.location
      });

      if (journalEntry.photo) {
        setPhotoPreview(journalEntry.photo);
      }

      if (journalEntry.audioRecording) {
        // Convert base64 back to blob for editing
        try {
          const response = await fetch(journalEntry.audioRecording);
          const blob = await response.blob();
          setAudioBlob(blob);
        } catch (err) {
          console.error('Error loading audio for editing:', err);
        }
      }

      if (journalEntry.weather) {
        setWeather(journalEntry.weather);
      }
    } catch (error) {
      console.error('Error loading entry for editing:', error);
      setError('Failed to load journal entry for editing');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSelect = (file: File) => {
    setPhoto(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRecordingComplete = (audioBlob: Blob) => {
    setAudioBlob(audioBlob);
  };

  const handleSave = async () => {
    // Check if at least one field has content
    const hasTitle = Boolean(entry.title?.trim());
    const hasContent = Boolean(entry.content?.trim());
    const hasMood = entry.mood !== '';
    const hasPhoto = photo !== null;
    const hasAudio = audioBlob !== null;

    // Require at least one piece of content
    if (!hasTitle && !hasContent && !hasMood && !hasPhoto && !hasAudio) {
      setError('Please add at least some content to your journal entry.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const journalData = {
        title: entry.title?.trim() || `Journal Entry - ${new Date().toLocaleDateString()}`,
        content: entry.content?.trim() || '',
        mood: entry.mood || 'neutral',
        tags: entry.tags || [],
        photo: photo ? await convertPhotoToBase64(photo) : undefined,
        audioRecording: audioBlob ? await convertAudioToBase64(audioBlob) : undefined,
        weather: weather,
        location: entry.location || undefined
      };

      // Save to MongoDB via API
      let result;
      if (isEditing && editId) {
        result = await apiService.updateJournalEntry(editId, journalData);
      } else {
        result = await apiService.createJournalEntry(journalData);
      }

      // Show success message
      setShowSuccess(true);

      // Reset form after short delay or navigate back if editing
      setTimeout(() => {
        if (isEditing) {
          // Navigate back to the journal detail page
          window.history.back();
        } else {
          // Reset form for new entry
          setEntry({
            title: '',
            content: '',
            mood: '',
            theme: 'Medical Blue',
            date: new Date(),
            tags: []
          });
          setPhoto(null);
          setAudioBlob(null);
          setPhotoPreview('');
          setShowSuccess(false);
        }
      }, 1500);

    } catch (error) {
      console.error('Error saving journal:', error);
      setError(error instanceof Error ? error.message : 'Failed to save journal entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to convert photo to base64
  const convertPhotoToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Helper function to convert audio to base64
  const convertAudioToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const selectedTheme = themes.find(t => t.name === entry.theme) || themes[0];
  const WeatherIcon = weatherIcons[weather as keyof typeof weatherIcons];

  // Show loading state
  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--md-sys-color-background)' }}>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LinearProgress className="w-32 mx-auto mb-4" />
            <p style={{ color: 'var(--janya-text-secondary)' }}>Loading journal entry...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--md-sys-color-background)' }}>
      <Navigation />

      {/* Content */}
      <div className="relative z-10 max-w-md mx-auto px-4 py-6 space-y-6 pb-28">
        {/* Title Input */}
        <Card className="p-4">
          <TextField
            type="text"
            placeholder={isEditing ? "Edit your journal title..." : "What's on your mind today?"}
            value={entry.title}
            onChange={(e) => setEntry(prev => ({ ...prev, title: e.target.value }))}
            className="w-full"
            label="Journal Title"
          />
        </Card>

        {/* Mood Selector */}
        <MoodSelector
          selectedMood={entry.mood || ''}
          onMoodSelect={(mood) => setEntry(prev => ({ ...prev, mood }))}
        />

        {/* Content Editor */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Type size={18} style={{ color: 'var(--janya-text-secondary)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--janya-text-primary)' }}>Your thoughts</span>
            <span className="ml-auto text-xs" style={{ color: 'var(--janya-text-secondary)' }}>{wordCount} words</span>
          </div>
          <textarea
            placeholder="Write about your day, your thoughts, your dreams..."
            value={entry.content}
            onChange={(e) => setEntry(prev => ({ ...prev, content: e.target.value }))}
            className="w-full h-40 bg-transparent border-none outline-none resize-none leading-relaxed"
            style={{
              color: 'var(--janya-text-primary)',
              backgroundColor: 'transparent'
            }}
          />
        </Card>

        {/* Media Controls */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <PhotoUpload onPhotoSelect={handlePhotoSelect} />
            <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
          </div>

          {photoPreview && (
            <div className="mt-4">
              <img
                src={photoPreview}
                alt="Selected photo"
                className="w-full h-48 object-cover rounded-xl"
              />
            </div>
          )}
        </Card>

        {/* AI Insights */}
        {entry.content && entry.mood && (
          <AIInsights content={entry.content} mood={entry.mood} />
        )}
      </div>

      {/* Floating Save Button */}
      <FAB
        onClick={handleSave}
        disabled={isSaving}
        className="fixed bottom-6 right-6"
        style={{
          backgroundColor: isSaving ? 'var(--md-sys-color-outline)' : 'var(--janya-primary)'
        }}
      >
        {isSaving ? (
          <LinearProgress />
        ) : (
          <Save size={24} style={{ color: 'white' }} />
        )}
      </FAB>

      {/* Success Message */}
      {showSuccess && (
        <Card className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-3 shadow-lg z-50"
          style={{ backgroundColor: 'var(--janya-secondary)' }}>
          <div className="flex items-center gap-2 text-white">
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <span style={{ color: 'var(--janya-secondary)' }} className="text-sm">✓</span>
            </div>
            Journal saved successfully!
          </div>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-3 shadow-lg z-50"
          style={{ backgroundColor: 'var(--md-sys-color-error)' }}>
          <div className="flex items-center gap-2 text-white">
            <span className="text-lg">⚠️</span>
            {error}
          </div>
        </Card>
      )}
    </div>
  );
}

export default withAuth(JournalPageComponent);