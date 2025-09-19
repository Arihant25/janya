'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, Save, Mic, MicOff, Palette, Calendar, Clock, Heart, Smile, Frown, Meh, Angry, Zap, Coffee, Music, Image as ImageIcon, Type, Sparkles, Sun, Moon, Cloud, CloudRain } from 'lucide-react';
import withAuth from '@/components/withAuth';
import Navigation from '@/app/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';

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
  { name: 'happy', icon: Smile, color: '#FFD700', description: 'Joyful & Content' },
  { name: 'excited', icon: Zap, color: '#FF6347', description: 'Energetic & Thrilled' },
  { name: 'calm', icon: Heart, color: '#98FB98', description: 'Peaceful & Serene' },
  { name: 'thoughtful', icon: Coffee, color: '#9370DB', description: 'Reflective & Contemplative' },
  { name: 'neutral', icon: Meh, color: '#808080', description: 'Balanced & Steady' },
  { name: 'anxious', icon: Frown, color: '#DDA0DD', description: 'Worried & Tense' },
  { name: 'sad', icon: CloudRain, color: '#4682B4', description: 'Melancholy & Blue' },
  { name: 'angry', icon: Angry, color: '#DC143C', description: 'Frustrated & Upset' }
];

const themes: Theme[] = [
  {
    name: 'Sunrise',
    colors: {
      primary: '#FF6B6B',
      secondary: '#FFE66D',
      accent: '#FF8E53',
      background: 'linear-gradient(135deg, #FFE66D 0%, #FF6B6B 100%)'
    },
    pattern: 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)'
  },
  {
    name: 'Ocean',
    colors: {
      primary: '#4ECDC4',
      secondary: '#44A08D',
      accent: '#093637',
      background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)'
    },
    pattern: 'radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)'
  },
  {
    name: 'Lavender',
    colors: {
      primary: '#A8E6CF',
      secondary: '#C8A2C8',
      accent: '#654EA3',
      background: 'linear-gradient(135deg, #A8E6CF 0%, #C8A2C8 100%)'
    },
    pattern: 'radial-gradient(circle at 60% 60%, rgba(255, 255, 255, 0.1) 0%, transparent 40%)'
  },
  {
    name: 'Midnight',
    colors: {
      primary: '#667EEA',
      secondary: '#764BA2',
      accent: '#F093FB',
      background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)'
    },
    pattern: 'radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)'
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
    <div className="flex items-center gap-3">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
          isRecording
            ? 'bg-red-500 text-white shadow-lg'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
        {isRecording ? 'Stop' : 'Record'}
      </button>
      {isRecording && (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">{formatTime(recordingTime)}</span>
        </div>
      )}
    </div>
  );
};

