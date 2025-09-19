'use client';

import { ArrowLeft, Settings, LogOut } from 'lucide-react';

interface ProfileHeaderProps {
    userName: string;
    onBack: () => void;
    onLogout: () => void;
}

export default function ProfileHeader({ userName, onBack, onLogout }: ProfileHeaderProps) {
    return (
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-lg border-b border-gray-100">
            <div className="px-4 py-6">
                {/* Title Section */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBack}
                            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            <ArrowLeft size={20} className="text-gray-700" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                            <p className="text-sm text-gray-500 mt-1">Welcome back, {userName}!</p>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={18} />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
