import { motion } from 'motion/react';
import { Download, RefreshCw, Maximize2 } from 'lucide-react';
import type { SynthesizedConcept } from './types';

interface ConceptCardProps {
    concept: SynthesizedConcept;
    artwork: string | null;
    index: number;
    isGenerating: boolean;
    onClick: () => void;
    onQuickAction: (action: 'download' | 'regenerate' | 'zoom') => void;
}

export default function ConceptCard({
    concept,
    artwork,
    index,
    isGenerating,
    onClick,
    onQuickAction,
}: ConceptCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            onClick={onClick}
            className="group relative w-[280px] h-[200px] rounded-xl border border-border-default overflow-hidden cursor-pointer transition-shadow hover:shadow-lg bg-bg-surface1 flex-shrink-0"
        >
            {artwork ? (
                /* ── With Artwork ── */
                <>
                    <img
                        src={artwork}
                        alt={concept.title}
                        className="w-full h-full object-cover"
                    />
                    {/* Hover overlay with quick actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-200 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                        <button
                            onClick={(e) => { e.stopPropagation(); onQuickAction('download'); }}
                            className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
                            aria-label="Download"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onQuickAction('regenerate'); }}
                            className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
                            aria-label="Regenerate"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onQuickAction('zoom'); }}
                            className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
                            aria-label="View full size"
                        >
                            <Maximize2 className="w-4 h-4" />
                        </button>
                    </div>
                    {/* Title strip at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
                        <p className="text-white text-[12px] font-medium truncate">{concept.title}</p>
                    </div>
                </>
            ) : (
                /* ── Without Artwork ── */
                <div className="flex flex-col h-full p-4 group-hover:bg-bg-surface2/50 transition-colors">
                    <div className="flex-1 min-h-0">
                        <h3 className="text-[14px] font-semibold mb-1.5 line-clamp-1">
                            {concept.title}
                        </h3>
                        <p className="text-[12px] text-text-secondary leading-relaxed line-clamp-3">
                            {concept.description}
                        </p>
                    </div>

                    {/* Color palette dots */}
                    {concept.colorPalette && concept.colorPalette.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-3">
                            {concept.colorPalette.slice(0, 4).map((color, i) => (
                                <div
                                    key={i}
                                    className="w-5 h-5 rounded-full border border-border-default shadow-sm"
                                    style={{ backgroundColor: color.hex }}
                                    title={`${color.name} (${color.role})`}
                                />
                            ))}
                            <span className="text-[11px] text-text-tertiary ml-1">
                                View Details →
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Generating overlay */}
            {isGenerating && !artwork && (
                <div className="absolute inset-0 bg-bg-surface1/80 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </motion.div>
    );
}
