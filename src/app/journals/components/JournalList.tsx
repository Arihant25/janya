'use client';

import { Calendar, FileText, ChevronRight, Image, Mic } from 'lucide-react';
import { Journal } from '@/types/theme';
import { Card, Chip } from '@/app/components/MaterialComponents';

interface JournalListProps {
    journals: Journal[];
    onJournalClick: (journal: Journal) => void;
}

const JournalListItem = ({ journal, onClick }: { journal: Journal; onClick: (journal: Journal) => void }) => {
    const getMoodColor = (mood: string) => {
        const colors: Record<string, string> = {
            happy: 'var(--janya-secondary)',
            sad: 'var(--janya-primary)',
            excited: 'var(--md-sys-color-error)',
            calm: 'var(--janya-accent)',
            anxious: 'var(--md-sys-color-tertiary)',
            angry: 'var(--md-sys-color-error)',
            thoughtful: 'var(--janya-primary)',
            inspired: 'var(--janya-secondary)'
        };
        return colors[mood] || 'var(--md-sys-color-outline)';
    };

    return (
        <Card
            onClick={() => onClick(journal)}
            className="p-4 hover:shadow-md transition-all duration-300 cursor-pointer group"
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
                        <h3
                            className="font-semibold truncate pr-2"
                            style={{ color: 'var(--janya-text-primary)' }}
                        >
                            {journal.title}
                        </h3>
                        <ChevronRight
                            size={16}
                            className="transition-colors flex-shrink-0"
                            style={{ color: 'var(--janya-text-secondary)' }}
                        />
                    </div>

                    <p
                        className="text-sm line-clamp-2 mb-3"
                        style={{ color: 'var(--janya-text-secondary)' }}
                    >
                        {journal.preview}
                    </p>

                    {/* Media Tags */}
                    {(journal.photo || journal.audioRecording) && (
                        <div className="flex items-center gap-2 mb-3">
                            {journal.photo && (
                                <Chip
                                    className="text-xs"
                                    style={{
                                        backgroundColor: 'var(--md-sys-color-primary-container)',
                                        color: 'var(--md-sys-color-on-primary-container)'
                                    }}
                                >
                                    <Image size={12} className="mr-1" />
                                    Image
                                </Chip>
                            )}
                            {journal.audioRecording && (
                                <Chip
                                    className="text-xs"
                                    style={{
                                        backgroundColor: 'var(--md-sys-color-tertiary-container)',
                                        color: 'var(--md-sys-color-on-tertiary-container)'
                                    }}
                                >
                                    <Mic size={12} className="mr-1" />
                                    Audio
                                </Chip>
                            )}
                        </div>
                    )}

                    <div
                        className="flex items-center gap-4 text-xs"
                        style={{ color: 'var(--janya-text-secondary)' }}
                    >
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
        </Card>
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
                        <div
                            className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: 'var(--md-sys-color-surface-variant)' }}
                        >
                            <FileText size={32} style={{ color: 'var(--janya-text-secondary)' }} />
                        </div>
                        <h3
                            className="text-lg font-semibold mb-2"
                            style={{ color: 'var(--janya-text-primary)' }}
                        >
                            No entries found
                        </h3>
                        <p
                            className="text-sm"
                            style={{ color: 'var(--janya-text-secondary)' }}
                        >
                            Try adjusting your search or filters
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
