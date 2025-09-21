'use client';

import { Trophy, Heart, Lightbulb } from 'lucide-react';
import { Card, Chip } from '@/app/components/MaterialComponents';

interface MoodAnalysis {
    primary: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    energyLevel: number;
    stressLevel: number;
}

interface MoodSummaryProps {
    moodAnalysis: MoodAnalysis;
    todaysEntries: any[];
}

export default function MoodSummary({ moodAnalysis, todaysEntries }: MoodSummaryProps) {
    return (
        <div className="mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0"
                    style={{ backgroundColor: 'var(--md-sys-color-primary-container)' }}>
                    {moodAnalysis.sentiment === 'positive' ?
                        <Trophy size={18} style={{ color: 'var(--md-sys-color-on-primary-container)' }} /> :
                        moodAnalysis.sentiment === 'negative' ?
                            <Heart size={18} style={{ color: 'var(--md-sys-color-on-primary-container)' }} /> :
                            <Lightbulb size={18} style={{ color: 'var(--md-sys-color-on-primary-container)' }} />
                    }
                </div>

                <div className="flex-grow text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-1 sm:gap-2">
                        <p className="font-bold text-lg sm:text-xl" style={{ color: 'var(--md-sys-color-primary)' }}>
                            {moodAnalysis.primary}
                        </p>
                        <span className="text-lg sm:text-xl">
                            {moodAnalysis.sentiment === 'positive' ? '✨' :
                                moodAnalysis.sentiment === 'negative' ? '💙' : '🌱'}
                        </span>
                    </div>
                    <p className="text-sm mt-1" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                        {todaysEntries.length} journal entries today
                    </p>
                </div>

                <div className="flex gap-2 mt-3 sm:mt-0 sm:flex-col sm:items-end sm:justify-center">
                    <Chip
                        variant="suggestion"
                        label={`Energy: ${moodAnalysis.energyLevel}/10`}
                        className="text-xs"
                    />
                    <Chip
                        variant="suggestion"
                        label={`Stress: ${moodAnalysis.stressLevel}/10`}
                        className="text-xs"
                    />
                </div>
            </div>
        </div>
    );
}
