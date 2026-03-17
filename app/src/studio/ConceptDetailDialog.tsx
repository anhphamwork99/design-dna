import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, RefreshCw, Sparkles, Loader2, Paintbrush, Lightbulb } from 'lucide-react';
import type { SynthesizedConcept } from './types';

interface ConceptDetailDialogProps {
    concept: SynthesizedConcept;
    artwork: string | null;
    isGenerating: boolean;
    generationStep: string;
    onGenerateArtwork: () => void;
    onRegenerateArtwork: () => void;
    onDownload: () => void;
    onStartOver: () => void;
    onClose: () => void;
}

export default function ConceptDetailDialog({
    concept,
    artwork,
    isGenerating,
    generationStep,
    onGenerateArtwork,
    onRegenerateArtwork,
    onDownload,
    onStartOver,
    onClose,
}: ConceptDetailDialogProps) {
    // ESC to close
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [handleKeyDown]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-bg-surface1 border border-border-default rounded-2xl shadow-2xl w-[90vw] max-w-[1000px] max-h-[90vh] overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border-default flex-shrink-0">
                        <div>
                            <h2 className="text-[18px] font-semibold">{concept.title}</h2>
                            <p className="text-[13px] text-text-secondary mt-0.5">Concept Details</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-bg-surface2 text-text-secondary hover:text-text-primary transition-colors"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                        {artwork || isGenerating ? (
                            /* ── With Artwork or Generating ── */
                            <div className="flex flex-col md:flex-row h-full">
                                {/* Artwork area */}
                                <div className="flex-1 flex items-center justify-center p-6 bg-bg-base min-h-[300px]">
                                    {isGenerating ? (
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-14 h-14 rounded-2xl bg-bg-surface1/80 border border-border-default flex items-center justify-center mb-5">
                                                <Loader2 className="w-6 h-6 text-accent animate-spin" />
                                            </div>
                                            <h3 className="text-[16px] font-semibold mb-1.5">
                                                {generationStep || 'Generating artwork...'}
                                            </h3>
                                            <p className="text-text-tertiary text-[13px]">
                                                This usually takes 20–40 seconds
                                            </p>
                                        </div>
                                    ) : artwork ? (
                                        <img
                                            src={artwork}
                                            alt={concept.title}
                                            className="max-w-full max-h-[60vh] object-contain rounded-xl border border-border-default shadow-lg"
                                        />
                                    ) : null}
                                </div>

                                {/* Summary sidebar */}
                                <div className="w-full md:w-[320px] p-6 border-t md:border-t-0 md:border-l border-border-default overflow-y-auto space-y-4">
                                    <div>
                                        <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">
                                            Description
                                        </span>
                                        <p className="text-[13px] text-text-primary mt-1 leading-relaxed">
                                            {concept.description}
                                        </p>
                                    </div>

                                    {concept.colorPalette && concept.colorPalette.length > 0 && (
                                        <div>
                                            <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">
                                                Palette
                                            </span>
                                            <div className="flex gap-1.5 mt-1.5">
                                                {concept.colorPalette.map((c, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-7 h-7 rounded-full border border-border-default shadow-sm"
                                                        style={{ backgroundColor: c.hex }}
                                                        title={`${c.name} — ${c.role}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action buttons */}
                                    <div className="flex flex-col gap-2 pt-3 border-t border-border-default">
                                        {artwork && (
                                            <>
                                                <button
                                                    onClick={onDownload}
                                                    className="px-4 py-2 bg-bg-surface2 border border-border-default rounded-lg text-[13px] font-medium hover:bg-bg-surface2/80 transition-colors flex items-center gap-2"
                                                >
                                                    <Download className="w-3.5 h-3.5" /> Download
                                                </button>
                                                <button
                                                    onClick={onRegenerateArtwork}
                                                    className="px-4 py-2 text-[12px] text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 rounded-lg hover:bg-bg-surface2/60"
                                                >
                                                    <RefreshCw className="w-3 h-3" /> Regenerate
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={onStartOver}
                                            className="px-4 py-2 text-[12px] text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 rounded-lg hover:bg-bg-surface2/60"
                                        >
                                            <Sparkles className="w-3 h-3" /> Start Over
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* ── Without Artwork — Full concept details ── */
                            <div className="p-6 space-y-5 max-w-[700px] mx-auto">
                                <div>
                                    <p className="text-[14px] text-text-primary leading-relaxed">
                                        {concept.description}
                                    </p>
                                </div>

                                {/* Suggested Text */}
                                {concept.suggestedText && concept.suggestedText.primary && (
                                    <div className="bg-accent/5 border border-accent/10 rounded-lg px-4 py-3">
                                        <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">
                                            Design Text
                                        </span>
                                        <p className="text-[15px] text-accent font-semibold mt-1.5 leading-snug">
                                            &ldquo;{concept.suggestedText.primary}&rdquo;
                                        </p>
                                        {concept.suggestedText.secondary && (
                                            <p className="text-[12px] text-text-secondary mt-1 italic">
                                                &ldquo;{concept.suggestedText.secondary}&rdquo;
                                            </p>
                                        )}
                                        <span className="inline-block mt-2 bg-bg-surface2 px-2 py-0.5 rounded text-[10px] text-text-tertiary">
                                            {concept.suggestedText.textStyle}
                                        </span>
                                    </div>
                                )}

                                {/* Color Palette */}
                                {concept.colorPalette && concept.colorPalette.length > 0 && (
                                    <div>
                                        <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">
                                            Color Palette
                                        </span>
                                        <div className="flex items-center gap-3 mt-2">
                                            {concept.colorPalette.map((color, i) => (
                                                <div key={i} className="flex items-center gap-1.5" title={`${color.name} (${color.role})`}>
                                                    <div
                                                        className="w-6 h-6 rounded-full border border-border-default flex-shrink-0 shadow-sm"
                                                        style={{ backgroundColor: color.hex }}
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="text-[11px] text-text-secondary leading-tight">{color.name}</span>
                                                        <span className="text-[9px] text-text-tertiary leading-tight">{color.role}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <div>
                                        <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">
                                            Visual Direction
                                        </span>
                                        <p className="text-[13px] text-text-primary mt-1">{concept.visualDirection}</p>
                                    </div>
                                    <div>
                                        <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">
                                            Target Buyer
                                        </span>
                                        <p className="text-[13px] text-text-primary mt-1">{concept.targetBuyer}</p>
                                    </div>

                                    {concept.madeForMeHook && (
                                        <div>
                                            <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">
                                                "Made For Me" Hook
                                            </span>
                                            <p className="text-[13px] text-text-primary mt-1 bg-bg-surface2/50 rounded-lg px-3 py-2">
                                                <Lightbulb className="w-3.5 h-3.5 inline mr-1 text-accent" /> {concept.madeForMeHook}
                                            </p>
                                        </div>
                                    )}

                                    <div>
                                        <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">
                                            Why It Works
                                        </span>
                                        <p className="text-[13px] text-text-primary mt-1">{concept.coherenceNotes}</p>
                                    </div>
                                </div>

                                {/* Key Elements chips */}
                                {concept.keyElements && concept.keyElements.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border-default/30">
                                        {concept.keyElements.map((el, i) => (
                                            <span key={i} className="bg-bg-surface2 px-2 py-0.5 rounded text-[11px] text-text-secondary">
                                                {el}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer — Generate CTA when no artwork */}
                    {!artwork && !isGenerating && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-border-default flex-shrink-0">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-[13px] text-text-secondary hover:text-text-primary rounded-lg hover:bg-bg-surface2 transition-colors"
                            >
                                Back to Concepts
                            </button>
                            <button
                                onClick={onGenerateArtwork}
                                className="px-6 py-2.5 ai-gradient text-white rounded-lg font-medium text-[14px] shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                            >
                                <Paintbrush className="w-4 h-4" /> Generate Artwork
                            </button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
