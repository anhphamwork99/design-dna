import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import type { Stage, StudioGoal, Shifts, AppliedPatternData, SynthesizedConcept } from './types';
import FloatingPanel from './FloatingPanel';
import AccordionSection from './AccordionSection';
import DimensionShifts from './DimensionShifts';
import ConceptCard from './ConceptCard';
import PatternPicker from './PatternPicker';

// ── Types ──────────────────────────────────────────────────────────

interface VariationStudioProps {
    goal: 'variations' | 'explore';
    stage: Stage;
    uploadedImage: { data: string; name: string; type: string };
    analysisResult: any;

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

    // Actions
    onCreateConcepts: () => void;
    onSelectConcept: (index: number) => void;
    onQuickAction: (index: number, action: 'download' | 'regenerate' | 'zoom') => void;
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
    shifts,
    onShiftsChange,
    appliedPattern,
    onApplyPattern,
    onRemovePattern,
    aspectRatio,
    onAspectRatioChange,
    concepts,
    conceptArtworks,
    onCreateConcepts,
    onSelectConcept,
    onQuickAction,
    onStartOver,
    error,
}: VariationStudioProps) {
    const [panelVisible, setPanelVisible] = useState(true);

    // Derived data from analysis
    const style = analysisResult?.visual_dna?.graphics?.style;
    const harmony = analysisResult?.visual_dna?.color?.harmony;
    const tribe = analysisResult?.buyer_dna?.identity_signals?.tribe;
    const emotion = analysisResult?.buyer_dna?.emotional_triggers?.primary_emotion;

    const isSynthesizing = stage === 'synthesizing';
    const isGenerating = stage === 'generating';
    const hasConcepts = concepts.length > 0;
    const hasAnyArtwork = conceptArtworks.size > 0;

    return (
        <div className="relative w-full h-full overflow-hidden">
            {/* ═══ CANVAS — full width ═══ */}
            <div className="flex flex-col items-center justify-center w-full h-full p-6 overflow-y-auto bg-bg-base">
                <AnimatePresence mode="wait">
                    {/* Synthesizing state */}
                    {isSynthesizing && (
                        <motion.div
                            key="synthesizing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center text-center"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-bg-surface1/80 border border-border-default flex items-center justify-center mb-5">
                                <Loader2 className="w-6 h-6 text-accent animate-spin" />
                            </div>
                            <h2 className="text-[16px] font-semibold mb-1.5">Creating concepts...</h2>
                            <p className="text-text-tertiary text-[13px]">
                                AI is synthesizing 3 design directions
                            </p>
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
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-[900px]"
                        >
                            <div className="text-center mb-6">
                                <h2 className="text-[18px] font-semibold mb-1">
                                    {hasAnyArtwork ? 'Your Concepts' : 'Choose a Concept'}
                                </h2>
                                <p className="text-text-tertiary text-[13px]">
                                    {hasAnyArtwork
                                        ? 'Click a card to view details or generate more artwork'
                                        : 'Click a card to see details and generate artwork'}
                                </p>
                            </div>
                            <div className="flex gap-4 justify-center flex-wrap">
                                {concepts.map((concept, i) => (
                                    <ConceptCard
                                        key={i}
                                        concept={concept}
                                        artwork={conceptArtworks.get(i) || null}
                                        index={i}
                                        isGenerating={isGenerating}
                                        onClick={() => onSelectConcept(i)}
                                        onQuickAction={(action) => onQuickAction(i, action)}
                                    />
                                ))}
                            </div>
                            {hasConcepts && (
                                <div className="flex justify-center gap-3 mt-6">
                                    <button
                                        onClick={onCreateConcepts}
                                        disabled={isSynthesizing || isGenerating}
                                        className="px-5 py-2.5 ai-gradient text-white rounded-xl font-medium text-[13px] shadow-lg hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" /> Regenerate Concepts
                                    </button>
                                    <button
                                        onClick={onStartOver}
                                        className="px-4 py-2 text-[12px] text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-bg-surface2"
                                    >
                                        ← Start Over
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Empty state — CTA lives here on canvas */}
                    {!isSynthesizing && !error && !hasConcepts && (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center text-center max-w-[320px]"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-bg-surface1/80 border border-border-default/50 flex items-center justify-center mb-5">
                                <Sparkles className="w-7 h-7 text-text-tertiary" />
                            </div>
                            <h2 className="text-[18px] font-medium text-text-primary mb-1.5">
                                {goal === 'explore' ? 'Ready to Explore' : 'Ready for Variations'}
                            </h2>
                            <p className="text-text-tertiary text-[13px] mb-6 leading-relaxed">
                                {goal === 'explore'
                                    ? 'Configure your dimension shifts in the panel, then create wildly fresh concepts'
                                    : 'Adjust what to keep and change in the panel, then create concept variations'}
                            </p>
                            <button
                                onClick={onCreateConcepts}
                                disabled={isSynthesizing}
                                className="px-6 py-2.5 ai-gradient text-white rounded-lg font-medium text-[14px] shadow-lg hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center gap-2"
                            >
                                <Sparkles className="w-4 h-4" /> Create Concepts
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ═══ FLOATING PANEL — overlays on left ═══ */}
            <FloatingPanel isVisible={panelVisible} onToggle={() => setPanelVisible(!panelVisible)}>
                {/* Your Original — thumbnail + tags only (no filename) */}
                <AccordionSection title="YOUR ORIGINAL" defaultOpen={false}>
                    <div className="flex gap-2 items-start">
                        <img
                            src={uploadedImage.data}
                            alt="Original design"
                            className="w-10 h-10 rounded-lg object-cover border border-border-default flex-shrink-0"
                        />
                        <div className="flex flex-wrap gap-1">
                            {style && <span className="bg-bg-surface2 px-1.5 py-0.5 rounded text-[10px] text-text-secondary">{style}</span>}
                            {harmony && <span className="bg-bg-surface2 px-1.5 py-0.5 rounded text-[10px] text-text-secondary">{harmony}</span>}
                            {tribe && <span className="bg-bg-surface2 px-1.5 py-0.5 rounded text-[10px] text-text-secondary">{tribe}</span>}
                            {emotion && <span className="bg-bg-surface2 px-1.5 py-0.5 rounded text-[10px] text-text-secondary">{emotion}</span>}
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
                <AccordionSection title="APPLIED PATTERNS" defaultOpen={false}>
                    <PatternPicker
                        appliedPattern={appliedPattern}
                        onApply={onApplyPattern}
                        onRemove={onRemovePattern}
                    />
                </AccordionSection>

                {/* Output Size */}
                <AccordionSection title="OUTPUT SIZE" defaultOpen={false}>
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
