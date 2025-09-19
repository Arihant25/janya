'use client';

import { useState } from 'react';
import { Edit3, Check, X, Mail, Calendar, Music } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';

interface PersonalInfoProps {
    profile: {
        name: string;
        email: string;
        avatar?: string;
        musicPlatform?: string;
        joinDate: string;
    };
    onSave: (data: Partial<PersonalInfoProps['profile']>) => void;
}

export default function PersonalInfo({ profile, onSave }: PersonalInfoProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: profile.name,
        musicPlatform: profile.musicPlatform || ''
    });

    const handleSave = () => {
        onSave(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({
            name: profile.name,
            musicPlatform: profile.musicPlatform || ''
        });
        setIsEditing(false);
    };

    return (
        <div className="px-4 py-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                    <div className="flex gap-2">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="p-2 rounded-xl bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                                >
                                    <Check size={18} />
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                                <Edit3 size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Profile Section */}
                <div className="flex items-center gap-4 mb-6">
                    <ProfileAvatar
                        avatar={profile.avatar}
                        name={profile.name}
                        isEditing={isEditing}
                        onAvatarChange={(file) => {
                            // Handle avatar upload
                            console.log('Avatar file:', file);
                        }}
                    />
                    <div className="flex-1">
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full text-xl font-bold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Your name"
                            />
                        ) : (
                            <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
                        )}
                        <p className="text-gray-500 text-sm mt-1">Janya Community Member</p>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Mail size={18} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Email Address</p>
                            <p className="font-medium text-gray-900">{profile.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Calendar size={18} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Member Since</p>
                            <p className="font-medium text-gray-900">
                                {new Date(profile.joinDate).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Music size={18} className="text-purple-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-600">Music Platform</p>
                            {isEditing ? (
                                <select
                                    value={formData.musicPlatform}
                                    onChange={(e) => setFormData({ ...formData, musicPlatform: e.target.value })}
                                    className="w-full mt-1 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="">Select platform</option>
                                    <option value="spotify">Spotify</option>
                                    <option value="apple-music">Apple Music</option>
                                    <option value="youtube-music">YouTube Music</option>
                                    <option value="amazon-music">Amazon Music</option>
                                </select>
                            ) : (
                                <p className="font-medium text-gray-900">
                                    {profile.musicPlatform ?
                                        profile.musicPlatform.charAt(0).toUpperCase() + profile.musicPlatform.slice(1).replace('-', ' ') :
                                        'Not connected'
                                    }
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
