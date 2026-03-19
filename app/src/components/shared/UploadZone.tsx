import React, { useRef, useState, useCallback } from 'react';
import { UploadCloud, X } from 'lucide-react';

interface UploadZoneProps {
    onFileSelect: (file: { data: string; name: string; type: string }) => void;
    accept?: string;
    maxSizeMB?: number;
    preview?: { data: string; name: string } | null;
    onClear?: () => void;
    className?: string;
    compact?: boolean;
}

export function UploadZone({
    onFileSelect,
    accept = 'image/*',
    maxSizeMB = 10,
    preview,
    onClear,
    className = '',
    compact = false,
}: UploadZoneProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const processFile = useCallback((file: File) => {
        setError(null);
        if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
            setError(`File too large. Max ${maxSizeMB}MB.`);
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            onFileSelect({
                data: e.target?.result as string,
                name: file.name,
                type: file.type,
            });
        };
        reader.readAsDataURL(file);
    }, [onFileSelect, maxSizeMB]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    }, [processFile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handlePaste = useCallback((e: React.ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;
        for (const item of items) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                if (file) {
                    e.preventDefault();
                    processFile(file);
                    break;
                }
            }
        }
    }, [processFile]);

    if (preview) {
        return (
            <div className={`relative bg-bg-surface2 rounded-[16px] border border-border-default overflow-hidden ${className}`}>
                <img src={preview.data} alt={preview.name} className="w-full max-h-[400px] object-contain p-2 rounded-[16px]" />
                {onClear && (
                    <button
                        onClick={onClear}
                        className="absolute top-3 right-3 bg-bg-surface1/90 backdrop-blur-sm text-text-secondary border border-border-default p-1.5 rounded-full hover:text-text-primary hover:bg-bg-surface1 transition-colors shadow-sm"
                        aria-label="Remove image"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
                <p className="px-4 pb-3 text-[12px] text-text-tertiary truncate">{preview.name}</p>
            </div>
        );
    }

    return (
        <div className={className}>
            <div
                className={`border-2 border-dashed rounded-[16px] flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${compact ? 'py-6 px-4' : 'py-12 px-6'
                    } ${isDragging
                        ? 'border-accent bg-accent-subtle'
                        : 'border-border-default hover:border-accent bg-bg-surface1'
                    }`}
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onPaste={handlePaste}
            >
                <UploadCloud className={`text-text-tertiary mb-3 ${compact ? 'w-8 h-8' : 'w-12 h-12'}`} />
                <p className={`font-medium text-text-primary mb-1 ${compact ? 'text-[14px]' : 'text-[16px]'}`}>
                    Drop or paste your design here
                </p>
                <p className="text-[14px] text-text-secondary mb-1">or click to browse · Ctrl+V to paste</p>
                <p className="text-[12px] text-text-tertiary">PNG, JPG, WEBP · Max {maxSizeMB}MB</p>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept={accept}
                    onChange={handleFileChange}
                />
            </div>
            {error && (
                <p className="mt-2 text-[12px] text-error">{error}</p>
            )}
        </div>
    );
}
