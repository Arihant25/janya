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
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'var(--md-sys-color-primary-container)' }}>
                        {moodAnalysis.sentiment === 'positive' ?
                            <Trophy size={20} style={{ color: 'var(--md-sys-color-on-primary-container)' }} /> :
                            moodAnalysis.sentiment === 'negative' ?
                                <Heart size={20} style={{ color: 'var(--md-sys-color-on-primary-container)' }} /> :
                                <Lightbulb size={20} style={{ color: 'var(--md-sys-color-on-primary-container)' }} />
                        }
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-lg" style={{ color: 'var(--md-sys-color-primary)' }}>
                                {moodAnalysis.primary}
                            </p>
                            <span className="text-xl">
                                {moodAnalysis.sentiment === 'positive' ? '✨' :
                                    moodAnalysis.sentiment === 'negative' ? '💙' : '🌱'}
                            </span>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                            {todaysEntries.length} journal entries today
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Chip
                        variant="suggestion"
                        label={`Energy: ${moodAnalysis.energyLevel}/10`}
                    />
                    <Chip
                        variant="suggestion"
                        label={`Stress: ${moodAnalysis.stressLevel}/10`}
                    />
                </div>
            </div>
        </div>
    );
}
