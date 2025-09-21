'use client';

import { useState, useEffect } from 'react';
import withAuth from '@/components/withAuth';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, BarChart3, Settings, Award, LogOut } from 'lucide-react';
import { apiService } from '@/lib/api';

// Components
import StatsGrid from './components/StatsGrid';
import PersonalInfo from './components/PersonalInfo';
import PreferencesCard from './components/PreferencesCard';
import AchievementsGrid from './components/AchievementsGrid';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  musicPlatform?: string;
  joinDate: string;
  preferences?: {
    journalReminders?: boolean;
    dailyInsights?: boolean;
    weeklyReports?: boolean;
    pushNotifications?: boolean;
  };
  stats?: {
    totalEntries: number;
    currentStreak: number;
    longestStreak: number;
    totalWords: number;
    favoriteThemes: string[];
    weeklyAverage: number;
  };
  achievements?: any[];
}

// Achievement mapping for database achievements
const mapAchievementFromDatabase = (dbAchievement: any) => ({
  id: dbAchievement._id?.toString() || dbAchievement.achievementId,
  name: dbAchievement.title,
  description: dbAchievement.description,
  icon: dbAchievement.icon,
  unlocked: true,
  rarity: dbAchievement.rarity || 'common' as const
});

type TabType = 'overview' | 'profile' | 'preferences' | 'achievements';

interface TabItem {
  id: TabType;
  label: string;
  icon: React.ElementType;
}

const tabs: TabItem[] = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'preferences', label: 'Settings', icon: Settings },
  { id: 'achievements', label: 'Awards', icon: Award }
];

function ProfilePageComponent() {
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await apiService.getProfile();
      const profileData = response.profile;

      // Map database achievements to frontend format
      const mappedAchievements = profileData.achievements?.map(mapAchievementFromDatabase) || [];

      // Calculate total words from journal entries if not available
      let totalWords = 0;
      if (!profileData.stats.totalWords) {
        try {
          const journalsResponse = await apiService.getJournalEntries();
          const journals = journalsResponse.entries || [];
          totalWords = journals.reduce((sum: number, journal: any) =>
            sum + (journal.content?.split(' ').filter((word: string) => word.length > 0).length || 0), 0);
        } catch (error) {
          console.error('Error calculating total words:', error);
        }
      }

      const userProfile: UserProfile = {
        id: profileData.id,
        name: profileData.name,
        email: profileData.email,
        avatar: profileData.avatar,
        musicPlatform: profileData.musicPlatform || 'spotify',
        joinDate: profileData.joinDate,
        preferences: profileData.preferences || {
          journalReminders: true,
          dailyInsights: true,
          weeklyReports: false,
          pushNotifications: true
        },
        stats: {
          totalEntries: profileData.stats.totalEntries || 0,
          currentStreak: profileData.stats.currentStreak || 0,
          longestStreak: profileData.stats.longestStreak || 0,
          totalWords: profileData.stats.totalWords || totalWords,
          favoriteThemes: profileData.stats.favoriteThemes || [],
          weeklyAverage: Math.ceil((profileData.stats.totalEntries || 0) / 4) || 0
        },
        achievements: mappedAchievements
      };

      setProfile(userProfile);
    } catch (error: any) {
      setError(error.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (updatedData: any) => {
    try {
      await apiService.updateProfile(updatedData);
      setProfile(prev => prev ? { ...prev, ...updatedData } : null);
      updateUser(updatedData);
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
    }
  };

  const handlePreferenceChange = (key: string, value: boolean) => {
    const updatedPreferences = {
      ...profile?.preferences,
      [key]: value
    };
    handleSaveProfile({ preferences: updatedPreferences });
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleBack = () => {
    router.push('/journals');
  };

  const renderTabContent = () => {
    if (!profile) return null;

    switch (activeTab) {
      case 'overview':
        return <StatsGrid stats={profile.stats!} />;
      case 'profile':
        return (
          <PersonalInfo
            profile={profile}
            onSave={handleSaveProfile}
          />
        );
      case 'preferences':
        return (
          <PreferencesCard
            preferences={profile.preferences!}
            onPreferenceChange={handlePreferenceChange}
          />
        );
      case 'achievements':
        return <AchievementsGrid achievements={profile.achievements!} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full animate-spin"
            style={{ background: 'var(--janya-warm-gradient)' }}>
            <div className="w-full h-full rounded-full border-4 border-transparent border-t-white" />
          </div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-900">Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchProfile}
            className="px-6 py-3 rounded-xl text-white transition-colors"
            style={{ background: 'var(--janya-primary)' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-lg border-b border-gray-100">
        <div className="px-4 py-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-700" />
              </button>
              {/* <div>
                <h1 className="text-xl font-bold text-gray-900">{profile.name}</h1>
                <p className="text-sm text-gray-500">Member since {new Date(profile.joinDate).getFullYear()}</p>
              </div> */}
            </div>

            {/* Enhanced Logout Button */}
            <div className="relative">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <LogOut size={16} />
                <span className="text-sm font-medium hidden sm:block">Sign Out</span>
              </button>
            </div>
          </div>

          {/* Mini Navbar */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-300 ${isActive
                    ? 'bg-white shadow-sm text-gray-900 scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium hidden sm:block">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pb-6">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default withAuth(ProfilePageComponent);