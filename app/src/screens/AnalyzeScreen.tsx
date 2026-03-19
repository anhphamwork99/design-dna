import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ImageOff, Copy, Check, ArrowLeft, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeDesign, saveAnalysis } from '../apiClient';
import { generateThumbnail } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/shared';
import { AnalyzeUploadStep } from './analyze/AnalyzeUploadStep';
import { AnalyzeLoadingStep } from './analyze/AnalyzeLoadingStep';
import { AnalyzeGoToStudioButton } from './analyze/AnalyzeGoToStudioButton';
import { AnalyzeBuyerTab } from './analyze/AnalyzeBuyerTab';
import { AnalyzeVisualTab } from './analyze/AnalyzeVisualTab';
import MyAnalysesScreen from './MyAnalysesScreen';
import { invalidateAnalysesCache } from './MyAnalysesScreen';
import ViewAnalysisScreen from './ViewAnalysisScreen';
import type { AnalyzeImage, AnalyzeError } from './analyze/types';

// ── Nested Route Shell ─────────────────────────────────────────────

export default function AnalyzeScreen() {
    return (
        <Routes>
            <Route index element={<AnalyzeListView />} />
            <Route path="new" element={<AnalyzeNewFlow />} />
            <Route path=":id" element={<ViewAnalysisScreen />} />
        </Routes>
    );
}

// ── Analyze List View ──────────────────────────────────────────────
// Wraps MyAnalysesScreen + "New Analysis" CTA header

