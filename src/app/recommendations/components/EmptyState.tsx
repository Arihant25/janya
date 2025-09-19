'use client';

import { Calendar, ArrowLeft } from 'lucide-react';

export default function EmptyState() {
    return (
        <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--md-sys-color-background, #f9fafb)' }}>
            <div className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100">
                <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full"
                    style={{ background: 'var(--janya-soft-gradient, linear-gradient(135deg, #673AB7, #9C27B0)' }}>
                    <Calendar size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center" style={{ color: 'var(--janya-text-primary, #1f2937)' }}>
                    Your journal awaits today's story
                </h3>
                <p className="mb-8 text-center" style={{ color: 'var(--janya-text-secondary, #4b5563)' }}>
                    Write your first journal entry today to unlock personalized recommendations tailored just for you.
                </p>
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center gap-2 w-full py-4 rounded-xl text-white font-bold transition-transform active:scale-95"
                        style={{ background: 'var(--janya-primary, #673AB7)' }}
                    >
                        <ArrowLeft size={20} />
                        Go to Journal
                    </button>
                    <div className="text-center mt-2">
                        <p className="text-sm text-gray-500">
                            Your recommendations will appear here once you've journaled about your day
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
