import { motion } from 'motion/react';
import { Download, RefreshCw, Maximize2, Sparkles } from 'lucide-react';
import type { SynthesizedConcept } from './types';
import MascotLoader from './MascotLoader';

interface ConceptCardProps {
    concept: SynthesizedConcept;
    artwork: string | null;
    index: number;
    isGenerating: boolean;
    onClick: () => void;
    onQuickAction: (action: 'download' | 'regenerate' | 'zoom') => void;
    onGenerateArtwork?: () => void;
}

export default function ConceptCard({
    concept,
    artwork,
    index,
    isGenerating,
    onClick,
    onQuickAction,
    onGenerateArtwork,
}: ConceptCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            onClick={onClick}
            className="group flex flex-col rounded-xl border border-border-default overflow-hidden cursor-pointer transition-shadow hover:shadow-lg bg-white"
        >
            {/* ── Top area — artwork, generating, or placeholder ── */}
            <div className="aspect-[4/3] relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                {artwork ? (
                    <>
                        <img
                            src={artwork}
                            alt={concept.title}
                            className="w-full h-full object-cover"
                        />
                        {/* Hover actions overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-200 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
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
                    </>
                ) : isGenerating ? (
                    /* Generating state — MascotLoader inside card + wave gradient */
                    <div className="w-full h-full flex flex-col items-center justify-center relative">
                        <MascotLoader size={60} />
                        <p className="text-[11px] text-text-tertiary mt-2">Generating...</p>
                        {/* Wave pulse bars at bottom — audio visualizer, full width */}
                        <div className="absolute bottom-0 left-0 right-0 h-10 wave-gradient" style={{ padding: 0 }}>
                            {Array.from({ length: 40 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="wave-gradient-bar"
                                    style={{
                                        flex: 1,
                                        height: `${20 + Math.sin(i * 0.7) * 14 + Math.random() * 6}px`,
                                        animationDelay: `${i * 0.06}s`,
                                        animationDuration: `${0.8 + Math.sin(i * 0.5) * 0.4}s`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Gradient placeholder with color palette dots */
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="flex gap-2">
                            {concept.colorPalette?.slice(0, 5).map((color, i) => (
                                <div
                                    key={i}
                                    className="w-6 h-6 rounded-full border border-white/60 shadow-sm"
                                    style={{ backgroundColor: color.hex }}
                                    title={`${color.name} (${color.role})`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Bottom area — title + description + CTA ── */}
            <div className="p-4">
                <h4 className="text-[14px] font-semibold text-text-primary truncate">{concept.title}</h4>
                <p className="text-[12px] text-text-secondary line-clamp-2 mt-1">{concept.description}</p>
                {!artwork && !isGenerating && onGenerateArtwork && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onGenerateArtwork(); }}
                        className="mt-3 w-full px-4 py-2.5 ai-gradient text-white rounded-lg font-medium text-[13px] shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                        <Sparkles className="w-3.5 h-3.5" /> Generate Artwork
                    </button>
                )}
            </div>
        </motion.div>
    );
}
