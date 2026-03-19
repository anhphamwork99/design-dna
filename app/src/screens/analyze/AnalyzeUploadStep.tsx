import { motion } from 'motion/react';
import { UploadZone, Button } from '../../components/shared';
import type { AnalyzeImage } from './types';

interface AnalyzeUploadStepProps {
    uploadedImage: AnalyzeImage | null;
    setUploadedImage: (img: AnalyzeImage | null) => void;
    onAnalyze: () => void;
}

export function AnalyzeUploadStep({
    uploadedImage,
    setUploadedImage,
    onAnalyze,
}: AnalyzeUploadStepProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center py-16 px-4"
        >
            {/* Header */}
            <div className="text-center mb-10 max-w-[520px]">
                <h1 className="text-[28px] font-bold tracking-tight mb-3">
                    Analyze a Design
                </h1>
                <p className="text-[14px] text-text-secondary leading-relaxed">
                    Upload a design image to decode its visual DNA and uncover the buyer psychology behind it.
                </p>
            </div>

            {/* Upload zone + actions */}
            <div className="w-full max-w-[640px] flex flex-col gap-4">
                <UploadZone
                    onFileSelect={setUploadedImage}
                    preview={uploadedImage ? { data: uploadedImage.data, name: uploadedImage.name } : null}
                    onClear={uploadedImage ? () => setUploadedImage(null) : undefined}
                    className="w-full"
                />

                {uploadedImage && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-2"
                    >
                        <Button onClick={onAnalyze} size="lg" className="w-full">
                            Analyze Design
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setUploadedImage(null)}
                            className="w-full"
                        >
                            Change Image
                        </Button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
