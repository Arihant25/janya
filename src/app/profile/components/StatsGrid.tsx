'use client';

import { BookOpen, Calendar, TrendingUp, Target, Award, Flame, Clock, Hash } from 'lucide-react';

interface StatItemProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
    gradient: string;
    trend?: string;
    subtitle?: string;
}

const StatItem = ({ icon: Icon, label, value, gradient, trend, subtitle }: StatItemProps) => (
    <div className="relative overflow-hidden rounded-2xl p-4 bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
        <div
            className="absolute inset-0 opacity-5"
            style={{ background: gradient }}
        />
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
                <div
                    className="p-2 rounded-xl"
                    style={{ background: gradient + '20' }}
                >
                    <Icon size={20} style={{ color: 'var(--janya-primary)' }} />
                </div>
                {trend && (
                    <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                        {trend}
                    </span>
                )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
            <p className="text-sm text-gray-600">{label}</p>
            {subtitle && (
                <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
        </div>
    </div>
);

interface StatsGridProps {
    stats: {
        totalEntries: number;
        currentStreak: number;
        longestStreak: number;
        totalWords?: number;
        favoriteThemes?: string[];
        weeklyAverage?: number;
    };
}

export default function StatsGrid({ stats }: StatsGridProps) {
    return (
        <div className="px-4 py-4">
            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <StatItem
                    icon={BookOpen}
                    label="Total Entries"
                    value={stats.totalEntries}
                    gradient="var(--janya-warm-gradient)"
                    trend={stats.totalEntries > 0 ? `+${Math.ceil(stats.totalEntries / 7)} this week` : undefined}
                    subtitle="Keep writing!"
                />
                <StatItem
                    icon={Flame}
                    label="Current Streak"
                    value={`${stats.currentStreak} days`}
                    gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                    trend={stats.currentStreak > 3 ? "On fire!" : undefined}
                    subtitle={stats.currentStreak > 0 ? "Amazing!" : "Start today!"}
                />
                <StatItem
                    icon={Award}
                    label="Best Streak"
                    value={`${stats.longestStreak} days`}
                    gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
                    subtitle="Personal record"
                />
                <StatItem
                    icon={TrendingUp}
                    label="Weekly Avg"
                    value={stats.weeklyAverage || Math.ceil(stats.totalEntries / 4)}
                    gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                    subtitle="entries per week"
                />
            </div>

            {/* Detailed Stats */}
            <div className="space-y-4">
                {/* Words Section */}
                {stats.totalWords && (
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800">Writing Progress</h4>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalWords.toLocaleString()}</p>
                                <p className="text-sm text-gray-500">words written • ~{Math.ceil(stats.totalWords / 250)} pages</p>
                            </div>
                            <div
                                className="w-16 h-16 rounded-full flex items-center justify-center"
                                style={{ background: 'var(--janya-soft-gradient)' }}
                            >
                                <Hash size={24} className="text-white" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Journal Insights */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Journal Insights</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-xl">
                            <Clock size={20} className="mx-auto mb-2 text-blue-600" />
                            <p className="text-sm text-blue-600 font-medium">Avg Time</p>
                            <p className="text-lg font-bold text-blue-700">12 min</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-xl">
                            <Target size={20} className="mx-auto mb-2 text-purple-600" />
                            <p className="text-sm text-purple-600 font-medium">Goal Progress</p>
                            <p className="text-lg font-bold text-purple-700">75%</p>
                        </div>
                    </div>
                </div>

                {/* Favorite Themes */}
                {stats.favoriteThemes && stats.favoriteThemes.length > 0 && (
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Favorite Themes</h4>
                        <div className="flex flex-wrap gap-2">
                            {stats.favoriteThemes.map((theme, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                                >
                                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
