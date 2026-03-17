import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    className = '',
}: EmptyStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}>
            <div className="w-12 h-12 rounded-[12px] bg-bg-surface2 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-text-tertiary" />
            </div>
            <h3 className="text-[16px] font-semibold text-text-primary mb-1">{title}</h3>
            <p className="text-[14px] text-text-secondary max-w-[360px] mb-5">{description}</p>
            {actionLabel && onAction && (
                <Button variant="primary" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
