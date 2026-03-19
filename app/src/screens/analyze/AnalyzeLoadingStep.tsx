import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal, Button } from '../../components/shared';
import MascotLoader from '../../studio/MascotLoader';
import type { AnalyzeError } from './types';

interface AnalyzeLoadingStepProps {
    error: AnalyzeError | null;
    onRetry: () => void;
    onCancel: () => void;
}

const STEPS = [
    { threshold: 0, label: 'Reading design...' },
    { threshold: 25, label: 'Analyzing composition...' },
    { threshold: 50, label: 'Decoding buyer DNA...' },
    { threshold: 75, label: 'Finalizing...' },
];

function getProgress(elapsed: number): number {
    if (elapsed <= 4) {
        // 0-4s → 0→25%
        return Math.floor((elapsed / 4) * 25);
    } else if (elapsed <= 10) {
        // 5-10s → 25→50%
        return Math.floor(25 + ((elapsed - 4) / 6) * 25);
    } else if (elapsed <= 18) {
        // 11-18s → 50→75%
        return Math.floor(50 + ((elapsed - 10) / 8) * 25);
    } else if (elapsed <= 30) {
        // 19-30s → 75→95% (slow crawl)
        return Math.floor(75 + ((elapsed - 18) / 12) * 20);
    }
    return 95;
}

function getStepLabel(percentage: number): string {
    let label = STEPS[0].label;
    for (const step of STEPS) {
        if (percentage >= step.threshold) {
            label = step.label;
        }
    }
    return label;
}

function getErrorTitle(error: AnalyzeError): string {
    switch (error.type) {
        case 'api':
            return 'API Error';
        case 'timeout':
            return 'Request Timed Out';
        case 'network':
            return 'Connection Failed';
        default:
            return 'Analysis Failed';
    }
}

export function AnalyzeLoadingStep({
    error,
    onRetry,
    onCancel,
}: AnalyzeLoadingStepProps) {
    const [elapsed, setElapsed] = useState(0);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    useEffect(() => {
        if (error) return;
        const interval = setInterval(() => {
            setElapsed((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [error]);

    const percentage = getProgress(elapsed);
    const stepLabel = getStepLabel(percentage);
    const canChangeApiKey = error?.type === 'api' && error.message.includes('API key');

    return (
        <div className="flex flex-col items-center w-full">
            {/* Loading Content */}
            <div className="flex flex-col items-center gap-6 w-full max-w-[400px] px-6">
                {/* MascotLoader GIF */}
                <MascotLoader size={120} />

                {/* Step text */}
                <p className="text-[14px] text-text-secondary text-center shimmer-text">
                    {stepLabel}
                </p>

                {/* Energy bar section */}
                <div className="w-full flex flex-col gap-2">
                    {/* Percentage display */}
                    <div className="flex justify-end">
                        <span className="text-[12px] font-medium text-text-primary">
                            {percentage}%
                        </span>
                    </div>

                    {/* Progress bar container */}
                    <div
                        className="w-full rounded-full border border-border-default overflow-hidden"
                        style={{
                            height: '16px',
                            backgroundColor: 'var(--color-bg-surface2)',
                        }}
                    >
                        {/* Energy fill */}
                        <div
                            className="energy-bar-fill h-full rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>

                {/* Cancel button */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCancelConfirm(true)}
                >
                    Cancel
                </Button>
            </div>

            {/* Error Modal Overlay */}
            <Modal
                open={!!error}
                onClose={() => { }}
                title={error ? getErrorTitle(error) : ''}
                width="max-w-[440px]"
            >
                <div className="flex flex-col gap-5">
                    {/* Icon + message */}
                    <div className="flex items-start gap-4">
                        <div
                            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
                        >
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                        </div>
                        <p className="text-[14px] text-text-secondary pt-2 leading-relaxed">
                            {error?.message}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                        <Button variant="primary" size="md" onClick={onRetry} className="w-full">
                            Try Again
                        </Button>
                        {canChangeApiKey && (
                            <Button
                                variant="secondary"
                                size="md"
                                className="w-full"
                                onClick={() => {
                                    document.dispatchEvent(new CustomEvent('open-settings'));
                                    onCancel();
                                }}
                            >
                                Change API Key
                            </Button>
                        )}
                        <Button variant="ghost" size="md" onClick={onCancel} className="w-full">
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Cancel Confirmation Dialog */}
            <Modal
                open={showCancelConfirm}
                onClose={() => setShowCancelConfirm(false)}
                title="Cancel Analysis?"
                width="max-w-[400px]"
            >
                <div className="flex flex-col gap-5">
                    <p className="text-[14px] text-text-secondary leading-relaxed">
                        The analysis is still in progress. Are you sure you want to cancel?
                    </p>
                    <div className="flex flex-col gap-2">
                        <Button variant="primary" size="md" onClick={() => setShowCancelConfirm(false)} className="w-full">
                            Continue Analysis
                        </Button>
                        <Button
                            variant="ghost"
                            size="md"
                            className="w-full text-red-500 hover:text-red-600"
                            onClick={() => {
                                setShowCancelConfirm(false);
                                onCancel();
                            }}
                        >
                            Yes, Cancel
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
