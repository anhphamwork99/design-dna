import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

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

    const progress = ((stepIndex + 1) / analysisSteps.length) * 100;

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 relative">
            {/* Title */}
            <motion.h2
                className="text-[22px] font-semibold text-text-primary mb-8 tracking-tight"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                AI analyzing your artwork
            </motion.h2>

            {/* Image thumbnail — centered above progress */}
            <motion.div
                className="mb-8 flex flex-col items-center gap-3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
                <div className="relative">
                    <img
                        src={image.data}
                        alt={image.name}
                        className="w-[120px] h-[120px] rounded-2xl object-cover border border-border-default shadow-md"
                    />
                    {/* Scanning line animation */}
                    <motion.div
                        className="absolute left-0 right-0 h-[2px] rounded-full"
                        style={{ background: 'var(--color-accent)' }}
                        animate={{
                            top: ['0%', '100%', '0%'],
                            opacity: [0.8, 0.4, 0.8],
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                </div>
                <span className="text-[12px] text-text-tertiary max-w-[180px] truncate text-center">
                    {image.name}
                </span>
            </motion.div>

            {/* Progress bar */}
            <div className="w-[280px] mb-6">
                <div className="h-[3px] rounded-full bg-border-default overflow-hidden">
                    <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'var(--color-accent)' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                    />
                </div>
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
                    <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        animate={{
                            backgroundColor:
                                i <= stepIndex
                                    ? 'var(--color-accent)'
                                    : 'var(--color-border-default)',
                        }}
                        transition={{ duration: 0.3 }}
                    />
                ))}
            </div>
        </div>
    );
}
