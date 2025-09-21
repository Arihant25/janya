'use client';

import { ChevronRight } from 'lucide-react';

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
        <div
            onClick={() => onClick(folder)}
            className="relative group cursor-pointer"
        >
            {/* Main Folder Container */}
            <div className="relative overflow-hidden rounded-3xl bg-white shadow-sm border border-gray-100 transition-all duration-500 group-hover:shadow-xl group-hover:scale-[1.02]">
                {/* Gradient Background */}
                <div
                    className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity duration-500"
                    style={{ background: folder.gradient }}
                />

                {/* Content */}
                <div className="relative z-10 p-6">
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
                        <ChevronRight size={20} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>

                    {/* Folder Info */}
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{folder.name}</h3>
                        <p className="text-sm text-gray-600">
                            {folder.journalCount} {folder.journalCount === 1 ? 'entry' : 'entries'}
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
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
                    <p className="text-xs text-gray-500">
                        Last entry: {new Date(folder.lastUpdated).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                        })}
                    </p>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
        </div>
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
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-lg bg-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No journals yet</h3>
                        <p className="text-gray-500 text-sm">Start writing to organize your thoughts</p>
                    </div>
                )}
            </div>
        </div>
    );
}
