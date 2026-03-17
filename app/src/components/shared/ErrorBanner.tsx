import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

interface ErrorBannerProps {
    message: string;
    title?: string;
    onRetry?: () => void;
    onDismiss?: () => void;
    className?: string;
}

export function ErrorBanner({
    message,
    title = 'Something went wrong',
    onRetry,
    onDismiss,
    className = '',
}: ErrorBannerProps) {
    return (
        <div className={`bg-bg-surface1 border-l-4 border-l-error rounded-[12px] p-4 flex items-start gap-3 ${className}`}>
            <AlertTriangle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
                <h4 className="text-[14px] font-semibold text-text-primary mb-0.5">{title}</h4>
                <p className="text-[13px] text-text-secondary">{message}</p>
                {onRetry && (
                    <div className="mt-3">
                        <Button variant="primary" size="sm" onClick={onRetry}>
                            Retry
                        </Button>
                    </div>
                )}
            </div>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="text-text-tertiary hover:text-text-primary transition-colors p-1 rounded-full hover:bg-state-hover flex-shrink-0"
                    aria-label="Dismiss error"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
