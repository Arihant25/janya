'use client';

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    count: number;
    color: string;
}

export default function TabButton({ active, onClick, icon, label, count, color }: TabButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-all duration-200 relative ${active ? 'scale-105' : 'opacity-70'
                }`}
        >
            <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${active ? 'animate-pulse-slow' : ''
                    }`}
                style={{
                    backgroundColor: active ? `${color}15` : 'transparent',
                    color: active ? color : 'gray'
                }}
            >
                {icon}
            </div>

            <span className="text-xs font-medium" style={{
                color: active ? color : 'gray',
                fontWeight: active ? '600' : '400'
            }}>
                {label}
            </span>

            {count > 0 && active && (
                <div
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                    style={{
                        backgroundColor: color,
                        transform: 'scale(1)',
                        transition: 'transform 0.2s ease, opacity 0.2s ease'
                    }}
                >
                    {count}
                </div>
            )}
        </button>
    );
}
