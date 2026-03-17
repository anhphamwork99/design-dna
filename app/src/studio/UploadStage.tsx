import { useCallback } from 'react';
import { Copy, Layers, Sparkles, ChevronRight } from 'lucide-react';
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

const goalIconMap: Record<StudioGoal, React.ComponentType<{ className?: string }>> = {
    clone: Copy,
    variations: Layers,
    explore: Sparkles,
};

export default function UploadStage({ goal, onImageReady, onBack }: UploadStageProps) {
    const info = goalDescriptions[goal];
    const GoalIcon = goalIconMap[goal];

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
            {/* Breadcrumb: Studio > Goal */}
            <div className="absolute top-6 left-16 flex items-center gap-1.5 text-[13px]">
                <button
                    onClick={onBack}
                    className="text-text-secondary hover:text-text-primary transition-colors"
                >
                    Studio
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-text-tertiary" />
                <span className="text-text-primary font-medium flex items-center gap-1.5">
                    <GoalIcon className="w-3.5 h-3.5" />
                    {info.title}
                </span>
            </div>

            {/* Upload zone container */}
            <div className="w-full max-w-[500px]">
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
            </div>
        </div>
    );
}
