'use client';

import { BookOpen, Volume2, Activity, Star, ExternalLink, ChevronRight, Sparkles } from 'lucide-react';

interface Recommendation {
    id: string;
    type: 'book' | 'music' | 'activity';
    title: string;
    description: string;
    author?: string;
    artist?: string;
    duration?: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    mood: string;
    coverArt?: string;
    rating: number;
    tags: string[];
    aiReason?: string;
    matchScore: number;
    link?: string;
}

interface RecommendationCardProps {
    recommendation: Recommendation;
    onClick: (recommendation: Recommendation) => void;
    isExpanded: boolean;
    isSaved: boolean;
    onSave: (id: string, e: React.MouseEvent) => void;
}

export default function RecommendationCard({
    recommendation,
    onClick,
    isExpanded,
    isSaved,
    onSave
}: RecommendationCardProps) {
    // Get type-specific styling
    const getTypeStyles = () => {
        switch (recommendation.type) {
            case 'book':
                return {
                    color: '#4285F4',
                    bgLight: '#E8F0FE',
                    icon: <BookOpen size={16} />,
                    label: 'Book',
                    action: 'Read More'
                };
            case 'music':
                return {
                    color: '#DB4437',
                    bgLight: '#FCE8E6',
                    icon: <Volume2 size={16} />,
                    label: 'Music',
                    action: 'Listen Now'
                };
            case 'activity':
                return {
                    color: '#0F9D58',
                    bgLight: '#E6F4EA',
                    icon: <Activity size={16} />,
                    label: 'Activity',
                    action: 'Try This'
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div
            className={`bg-white rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 ${isExpanded ? 'shadow-md' : 'shadow-sm'
                }`}
            onClick={() => onClick(recommendation)}
        >
            {/* Card Header - Always visible */}
            <div className="flex items-center p-3 border-b border-gray-100">
                {/* Image/Icon */}
                <div className="w-11 h-11 rounded-lg overflow-hidden mr-3 flex-shrink-0 border border-gray-200">
                    {recommendation.coverArt ? (
                        <img
                            src={recommendation.coverArt}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ backgroundColor: styles.bgLight }}
                        >
                            <div style={{ color: styles.color }}>{styles.icon}</div>
                        </div>
                    )}
                </div>

                {/* Title and Subtitle */}
                <div className="flex-grow overflow-hidden">
                    <h3 className="font-medium text-gray-900 truncate">
                        {recommendation.title}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                        {recommendation.author || recommendation.artist || styles.label}
                    </p>
                </div>

                {/* Match Score and Save Button */}
                <div className="ml-2 flex items-center gap-2">
                    <button
                        onClick={(e) => onSave(recommendation.id, e)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isSaved ? 'bg-amber-50' : 'bg-gray-100'
                            }`}
                    >
                        <Star
                            size={16}
                            className={isSaved ? 'text-amber-500 fill-amber-500' : 'text-gray-400'}
                        />
                    </button>

                    <div
                        className="flex items-center justify-center rounded-full w-8 h-8"
                        style={{ backgroundColor: styles.bgLight }}
                    >
                        <span
                            className="text-xs font-bold"
                            style={{ color: styles.color }}
                        >
                            {recommendation.matchScore}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Expandable Content */}
            <div
                className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="p-3 border-b border-gray-100">
                    {/* Tags Row */}
                    <div className="flex flex-wrap gap-1 mb-3">
                        <span
                            className="text-xs px-2 py-1 rounded-full"
                            style={{ backgroundColor: styles.bgLight, color: styles.color }}
                        >
                            {recommendation.mood}
                        </span>

                        {recommendation.duration && (
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                {recommendation.duration}
                            </span>
                        )}

                        {recommendation.difficulty && (
                            <span className={`text-xs px-2 py-1 rounded-full ${recommendation.difficulty === 'Easy' ? 'bg-green-50 text-green-600' :
                                    recommendation.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-600' :
                                        'bg-red-50 text-red-600'
                                }`}>
                                {recommendation.difficulty}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-3">
                        {recommendation.description}
                    </p>

                    {/* AI Reason */}
                    {recommendation.aiReason && (
                        <div className="mb-3 p-2 rounded-lg" style={{ backgroundColor: styles.bgLight }}>
                            <div className="flex items-start">
                                <Sparkles size={14} style={{ color: styles.color }} className="mt-0.5 mr-2 flex-shrink-0" />
                                <p className="text-xs" style={{ color: styles.color }}>
                                    {recommendation.aiReason}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Action Button */}
                    {recommendation.link && (
                        <a
                            href={recommendation.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1 w-full py-2.5 rounded-lg text-white text-sm font-medium mt-2"
                            style={{ backgroundColor: styles.color }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {styles.action}
                            <ExternalLink size={14} />
                        </a>
                    )}
                </div>
            </div>

            {/* Card Footer */}
            <div className="px-3 py-2 flex items-center justify-between bg-gray-50">
                <div className="flex items-center">
                    <div
                        className="w-4 h-4 rounded-full flex items-center justify-center mr-2"
                        style={{ backgroundColor: styles.color }}
                    >
                        <div className="text-white" style={{ transform: 'scale(0.7)' }}>
                            {styles.icon}
                        </div>
                    </div>

                    <span className="text-xs text-gray-500">
                        {isExpanded ? 'Tap to collapse' : 'Tap to learn more'}
                    </span>
                </div>

                <ChevronRight
                    size={16}
                    className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''
                        }`}
                />
            </div>
        </div>
    );
}