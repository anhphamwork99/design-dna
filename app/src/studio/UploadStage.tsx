import { useCallback } from 'react';
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

export default function UploadStage({ goal, onImageReady }: UploadStageProps) {
    const info = goalDescriptions[goal];

    const handleFileSelect = useCallback(
        async (file: { data: string; name: string; type: string }) => {
            const resizedData = await resizeImageIfNeeded(file.data);
            onImageReady({ ...file, data: resizedData });
        },
        [onImageReady],
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6">
            {/* Title */}
            <h1 className="text-[24px] font-bold tracking-tight mb-2">
                {info.title}
            </h1>

            {/* Description */}
            <p className="text-text-secondary text-[15px] mb-8">
                {info.description}
            </p>

            {/* Upload zone */}
            <div className="w-full max-w-[500px]">
                <UploadZone
                    onFileSelect={handleFileSelect}
                    accept="image/png,image/jpeg,image/webp"
                    maxSizeMB={10}
                />

                <p className="text-center text-[12px] text-text-tertiary mt-4">
                    Supports PNG, JPG, WEBP · Max 10 MB
                </p>
            </div>
        </div>
    );
}
