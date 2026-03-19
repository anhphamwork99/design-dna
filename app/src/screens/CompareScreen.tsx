import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { CompareUpload, CompareAnalyzing, CompareResults } from '../compare';
import type { Step, CompareImage, CompareError } from '../compare';
import { analyzeBatch } from '../apiClient';
import { useAuth } from '../contexts/AuthContext';

export default function CompareScreen() {
    const { session } = useAuth();
    const navigate = useNavigate();

    // ── State machine ──
    const [step, setStep] = useState<Step>('upload');
    const [compareImages, setCompareImages] = useState<CompareImage[]>([]);
    const [compareResult, setCompareResult] = useState<any>(null);
    const [error, setError] = useState<CompareError | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // ── Page title ──
    useEffect(() => {
        const titles: Record<Step, string> = {
            upload: 'DesignDNA — Compare',
            analyzing: 'DesignDNA — Comparing…',
            results: 'DesignDNA — Compare Results',
        };
        document.title = titles[step];
    }, [step]);

    // ── Handlers ──

    const handleCompareAnalyze = async () => {
        if (compareImages.length < 2 || !session) return;

        const token = session.access_token;
        setStep('analyzing');
        setError(null);

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        try {
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('timeout')), 60000);
            });

            const result = await Promise.race([
                analyzeBatch(token, compareImages),
                timeoutPromise,
            ]);

            if (abortController.signal.aborted) return;

            setCompareResult(result);
            setStep('results');
        } catch (err: any) {
            if (abortController.signal.aborted) return;

            console.error(err);
            const errMsg = err?.message || String(err);

            // NO_API_KEY → auto-open Settings
            if (errMsg.includes('NO_API_KEY') || errMsg.includes('No API key')) {
                document.dispatchEvent(new CustomEvent('open-settings'));
                setStep('upload');
                return;
            }

            let errorType = 'network';
            let errorMessage =
                'Could not reach the Gemini API. Check your internet connection and try again.';

            if (errMsg === 'timeout') {
                errorType = 'timeout';
                errorMessage = 'The analysis took too long. Please try again.';
            } else if (
                errMsg.includes('location is not supported') ||
                errMsg.includes('FAILED_PRECONDITION')
            ) {
                errorType = 'api';
                errorMessage =
                    'Your location is not supported by Gemini API. Try turning off VPN or switching to a US/EU server.';
            } else if (errMsg.includes('400')) {
                errorType = 'api';
                errorMessage =
                    'Invalid request. The images may be too large or in an unsupported format.';
            } else if (
                errMsg.includes('403') ||
                errMsg.includes('API key not valid')
            ) {
                errorType = 'api';
                errorMessage =
                    'Invalid API key. Please check your key in Settings.';
            } else if (
                errMsg.includes('429') ||
                errMsg.includes('quota')
            ) {
                errorType = 'api';
                errorMessage =
                    'Rate limit exceeded. Please wait a moment and try again.';
            } else if (
                errMsg.includes('50') ||
                errMsg.includes('unavailable')
            ) {
                errorType = 'api';
                errorMessage =
                    'Gemini API is temporarily unavailable. Please try again later.';
            } else if (
                errMsg.includes('JSON') ||
                errMsg.includes('parse') ||
                errMsg.includes('SyntaxError')
            ) {
                errorType = 'parse';
                errorMessage =
                    'Received an unexpected response format. Please try again.';
            }

            setError({ type: errorType, message: errorMessage });
            setStep('upload');
        }
    };

    const handleCancelAnalysis = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setStep('upload');
    };

    const handleNewComparison = () => {
        // No confirm dialog (LOCKED decision)
        setCompareImages([]);
        setCompareResult(null);
        setError(null);
        setStep('upload');
    };

    // ── Render ──
    return (
        <div>
            {/* Back breadcrumb — shown on upload step only */}
            {step === 'upload' && (
                <div className="pt-6 pb-2 max-w-[960px] mx-auto">
                    <button
                        onClick={() => navigate('/pattern')}
                        className="flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Patterns
                    </button>
                </div>
            )}

            <AnimatePresence mode="wait">
                {step === 'upload' && (
                    <CompareUpload
                        key="upload"
                        images={compareImages}
                        onImagesChange={setCompareImages}
                        onAnalyze={handleCompareAnalyze}
                        error={error}
                        onDismissError={() => setError(null)}
                    />
                )}

                {step === 'analyzing' && (
                    <CompareAnalyzing
                        key="analyzing"
                        error={error}
                        onRetry={handleCompareAnalyze}
                        onCancel={handleCancelAnalysis}
                    />
                )}

                {step === 'results' && (
                    <CompareResults
                        key="results"
                        images={compareImages}
                        compareResult={compareResult}
                        onNewComparison={handleNewComparison}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
