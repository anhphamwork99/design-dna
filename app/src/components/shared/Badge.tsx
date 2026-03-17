import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'accent' | 'success' | 'warning' | 'error';
    className?: string;
}

export function Badge({
    children,
    variant = 'default',
    className = '',
}: BadgeProps) {
    const variantStyles = {
        default: 'bg-bg-surface2 text-text-secondary border border-border-default',
        accent: 'bg-accent-subtle text-accent',
        success: 'bg-success-subtle text-success',
        warning: 'bg-warning-subtle text-warning',
        error: 'bg-error-subtle text-error',
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium ${variantStyles[variant]} ${className}`}
        >
            {children}
        </span>
    );
}
