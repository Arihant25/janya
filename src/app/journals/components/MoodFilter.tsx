'use client';

import { Journal } from '@/types/theme';

interface MoodFilterProps {
    selectedMood: 'all' | Journal['mood'];
    onMoodChange: (mood: 'all' | Journal['mood']) => void;
    journalCounts: Record<string, number>;
}

const moodConfig = {
    all: { name: 'All', color: 'var(--janya-primary)', bg: 'var(--janya-primary-light)' },
    happy: { name: 'Happy', color: '#f59e0b', bg: '#fef3c7' },
    sad: { name: 'Sad', color: '#3b82f6', bg: '#dbeafe' },
    excited: { name: 'Excited', color: '#ef4444', bg: '#fee2e2' },
    calm: { name: 'Calm', color: '#10b981', bg: '#d1fae5' },
    anxious: { name: 'Anxious', color: '#8b5cf6', bg: '#ede9fe' },
    angry: { name: 'Angry', color: '#f97316', bg: '#fed7aa' },
    thoughtful: { name: 'Thoughtful', color: '#6366f1', bg: '#e0e7ff' },
    inspired: { name: 'Inspired', color: '#ec4899', bg: '#fce7f3' }
};

export default function MoodFilter({ selectedMood, onMoodChange, journalCounts }: MoodFilterProps) {
    const moods = Object.keys(moodConfig) as Array<keyof typeof moodConfig>;

    return (
        <div className="px-4 pb-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {moods.map((mood) => {
                    const config = moodConfig[mood];
                    const count = mood === 'all'
                        ? Object.values(journalCounts).reduce((sum, count) => sum + count, 0)
                        : journalCounts[mood] || 0;

                    const isSelected = selectedMood === mood;

                    return (
                        <button
                            key={mood}
                            onClick={() => onMoodChange(mood as any)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full transition-all duration-300 ${isSelected
                                    ? 'scale-105 shadow-lg'
                                    : 'hover:scale-102'
                                }`}
                            style={{
                                backgroundColor: isSelected ? config.color : config.bg,
                                color: isSelected ? 'white' : config.color,
                                border: `1px solid ${config.color}20`
                            }}
                        >
                            <span className="text-sm font-medium whitespace-nowrap">
                                {config.name}
                                {count > 0 && (
                                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${isSelected ? 'bg-white/20' : 'bg-current/20'
                                        }`}>
                                        {count}
                                    </span>
                                )}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
