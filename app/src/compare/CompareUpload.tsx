import React, { useState, useRef } from 'react';
import { UploadCloud, X } from 'lucide-react';
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

        // Read all files in parallel, then update state once to avoid race condition
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
        // Reset so re-selecting the same file triggers onChange
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
        <div className="pt-8">
            {/* Header */}
            <div className="max-w-[800px] mx-auto text-center mb-8">
                <h1 className="text-[32px] font-bold tracking-tight mb-2">
                    Compare Your Designs
                </h1>
                <p className="text-[14px] text-text-secondary">
                    Upload 2–5 of your best-selling designs and we'll find the patterns they share — so you can repeat what works.
                </p>
            </div>

            {/* Upload area */}
            <div className="max-w-[800px] mx-auto">
                <div className="bg-bg-surface1 border border-border-default rounded-xl p-6 mb-6">
                    {/* Image grid */}
                    <div className="flex flex-wrap gap-4 mb-4">
                        {images.map((img, index) => (
                            <div
                                key={index}
                                className="relative w-[150px] h-[150px] rounded-lg overflow-hidden border border-border-default group"
                            >
                                <img
                                    src={img.data}
                                    alt={img.name}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-accent focus-visible:opacity-100"
                                    aria-label={`Remove ${img.name}`}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        {/* Add-image zone */}
                        {images.length < 5 && (
                            <div
                                className={`w-[150px] h-[150px] bg-bg-surface2 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isDragging
                                    ? 'border-accent bg-accent/10'
                                    : 'border-border-default hover:border-border-hover'
                                    }`}
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDragging(true);
                                }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                            >
                                <UploadCloud className="w-8 h-8 text-text-secondary mb-2" />
                                <span className="text-[12px] text-text-secondary">
                                    Add Image
                                </span>
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
                    </div>

                    <p className="text-[14px] text-text-secondary text-center">
                        {images.length}/5 images selected
                    </p>
                </div>

                {/* Error banner */}
                {error && (
                    <div className="mb-6">
                        <ErrorBanner
                            title="Analysis failed"
                            message={error.message}
                            onDismiss={onDismissError}
                        />
                    </div>
                )}

                {/* CTA */}
                <button
                    onClick={onAnalyze}
                    disabled={images.length < 2}
                    className="w-full ai-gradient text-white font-medium py-[14px] px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
                >
                    Find Shared Patterns
                </button>
            </div>
        </div>
    );
}