const MoodSelector = ({ selectedMood, onMoodSelect }: {
  selectedMood: string;
  onMoodSelect: (mood: string) => void;
}) => (
  <div className="space-y-3">
    <h3 className="font-medium text-gray-800">How are you feeling?</h3>
    <div className="grid grid-cols-4 gap-3">
      {moods.map((mood) => {
        const IconComponent = mood.icon;
        return (
          <button
            key={mood.name}
            onClick={() => onMoodSelect(mood.name)}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 ${
              selectedMood === mood.name
                ? 'bg-white shadow-lg border-2 scale-105'
                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
            }`}
            style={{
              borderColor: selectedMood === mood.name ? mood.color : 'transparent'
            }}
          >
            <IconComponent 
              size={24} 
              style={{ color: selectedMood === mood.name ? mood.color : '#6B7280' }}
            />
            <span className="text-xs text-gray-600 capitalize">{mood.name}</span>
          </button>
        );
      })}
    </div>
    {selectedMood && (
      <div className="text-center mt-3">
        <p className="text-sm text-gray-600">
          {moods.find(m => m.name === selectedMood)?.description}
        </p>
      </div>
    )}
  </div>
);

const ThemeSelector = ({ selectedTheme, onThemeSelect }: {
  selectedTheme: string;
  onThemeSelect: (theme: string) => void;
}) => (
  <div className="space-y-3">
    <h3 className="font-medium text-gray-800 flex items-center gap-2">
      <Palette size={18} />
      Choose your theme
    </h3>
    <div className="grid grid-cols-2 gap-3">
      {themes.map((theme) => (
        <button
          key={theme.name}
          onClick={() => onThemeSelect(theme.name)}
          className={`relative h-16 rounded-xl overflow-hidden transition-all duration-300 ${
            selectedTheme === theme.name
              ? 'ring-2 ring-purple-500 ring-offset-2 scale-105'
              : 'hover:scale-102'
          }`}
          style={{ background: theme.colors.background }}
        >
          <div 
            className="absolute inset-0"
            style={{ background: theme.pattern }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-medium text-sm drop-shadow-lg">
              {theme.name}
            </span>
          </div>
        </button>
      ))}
    </div>
  </div>
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
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
      >
        <Camera size={18} />
        Add Photo
      </button>
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
      // Simulate AI analysis - replace with actual Gemini API call
      setTimeout(() => {
        const mockInsights = [
          "Your writing shows a positive shift in perspective today.",
          "There's a theme of growth and self-reflection in your thoughts.",
          "You seem to be processing emotions in a healthy way.",
          "Your gratitude practice is showing through in your words.",
          "There's an underlying current of determination in your writing."
        ];
        setInsights(mockInsights[Math.floor(Math.random() * mockInsights.length)]);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error generating insights:', error);
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
    <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={16} className="text-purple-500" />
        <span className="text-sm font-medium text-purple-700">AI Insights</span>
      </div>
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <span className="text-sm text-purple-600 ml-2">Analyzing your thoughts...</span>
        </div>
      ) : (
        <p className="text-sm text-purple-700">{insights}</p>
      )}
    </div>
  );
};

function JournalPageComponent() {
  const { user } = useAuth();
  const [entry, setEntry] = useState<Partial<JournalEntry>>({
    title: '',
    content: '',
    mood: '',
    theme: 'Sunrise',
    date: new Date(),
    tags: []
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [weather, setWeather] = useState<string>('sunny');

  useEffect(() => {
    // Get current weather (mock implementation)
    const weathers = ['sunny', 'cloudy', 'rainy', 'clear'];
    setWeather(weathers[Math.floor(Math.random() * weathers.length)]);
  }, []);

  useEffect(() => {
    setWordCount(entry.content?.split(' ').filter(word => word.length > 0).length || 0);
  }, [entry.content]);

  const handlePhotoSelect = (file: File) => {
    setPhoto(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRecordingComplete = (audioBlob: Blob) => {
    // Handle audio recording - could convert to text or store as audio
    console.log('Audio recorded:', audioBlob);
  };

  const handleSave = async () => {
    if (!entry.content?.trim() || !entry.mood) {
      alert('Please write something and select a mood before saving.');
      return;
    }

    setIsSaving(true);
    try {
      const entryData = {
        title: entry.title || '',
        content: entry.content,
        mood: entry.mood,
        theme: entry.theme || 'Sunrise',
        weather,
        tags: entry.tags || []
      };

      const response = await fetch('/api/journals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entryData),
      });

      if (!response.ok) {
        throw new Error('Failed to save journal entry');
      }

      const savedEntry = await response.json();
      console.log('Entry saved:', savedEntry);
      
      // Reset form
      setEntry({
        title: '',
        content: '',
        mood: '',
        theme: 'Sunrise',
        date: new Date(),
        tags: []
      });
      setPhoto(null);
      setPhotoPreview('');
      
      alert('Journal entry saved successfully!');
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save journal entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const selectedTheme = themes.find(t => t.name === entry.theme) || themes[0];
  const WeatherIcon = weatherIcons[weather as keyof typeof weatherIcons];

  return (
    <div>
      <Navigation />
      <div className="min-h-screen pb-24" style={{ background: selectedTheme.colors.background }}>
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ background: selectedTheme.pattern }}
        />
        
        {/* Header */}
        <div className="relative z-10 sticky top-0 bg-white bg-opacity-95 backdrop-blur-lg border-b border-gray-200">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-gray-600" />
                <div>
                  <h1 className="font-bold text-gray-800">New Entry</h1>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                    <WeatherIcon size={14} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">
                  {new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-md mx-auto px-4 py-6 space-y-6">
          {/* Title Input */}
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
            <input
              type="text"
              placeholder="What's on your mind today?"
              value={entry.title || ''}
              onChange={(e) => setEntry(prev => ({ ...prev, title: e.target.value }))}
              className="w-full text-lg font-medium bg-transparent border-none outline-none placeholder-gray-500"
            />
          </div>

          {/* Mood Selector */}
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
            <MoodSelector
              selectedMood={entry.mood || ''}
              onMoodSelect={(mood) => setEntry(prev => ({ ...prev, mood }))}
            />
          </div>

          {/* Theme Selector */}
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
            <ThemeSelector
              selectedTheme={entry.theme || 'Sunrise'}
              onThemeSelect={(theme) => setEntry(prev => ({ ...prev, theme }))}
            />
          </div>

          {/* Content Editor */}
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Type size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Your thoughts</span>
              <span className="ml-auto text-xs text-gray-500">{wordCount} words</span>
            </div>
            <textarea
              placeholder="Write about your day, your thoughts, your dreams..."
              value={entry.content || ''}
              onChange={(e) => setEntry(prev => ({ ...prev, content: e.target.value }))}
              className="w-full h-40 bg-transparent border-none outline-none resize-none placeholder-gray-500 text-gray-800 leading-relaxed"
            />
          </div>

          {/* Media Controls */}
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
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
          </div>

          {/* AI Insights */}
          {entry.content && entry.mood && (
            <AIInsights content={entry.content} mood={entry.mood} />
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving || !entry.content?.trim() || !entry.mood}
            className={`w-full py-4 rounded-2xl font-medium transition-all duration-300 ${
              isSaving || !entry.content?.trim() || !entry.mood
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            {isSaving ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving your thoughts...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Save size={20} />
                Save Entry
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default withAuth(JournalPageComponent);