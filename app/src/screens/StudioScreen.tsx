import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import type { Stage, StudioGoal } from '../studio/types';
import GoalPicker from '../studio/GoalPicker';
import UploadStage from '../studio/UploadStage';
import AnalyzingStage from '../studio/AnalyzingStage';
import CloneStudio from '../studio/CloneStudio';
import CreativeStudio from '../CreativeStudio';
import { useAuth } from '../contexts/AuthContext';
import { analyzeDesign, cloneDesign } from '../apiClient';

export default function StudioScreen() {
    // ── Auth ──
    const { session } = useAuth();
    const token = session?.access_token ?? '';

    // ── State machine ──
    const [stage, setStage] = useState<Stage>('goals');
    const [goal, setGoal] = useState<StudioGoal | null>(null);
    const [uploadedImage, setUploadedImage] = useState<{ data: string; name: string; type: string } | null>(null);
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    // Clone-specific state
    const [clonedImage, setClonedImage] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [error, setError] = useState<string | null>(null);

    // ── Page title ──
    useEffect(() => {
        document.title = 'DesignDNA — Studio';
    }, []);

    // ── Handle "entry from Analyze" via route state ──
    const location = useLocation();
    useEffect(() => {
        const state = location.state as { analysisResult?: any; uploadedImage?: any } | null;
        if (state?.analysisResult && state?.uploadedImage) {
            setAnalysisResult(state.analysisResult);
            setUploadedImage(state.uploadedImage);
            // Image+DNA preloaded — stay on goal picker, but show preloaded indicator
        }
    }, [location.state]);

    // ── Handlers ──

    const handleSelectGoal = (selectedGoal: StudioGoal) => {
        setGoal(selectedGoal);
        setError(null);
        setClonedImage(null);
        if (uploadedImage && analysisResult) {
            // Image+DNA already loaded (from Analyze) → skip upload, go to studio
            setStage('studio');
        } else {
            // Need to upload first
            setStage('upload');
        }
    };

    const handleImageReady = useCallback(
        async (image: { data: string; name: string; type: string }) => {
            setUploadedImage(image);
            setError(null);

            // Auto-analyze on drop
            setStage('analyzing');
            try {
                const result = await analyzeDesign(token, image.data, image.type);
                setAnalysisResult(result);
                setStage('studio');
            } catch (err: any) {
                setError(err.message || 'Analysis failed. Please try again.');
                setStage('upload');
            }
        },
        [token],
    );

    const handleClone = useCallback(async () => {
        if (!uploadedImage || !analysisResult) return;
        setError(null);
        setStage('cloning');
        try {
            const result = await cloneDesign(token, {
                originalDna: analysisResult,
                originalImage: uploadedImage.data,
                originalMimeType: uploadedImage.type,
                aspectRatio,
            });
            setClonedImage(result);
            setStage('clone-result');
        } catch (err: any) {
            setError(err.message || 'Clone failed. Please try again.');
            setStage('studio');
        }
    }, [token, uploadedImage, analysisResult, aspectRatio]);

    const handleReClone = useCallback(() => {
        setClonedImage(null);
        setError(null);
        handleClone();
    }, [handleClone]);

    const handleDownload = useCallback(() => {
        if (!clonedImage) return;
        const link = document.createElement('a');
        link.href = clonedImage;
        link.download = `clone-${uploadedImage?.name || 'design'}.png`;
        link.click();
    }, [clonedImage, uploadedImage]);

    const handleStartOver = () => {
        // Keep image + DNA, reset clone state
        setGoal(null);
        setClonedImage(null);
        setError(null);
        setStage('goals');
    };

    const handleBackToGoals = () => {
        setGoal(null);
        setStage('goals');
    };

    const handleRetryUpload = () => {
        setUploadedImage(null);
        setError(null);
        setStage('upload');
    };

    // ── Render by stage ──
    return (
        <div className="flex flex-col h-full bg-bg-base">
            <AnimatePresence mode="wait">
                {stage === 'goals' && (
                    <motion.div
                        key="goals"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex-1"
                    >
                        <GoalPicker
                            onSelectGoal={handleSelectGoal}
                            preloadedImage={uploadedImage ? { data: uploadedImage.data, name: uploadedImage.name } : null}
                        />
                    </motion.div>
                )}

                {stage === 'upload' && goal && (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex-1"
                    >
                        <UploadStage
                            goal={goal}
                            onImageReady={handleImageReady}
                            onBack={handleBackToGoals}
                        />
                        {/* Inline error from failed analysis */}
                        {error && (
                            <div className="fixed inset-0 flex items-center justify-center bg-bg-base/80 z-50">
                                <div className="bg-bg-surface1 border border-border-default rounded-2xl p-8 max-w-[400px] text-center shadow-lg">
                                    <p className="text-[15px] text-text-primary font-medium mb-2">
                                        Analysis Failed
                                    </p>
                                    <p className="text-[13px] text-text-secondary mb-6">{error}</p>
                                    <div className="flex gap-3 justify-center">
                                        <button
                                            onClick={() => {
                                                setError(null);
                                                if (uploadedImage) handleImageReady(uploadedImage);
                                            }}
                                            className="px-4 py-2 rounded-xl bg-text-primary text-white text-[13px] font-medium hover:opacity-90 transition-opacity"
                                        >
                                            Try Again
                                        </button>
                                        <button
                                            onClick={handleRetryUpload}
                                            className="px-4 py-2 rounded-xl bg-bg-surface1 border border-border-default text-text-secondary text-[13px] font-medium hover:border-border-hover transition-colors"
                                        >
                                            Upload Different Image
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {stage === 'analyzing' && uploadedImage && (
                    <motion.div
                        key="analyzing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex-1"
                    >
                        <AnalyzingStage image={{ data: uploadedImage.data, name: uploadedImage.name }} />
                    </motion.div>
                )}

                {/* Clone flow stages */}
                {(stage === 'studio' || stage === 'cloning' || stage === 'clone-result') && goal === 'clone' && uploadedImage && (
                    <motion.div
                        key="clone-flow"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex-1"
                    >
                        <CloneStudio
                            stage={stage as 'studio' | 'cloning' | 'clone-result'}
                            uploadedImage={uploadedImage}
                            analysisResult={analysisResult}
                            clonedImage={clonedImage}
                            error={error}
                            aspectRatio={aspectRatio}
                            onAspectRatioChange={setAspectRatio}
                            onClone={handleClone}
                            onReClone={handleReClone}
                            onDownload={handleDownload}
                            onStartOver={handleStartOver}
                        />
                    </motion.div>
                )}

                {/* Variation/Explore + other non-clone stages → fallback to old CreativeStudio */}
                {stage !== 'goals' && stage !== 'upload' && stage !== 'analyzing' && !(goal === 'clone') && (
                    <motion.div
                        key="legacy-studio"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex-1 flex flex-col"
                    >
                        <CreativeStudio
                            analysisResult={analysisResult}
                            uploadedImage={uploadedImage}
                            onNavigate={handleStartOver}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
