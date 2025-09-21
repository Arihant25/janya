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
