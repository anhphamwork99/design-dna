import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import MascotLoader from './MascotLoader';

interface AnalyzingStageProps {
    image: { data: string; name: string };
}

const analysisSteps = [
    'Extracting colors…',
    'Reading typography…',
    'Mapping composition…',
    'Analyzing buyer signals…',
    'Building design DNA…',
];

const STEP_INTERVAL_MS = 3000;

export default function AnalyzingStage({ image }: AnalyzingStageProps) {
    const [stepIndex, setStepIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setStepIndex((prev) => (prev + 1) % analysisSteps.length);
        }, STEP_INTERVAL_MS);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6">
            {/* Mascot animation */}
            <div className="mb-8">
                <MascotLoader size={140} />
            </div>

            {/* Title */}
            <h2 className="text-[22px] font-semibold shimmer-text mb-6 tracking-tight">
                AI analyzing your artwork<span className="animated-dots"><span>.</span><span>.</span><span>.</span></span>
            </h2>

            {/* Uploaded image — small indicator */}
            <div className="flex items-center gap-3 mb-6 bg-bg-surface1 border border-border-default rounded-xl px-4 py-3">
                <img
                    src={image.data}
                    alt={image.name}
                    className="w-10 h-10 rounded-lg object-cover border border-border-default"
                />
                <span className="text-[13px] text-text-secondary max-w-[180px] truncate">
                    {image.name}
                </span>
            </div>

            {/* Step text — fades between analysis steps */}
            <div className="h-6 relative flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={stepIndex}
                        className="text-[14px] font-medium text-text-secondary whitespace-nowrap"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                    >
                        {analysisSteps[stepIndex]}
                    </motion.p>
                </AnimatePresence>
            </div>

            {/* Step dots */}
            <div className="flex gap-2 mt-4">
                {analysisSteps.map((_, i) => (
                    <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
                        style={{
                            backgroundColor:
                                i <= stepIndex
                                    ? 'var(--color-accent, #8b5cf6)'
                                    : 'var(--color-border-default, #e5e7eb)',
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
