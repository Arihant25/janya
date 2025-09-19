'use client';

// ...existing imports...

interface MoodSelectorProps {
    selectedMood: string;
    onMoodChange: (mood: string) => void;
}

export default function MoodSelector({ selectedMood, onMoodChange }: MoodSelectorProps) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">😊</span>
                How are you feeling?
                <span className="text-sm font-normal text-gray-500">(optional)</span>
            </h3>

            {/* ...existing mood options code... */}
        </div>
    );
}
