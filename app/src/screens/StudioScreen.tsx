import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import type { Stage, StudioGoal } from '../studio/types';
import GoalPicker from '../studio/GoalPicker';
import CreativeStudio from '../CreativeStudio';

export default function StudioScreen() {
    // ── State machine ──
    const [stage, setStage] = useState<Stage>('goals');
    const [goal, setGoal] = useState<StudioGoal | null>(null);
    const [uploadedImage, setUploadedImage] = useState<{ data: string; name: string; type: string } | null>(null);
    const [analysisResult, setAnalysisResult] = useState<any>(null);

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
        if (uploadedImage && analysisResult) {
            // Image+DNA already loaded (from Analyze) → skip upload, go to studio
            setStage('studio');
        } else {
            // Need to upload first
            setStage('upload');
        }
    };

    const handleStartOver = () => {
        // Keep image + DNA, reset everything else
        setGoal(null);
        setStage('goals');
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

                {/* Stages not yet implemented → fallback to old CreativeStudio */}
                {stage !== 'goals' && (
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
