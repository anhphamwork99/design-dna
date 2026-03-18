import { Home, ChevronRight } from 'lucide-react';

interface StudioTopBarProps {
    goalLabel: string;
    onExit: () => void;
    onBackToGoals?: () => void;
}

export default function StudioTopBar({ goalLabel, onExit, onBackToGoals }: StudioTopBarProps) {
    return (
        <div className="flex items-center gap-3 px-5 py-3 border-b border-border-default/50 bg-bg-base/80 backdrop-blur-sm flex-shrink-0">
            {/* Home exit button */}
            <button
                onClick={onExit}
                className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Go to Home"
                title="Go to Home"
            >
                <Home className="w-4 h-4" />
            </button>

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-[13px]">
                {onBackToGoals ? (
                    <button
                        onClick={onBackToGoals}
                        className="text-text-tertiary hover:text-text-primary transition-colors"
                    >
                        Studio
                    </button>
                ) : (
                    <span className="text-text-tertiary">Studio</span>
                )}
                <ChevronRight className="w-3 h-3 text-text-tertiary" />
                <span className="text-text-primary font-medium">{goalLabel}</span>
            </nav>
        </div>
    );
}
