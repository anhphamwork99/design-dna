import React, { useEffect } from 'react';
import { X, Download } from 'lucide-react';

interface ImageLightboxProps {
    open: boolean;
    onClose: () => void;
    src: string;
    alt?: string;
}

export function ImageLightbox({ open, onClose, src, alt = '' }: ImageLightboxProps) {
    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [open, onClose]);

    // Prevent body scroll when open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    if (!open) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
            onClick={handleBackdropClick}
        >
            {/* Controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <a
                    href={src}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition-colors"
                    aria-label="Download image"
                >
                    <Download className="w-5 h-5" />
                </a>
                <button
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition-colors"
                    aria-label="Close lightbox"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Image */}
            <img
                src={src}
                alt={alt}
                className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );
}
