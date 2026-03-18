import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
    const sizeStyles = {
        sm: 'w-4 h-4 border-2',
        md: 'w-6 h-6 border-2',
        lg: 'w-8 h-8 border-[3px]',
    };

    return (
        <div
            className={`rounded-full border-accent border-t-transparent animate-spin ${sizeStyles[size]} ${className}`}
            role="status"
            aria-label="Loading"
        />
    );
}

type SkeletonProps = React.ComponentProps<'div'>;

export function Skeleton({ className = '', ...props }: SkeletonProps) {
    return (
        <div className={`bg-bg-surface2 rounded-[8px] animate-pulse ${className}`} {...props} />
    );
}

interface SkeletonCardProps {
    lines?: number;
    className?: string;
}

export function SkeletonCard({ lines = 3, className = '' }: SkeletonCardProps) {
    return (
        <div className={`bg-bg-surface1 border border-border-default rounded-[16px] p-6 flex flex-col gap-3 ${className}`}>
            <Skeleton className="h-5 w-[60%]" />
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={`h-4 ${i === lines - 1 ? 'w-[40%]' : i === lines - 2 ? 'w-[80%]' : 'w-full'}`}
                />
            ))}
        </div>
    );
}
