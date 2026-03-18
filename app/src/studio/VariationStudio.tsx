import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, AlertCircle } from 'lucide-react';
import type { Stage, StudioGoal, Shifts, AppliedPatternData, SynthesizedConcept } from './types';
import FloatingPanel from './FloatingPanel';
import AccordionSection from './AccordionSection';
import DimensionShifts from './DimensionShifts';
import ConceptCard from './ConceptCard';
import PatternPicker from './PatternPicker';

// ── Skeleton card for synthesizing state ───────────────────────────

const SKELETON_LABELS = [
    ['Exploring visual styles', 'Analyzing color harmony', 'Crafting composition'],
    ['Interpreting buyer DNA', 'Mixing design elements', 'Defining visual direction'],
    ['Building concept story', 'Selecting typography', 'Finalizing palette'],
];

const NOISE_BG = 'url("data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E")';

function SkeletonConceptCard({ index }: { index: number }) {
    const labels = SKELETON_LABELS[index];
    const [labelIdx, setLabelIdx] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setLabelIdx((prev) => (prev + 1) % labels.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [labels.length]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.3 }}
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
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: NOISE_BG }} />
                {/* Dynamic cycling text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={labelIdx}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.3 }}
                            className="text-[13px] text-white/70 font-medium"
                        >
                            {labels[labelIdx]}…
                        </motion.span>
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}

// ── Types ──────────────────────────────────────────────────────────

interface VariationStudioProps {
    goal: 'variations' | 'explore';
    stage: Stage;
    uploadedImage: { data: string; name: string; type: string };
    analysisResult: any;
    analysisStatus: 'idle' | 'pending' | 'complete' | 'error';

    // Shift state
    shifts: Shifts;
    onShiftsChange: (shifts: Shifts) => void;

    // Pattern state
    appliedPattern: AppliedPatternData | null;
    onApplyPattern: (pattern: AppliedPatternData) => void;
    onRemovePattern: () => void;

    // Aspect ratio
    aspectRatio: string;
    onAspectRatioChange: (ratio: string) => void;

    // Concepts
    concepts: SynthesizedConcept[];
    conceptArtworks: Map<number, string>;
    generatingCardIds: Set<number>;

    // Actions
    onCreateConcepts: () => void;
    onSelectConcept: (index: number) => void;
    onQuickAction: (index: number, action: 'download' | 'regenerate' | 'zoom') => void;
    onGenerateArtwork?: (index: number) => void;
    onStartOver: () => void;

    // Loading states
    error: string | null;
}

// ── Component ──────────────────────────────────────────────────────

export default function VariationStudio({
    goal,
    stage,
    uploadedImage,
    analysisResult,
    analysisStatus,
    shifts,
    onShiftsChange,
    appliedPattern,
    onApplyPattern,
    onRemovePattern,
    aspectRatio,
    onAspectRatioChange,
    concepts,
    conceptArtworks,
    generatingCardIds,
    onCreateConcepts,
    onSelectConcept,
    onQuickAction,
    onGenerateArtwork,
    onStartOver,
    error,
}: VariationStudioProps) {
    const [panelVisible, setPanelVisible] = useState(true);
    const [panelBeforeSynth, setPanelBeforeSynth] = useState(true);

    // Auto-collapse panel when synthesizing begins, restore when done
    const isSynthesizing = stage === 'synthesizing';
    useEffect(() => {
        if (isSynthesizing) {
            setPanelBeforeSynth(panelVisible);
            setPanelVisible(false);
        } else {
            // Restore prior state after synthesizing completes
            setPanelVisible(panelBeforeSynth);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSynthesizing]);

    // Derived data from analysis
    const style = analysisResult?.visual_dna?.graphics?.style;
    const harmony = analysisResult?.visual_dna?.color?.harmony;
    const tribe = analysisResult?.buyer_dna?.identity_signals?.tribe;
    const emotion = analysisResult?.buyer_dna?.emotional_triggers?.primary_emotion;


    const isAnyGenerating = generatingCardIds.size > 0;
    const hasConcepts = concepts.length > 0;
    const hasAnyArtwork = conceptArtworks.size > 0;

    return (
        <div className="relative w-full h-full overflow-hidden">
            {/* ═══ CANVAS — full width ═══ */}
            <div className="flex flex-col items-center justify-center w-full h-full p-6 overflow-y-auto bg-bg-base">
                <AnimatePresence mode="wait">
                    {/* Synthesizing state — skeleton concept cards */}
                    {isSynthesizing && (
                        <motion.div
                            key="synthesizing"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.35 }}
                            className="w-full max-w-[900px]"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-[24px] font-semibold mb-1.5 text-text-primary">
                                    Creating Concepts
                                </h2>
                                <p className="text-text-tertiary text-[14px]">
                                    AI is crafting 3 unique design directions from your shifts
                                </p>
                            </div>
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
                                {[0, 1, 2].map((i) => (
                                    <SkeletonConceptCard key={i} index={i} />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Error state */}
                    {!isSynthesizing && error && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="flex flex-col items-center justify-center text-center max-w-[400px]"
                        >
                            <div className="bg-error/10 border border-error/20 p-6 rounded-xl w-full">
                                <AlertCircle className="w-8 h-8 text-error mx-auto mb-3" />
                                <h3 className="text-error font-medium mb-2">Generation Failed</h3>
                                <p className="text-text-secondary text-[14px] mb-4">{error}</p>
                                <button
                                    onClick={onCreateConcepts}
                                    className="px-5 py-2.5 ai-gradient text-white rounded-lg text-[14px] font-medium hover:opacity-90 transition-opacity"
                                >
                                    Try Again
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Concept cards */}
                    {!isSynthesizing && !error && hasConcepts && (
                        <motion.div
                            key="concepts"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="w-full max-w-[900px]"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-[24px] font-semibold mb-1.5">
                                    {hasAnyArtwork ? 'Your Concepts' : 'Choose a Concept'}
                                </h2>
                                <p className="text-text-tertiary text-[14px]">
                                    {hasAnyArtwork
                                        ? 'Click a card to view details or generate more artwork'
                                        : 'Click any card to generate artwork'}
                                </p>
                            </div>
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
                                {concepts.map((concept, i) => (
                                    <ConceptCard
                                        key={i}
                                        concept={concept}
                                        artwork={conceptArtworks.get(i) || null}
                                        index={i}
                                        isGenerating={generatingCardIds.has(i)}
                                        onClick={() => onSelectConcept(i)}
                                        onQuickAction={(action) => onQuickAction(i, action)}
                                        onGenerateArtwork={() => onGenerateArtwork?.(i)}
                                    />
                                ))}
                            </div>
                            {hasConcepts && (
                                <div className="flex justify-center mt-6">
                                    <button
                                        onClick={onCreateConcepts}
                                        disabled={isSynthesizing || isAnyGenerating}
                                        className="px-4 py-2 text-[12px] text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-bg-surface2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                                    >
                                        <Sparkles className="w-3.5 h-3.5" /> Regenerate All Concepts
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Canvas preview — shows uploaded image + DNA insights */}
                    {!isSynthesizing && !error && !hasConcepts && (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.35 }}
                            className="flex flex-col items-center justify-center text-center max-w-[480px] w-full"
                        >
                            {/* Uploaded image — hero display with mesh glow */}
                            <div className="relative mb-6 w-full max-w-[320px]">
                                {/* Mesh gradient glow behind image — only during analysis */}
                                <AnimatePresence>
                                    {analysisStatus === 'pending' && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 0.3 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.6 }}
                                            className="absolute -inset-4 rounded-3xl blur-3xl"
                                            style={{
                                                background: 'var(--gradient-mesh)',
                                                backgroundSize: '400% 400%',
                                                animation: 'mesh-shift 10s ease-in-out infinite',
                                            }}
                                        />
                                    )}
                                </AnimatePresence>
                                <div className="relative rounded-2xl overflow-hidden border border-border-default shadow-lg bg-bg-surface1">
                                    <img
                                        src={uploadedImage.data}
                                        alt="Your design"
                                        className="w-full object-contain max-h-[280px]"
                                    />
                                    {/* Shimmer overlay while analysis pending */}
                                    {analysisStatus === 'pending' && (
                                        <div className="absolute inset-0 pointer-events-none rounded-2xl animate-shimmer" />
                                    )}
                                </div>

                                {/* DNA tag badges — flow in as analysis completes */}
                                {analysisStatus === 'complete' && analysisResult && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2, duration: 0.3 }}
                                        className="flex flex-wrap justify-center gap-1.5 mt-3"
                                    >
                                        {[
                                            analysisResult?.visual_dna?.graphics?.style,
                                            analysisResult?.visual_dna?.color?.harmony,
                                            analysisResult?.buyer_dna?.identity_signals?.tribe,
                                            analysisResult?.buyer_dna?.emotional_triggers?.primary_emotion,
                                        ]
                                            .filter(Boolean)
                                            .map((tag, i) => (
                                                <motion.span
                                                    key={tag}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.3 + i * 0.1 }}
                                                    className="bg-bg-surface2 px-2.5 py-1 rounded-full text-[11px] text-text-secondary border border-border-default"
                                                >
                                                    {tag}
                                                </motion.span>
                                            ))}
                                    </motion.div>
                                )}
                            </div>

                            {/* Status text */}
                            <h2 className="text-[17px] font-medium text-text-primary mb-1">
                                {analysisStatus === 'complete'
                                    ? 'Design DNA Decoded'
                                    : 'Decoding Design DNA…'}
                            </h2>
                            <p className="text-text-tertiary text-[13px] mb-5 leading-relaxed max-w-[280px]">
                                {analysisStatus === 'complete'
                                    ? goal === 'explore'
                                        ? 'Tune the dimension shifts, then create wildly fresh concepts'
                                        : 'Adjust what to keep and change, then create variations'
                                    : 'AI is extracting visual and buyer DNA from your design…'}
                            </p>

                            {/* CTA — only visible when analysis is complete */}
                            {analysisStatus === 'complete' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.3 }}
                                >
                                    <button
                                        onClick={onCreateConcepts}
                                        disabled={isSynthesizing}
                                        className="px-6 py-2.5 ai-gradient text-white rounded-lg font-medium text-[14px] shadow-lg hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" /> Create Concepts
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ═══ FLOATING PANEL — overlays on left ═══ */}
            <FloatingPanel isVisible={panelVisible} onToggle={() => setPanelVisible(!panelVisible)}>
                {/* Your Original — thumbnail + tags only (no filename) */}
                <AccordionSection title="YOUR ORIGINAL" defaultOpen={true}>
                    <div className="flex gap-2 items-start">
                        <img
                            src={uploadedImage.data}
                            alt="Original design"
                            className="w-10 h-10 rounded-lg object-cover border border-border-default flex-shrink-0"
                        />
                        <div className="flex flex-wrap gap-1">
                            {analysisStatus === 'pending' ? (
                                /* Shimmer placeholders while analysis pending */
                                <>
                                    <span className="bg-bg-surface2 px-3 py-0.5 rounded text-[10px] text-transparent animate-pulse">analyzing</span>
                                    <span className="bg-bg-surface2 px-3 py-0.5 rounded text-[10px] text-transparent animate-pulse">design</span>
                                    <span className="bg-bg-surface2 px-3 py-0.5 rounded text-[10px] text-transparent animate-pulse">dna</span>
                                </>
                            ) : (
                                <>
                                    {style && <span className="bg-bg-surface2 px-1.5 py-0.5 rounded text-[10px] text-text-secondary">{style}</span>}
                                    {harmony && <span className="bg-bg-surface2 px-1.5 py-0.5 rounded text-[10px] text-text-secondary">{harmony}</span>}
                                    {tribe && <span className="bg-bg-surface2 px-1.5 py-0.5 rounded text-[10px] text-text-secondary">{tribe}</span>}
                                    {emotion && <span className="bg-bg-surface2 px-1.5 py-0.5 rounded text-[10px] text-text-secondary">{emotion}</span>}
                                </>
                            )}
                        </div>
                    </div>
                </AccordionSection>

                {/* Dimension Shifts — expanded by default */}
                <AccordionSection title="DIMENSION SHIFTS" defaultOpen={true}>
                    <DimensionShifts
                        shifts={shifts}
                        onShiftsChange={onShiftsChange}
                        customInputs={{}}
                        onCustomInputChange={() => { }}
                    />
                </AccordionSection>

                {/* Applied Patterns */}
                <AccordionSection title="APPLIED PATTERNS" defaultOpen={true}>
                    <PatternPicker
                        appliedPattern={appliedPattern}
                        onApply={onApplyPattern}
                        onRemove={onRemovePattern}
                    />
                </AccordionSection>

                {/* Output Size */}
                <AccordionSection title="OUTPUT SIZE" defaultOpen={true}>
                    <select
                        value={aspectRatio}
                        onChange={(e) => onAspectRatioChange(e.target.value)}
                        className="w-full bg-bg-surface2 border border-border-default rounded-lg px-2.5 py-1.5 text-[12px] text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all cursor-pointer"
                    >
                        <option value="1:1">1:1 — Square</option>
                        <option value="4:5">4:5 — Portrait</option>
                        <option value="3:4">3:4 — Portrait Tall</option>
                        <option value="4:3">4:3 — Landscape</option>
                        <option value="16:9">16:9 — Wide</option>
                        <option value="9:16">9:16 — Tall</option>
                    </select>
                </AccordionSection>
            </FloatingPanel>
        </div>
    );
}
