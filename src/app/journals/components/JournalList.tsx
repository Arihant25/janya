'use client';

import { Calendar, FileText, ChevronRight } from 'lucide-react';
import { Journal } from '@/types/theme';

interface JournalListProps {
    journals: Journal[];
    onJournalClick: (journal: Journal) => void;
}

const JournalListItem = ({ journal, onClick }: { journal: Journal; onClick: (journal: Journal) => void }) => {
    const getMoodColor = (mood: string) => {
        const colors: Record<string, string> = {
            happy: '#f59e0b',
            sad: '#3b82f6',
            excited: '#ef4444',
            calm: '#10b981',
            anxious: '#8b5cf6',
            angry: '#f97316',
            thoughtful: '#6366f1',
            inspired: '#ec4899'
        };
        return colors[mood] || '#6b7280';
    };

    return (
        <div
            onClick={() => onClick(journal)}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer group"
        >
            <div className="flex items-start gap-4">
                {/* Mood Indicator */}
                <div
                    className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
                    style={{ backgroundColor: getMoodColor(journal.mood) }}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 truncate pr-2">{journal.title}</h3>
                        <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {journal.preview}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>{new Date(journal.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                            })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <FileText size={12} />
                            <span>{journal.wordCount} words</span>
                        </div>
                        <div className="ml-auto">
                            <span className="capitalize">{journal.mood}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function JournalList({ journals, onJournalClick }: JournalListProps) {
    return (
        <div className="px-4 pb-24">
            <div className="space-y-3">
                {journals.map((journal) => (
                    <JournalListItem
                        key={journal.id}
                        journal={journal}
                        onClick={onJournalClick}
                    />
                ))}

                {journals.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <FileText size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No entries found</h3>
                        <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
}
