'use client';

import { Calendar, FileText, Image, Mic } from 'lucide-react';
import { Journal } from '@/types/theme';

interface JournalGridProps {
    journals: Journal[];
    onJournalClick: (journal: Journal) => void;
}

const JournalGridItem = ({ journal, onClick }: { journal: Journal; onClick: (journal: Journal) => void }) => {
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
            className="relative group cursor-pointer"
        >
            <div className="aspect-square bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden">
                {/* Background Image or Gradient */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `linear-gradient(135deg, ${getMoodColor(journal.mood)}20 0%, ${getMoodColor(journal.mood)}40 100%)`
                    }}
                />

                {journal.photo && (
                    <img
                        src={journal.photo}
                        alt={journal.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        onLoad={(e) => {
                            // Hide gradient background when image loads
                            const gradientDiv = e.currentTarget.previousElementSibling as HTMLElement;
                            if (gradientDiv) {
                                gradientDiv.style.display = 'none';
                            }
                        }}
                        onError={(e) => {
                            // Show gradient background if image fails to load
                            e.currentTarget.style.display = 'none';
                            const gradientDiv = e.currentTarget.previousElementSibling as HTMLElement;
                            if (gradientDiv) {
                                gradientDiv.style.display = 'block';
                            }
                        }}
                    />
                )}

                {/* Content Overlay */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    {/* Top Section */}
                    <div className="flex justify-between items-start">
                        {/* Mood Indicator */}
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getMoodColor(journal.mood) }}
                        />

                        {/* Media Indicators */}
                        <div className="flex gap-1">
                            {journal.photo && (
                                <div className="w-6 h-6 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                                    <Image size={12} className="text-blue-600" />
                                </div>
                            )}
                            {journal.audioRecording && (
                                <div className="w-6 h-6 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                                    <Mic size={12} className="text-purple-600" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Section - Title and Info */}
                    <div>
                        <h3 className={`font-semibold mb-2 line-clamp-2 ${
                            journal.photo ? 'text-white' : 'text-gray-900'
                        }`}>
                            {journal.title}
                        </h3>

                        <div className="flex items-center justify-between text-xs">
                            <div className={`flex items-center gap-1 ${
                                journal.photo ? 'text-white text-opacity-90' : 'text-gray-500'
                            }`}>
                                <Calendar size={10} />
                                <span>{new Date(journal.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                })}</span>
                            </div>
                            <div className={`flex items-center gap-1 ${
                                journal.photo ? 'text-white text-opacity-90' : 'text-gray-500'
                            }`}>
                                <FileText size={10} />
                                <span>{journal.wordCount}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
        </div>
    );
};

export default function JournalGrid({ journals, onJournalClick }: JournalGridProps) {
    return (
        <div className="px-4 pb-24">
            <div className="grid grid-cols-2 gap-4">
                {journals.map((journal) => (
                    <JournalGridItem
                        key={journal.id}
                        journal={journal}
                        onClick={onJournalClick}
                    />
                ))}

                {journals.length === 0 && (
                    <div className="col-span-2 text-center py-16">
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