'use client';

import { useState, useEffect } from 'react';
import withAuth from '@/components/withAuth';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';
import { useRouter } from 'next/navigation';

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
  };
  stats?: {
    totalEntries: number;
    currentStreak: number;
    longestStreak: number;
    moodDistribution: any;
    favoriteThemes: string[];
  };
  achievements?: any[];
}

function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await apiService.getProfile();
      setProfile(response.profile);
    } catch (error: any) {
      setError(error.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (updatedProfile: Partial<UserProfile>) => {
    try {
      await updateUser(updatedProfile);
      setProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
      setEditing(false);
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchProfile}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-800">My Profile</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/journal')}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Back to Journal
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Personal Information</h2>
                <button
                  onClick={() => setEditing(!editing)}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  {editing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {editing ? (
                <EditProfileForm 
                  profile={profile}
                  onSave={handleSaveProfile}
                  onCancel={() => setEditing(false)}
                />
              ) : (
                <ProfileDisplay profile={profile} />
              )}
            </div>

            {/* Achievements Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Achievements</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {profile?.achievements?.length ? (
                  profile.achievements.map((achievement, index) => (
                    <div key={index} className="text-center p-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg">
                      <div className="text-2xl mb-2">{achievement.icon || '🏆'}</div>
                      <div className="text-sm font-medium text-gray-800">{achievement.name}</div>
                      <div className="text-xs text-gray-600">{achievement.description}</div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center p-8 text-gray-500 italic">
                    Keep journaling to unlock achievements!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats & Preferences */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Journey</h3>
              <div className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {profile?.stats?.totalEntries || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Entries</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {profile?.stats?.currentStreak || 0}
                  </div>
                  <div className="text-sm text-gray-600">Current Streak</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {profile?.stats?.longestStreak || 0}
                  </div>
                  <div className="text-sm text-gray-600">Longest Streak</div>
                </div>
              </div>
            </div>

            {/* Preferences Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Preferences</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-gray-700">Journal Reminders</span>
                  <input
                    type="checkbox"
                    checked={profile?.preferences?.journalReminders || false}
                    onChange={(e) => {
                      const updatedPreferences = {
                        ...profile?.preferences,
                        journalReminders: e.target.checked
                      };
                      handleSaveProfile({ preferences: updatedPreferences });
                    }}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-gray-700">Daily Insights</span>
                  <input
                    type="checkbox"
                    checked={profile?.preferences?.dailyInsights || false}
                    onChange={(e) => {
                      const updatedPreferences = {
                        ...profile?.preferences,
                        dailyInsights: e.target.checked
                      };
                      handleSaveProfile({ preferences: updatedPreferences });
                    }}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-gray-700">Weekly Reports</span>
                  <input
                    type="checkbox"
                    checked={profile?.preferences?.weeklyReports || false}
                    onChange={(e) => {
                      const updatedPreferences = {
                        ...profile?.preferences,
                        weeklyReports: e.target.checked
                      };
                      handleSaveProfile({ preferences: updatedPreferences });
                    }}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Profile Display Component
function ProfileDisplay({ profile }: { profile: UserProfile | null }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <p className="text-lg text-gray-900">{profile?.name || 'Not set'}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <p className="text-lg text-gray-900">{profile?.email || 'Not set'}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Music Platform</label>
        <p className="text-lg text-gray-900">{profile?.musicPlatform || 'Not set'}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
        <p className="text-lg text-gray-900">
          {profile?.joinDate ? new Date(profile.joinDate).toLocaleDateString() : 'Not available'}
        </p>
      </div>
    </div>
  );
}

// Edit Profile Form Component
function EditProfileForm({ 
  profile, 
  onSave, 
  onCancel 
}: { 
  profile: UserProfile | null;
  onSave: (profile: Partial<UserProfile>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    musicPlatform: profile?.musicPlatform || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      musicPlatform: formData.musicPlatform
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Music Platform</label>
        <select
          value={formData.musicPlatform}
          onChange={(e) => setFormData({ ...formData, musicPlatform: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Select a platform</option>
          <option value="spotify">Spotify</option>
          <option value="apple-music">Apple Music</option>
          <option value="youtube-music">YouTube Music</option>
          <option value="amazon-music">Amazon Music</option>
        </select>
      </div>
      <div className="flex space-x-4">
        <button
          type="submit"
          className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default withAuth(ProfilePage);