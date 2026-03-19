import React from 'react';

interface DataPairRowProps {
    label: string;
    value: React.ReactNode;
    className?: string;
}

export function DataPairRow({
    label,
    value,
    className = '',
}: DataPairRowProps) {
    return (
        <div className={`flex justify-between items-center border-b border-border-default pb-2 ${className}`}>
            <span className="text-text-secondary">{label}</span>
            <span className="text-text-primary font-medium text-right">{value}</span>
        </div>
    );
}

interface DataPointCardProps {
    label: string;
    value: React.ReactNode;
    centered?: boolean;
    className?: string;
}

export function DataPointCard({
    label,
    value,
    centered = false,
    className = '',
}: DataPointCardProps) {
    return (
        <div className={`bg-bg-surface2 p-3 rounded-lg border border-border-default ${centered ? 'text-center' : ''} ${className}`}>
            <span className="block text-text-secondary text-[12px] mb-1">{label}</span>
            <span className="font-medium text-text-primary leading-tight">{value}</span>
        </div>
    );
}

interface TagChipProps {
    children: React.ReactNode;
    rounded?: 'md' | 'full';
    className?: string;
}

export function TagChip({
    children,
    rounded = 'md',
    className = '',
}: TagChipProps) {
    return (
        <span
            className={`bg-bg-surface2 text-text-primary border text-[13px] ${rounded === 'full'
                ? 'px-3 py-1.5 rounded-full border-border-default shadow-sm'
                : 'px-2 py-1 rounded-md border-border-hover'
                } ${className}`}
        >
            {children}
        </span>
    );
}
