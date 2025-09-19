'use client';

import { Trophy, Heart, Lightbulb } from 'lucide-react';

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
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'var(--janya-primary)' }}>
                        {moodAnalysis.sentiment === 'positive' ?
                            <Trophy size={18} className="text-white" /> :
                            moodAnalysis.sentiment === 'negative' ?
                                <Heart size={18} className="text-white" /> :
                                <Lightbulb size={18} className="text-white" />
                        }
                    </div>

                    <div>
                        <div className="flex items-center gap-1">
                            <p className="font-bold" style={{ color: 'var(--janya-primary)' }}>
                                {moodAnalysis.primary}
                            </p>
                            <span className="text-xl">
                                {moodAnalysis.sentiment === 'positive' ? '✨' :
                                    moodAnalysis.sentiment === 'negative' ? '💙' : '🌱'}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">
                            {todaysEntries.length} journal entries today
                        </p>
                    </div>
                </div>

                <div className="flex gap-1 text-sm">
                    <div className="px-2 py-1 bg-white rounded-lg border border-gray-200 text-xs font-medium">
                        <span className="text-gray-500">Energy:</span> {moodAnalysis.energyLevel}/10
                    </div>
                    <div className="px-2 py-1 bg-white rounded-lg border border-gray-200 text-xs font-medium">
                        <span className="text-gray-500">Stress:</span> {moodAnalysis.stressLevel}/10
                    </div>
                </div>
            </div>
        </div>
    );
}
