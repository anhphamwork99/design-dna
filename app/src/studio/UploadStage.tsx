import { useCallback } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import type { StudioGoal } from './types';
import { UploadZone } from '../components/shared/UploadZone';
import { resizeImageIfNeeded } from '../api';

interface UploadStageProps {
    goal: StudioGoal;
    onImageReady: (image: { data: string; name: string; type: string }) => void;
    onBack: () => void;
}

const goalDescriptions: Record<StudioGoal, { title: string; description: string }> = {
    clone: {
        title: 'Clone Design',
        description: 'Upload the product photo you want to extract',
    },
    variations: {
        title: 'Make Variations',
        description: 'Upload the design you want to riff on',
    },
    explore: {
        title: 'Explore New Ideas',
        description: 'Upload the design for inspiration',
    },
};

const goalIcons: Record<StudioGoal, string> = {
    clone: '🎯',
    variations: '🔄',
    explore: '✨',
};

export default function UploadStage({ goal, onImageReady, onBack }: UploadStageProps) {
    const info = goalDescriptions[goal];

    const handleFileSelect = useCallback(
        async (file: { data: string; name: string; type: string }) => {
            // Resize image before passing upstream (Gemini needs ≤1536px)
            const resizedData = await resizeImageIfNeeded(file.data);
            onImageReady({ ...file, data: resizedData });
        },
        [onImageReady],
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 relative">
            {/* Back link */}
            <motion.button
                className="absolute top-6 left-6 flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary transition-colors"
                onClick={onBack}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                <ArrowLeft className="w-4 h-4" />
                Back to goals
            </motion.button>

            {/* Goal breadcrumb */}
            <motion.div
                className="flex items-center gap-2 mb-6 bg-bg-surface1 border border-border-default rounded-full px-4 py-2"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
            >
                <span className="text-[18px]">{goalIcons[goal]}</span>
                <span className="text-[13px] font-medium text-text-primary">{info.title}</span>
            </motion.div>

            {/* Upload zone container */}
            <motion.div
                className="w-full max-w-[500px]"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
                {/* Description */}
                <p className="text-center text-text-secondary text-[15px] mb-6">
                    {info.description}
                </p>

                {/* Upload zone — reuses shared component */}
                <UploadZone
                    onFileSelect={handleFileSelect}
                    accept="image/png,image/jpeg,image/webp"
                    maxSizeMB={10}
                />

                {/* Formats note */}
                <p className="text-center text-[12px] text-text-tertiary mt-4">
                    Supports PNG, JPG, WEBP · Max 10 MB
                </p>
            </motion.div>
        </div>
    );
}
