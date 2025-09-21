'use client';

import { Search, Grid, List, ArrowLeft, Grid3X3 } from 'lucide-react';

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
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-lg border-b border-gray-100">
            <div className="px-4 py-6">
                {/* Title Section */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        {showBack && (
                            <button
                                onClick={onBack}
                                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <ArrowLeft size={20} className="text-gray-700" />
                            </button>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                        </div>
                    </div>

                    {/* View Toggle Bubble */}
                    <div className="relative">
                        <div className="flex bg-gray-100 p-1 rounded-full">
                            <button
                                onClick={() => onViewModeChange('folders')}
                                className={`p-2 rounded-full transition-all duration-300 ${viewMode === 'folders'
                                    ? 'bg-white shadow-sm scale-105'
                                    : 'hover:bg-gray-200'
                                    }`}
                            >
                                <Grid size={16} className={viewMode === 'folders' ? 'text-gray-800' : 'text-gray-500'} />
                            </button>
                            <button
                                onClick={() => onViewModeChange('list')}
                                className={`p-2 rounded-full transition-all duration-300 ${viewMode === 'list'
                                    ? 'bg-white shadow-sm scale-105'
                                    : 'hover:bg-gray-200'
                                    }`}
                            >
                                <List size={16} className={viewMode === 'list' ? 'text-gray-800' : 'text-gray-500'} />
                            </button>
                            <button
                                onClick={() => onViewModeChange('grid')}
                                className={`p-2 rounded-full transition-all duration-300 ${viewMode === 'grid'
                                    ? 'bg-white shadow-sm scale-105'
                                    : 'hover:bg-gray-200'
                                    }`}
                            >
                                <Grid3X3 size={16} className={viewMode === 'grid' ? 'text-gray-800' : 'text-gray-500'} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search your thoughts..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-0 focus:bg-white focus:ring-2 transition-all duration-300"
                        style={{
                            fontSize: '16px' // Prevents zoom on iOS
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
