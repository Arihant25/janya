'use client';

import { BookOpen, Calendar, TrendingUp, Target } from 'lucide-react';
import { Card } from '@/app/components/MaterialComponents';

interface StatItemProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
    color: string;
    trend?: string;
}

const StatItem = ({ icon: Icon, label, value, color, trend }: StatItemProps) => (
    <Card className="p-4">
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
                <div
                    className="p-2 rounded-xl"
                    style={{ backgroundColor: color + '20' }}
                >
                    <Icon size={20} style={{ color: color }} />
                </div>
                {trend && (
                    <span className="text-xs font-medium" style={{ color: 'var(--janya-secondary)' }}>
                        {trend}
                    </span>
                )}
            </div>
            <h3 className="text-2xl font-bold" style={{ color: 'var(--janya-text-primary)' }}>{value}</h3>
            <p className="text-sm" style={{ color: 'var(--janya-text-secondary)' }}>{label}</p>
        </div>
    </Card>
);

interface QuickStatsProps {
    totalEntries: number;
    currentStreak: number;
    totalWords: number;
    avgWordsPerEntry: number;
}

export default function QuickStats({
    totalEntries,
    currentStreak,
    totalWords,
    avgWordsPerEntry
}: QuickStatsProps) {
    return (
        <div className="px-4 pb-6">
            <div className="grid grid-cols-2 gap-4">
                <StatItem
                    icon={BookOpen}
                    label="Total Entries"
                    value={totalEntries}
                    color="var(--janya-primary)"
                    trend={totalEntries > 0 ? "+2 this week" : undefined}
                />
                <StatItem
                    icon={Calendar}
                    label="Current Streak"
                    value={`${currentStreak} days`}
                    color="var(--janya-secondary)"
                    trend={currentStreak > 3 ? "On fire!" : undefined}
                />
                <StatItem
                    icon={TrendingUp}
                    label="Total Words"
                    value={totalWords.toLocaleString()}
                    color="var(--janya-accent)"
                />
                <StatItem
                    icon={Target}
                    label="Avg per Entry"
                    value={avgWordsPerEntry}
                    color="var(--md-sys-color-tertiary)"
                />
            </div>
        </div>
    );
}
