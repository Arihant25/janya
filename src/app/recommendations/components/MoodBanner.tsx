'use client';

interface MoodAnalysis {
    primary: string;
    sentiment: 'positive' | 'negative' | 'neutral';
}

interface MoodBannerProps {
    moodAnalysis: MoodAnalysis;
    todaysEntries: any[];
}

export default function MoodBanner({ moodAnalysis, todaysEntries }: MoodBannerProps) {
    // Remove this component since we've integrated it directly into the main page
    // The mood banner is now part of the main recommendations page
    return null;
}
return 'Keep shining bright!';
        } else if (moodAnalysis.primary === 'anxious' || moodAnalysis.primary === 'stressed') {
    return 'Let\'s find your calm';
} else {
    return 'Embrace your journey today';
}
    };

const getIcon = () => {
    if (moodAnalysis.sentiment === 'positive') return <Trophy size={22} />;
    if (moodAnalysis.sentiment === 'negative') return <Heart size={22} />;
    return <Lightbulb size={22} />;
};

const getDecorative = () => {
    if (moodAnalysis.sentiment === 'positive') return '✨';
    if (moodAnalysis.sentiment === 'negative') return '💙';
    return '🌱';
};

return (
    <div
        className="rounded-2xl p-5 text-white mb-5 relative overflow-hidden"
        style={{
            background: 'var(--janya-warm-gradient, linear-gradient(135deg, #9C27B0, #673AB7))',
            boxShadow: 'var(--shadow-md)'
        }}
    >
        <div className="flex items-center gap-3 relative z-10">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                {getIcon()}
            </div>
            <div>
                <p className="font-bold text-lg">
                    {getTitle()}
                </p>
                <p className="text-sm opacity-90">
                    Feeling {moodAnalysis.primary} • {todaysEntries.length} journal entries
                </p>
            </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-6 -bottom-6 text-7xl opacity-10 rotate-12">
            {getDecorative()}
        </div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mt-10 -mr-10"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -mb-8 -ml-8"></div>
    </div>
);
}
