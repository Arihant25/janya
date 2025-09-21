'use client';

import { Search, Grid, List, ArrowLeft, Grid3X3 } from 'lucide-react';
import { IconButton, TextField } from '@/app/components/MaterialComponents';

interface JournalHeaderProps {
    title: string;
    subtitle: string;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    viewMode: 'folders' | 'list' | 'grid';
    onViewModeChange: (mode: 'folders' | 'list' | 'grid') => void;
    showBack?: boolean;
    onBack?: () => void;
}

export default function JournalHeader({
    title,
    subtitle,
    searchTerm,
    onSearchChange,
    viewMode,
    onViewModeChange,
    showBack = false,
    onBack
}: JournalHeaderProps) {
    return (
        <div
            className="sticky top-0 z-20 backdrop-blur-lg border-b"
            style={{
                backgroundColor: 'var(--md-sys-color-surface)',
                borderColor: 'var(--md-sys-color-outline-variant)'
            }}
        >
            <div className="px-4 py-6">
                {/* Title Section */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        {showBack && (
                            <IconButton
                                onClick={onBack}
                                variant="filled-tonal"
                            >
                                <ArrowLeft size={20} />
                            </IconButton>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold" style={{ color: 'var(--janya-text-primary)' }}>{title}</h1>
                            <p className="text-sm mt-1" style={{ color: 'var(--janya-text-secondary)' }}>{subtitle}</p>
                        </div>
                    </div>

                    {/* View Toggle Bubble */}
                    <div className="relative">
                        <div
                            className="flex p-1 rounded-full"
                            style={{ backgroundColor: 'var(--md-sys-color-surface-variant)' }}
                        >
                            <IconButton
                                onClick={() => onViewModeChange('folders')}
                                variant={viewMode === 'folders' ? 'filled' : 'standard'}
                            >
                                <Grid size={16} />
                            </IconButton>
                            <IconButton
                                onClick={() => onViewModeChange('list')}
                                variant={viewMode === 'list' ? 'filled' : 'standard'}
                            >
                                <List size={16} />
                            </IconButton>
                            <IconButton
                                onClick={() => onViewModeChange('grid')}
                                variant={viewMode === 'grid' ? 'filled' : 'standard'}
                            >
                                <Grid3X3 size={16} />
                            </IconButton>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search
                        size={20}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2"
                        style={{ color: 'var(--janya-text-secondary)' }}
                    />
                    <input
                        type="text"
                        placeholder="Search your thoughts..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 transition-all duration-300"
                        style={{
                            fontSize: '16px', // Prevents zoom on iOS
                            backgroundColor: 'var(--md-sys-color-surface-variant)',
                            color: 'var(--janya-text-primary)'
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
