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

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 relative">
            {/* Image thumbnail — top-left corner */}
            <motion.div
                className="absolute top-6 left-6 flex items-center gap-3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
                <img
                    src={image.data}
                    alt={image.name}
                    className="w-[80px] h-[80px] rounded-xl object-cover border border-border-default shadow-sm"
                />
                <span className="text-[12px] text-text-tertiary max-w-[140px] truncate">
                    {image.name}
                </span>
            </motion.div>

            {/* Center loading */}
            <div className="flex flex-col items-center gap-8">
                {/* Pulsing glow ring */}
                <div className="relative flex items-center justify-center">
                    {/* Outer glow */}
                    <motion.div
                        className="absolute w-32 h-32 rounded-full"
                        style={{
                            background:
                                'radial-gradient(circle, var(--color-accent-subtle) 0%, transparent 70%)',
                        }}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.4, 0.7, 0.4],
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                    {/* Inner spinner ring */}
                    <motion.div
                        className="relative w-16 h-16 rounded-full border-[3px] border-border-default"
                        style={{
                            borderTopColor: 'var(--color-accent)',
                        }}
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />
                    {/* Center dot */}
                    <motion.div
                        className="absolute w-3 h-3 rounded-full bg-accent"
                        animate={{
                            scale: [1, 1.3, 1],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                </div>

                {/* Step text — fades between analysis steps */}
                <div className="h-6 relative flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={stepIndex}
                            className="text-[15px] font-medium text-text-secondary whitespace-nowrap"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                        >
                            {analysisSteps[stepIndex]}
                        </motion.p>
                    </AnimatePresence>
                </div>

                {/* Progress dots */}
                <div className="flex gap-2">
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
        </div>
    );
}