function AnalyzeListView() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showSavedToast, setShowSavedToast] = useState(false);

    useEffect(() => {
        document.title = 'DesignDNA — Analyze';
    }, []);

    // Show toast if navigated back after saving
    useEffect(() => {
        if ((location.state as any)?.saved) {
            setShowSavedToast(true);
            const timer = setTimeout(() => setShowSavedToast(false), 3000);
            // Clear state so refreshing doesn't re-trigger
            window.history.replaceState({}, '');
            return () => clearTimeout(timer);
        }
    }, [location.state]);

    return (
        <div className="max-w-[960px] mx-auto">
            {/* Title + CTA — same row */}
            <div className="flex items-center justify-between pt-8 mb-6">
                <div>
                    <h1 className="text-[32px] font-bold tracking-tight mb-1">Deep Analyses</h1>
                </div>
                <Button
                    variant="accent"
                    onClick={() => navigate('/analyze/new')}
                    className="flex items-center gap-2 flex-shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    New Analysis
                </Button>
            </div>
            <MyAnalysesScreen hideTitle />

            {/* Saved toast */}
            <AnimatePresence>
                {showSavedToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="fixed bottom-6 right-6 bg-bg-surface1 border border-border-default rounded-lg px-4 py-3 shadow-lg flex items-center gap-2 text-[13px] z-50"
                    >
                        <Check className="w-4 h-4 text-success" />
                        <span>Analysis saved</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}


// ── Analyze New Flow ───────────────────────────────────────────────
// The existing 3-step upload → analyzing → results state machine

type Step = 'upload' | 'analyzing' | 'results';

function AnalyzeNewFlow() {
    const navigate = useNavigate();
    const { session } = useAuth();
    const [currentStep, setCurrentStep] = useState<Step>('upload');
    const [uploadedImage, setUploadedImage] = useState<AnalyzeImage | null>(null);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [error, setError] = useState<AnalyzeError | null>(null);
    const [showSavedToast, setShowSavedToast] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        const titles: Record<Step, string> = {
            upload: 'DesignDNA — New Analysis',
            analyzing: 'DesignDNA — Analyzing…',
            results: 'DesignDNA — Results',
        };
        document.title = titles[currentStep];
    }, [currentStep]);

    const handleAnalyze = async () => {
        if (!uploadedImage || !session) return;

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
                analyzeDesign(token, uploadedImage.data, uploadedImage.type),
                timeoutPromise
            ]);

            if (abortController.signal.aborted) return;

            // Auto-save fire-and-forget + show toast on success
            generateThumbnail(uploadedImage.data, 200)
                .then(thumbnail => {
                    saveAnalysis(token, {
                        name: uploadedImage.name,
                        thumbnail,
                        resultJson: result
                    })
                        .then(() => {
                            // Invalidate list cache so /analyze shows new analysis immediately
                            invalidateAnalysesCache();
                            // Show "Analysis saved ✓" toast for 3s
                            setShowSavedToast(true);
                            setTimeout(() => setShowSavedToast(false), 3000);
                        })
                        .catch(err => console.warn('Failed to auto-save analysis:', err));
                })
                .catch(err => console.warn('Failed to generate thumbnail for auto-save:', err));

            setAnalysisResult(result);
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
                errorMessage = 'Invalid request. The image may be too large or in an unsupported format.';
            } else if (errMsg.includes('403') || errMsg.includes('API key not valid')) {
                errorType = 'api';
                errorMessage = 'Invalid API key. Please check your key in Settings.';
            } else if (errMsg.includes('429') || errMsg.includes('quota')) {
                errorType = 'api';
                errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
            } else if (errMsg.includes('50') || errMsg.includes('unavailable')) {
                errorType = 'api';
                errorMessage = 'Gemini API is temporarily unavailable. Please try again later.';
            } else if (errMsg.includes('JSON') || errMsg.includes('parse')) {
                errorType = 'parse';
                errorMessage = 'Received an unexpected response format. Please try again.';
            }

            setError({ type: errorType, message: errorMessage });
        }
    };

    const handleCancelAnalysis = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setCurrentStep('upload');
    };

    return (
        <div>
            {/* Back link */}
            <div className="pt-6 pb-2 max-w-[960px] mx-auto">
                <button
                    onClick={() => navigate('/analyze', { state: analysisResult ? { saved: true } : undefined })}
                    className="flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Analyses
                </button>
            </div>

            <AnimatePresence mode="wait">
                {currentStep === 'analyzing' ? (
                    <motion.div
                        key="analyzing"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="pt-8 mb-24 max-w-[960px] mx-auto"
                    >
                        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                            {/* Left: Image preview */}
                            <div className="w-full md:w-[40%] md:sticky md:top-[80px] self-start">
                                <div className="bg-bg-surface2 p-2 rounded-xl border border-border-default">
                                    {uploadedImage && (
                                        <img src={uploadedImage.data} alt="Analyzing..." className="w-full max-h-[300px] md:max-h-none object-contain rounded-lg" />
                                    )}
                                </div>
                                <p className="mt-4 text-[12px] text-text-secondary truncate" title={uploadedImage?.name}>{uploadedImage?.name}</p>
                            </div>

                            {/* Right: Loading content */}
                            <div className="w-full md:w-[60%] flex flex-col items-center justify-center min-h-[400px]">
                                <AnalyzeLoadingStep
                                    error={error}
                                    onRetry={() => handleAnalyze()}
                                    onCancel={handleCancelAnalysis}
                                />
                            </div>
                        </div>
                    </motion.div>
                ) : currentStep === 'results' ? (
                    <ResultsStep
                        key="results"
                        uploadedImage={uploadedImage}
                        analysisResult={analysisResult}
                        onNavigate={setCurrentStep}
                    />
                ) : (
                    <AnalyzeUploadStep
                        key="upload"
                        uploadedImage={uploadedImage}
                        setUploadedImage={setUploadedImage}
                        onAnalyze={() => handleAnalyze()}
                    />
                )}
            </AnimatePresence>

            {/* Auto-save toast — fixed bottom-right */}
            <AnimatePresence>
                {showSavedToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="fixed bottom-6 right-6 bg-bg-surface1 border border-border-default rounded-lg px-4 py-3 shadow-lg flex items-center gap-2 text-[13px] z-50"
                    >
                        <Check className="w-4 h-4 text-success" />
                        <span>Analysis saved</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}


// ── Results Step ───────────────────────────────────────────────────

function ResultsStep({
    uploadedImage,
    analysisResult,
    onNavigate,
    readMode = false
}: {
    key?: string;
    uploadedImage: { data: string; name: string } | null;
    analysisResult: any;
    onNavigate: (s: Step) => void;
    readMode?: boolean;
}) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'visual' | 'buyer'>('visual');
    const [copied, setCopied] = useState(false);
    const [imagePinned, setImagePinned] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);

    // Mobile thumbnail pin: observe sentinel above the image
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // When sentinel leaves viewport (scrolled past) → pin the image
                setImagePinned(!entry.isIntersecting);
            },
            { threshold: 0, rootMargin: '0px 0px 0px 0px' }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, []);

    const handleCopyDNA = async () => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(analysisResult, null, 2));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    if (!analysisResult) return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-24 flex flex-col items-center text-center gap-4"
        >
            <ImageOff className="w-12 h-12 text-text-tertiary" />
            <h2 className="text-[20px] font-semibold">No Analysis Data</h2>
            <p className="text-[14px] text-text-secondary max-w-[400px]">It looks like there's no analysis to show. Upload a design to get started.</p>
            <Button
                onClick={() => onNavigate('upload')}
                className="mt-2"
            >
                Upload a Design
            </Button>
        </motion.div>
    );

    const visualDNA = analysisResult.visual_dna;
    const buyerDNA = analysisResult.buyer_dna;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pt-8 mb-24 max-w-[960px] mx-auto"
        >
            {/* Mobile pinned thumbnail — only visible on mobile when scrolled past image */}
            <AnimatePresence>
                {imagePinned && uploadedImage && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="md:hidden fixed top-0 left-0 right-0 z-40 bg-bg-base/95 backdrop-blur-sm border-b border-border-default px-4 py-2 flex items-center gap-3"
                    >
                        <img
                            src={uploadedImage.data}
                            alt="Design thumbnail"
                            className="h-10 w-10 object-cover rounded-md flex-shrink-0 border border-border-default"
                        />
                        <span className="text-[13px] text-text-secondary truncate">{uploadedImage.name}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sentinel: observe this to know when user scrolled past the image area */}
            <div ref={sentinelRef} className="md:hidden h-px" aria-hidden="true" />

            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                <div className="w-full md:w-[40%] md:sticky md:top-8 self-start">
                    <div className="bg-bg-surface2 p-2 rounded-xl border border-border-default">
                        {uploadedImage && (
                            <img src={uploadedImage.data} alt="Analyzed design" className="w-full max-h-[300px] md:max-h-none object-contain rounded-lg" />
                        )}
                    </div>
                    <p className="mt-4 text-[12px] text-text-secondary truncate" title={uploadedImage?.name}>{uploadedImage?.name}</p>
                </div>

                <div className="w-full md:w-[60%] flex flex-col gap-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-[32px] font-bold tracking-tight mb-2">Analysis Results</h1>
                            <p className="text-[14px] text-text-secondary">Here is the detailed breakdown of the original design and its target buyers.</p>
                        </div>
                        {/* Copy Analysis — top-right of content column */}
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleCopyDNA}
                            className="flex-shrink-0 mt-1"
                        >
                            {copied ? (
                                <><Check className="w-4 h-4 text-success" /> Copied!</>
                            ) : (
                                <><Copy className="w-4 h-4" /> Copy Analysis</>
                            )}
                        </Button>
                    </div>

                    <div className="flex border-b border-border-default" role="tablist">
                        <button
                            onClick={() => setActiveTab('visual')}
                            className={`py-3 px-5 text-[13px] font-medium uppercase tracking-[0.05em] relative transition-colors duration-150 focus-visible:outline-none rounded-t ${activeTab === 'visual' ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                            role="tab"
                            aria-selected={activeTab === 'visual'}
                        >
                            Design Breakdown
                            {activeTab === 'visual' && (
                                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-text-primary" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('buyer')}
                            className={`py-3 px-5 text-[13px] font-medium uppercase tracking-[0.05em] relative transition-colors duration-150 focus-visible:outline-none rounded-t ${activeTab === 'buyer' ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                            role="tab"
                            aria-selected={activeTab === 'buyer'}
                        >
                            Target Audience
                            {activeTab === 'buyer' && (
                                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-text-primary" />
                            )}
                        </button>
                    </div>

                    <motion.div
                        key={activeTab}
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="flex flex-col gap-10"
                        role="tabpanel"
                    >
                        {activeTab === 'visual' && visualDNA && (
                            <AnalyzeVisualTab visualDNA={visualDNA} itemVariants={itemVariants} />
                        )}

                        {activeTab === 'buyer' && buyerDNA && (
                            <AnalyzeBuyerTab buyerDNA={buyerDNA} itemVariants={itemVariants} />
                        )}

                        <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-border-default justify-end">
                            {!readMode && (
                                <>
                                    <AnalyzeGoToStudioButton
                                        uploadedImage={uploadedImage}
                                        analysisResult={analysisResult}
                                    />
                                    <Button
                                        variant="ghost"
                                        onClick={() => navigate('/analyze', { state: { saved: true } })}
                                    >
                                        <Plus className="w-4 h-4" /> Analyze Another
                                    </Button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
