import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { UploadCloud, X } from 'lucide-react';
import { Button } from '../components/shared';
import { ErrorBanner } from '../components/shared/ErrorBanner';
import type { CompareImage, CompareError } from './types';

interface CompareUploadProps {
    images: CompareImage[];
    onImagesChange: (images: CompareImage[]) => void;
    onAnalyze: () => void;
    error: CompareError | null;
    onDismissError: () => void;
}

export default function CompareUpload({
    images,
    onImagesChange,
    onAnalyze,
    error,
    onDismissError,
}: CompareUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const addFiles = (files: File[]) => {
        const validFiles = files.filter((f) => f.type.startsWith('image/'));
        const remainingSlots = 5 - images.length;
        const filesToAdd = validFiles.slice(0, remainingSlots);

        Promise.all(
            filesToAdd.map(
                (file) =>
                    new Promise<CompareImage>((resolve) => {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            resolve({
                                data: event.target?.result as string,
                                name: file.name,
                                type: file.type,
                            });
                        };
                        reader.readAsDataURL(file);
                    })
            )
        ).then((newImages) => {
            onImagesChange([...images, ...newImages]);
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        addFiles(Array.from(e.target.files || []));
        if (e.target) e.target.value = '';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        addFiles(Array.from(e.dataTransfer.files || []));
    };

    const removeImage = (index: number) => {
        onImagesChange(images.filter((_, i) => i !== index));
    };

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
                    Find patterns across your best designs
                </h1>
                <p className="text-[14px] text-text-secondary leading-relaxed">
                    Upload 2–5 of your best-selling designs and we'll find the patterns they share — so you can repeat what works.
                </p>
            </div>

            {/* Upload zone + thumbnails */}
            <div className="w-full max-w-[640px] flex flex-col gap-4">

                {/* Thumbnail grid */}
                {images.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-wrap gap-3"
                    >
                        {images.map((img, index) => (
                            <div
                                key={index}
                                className="relative w-[120px] h-[120px] rounded-lg overflow-hidden border border-border-default group"
                            >
                                <img
                                    src={img.data}
                                    alt={img.name}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1.5 right-1.5 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                                    aria-label={`Remove ${img.name}`}
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* Add image drop zone */}
                {images.length < 5 && (
                    <div
                        className={`w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors py-10 gap-3 ${isDragging
                                ? 'border-accent bg-accent/10'
                                : 'border-border-default hover:border-border-hover bg-bg-surface1'
                            }`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                    >
                        <UploadCloud className="w-8 h-8 text-text-secondary" />
                        <div>
                            <p className="text-[14px] font-medium text-text-primary">
                                {images.length === 0 ? 'Drop images here or click to browse' : 'Add more images'}
                            </p>
                            <p className="text-[12px] text-text-tertiary mt-1">
                                {images.length}/5 selected · PNG, JPG, WEBP
                            </p>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                        />
                    </div>
                )}

                {/* Error */}
                {error && (
                    <ErrorBanner
                        title="Analysis failed"
                        message={error.message}
                        onDismiss={onDismissError}
                    />
                )}

                {/* CTA — only show when ≥2 images */}
                {images.length >= 2 && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-2"
                    >
                        <Button onClick={onAnalyze} size="lg" className="w-full">
                            Find Shared Patterns
                        </Button>
                        {images.length < 5 && (
                            <p className="text-[12px] text-text-tertiary text-center">
                                Add up to {5 - images.length} more image{5 - images.length !== 1 ? 's' : ''} for better results
                            </p>
                        )}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
