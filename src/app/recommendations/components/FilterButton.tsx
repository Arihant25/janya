'use client';

interface FilterButtonProps {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    count: number;
}

export default function FilterButton({ active, onClick, icon, label, count }: FilterButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 min-w-20 ${active ? 'scale-105' : 'scale-100'
                }`}
            style={{
                backgroundColor: active ? 'var(--filter-active-bg, var(--md-sys-color-primary-container))' : 'var(--filter-inactive-bg, white)',
                color: active ? 'var(--filter-active-text, var(--md-sys-color-on-primary-container))' : 'var(--filter-inactive-text, var(--janya-text-secondary))',
                boxShadow: active ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: active ? 'var(--janya-primary)' : 'var(--janya-border, #e5e7eb)',
                transition: 'var(--transition-normal)'
            }}
        >
            {active && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
            )}
            <div className="text-2xl">
                {icon}
            </div>
            <span className="text-sm font-bold">{label}</span>
            <span className="absolute -bottom-2 px-2 py-0.5 rounded-full text-xs font-bold bg-white border border-gray-200 shadow-sm">{count}</span>
        </button>
    );
}
