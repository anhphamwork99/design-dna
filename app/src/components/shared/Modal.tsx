import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    width?: string;
}

export function Modal({
    open,
    onClose,
    title,
    children,
    width = 'max-w-[480px]',
}: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

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

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    ref={overlayRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 8 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className={`bg-bg-surface1 border border-border-default rounded-[16px] shadow-modal ${width} w-full mx-4`}
                    >
                        {title && (
                            <div className="flex items-center justify-between px-6 pt-6 pb-0">
                                <h2 className="text-[16px] font-semibold text-text-primary">{title}</h2>
                                <button
                                    onClick={onClose}
                                    className="text-text-tertiary hover:text-text-primary transition-colors rounded-full p-1 hover:bg-state-hover"
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                        <div className={title ? 'p-6' : 'p-6 relative'}>
                            {!title && (
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 text-text-tertiary hover:text-text-primary transition-colors rounded-full p-1 hover:bg-state-hover"
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
