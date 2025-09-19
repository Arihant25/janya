'use client';

import { Bell, BarChart3, FileText, Smartphone } from 'lucide-react';

interface PreferencesCardProps {
    preferences: {
        journalReminders?: boolean;
        dailyInsights?: boolean;
        weeklyReports?: boolean;
        pushNotifications?: boolean;
    };
    onPreferenceChange: (key: string, value: boolean) => void;
}

const PreferenceToggle = ({
    icon: Icon,
    title,
    description,
    checked,
    onChange
}: {
    icon: React.ElementType;
    title: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
                <Icon size={18} className="text-gray-600" />
            </div>
            <div>
                <h4 className="font-medium text-gray-900">{title}</h4>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
        </label>
    </div>
);

export default function PreferencesCard({ preferences, onPreferenceChange }: PreferencesCardProps) {
    return (
        <div className="px-4 py-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Preferences</h2>

                <div className="space-y-4">
                    <PreferenceToggle
                        icon={Bell}
                        title="Journal Reminders"
                        description="Get notified to write daily"
                        checked={preferences.journalReminders || false}
                        onChange={(checked) => onPreferenceChange('journalReminders', checked)}
                    />

                    <PreferenceToggle
                        icon={BarChart3}
                        title="Daily Insights"
                        description="Receive mood analysis summaries"
                        checked={preferences.dailyInsights || false}
                        onChange={(checked) => onPreferenceChange('dailyInsights', checked)}
                    />

                    <PreferenceToggle
                        icon={FileText}
                        title="Weekly Reports"
                        description="Get weekly progress reports"
                        checked={preferences.weeklyReports || false}
                        onChange={(checked) => onPreferenceChange('weeklyReports', checked)}
                    />

                    <PreferenceToggle
                        icon={Smartphone}
                        title="Push Notifications"
                        description="Enable app notifications"
                        checked={preferences.pushNotifications || false}
                        onChange={(checked) => onPreferenceChange('pushNotifications', checked)}
                    />
                </div>
            </div>
        </div>
    );
}
