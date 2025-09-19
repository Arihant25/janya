'use client';

import { Loader2 } from 'lucide-react';

export default function LoadingScreen() {
    return (
        <div className="min-h-screen flex items-center justify-center"
            style={{ backgroundColor: 'var(--md-sys-color-background, #f9fafb)' }}>
            <div className="text-center p-6 max-w-sm">
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full"
                    style={{ background: 'var(--janya-warm-gradient, linear-gradient(135deg, #9C27B0, #673AB7))' }}>
                    <Loader2 size={32} className="text-white animate-spin" />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--janya-text-primary, #1f2937)' }}>
                    Creating your daily magic...
                </h3>
                <p style={{ color: 'var(--janya-text-secondary, #4b5563)' }}>
                    Analyzing your journal entries to find perfect recommendations just for you
                </p>
                <div className="mt-6 flex justify-center">
                    <div className="w-full max-w-xs bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-600 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
