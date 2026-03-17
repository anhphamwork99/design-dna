import { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { CompareUploadScreen, CompareAnalyzingScreen, CompareResultsScreen } from '../CompareScreens';
import { analyzeBatch } from '../apiClient';
import { useAuth } from '../contexts/AuthContext';

type Step = 'upload' | 'analyzing' | 'results';

export default function CompareScreen() {
    const { session } = useAuth();
    const [currentStep, setCurrentStep] = useState<Step>('upload');
    const [compareImages, setCompareImages] = useState<{ data: string; name: string; type: string }[]>([]);
    const [compareResult, setCompareResult] = useState<any>(null);
    const [error, setError] = useState<{ type: string; message: string } | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        const titles: Record<Step, string> = {
            upload: 'DesignDNA — Compare',
            analyzing: 'DesignDNA — Comparing…',
            results: 'DesignDNA — Compare Results',
        };
        document.title = titles[currentStep];
    }, [currentStep]);

    const handleCompareAnalyze = async () => {
        if (compareImages.length < 2 || !session) return;

        const token = session.access_token;
        setCurrentStep('analyzing');
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
                timeoutPromise
            ]);

            if (abortController.signal.aborted) return;

            setCompareResult(result);
            setCurrentStep('results');
        } catch (err: any) {
            if (abortController.signal.aborted) return;

            console.error(err);
            const errMsg = err?.message || String(err);

            // NO_API_KEY → auto-open Settings
            if (errMsg.includes('NO_API_KEY') || errMsg.includes('No API key')) {
                document.dispatchEvent(new CustomEvent('open-settings'));
                setCurrentStep('upload');
                return;
            }

            let errorType = 'network';
            let errorMessage = 'Could not reach the Gemini API. Check your internet connection and try again.';

            if (errMsg === 'timeout') {
                errorType = 'timeout';
                errorMessage = 'The analysis took too long. Please try again.';
            } else if (errMsg.includes('location is not supported') || errMsg.includes('FAILED_PRECONDITION')) {
                errorType = 'api';
                errorMessage = 'Your location is not supported by Gemini API. Try turning off VPN or switching to a US/EU server.';
            } else if (errMsg.includes('400')) {
                errorType = 'api';
                errorMessage = 'Invalid request. The images may be too large or in an unsupported format.';
            } else if (errMsg.includes('403') || errMsg.includes('API key not valid')) {
                errorType = 'api';
                errorMessage = 'Invalid API key. Please check your key in Settings.';
            } else if (errMsg.includes('429') || errMsg.includes('quota')) {
                errorType = 'api';
                errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
            } else if (errMsg.includes('50') || errMsg.includes('unavailable')) {
                errorType = 'api';
                errorMessage = 'Gemini API is temporarily unavailable. Please try again later.';
            } else if (errMsg.includes('JSON') || errMsg.includes('parse') || errMsg.includes('SyntaxError')) {
                errorType = 'parse';
                errorMessage = 'Received an unexpected response format. Please try again.';
            }

            setError({ type: errorType, message: errorMessage });
            setCurrentStep('upload');
        }
    };

    const handleCancelAnalysis = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setCurrentStep('upload');
    };

    // Map local step to Screen type that CompareScreens expects
    const screenMap: Record<Step, string> = {
        upload: 'compare_upload',
        analyzing: 'compare_analyzing',
        results: 'compare_results',
    };

    const handleNavigate = (screen: string) => {
        // Map CompareScreens' Screen type back to our local steps
        if (screen === 'compare_upload' || screen === 'upload') setCurrentStep('upload');
        else if (screen === 'compare_analyzing') setCurrentStep('analyzing');
        else if (screen === 'compare_results') setCurrentStep('results');
    };

    return (
        <AnimatePresence mode="wait">
            {currentStep === 'analyzing' ? (
                <CompareAnalyzingScreen
                    key="compare_analyzing"
                    onNavigate={handleNavigate}
                    error={error}
                    onRetry={handleCompareAnalyze}
                    onCancel={handleCancelAnalysis}
                />
            ) : currentStep === 'results' ? (
                <CompareResultsScreen
                    key="compare_results"
                    onNavigate={handleNavigate}
                    compareImages={compareImages}
                    setCompareImages={setCompareImages}
                    compareResult={compareResult}
                />
            ) : (
                <CompareUploadScreen
                    key="compare_upload"
                    onNavigate={handleNavigate}
                    compareImages={compareImages}
                    setCompareImages={setCompareImages}
                    onAnalyze={handleCompareAnalyze}
                    error={error}
                    onDismissError={() => setError(null)}
                />
            )}
        </AnimatePresence>
    );
}
