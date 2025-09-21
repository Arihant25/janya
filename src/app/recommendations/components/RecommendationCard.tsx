'use client';

import { BookOpen, Volume2, Activity, Star, ExternalLink, ChevronRight, Sparkles } from 'lucide-react';
import { Card, Button, IconButton, Chip } from '@/app/components/MaterialComponents';

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
        <Card
            variant="elevated"
            className={`overflow-hidden transition-all duration-300 cursor-pointer ${isExpanded ? 'shadow-lg' : ''}`}
            onClick={() => onClick(recommendation)}
        >
            {/* Card Header - Always visible */}
            <div className="flex items-center p-3 sm:p-4">
                {/* Image/Icon */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden mr-3 sm:mr-4 flex-shrink-0" style={{ backgroundColor: 'var(--md-sys-color-surface-container)' }}>
                    {recommendation.coverArt ? (
                        <img
                            src={recommendation.coverArt}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div style={{ color: styles.color }}>{styles.icon}</div>
                        </div>
                    )}
                </div>

                {/* Title and Subtitle */}
                <div className="flex-grow overflow-hidden min-w-0">
                    <h3 className="font-medium text-base sm:text-lg mb-1 truncate" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                        {recommendation.title}
                    </h3>
                    <p className="text-sm truncate" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                        {recommendation.author || recommendation.artist || styles.label}
                    </p>
                </div>

                {/* Match Score and Save Button */}
                <div className="ml-2 flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <IconButton
                        variant={isSaved ? "filled" : "standard"}
                        onClick={(e) => onSave(recommendation.id, e)}
                    >
                        <Star size={18} className={isSaved ? 'fill-current' : ''} />
                    </IconButton>

                    <Chip
                        variant="assist"
                        label={`${recommendation.matchScore}%`}
                        className="text-xs"
                    />
                </div>
            </div>

            {/* Expandable Content */}
            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                    {/* Tags Row */}
                    <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                        <Chip
                            variant="suggestion"
                            label={recommendation.mood}
                        />

                        {recommendation.duration && (
                            <Chip
                                variant="suggestion"
                                label={recommendation.duration}
                            />
                        )}

                        {recommendation.difficulty && (
                            <Chip
                                variant="suggestion"
                                label={recommendation.difficulty}
                            />
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-sm mb-3 sm:mb-4" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                        {recommendation.description}
                    </p>

                    {/* AI Reason */}
                    {recommendation.aiReason && (
                        <Card variant="filled" className="mb-3 sm:mb-4 p-3">
                            <div className="flex items-start">
                                <Sparkles size={16} style={{ color: 'var(--md-sys-color-primary)' }} className="mt-0.5 mr-2 flex-shrink-0" />
                                <p className="text-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                                    {recommendation.aiReason}
                                </p>
                            </div>
                        </Card>
                    )}

                    {/* Action Button */}
                    {recommendation.link && (
                        <Button
                            variant="filled"
                            className="w-full"
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(recommendation.link, '_blank');
                            }}
                            hasIcon
                        >
                            {styles.action}
                            <ExternalLink size={16} />
                        </Button>
                    )}
                </div>
            </div>

            {/* Card Footer */}
            <div className="px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between" style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)' }}>
                <div className="flex items-center">
                    <div
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center mr-2"
                        style={{ backgroundColor: styles.color }}
                    >
                        <div className="text-white text-xs sm:text-sm" style={{ transform: 'scale(0.8)' }}>
                            {styles.icon}
                        </div>
                    </div>

                    <span className="text-xs sm:text-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                        {isExpanded ? 'Tap to collapse' : 'Tap to learn more'}
                    </span>
                </div>

                <ChevronRight
                    size={18}
                    className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
                    style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                />
            </div>
        </Card>
    );
}