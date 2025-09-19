'use client';

import { Camera, User } from 'lucide-react';

interface ProfileAvatarProps {
    avatar?: string;
    name: string;
    isEditing?: boolean;
    onAvatarChange?: (file: File) => void;
}

export default function ProfileAvatar({
    avatar,
    name,
    isEditing = false,
    onAvatarChange
}: ProfileAvatarProps) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onAvatarChange) {
            onAvatarChange(file);
        }
    };

    return (
        <div className="relative">
            <div
                className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden shadow-lg"
                style={{ background: 'var(--janya-warm-gradient)' }}
            >
                {avatar ? (
                    <img src={avatar} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <User size={32} className="text-white" />
                )}
            </div>

            {isEditing && (
                <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors border border-gray-200">
                    <Camera size={14} className="text-gray-600" />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>
            )}
        </div>
    );
}
