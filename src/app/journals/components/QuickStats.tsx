'use client';

import { BookOpen, Calendar, TrendingUp, Target } from 'lucide-react';

interface StatItemProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
    gradient: string;
    trend?: string;
}

const StatItem = ({ icon: Icon, label, value, gradient, trend }: StatItemProps) => (
    <div className="relative overflow-hidden rounded-2xl p-4 bg-white shadow-sm border border-gray-100">
        <div
            className="absolute inset-0 opacity-5"
            style={{ background: gradient }}
        />
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
                <div
                    className="p-2 rounded-xl"
                    style={{ background: gradient + '20' }}
                >
                    <Icon size={20} style={{ color: 'var(--janya-primary)' }} />
                </div>
                {trend && (
                    <span className="text-xs text-green-600 font-medium">
                        {trend}
                    </span>
                )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            <p className="text-sm text-gray-600">{label}</p>
        </div>
    </div>
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
                    gradient="var(--janya-warm-gradient)"
                    trend={totalEntries > 0 ? "+2 this week" : undefined}
                />
                <StatItem
                    icon={Calendar}
                    label="Current Streak"
                    value={`${currentStreak} days`}
                    gradient="var(--janya-soft-gradient)"
                    trend={currentStreak > 3 ? "On fire!" : undefined}
                />
                <StatItem
                    icon={TrendingUp}
                    label="Total Words"
                    value={totalWords.toLocaleString()}
                    gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                />
                <StatItem
                    icon={Target}
                    label="Avg per Entry"
                    value={avgWordsPerEntry}
                    gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
                />
            </div>
        </div>
    );
}
