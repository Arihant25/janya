'use client';

import { ChevronRight } from 'lucide-react';
import { Card } from '@/app/components/MaterialComponents';

interface JournalFolder {
    id: string;
    name: string;
    color: string;
    gradient: string;
    journalCount: number;
    lastUpdated: string;
    preview?: string;
    journals: any[];
}

interface FolderGridProps {
    folders: JournalFolder[];
    onFolderClick: (folder: JournalFolder) => void;
}

const FolderCard = ({ folder, onClick }: { folder: JournalFolder; onClick: (folder: JournalFolder) => void }) => {
    return (
        <Card
            onClick={() => onClick(folder)}
            className="relative group cursor-pointer transition-all duration-500 hover:shadow-xl hover:scale-[1.02] p-6"
        >
            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: folder.color + '20' }}
                    >
                        <div
                            className="w-6 h-6 rounded-lg"
                            style={{ backgroundColor: folder.color }}
                        />
                    </div>
                    <ChevronRight
                        size={20}
                        className="transition-colors"
                        style={{
                            color: 'var(--janya-text-secondary)'
                        }}
                    />
                </div>

                {/* Folder Info */}
                <div className="mb-4">
                    <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--janya-text-primary)' }}>
                        {folder.name}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--janya-text-secondary)' }}>
                        {folder.journalCount} {folder.journalCount === 1 ? 'entry' : 'entries'}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div
                        className="w-full h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: 'var(--md-sys-color-surface-variant)' }}
                    >
                        <div
                            className="h-full transition-all duration-700 rounded-full"
                            style={{
                                width: `${Math.min((folder.journalCount / 10) * 100, 100)}%`,
                                backgroundColor: folder.color
                            }}
                        />
                    </div>
                </div>

                {/* Last Updated */}
                <p className="text-xs" style={{ color: 'var(--janya-text-secondary)' }}>
                    Last entry: {new Date(folder.lastUpdated).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                    })}
                </p>
            </div>
        </Card>
    );
};

export default function FolderGrid({ folders, onFolderClick }: FolderGridProps) {
    return (
        <div className="px-4 pb-24">
            <div className="grid grid-cols-1 gap-4">
                {folders.map((folder) => (
                    <FolderCard
                        key={folder.id}
                        folder={folder}
                        onClick={onFolderClick}
                    />
                ))}

                {folders.length === 0 && (
                    <div className="text-center py-16">
                        <div
                            className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                            style={{
                                background: 'linear-gradient(135deg, var(--md-sys-color-surface-variant) 0%, var(--md-sys-color-outline-variant) 100%)'
                            }}
                        >
                            <div
                                className="w-8 h-8 rounded-lg"
                                style={{ backgroundColor: 'var(--janya-text-secondary)' }}
                            />
                        </div>
                        <h3
                            className="text-lg font-semibold mb-2"
                            style={{ color: 'var(--janya-text-primary)' }}
                        >
                            No journals yet
                        </h3>
                        <p
                            className="text-sm"
                            style={{ color: 'var(--janya-text-secondary)' }}
                        >
                            Start writing to organize your thoughts
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
