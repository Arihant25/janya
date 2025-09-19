'use client';

import { Award, Lock } from 'lucide-react';

interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    progress?: number;
    maxProgress?: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementsGridProps {
    achievements: Achievement[];
}

const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
    const rarityColors = {
        common: 'from-gray-100 to-gray-200 border-gray-300',
        rare: 'from-blue-100 to-blue-200 border-blue-300',
        epic: 'from-purple-100 to-purple-200 border-purple-300',
        legendary: 'from-yellow-100 to-yellow-200 border-yellow-300'
    };

    const rarityGlow = {
        common: 'shadow-sm',
        rare: 'shadow-blue-200',
        epic: 'shadow-purple-200',
        legendary: 'shadow-yellow-200'
    };

    return (
        <div
            className={`relative p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${achievement.unlocked
                ? `bg-gradient-to-br ${rarityColors[achievement.rarity]} ${rarityGlow[achievement.rarity]} shadow-lg`
                : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
        >
            {!achievement.unlocked && (
                <div className="absolute inset-0 bg-gray-100/50 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Lock size={24} className="text-gray-400" />
                </div>
            )}

            <div className="text-center">
                <div className="text-3xl mb-2">{achievement.unlocked ? achievement.icon : '🔒'}</div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{achievement.name}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{achievement.description}</p>

                {achievement.progress !== undefined && achievement.maxProgress && (
                    <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {achievement.progress}/{achievement.maxProgress}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function AchievementsGrid({ achievements }: AchievementsGridProps) {
    const unlockedCount = achievements.filter(a => a.unlocked).length;

    return (
        <div className="px-4 py-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Achievements</h2>
                    <div className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-full">
                        <Award size={16} className="text-purple-600" />
                        <span className="text-sm font-medium text-purple-600">
                            {unlockedCount}/{achievements.length}
                        </span>
                    </div>
                </div>

                {achievements.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                        {achievements.map((achievement) => (
                            <AchievementCard key={achievement.id} achievement={achievement} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <Award size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No achievements yet</h3>
                        <p className="text-gray-500 text-sm">Keep journaling to unlock achievements!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
