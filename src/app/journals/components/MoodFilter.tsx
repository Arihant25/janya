'use client';

import { Journal } from '@/types/theme';
import { Chip } from '@/app/components/MaterialComponents';

interface MoodFilterProps {
    selectedMood: 'all' | Journal['mood'];
    onMoodChange: (mood: 'all' | Journal['mood']) => void;
    journalCounts: Record<string, number>;
}

const moodConfig = {
    all: { name: 'All', color: 'var(--janya-primary)' },
    happy: { name: 'Happy', color: 'var(--janya-secondary)' },
    sad: { name: 'Sad', color: 'var(--janya-primary)' },
    excited: { name: 'Excited', color: 'var(--md-sys-color-error)' },
    calm: { name: 'Calm', color: 'var(--janya-accent)' },
    anxious: { name: 'Anxious', color: 'var(--md-sys-color-tertiary)' },
    angry: { name: 'Angry', color: 'var(--md-sys-color-error)' },
    thoughtful: { name: 'Thoughtful', color: 'var(--janya-primary)' },
    inspired: { name: 'Inspired', color: 'var(--janya-secondary)' }
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
                            className={`flex-shrink-0 px-4 py-2 rounded-full transition-all duration-300 ${isSelected ? 'scale-105 shadow-lg' : 'hover:scale-102'
                                }`}
                            style={{
                                backgroundColor: isSelected ? config.color : 'var(--md-sys-color-surface-variant)',
                                color: isSelected ? 'white' : config.color,
                                border: `1px solid ${config.color}20`
                            }}
                        >
                            <span className="text-sm font-medium whitespace-nowrap">
                                {config.name}
                                {count > 0 && (
                                    <span
                                        className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${isSelected ? 'bg-white/20' : 'bg-current/20'
                                            }`}
                                    >
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
