import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import MascotLoader from '../studio/MascotLoader';
import type { CompareError } from './types';

interface CompareAnalyzingProps {
    error: CompareError | null;
    onRetry: () => void;
    onCancel: () => void;
}

export default function CompareAnalyzing({
    error,
    onRetry,
    onCancel,
}: CompareAnalyzingProps) {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        if (error) return;
        const interval = setInterval(() => {
            setElapsed((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [error]);

    // ── Error state ──
    if (error) {
        return (
            <div className="pt-8">
                <div className="max-w-[480px] mx-auto flex flex-col items-center text-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-error" />
                    </div>

                    <div>
                        <h2 className="text-[20px] font-bold text-text-primary mb-2">
                            Analysis Failed
                        </h2>
                        <p className="text-[14px] text-text-secondary leading-relaxed">
                            {error.message}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <button
                            onClick={onRetry}
                            className="ai-gradient text-white px-6 py-2.5 rounded-lg text-[14px] font-medium hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
                        >
                            Retry
                        </button>
                        {error.type === 'api' && error.message.includes('API key') && (
                            <button
                                onClick={() => {
                                    onCancel();
                                    document.dispatchEvent(new CustomEvent('open-settings'));
                                }}
                                className="text-text-secondary hover:text-text-primary px-5 py-2.5 rounded-lg text-[14px] font-medium border border-border-default hover:bg-bg-surface2 transition-colors focus-visible:ring-2 focus-visible:ring-accent"
                            >
                                Change API Key
                            </button>
                        )}
                        <button
                            onClick={onCancel}
                            className="text-text-secondary hover:text-text-primary px-5 py-2.5 rounded-lg text-[14px] font-medium focus-visible:ring-2 focus-visible:ring-accent"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── Analyzing state (mascot GIF) ──
    return (
        <div className="pt-8">
            <div className="max-w-[480px] mx-auto flex flex-col items-center text-center gap-6">
                <MascotLoader size={160} />

                <div>
                    <p className="text-[16px] font-medium text-text-primary mb-1">
                        Discovering what makes your designs special…
                    </p>
                    <p className="text-[13px] text-text-tertiary">
                        {elapsed}s elapsed
                    </p>
                </div>

                <button
                    onClick={onCancel}
                    className="text-[14px] text-text-tertiary hover:text-text-secondary hover:underline transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
