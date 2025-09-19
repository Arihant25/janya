'use client';

import { Plus } from 'lucide-react';

interface CreateButtonProps {
    onClick: () => void;
}

export default function CreateButton({ onClick }: CreateButtonProps) {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-20 right-6 z-30 w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
                background: 'var(--janya-warm-gradient)',
                boxShadow: '0 8px 32px rgba(0, 139, 139, 0.3)'
            }}
        >
            <Plus size={24} className="text-white mx-auto" />
        </button>
    );
}
