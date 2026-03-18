import { motion } from 'motion/react';
import { Download, RefreshCw, Maximize2, Sparkles } from 'lucide-react';
import type { SynthesizedConcept } from './types';

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
    // ── STATE 1: Generating → full card mesh gradient ──
    if (isGenerating) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="rounded-xl border border-border-default overflow-hidden"
            >
                <div className="aspect-[3/4] relative overflow-hidden bg-[#f8f7f5]">
                    {/* Mesh gradient — slow drift */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'var(--gradient-mesh)',
                            backgroundSize: '400% 400%',
                            animation: `mesh-shift ${8 + index * 1.5}s ease-in-out infinite`,
                            opacity: 0.5,
                        }}
                    />
                    {/* Floating color orbs */}
                    {[0, 1, 2].map((j) => (
                        <div
                            key={j}
                            className="absolute rounded-full blur-2xl"
                            style={{
                                width: 60 + j * 20,
                                height: 60 + j * 20,
                                background: ['#f9a8d4', '#c084fc', '#60a5fa'][j],
                                opacity: 0.25,
                                left: `${20 + j * 25}%`,
                                top: `${15 + j * 20}%`,
                                animation: `float-orb-${j + 1} ${6 + j * 2}s ease-in-out infinite`,
                            }}
                        />
                    ))}
                    {/* Noise texture overlay */}
                    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E")' }} />
                    {/* Center spinner */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="w-8 h-8 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <p className="text-[12px] text-white/70 mt-3 font-medium">
                            Generating…
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    }

    // ── STATE 2: Has artwork → full image, hover overlay on bottom half ──
    if (artwork) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                onClick={onClick}
                className="group rounded-xl border border-border-default overflow-hidden cursor-pointer transition-shadow hover:shadow-lg"
            >
                <div className="aspect-[3/4] relative overflow-hidden bg-white">
                    <img
                        src={artwork}
                        alt={concept.title}
                        className="w-full h-full object-contain"
                    />

                    {/* Hover overlay — bottom half with text info */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
                        <h4 className="text-[14px] font-semibold text-white truncate">
                            {concept.title}
                        </h4>
                        <p className="text-[12px] text-white/80 line-clamp-2 mt-1">
                            {concept.description}
                        </p>
                        {/* Quick action buttons */}
                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={(e) => { e.stopPropagation(); onQuickAction('download'); }}
                                className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
                                aria-label="Download"
                            >
                                <Download className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onQuickAction('regenerate'); }}
                                className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
                                aria-label="Regenerate"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onQuickAction('zoom'); }}
                                className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
                                aria-label="View full size"
                            >
                                <Maximize2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    // ── STATE 3: No artwork yet → color dots + title + Generate CTA ──
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            onClick={onClick}
            className="group flex flex-col rounded-xl border border-border-default overflow-hidden cursor-pointer transition-shadow hover:shadow-lg bg-white"
        >
            {/* Color palette preview */}
            <div className="aspect-[4/3] relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex items-center justify-center">
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

            {/* Bottom area — title + description + CTA */}
            <div className="p-4">
                <h4 className="text-[14px] font-semibold text-text-primary truncate">{concept.title}</h4>
                <p className="text-[12px] text-text-secondary line-clamp-2 mt-1">{concept.description}</p>
                {onGenerateArtwork && (
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
