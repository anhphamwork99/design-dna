import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Download, Sparkles, AlertCircle, X, Settings, Paintbrush, Loader2, RefreshCw, RotateCcw } from 'lucide-react';
import { synthesizeConcept, generateArtwork, analyzeBuyerFit, SynthesizedConcept } from './api';

// ── Types ──────────────────────────────────────────────────────────
interface CreativeStudioProps {
    key?: string;
    analysisResult: any;
    uploadedImage: { data: string; name: string; type: string } | null;
    onNavigate: (screen: any) => void;
    prefilledBrief?: string;
    initialGenMode?: string;
}

interface ShiftState {
    keep: boolean;
    value: string;
}

interface Shifts {
    S: ShiftState;
    H: ShiftState;
    I: ShiftState;
    F: ShiftState;
    T: ShiftState;
    B: ShiftState;
}

// ── Helpers ────────────────────────────────────────────────────────
function getInitialShifts(initialGenMode?: string, prefilledBrief?: string): Shifts {
    if (prefilledBrief) {
        return {
            S: { keep: false, value: prefilledBrief },
            H: { keep: false, value: '' },
            I: { keep: false, value: '' },
            F: { keep: false, value: '' },
            T: { keep: false, value: '' },
            B: { keep: false, value: '' },
        };
    }
    if (initialGenMode === 'new_buyer') {
        return {
            S: { keep: true, value: '' },
            H: { keep: true, value: '' },
            I: { keep: true, value: '' },
            F: { keep: true, value: '' },
            T: { keep: false, value: '' },
            B: { keep: false, value: '' },
        };
    }
    // Default: same buyer, new design
    return {
        S: { keep: false, value: '' },
        H: { keep: false, value: '' },
        I: { keep: true, value: '' },
        F: { keep: true, value: '' },
        T: { keep: true, value: '' },
        B: { keep: true, value: '' },
    };
}

function getInitialCreativity(prefilledBrief?: string): number {
    return prefilledBrief ? 3 : 2;
}

const creativityLabels: Record<number, string> = {
    1: "Almost identical — subtle refinements to changed dimensions",
    2: "Same vibe — reinterprets your changes while staying close",
    3: "Noticeably different — bold take on your changes",
    4: "Very different — your changes as loose starting points",
    5: "Wildly new — maximum creative freedom on everything"
};

const creativityLevelNames: Record<number, string> = {
    1: 'Subtle',
    2: 'Close',
    3: 'Bold',
    4: 'Fresh',
    5: 'Wild',
};

const dimensionConfig = [
    { key: 'S' as const, name: 'Visual Style', placeholder: 'e.g., Watercolor landscape' },
    { key: 'H' as const, name: 'Colors', placeholder: 'e.g., Cool blues and teals' },
    { key: 'I' as const, name: 'Graphics', placeholder: 'e.g., Cat instead of dog' },
    { key: 'F' as const, name: 'Typography', placeholder: 'e.g., Bold hand-lettered' },
    { key: 'T' as const, name: 'Theme & Mood', placeholder: 'e.g., Calm serenity' },
    { key: 'B' as const, name: 'Audience', placeholder: 'e.g., Yoga moms 30-40' },
];

// ── Main Component ────────────────────────────────────────────────
export default function CreativeStudio({
    analysisResult,
    uploadedImage,
    onNavigate,
    prefilledBrief,
    initialGenMode,
}: CreativeStudioProps) {
    // ── State ──
    const [creativity, setCreativity] = useState<number>(() => getInitialCreativity(prefilledBrief));
    const [shifts, setShifts] = useState<Shifts>(() => getInitialShifts(initialGenMode, prefilledBrief));
    const [appliedPattern, setAppliedPattern] = useState<string | null>(prefilledBrief || null);
    const [aspectRatio, setAspectRatio] = useState('1:1');

    // Synthesis state
    const [concepts, setConcepts] = useState<SynthesizedConcept[]>([]);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [selectedConceptIndex, setSelectedConceptIndex] = useState(0);
    const [isSynthesizing, setIsSynthesizing] = useState(false);

    // Generation state
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStep, setGenerationStep] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [buyerFitScores, setBuyerFitScores] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // ── Handlers ──

    const handleSynthesize = async () => {
        const apiKey = localStorage.getItem('designdna_api_key');
        if (!apiKey) {
            document.dispatchEvent(new CustomEvent('open-settings'));
            return;
        }

        setIsSynthesizing(true);
        setError(null);
        setConcepts([]);
        setShowResult(false);
        setGeneratedImage(null);
        setBuyerFitScores(null);

        try {
            const result = await synthesizeConcept(apiKey, {
                originalDna: analysisResult,
                shifts,
                creativity,
                appliedPattern: appliedPattern || undefined,
            });
            setConcepts(result);
            setCarouselIndex(0);
        } catch (err: any) {
            console.error(err);
            let errMsg = err.message || 'Failed to create concepts';
            if (errMsg.includes('403') || errMsg.includes('API key not valid')) {
                errMsg = 'Invalid API Key. Please check your settings.';
            }
            setError(errMsg);
        } finally {
            setIsSynthesizing(false);
        }
    };

    const handleGenerateArtwork = async () => {
        const apiKey = localStorage.getItem('designdna_api_key');
        if (!apiKey || concepts.length === 0) return;

        const selectedConcept = concepts[carouselIndex];
        setIsGenerating(true);
        setError(null);

        try {
            const imageBase64 = await generateArtwork(apiKey, {
                concept: selectedConcept,
                originalImage: uploadedImage?.data || '',
                originalMimeType: uploadedImage?.type || 'image/png',
                aspectRatio,
                creativity,
                onProgress: (step) => setGenerationStep(step),
            });
            setGeneratedImage(imageBase64);
            setSelectedConceptIndex(carouselIndex);

            // Run buyer fit scoring (fire-and-forget with state update)
            const fitPrompt = `${selectedConcept.title}: ${selectedConcept.description}. Visual: ${selectedConcept.visualDirection}. Target: ${selectedConcept.targetBuyer}. Text: "${selectedConcept.suggestedText?.primary || ''}". Made-for-me: ${selectedConcept.madeForMeHook || 'N/A'}`;
            analyzeBuyerFit(apiKey, fitPrompt).then(setBuyerFitScores).catch(console.error);

            setShowResult(true);
        } catch (err: any) {
            console.error(err);
            let errMsg = err.message || 'Failed to generate artwork';
            if (errMsg.includes('403') || errMsg.includes('API key not valid')) {
                errMsg = 'Invalid API Key. Please check your settings.';
            }
            setError(errMsg);
            setShowResult(true);
        } finally {
            setIsGenerating(false);
        }
    };

    // 3 retry tiers
    const handleRegenerateArtwork = () => {
        setShowResult(false);
        setGeneratedImage(null);
        setBuyerFitScores(null);
        setError(null);
        // Trigger artwork generation with same concept
        setTimeout(() => handleGenerateArtwork(), 0);
    };

    const handleTryDifferentConcept = () => {
        setShowResult(false);
        setGeneratedImage(null);
        setBuyerFitScores(null);
        setError(null);
        // Concepts are still cached — show carousel
    };

    const handleStartOver = () => {
        setShowResult(false);
        setGeneratedImage(null);
        setBuyerFitScores(null);
        setConcepts([]);
        setError(null);
        // Returns to empty state with "Create Concepts" CTA
    };

    const handleDownload = () => {
        if (!generatedImage) return;
        const conceptTitle = concepts[selectedConceptIndex]?.title || 'design';
        const slug = conceptTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
        const a = document.createElement('a');
        a.href = generatedImage;
        a.download = `designdna-${slug}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleRemovePattern = () => {
        setAppliedPattern(null);
    };

    // ── Derived data ──
    const style = analysisResult?.visual_dna?.graphics?.style;
    const harmony = analysisResult?.visual_dna?.color?.harmony;
    const tribe = analysisResult?.buyer_dna?.identity_signals?.tribe;
    const emotion = analysisResult?.buyer_dna?.emotional_triggers?.primary_emotion;

    const allKeep = dimensionConfig.every(dim => shifts[dim.key].keep);

    // ── Center Canvas State Machine ──
    const renderCenterCanvas = () => {
        // 1. Synthesis loading
        if (isSynthesizing) {
            return (
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-bg-surface1/80 border border-border-default flex items-center justify-center mb-5">
                        <Loader2 className="w-6 h-6 text-accent animate-spin" />
                    </div>
                    <h2 className="text-[16px] font-semibold mb-1.5">Creating concepts...</h2>
                    <p className="text-text-tertiary text-[13px]">
                        AI is synthesizing 3 design directions
                    </p>
                </div>
            );
        }

        // 2. Artwork loading
        if (isGenerating) {
            return (
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-bg-surface1/80 border border-border-default flex items-center justify-center mb-5">
                        <Loader2 className="w-6 h-6 text-accent animate-spin" />
                    </div>
                    <h2 className="text-[16px] font-semibold mb-1.5">{generationStep || 'Generating artwork...'}</h2>
                    <p className="text-text-tertiary text-[13px]">
                        {generationStep.includes('illustration') ? 'Step 1 of 2 — creating the illustration' :
                            generationStep.includes('typography') ? 'Step 2 of 2 — adding decorated text' :
                                'This usually takes 20–40 seconds'}
                    </p>
                </div>
            );
        }

        // 3. Error state
        if (showResult && error) {
            return (
                <div className="flex flex-col items-center justify-center text-center max-w-[400px]">
                    <div className="bg-error/10 border border-error/20 p-6 rounded-xl w-full">
                        <AlertCircle className="w-8 h-8 text-error mx-auto mb-3" />
                        <h3 className="text-error font-medium mb-2">Generation Failed</h3>
                        <p className="text-text-secondary text-[14px] mb-4">{error}</p>
                        <div className="flex gap-2 justify-center">
                            {concepts.length > 0 ? (
                                <button
                                    onClick={handleTryDifferentConcept}
                                    className="px-5 py-2.5 ai-gradient text-white rounded-lg text-[14px] font-medium hover:opacity-90 transition-opacity"
                                >
                                    Back to Concepts
                                </button>
                            ) : (
                                <button
                                    onClick={handleSynthesize}
                                    className="px-5 py-2.5 ai-gradient text-white rounded-lg text-[14px] font-medium hover:opacity-90 transition-opacity"
                                >
                                    Try Again
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // 4. Artwork display + retry buttons
        if (showResult && generatedImage) {
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center max-w-full max-h-full"
                >
                    <img
                        src={generatedImage}
                        alt="Generated Design"
                        className="max-w-full max-h-[calc(100vh-240px)] object-contain rounded-xl border border-border-default shadow-lg"
                    />
                    {/* Primary actions */}
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={handleDownload}
                            className="px-4 py-2 bg-bg-surface1 border border-border-default rounded-lg text-[13px] font-medium hover:bg-bg-surface2 transition-colors flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-accent"
                        >
                            <Download className="w-3.5 h-3.5" /> Download
                        </button>
                    </div>
                    {/* Retry tiers */}
                    <div className="flex gap-1 mt-3">
                        <button
                            onClick={handleRegenerateArtwork}
                            className="px-3 py-1.5 text-[12px] text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5 rounded-lg hover:bg-bg-surface1/60"
                        >
                            <RefreshCw className="w-3 h-3" /> Regenerate
                        </button>
                        <button
                            onClick={handleTryDifferentConcept}
                            className="px-3 py-1.5 text-[12px] text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5 rounded-lg hover:bg-bg-surface1/60"
                        >
                            <RotateCcw className="w-3 h-3" /> Try Different Concept
                        </button>
                        <button
                            onClick={handleStartOver}
                            className="px-3 py-1.5 text-[12px] text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5 rounded-lg hover:bg-bg-surface1/60"
                        >
                            <Sparkles className="w-3 h-3" /> Start Over
                        </button>
                    </div>
                </motion.div>
            );
        }

        // 5. Concept carousel
        if (concepts.length > 0) {
            const concept = concepts[carouselIndex];
            return (
                <div className="flex flex-col items-center justify-center max-w-[520px] w-full">
                    {/* Carousel header */}
                    <div className="flex items-center gap-4 mb-4 text-text-tertiary text-[12px]">
                        <span>Concept {carouselIndex + 1} of {concepts.length}</span>
                    </div>

                    {/* Concept card */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={carouselIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="bg-bg-surface1 border border-border-default rounded-xl p-6 w-full"
                        >
                            <h3 className="text-[18px] font-semibold mb-3">{concept.title}</h3>
                            <p className="text-[14px] text-text-secondary mb-4 leading-relaxed">
                                {concept.description}
                            </p>

                            {/* Suggested Text */}
                            {concept.suggestedText && concept.suggestedText.primary && (
                                <div className="mb-4 bg-accent/5 border border-accent/10 rounded-lg px-4 py-3">
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
                                <div className="mb-4">
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
                                    <p className="text-[13px] text-text-primary mt-1">
                                        {concept.visualDirection}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">
                                        Target Buyer
                                    </span>
                                    <p className="text-[13px] text-text-primary mt-1">
                                        {concept.targetBuyer}
                                    </p>
                                </div>

                                {/* Made For Me Hook */}
                                {concept.madeForMeHook && (
                                    <div>
                                        <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">
                                            "Made For Me" Hook
                                        </span>
                                        <p className="text-[13px] text-text-primary mt-1 bg-bg-surface2/50 rounded-lg px-3 py-2">
                                            💡 {concept.madeForMeHook}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">
                                        Why It Works
                                    </span>
                                    <p className="text-[13px] text-text-primary mt-1">
                                        {concept.coherenceNotes}
                                    </p>
                                </div>
                            </div>

                            {/* Key Elements chips */}
                            {concept.keyElements && concept.keyElements.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-border-default/30">
                                    {concept.keyElements.map((el, i) => (
                                        <span key={i} className="bg-bg-surface2 px-2 py-0.5 rounded text-[11px] text-text-secondary">
                                            {el}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Arrow navigation + dots */}
                    <div className="flex items-center gap-3 mt-4">
                        <button
                            onClick={() => setCarouselIndex(i => Math.max(0, i - 1))}
                            disabled={carouselIndex === 0}
                            className="p-2 rounded-lg bg-bg-surface1 border border-border-default text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label="Previous concept"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>

                        <div className="flex gap-1.5">
                            {concepts.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCarouselIndex(i)}
                                    className={`w-2 h-2 rounded-full transition-colors ${i === carouselIndex ? 'bg-accent' : 'bg-bg-surface2 hover:bg-text-tertiary'}`}
                                    aria-label={`Go to concept ${i + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => setCarouselIndex(i => Math.min(concepts.length - 1, i + 1))}
                            disabled={carouselIndex === concepts.length - 1}
                            className="p-2 rounded-lg bg-bg-surface1 border border-border-default text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label="Next concept"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 mt-5">
                        <button
                            onClick={handleGenerateArtwork}
                            className="px-6 py-2.5 ai-gradient text-white rounded-lg font-medium text-[14px] shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                        >
                            <Paintbrush className="w-4 h-4" /> Generate Artwork
                        </button>
                        <button
                            onClick={handleStartOver}
                            className="px-4 py-2.5 bg-bg-surface1 border border-border-default rounded-lg text-[13px] font-medium hover:bg-bg-surface2 transition-colors flex items-center gap-2"
                        >
                            <RefreshCw className="w-3.5 h-3.5" /> Regenerate All
                        </button>
                    </div>
                </div>
            );
        }

        // 6. Empty state — Create Concepts CTA
        return (
            <div className="flex flex-col items-center justify-center text-center max-w-[320px]">
                <div className="w-14 h-14 rounded-2xl bg-bg-surface1/80 border border-border-default/50 flex items-center justify-center mb-5">
                    <Paintbrush className="w-6 h-6 text-text-tertiary" />
                </div>
                <h2 className="text-[16px] font-medium text-text-secondary mb-1.5">Ready to create</h2>
                <p className="text-text-tertiary text-[13px] mb-6 leading-relaxed">
                    Configure your design on the left, then create concepts
                </p>
                <button
                    onClick={handleSynthesize}
                    disabled={isSynthesizing}
                    className="px-6 py-2.5 ai-gradient text-white rounded-lg font-medium text-[14px] shadow-lg hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center gap-2"
                >
                    <Sparkles className="w-4 h-4" />
                    Create Concepts
                </button>
            </div>
        );
    };

    // ── Render ──
    return (
        <div className="flex flex-col h-screen bg-bg-base">
            {/* ── Topbar ── */}
            <div className="h-12 flex items-center justify-between px-4 border-b border-border-default flex-shrink-0 bg-bg-surface1">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onNavigate(prefilledBrief ? 'compare_results' : 'results')}
                        className="flex items-center text-text-secondary hover:text-text-primary text-[13px] font-medium transition-colors gap-1.5"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <div className="w-px h-5 bg-border-default" />
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded ai-gradient" />
                        <span className="text-[14px] font-semibold">Creative Studio</span>
                    </div>
                </div>
                <button
                    onClick={() => document.dispatchEvent(new CustomEvent('open-settings'))}
                    className="text-text-tertiary hover:text-text-primary transition-colors p-1.5 rounded-lg hover:bg-bg-surface2"
                    aria-label="Settings"
                >
                    <Settings className="w-4 h-4" />
                </button>
            </div>

            {/* ── 3-Panel Layout ── */}
            <div className="flex flex-1 overflow-hidden">

                {/* ═══ LEFT PANEL: Configuration ═══ */}
                <div
                    className="w-[280px] flex-shrink-0 border-r border-border-default overflow-y-auto p-4 space-y-3 bg-bg-surface1/50"
                    role="form"
                    aria-label="Design configuration"
                >
                    {/* ── Your Original ── */}
                    <div className="bg-bg-surface2/50 p-3 rounded-xl border border-border-default">
                        <div className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-2">
                            Your Original
                        </div>
                        {uploadedImage && (
                            <img
                                src={uploadedImage.data}
                                alt={uploadedImage.name}
                                className="w-[80px] h-[80px] rounded-lg object-cover border border-border-default mb-2"
                            />
                        )}
                        <div className="text-[13px] font-medium truncate mb-2">
                            {uploadedImage?.name || 'Untitled'}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {style && <span className="bg-bg-surface2 px-2 py-0.5 rounded text-[11px] text-text-secondary">{style}</span>}
                            {harmony && <span className="bg-bg-surface2 px-2 py-0.5 rounded text-[11px] text-text-secondary">{harmony}</span>}
                            {tribe && <span className="bg-bg-surface2 px-2 py-0.5 rounded text-[11px] text-text-secondary">{tribe}</span>}
                            {emotion && <span className="bg-bg-surface2 px-2 py-0.5 rounded text-[11px] text-text-secondary">{emotion}</span>}
                        </div>
                    </div>

                    {/* ── What to Change (6 Dimensions) ── */}
                    <div className="bg-bg-surface1 p-4 rounded-xl border border-border-default">
                        <div className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-3">
                            What to Change
                        </div>

                        {allKeep && (
                            <div className="text-[12px] text-text-tertiary bg-bg-surface2/50 p-2 rounded-lg mb-3 text-center" role="status">
                                All set to Keep — result will closely follow the original.
                            </div>
                        )}

                        <div className="space-y-1">
                            {dimensionConfig.map((dim) => {
                                const state = shifts[dim.key];
                                return (
                                    <div
                                        key={dim.key}
                                        className="py-2 border-b border-border-default/30 last:border-0"
                                    >
                                        <div className="flex items-center justify-between gap-2 mb-1.5">
                                            <span className="text-[13px] font-medium flex-shrink-0">
                                                {dim.name}
                                            </span>
                                            <div className="flex items-center bg-bg-surface2 p-0.5 rounded-full border border-border-default">
                                                <button
                                                    onClick={() =>
                                                        setShifts((s) => ({
                                                            ...s,
                                                            [dim.key]: { ...s[dim.key], keep: true },
                                                        }))
                                                    }
                                                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-accent ${state.keep
                                                        ? 'bg-bg-surface1 text-text-primary shadow-sm'
                                                        : 'text-text-secondary hover:text-text-primary'
                                                        }`}
                                                >
                                                    Keep
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setShifts((s) => ({
                                                            ...s,
                                                            [dim.key]: { ...s[dim.key], keep: false },
                                                        }))
                                                    }
                                                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-accent ${!state.keep
                                                        ? 'bg-accent text-white shadow-sm'
                                                        : 'text-text-secondary hover:text-text-primary'
                                                        }`}
                                                >
                                                    Change
                                                </button>
                                            </div>
                                        </div>

                                        {!state.keep && (
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder={dim.placeholder}
                                                    value={state.value}
                                                    onChange={(e) =>
                                                        setShifts((s) => ({
                                                            ...s,
                                                            [dim.key]: { ...s[dim.key], value: e.target.value },
                                                        }))
                                                    }
                                                    className="w-full bg-bg-surface2 border border-border-default rounded-lg px-3 py-1.5 text-[12px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                                />
                                                <p className="text-[10px] text-text-tertiary mt-1">Leave empty to let AI decide</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── How Different? (Creativity Level) ── */}
                    <div className="bg-bg-surface1 p-4 rounded-xl border border-border-default">
                        <div className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-3">
                            How Different?
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            step="1"
                            value={creativity}
                            onChange={(e) => setCreativity(parseInt(e.target.value))}
                            className="w-full accent-accent h-1.5 bg-bg-surface2 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-text-tertiary mt-2 font-medium">
                            {[1, 2, 3, 4, 5].map((n) => (
                                <span key={n} className={n === creativity ? 'text-accent font-semibold' : ''}>
                                    {creativityLevelNames[n]}
                                </span>
                            ))}
                        </div>
                        <div className="text-[12px] text-text-secondary mt-3 text-center bg-bg-surface2 py-1.5 rounded-lg">
                            {creativityLabels[creativity]}
                        </div>
                    </div>

                    {/* ── Applied Patterns ── */}
                    <div className="bg-bg-surface1 p-4 rounded-xl border border-border-default">
                        <div className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-3">
                            Applied Patterns
                        </div>

                        {appliedPattern ? (
                            <div className="flex flex-wrap gap-1.5">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent/10 text-accent text-[11px] rounded-lg border border-accent/20 max-w-full">
                                    <span className="truncate max-w-[180px]">{appliedPattern}</span>
                                    <button
                                        onClick={handleRemovePattern}
                                        className="flex-shrink-0 hover:text-white transition-colors rounded-full"
                                        aria-label={`Remove pattern`}
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            </div>
                        ) : (
                            <button
                                disabled
                                className="px-3 py-1.5 text-[12px] text-text-tertiary bg-bg-surface2 rounded-lg border border-border-default opacity-50 cursor-not-allowed"
                                title="Pattern library coming in Phase 7C"
                            >
                                + Add Pattern
                            </button>
                        )}
                    </div>

                    {/* ── Output Size (Aspect Ratio) ── */}
                    <div className="bg-bg-surface1 p-4 rounded-xl border border-border-default">
                        <div className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-3">
                            Output Size
                        </div>
                        <select
                            value={aspectRatio}
                            onChange={(e) => setAspectRatio(e.target.value)}
                            className="w-full bg-bg-surface2 border border-border-default rounded-lg px-3 py-2 text-[13px] text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all cursor-pointer"
                        >
                            <option value="1:1">1:1 — Square</option>
                            <option value="4:5">4:5 — Portrait</option>
                            <option value="3:4">3:4 — Portrait Tall</option>
                            <option value="4:3">4:3 — Landscape</option>
                            <option value="16:9">16:9 — Wide</option>
                            <option value="9:16">9:16 — Tall</option>
                        </select>
                    </div>
                </div>

                {/* ═══ CENTER CANVAS: Concepts + Artwork ═══ */}
                <div
                    className="flex-1 flex flex-col items-center p-6 overflow-y-auto relative"
                    role="main"
                    style={{
                        background: 'linear-gradient(180deg, hsl(222 47% 9%) 0%, hsl(222 47% 7%) 100%)',
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.1)',
                    }}
                >
                    {renderCenterCanvas()}
                </div>

                {/* ═══ RIGHT PANEL: Buyer Fit ═══ */}
                <div
                    className="w-[300px] flex-shrink-0 border-l border-border-default overflow-y-auto p-4 bg-bg-surface1/50"
                    role="complementary"
                    aria-label="Buyer fit evaluation"
                >
                    {showResult && !error && buyerFitScores ? (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <div className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">
                                Buyer Fit
                            </div>
                            <div className="bg-bg-surface2 p-4 rounded-xl border border-border-default space-y-4">
                                {/* Buyer Match */}
                                <div>
                                    <div className="flex justify-between text-[13px] mb-1.5">
                                        <span className="text-text-secondary">Buyer Match</span>
                                        <span className="text-text-primary font-medium">{buyerFitScores.buyer_match || 0}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-bg-surface1 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-success rounded-full transition-all duration-1000"
                                            style={{ width: `${buyerFitScores.buyer_match || 0}%` }}
                                        />
                                    </div>
                                </div>
                                {/* Emotion Match */}
                                <div>
                                    <div className="flex justify-between text-[13px] mb-1.5">
                                        <span className="text-text-secondary">Emotion Match</span>
                                        <span className="text-text-primary font-medium">{buyerFitScores.emotion_match || 0}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-bg-surface1 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-success rounded-full transition-all duration-1000"
                                            style={{ width: `${buyerFitScores.emotion_match || 0}%` }}
                                        />
                                    </div>
                                </div>
                                {/* Originality */}
                                <div>
                                    <div className="flex justify-between text-[13px] mb-1.5">
                                        <span className="text-text-secondary">Originality</span>
                                        <span className="text-text-primary font-medium">{buyerFitScores.originality || 0}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-bg-surface1 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-accent rounded-full transition-all duration-1000"
                                            style={{ width: `${buyerFitScores.originality || 0}%` }}
                                        />
                                    </div>
                                </div>
                                {/* Made For Me */}
                                <div className="pt-2 border-t border-border-default">
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-text-secondary">"Made For Me" Signals</span>
                                        <span className="text-text-primary font-medium">{buyerFitScores.made_for_me_signal_count || 0}/5</span>
                                    </div>
                                </div>
                            </div>

                            {/* Selected concept info */}
                            {concepts[selectedConceptIndex] && (
                                <div className="bg-bg-surface2 p-4 rounded-xl border border-border-default">
                                    <div className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-2">
                                        Selected Concept
                                    </div>
                                    <h4 className="text-[14px] font-medium mb-1">{concepts[selectedConceptIndex].title}</h4>
                                    <p className="text-[12px] text-text-secondary leading-relaxed">
                                        {concepts[selectedConceptIndex].description}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        /* Empty right panel */
                        <div className="h-full flex items-center justify-center">
                            <p className="text-[12px] text-text-tertiary text-center">
                                Buyer Fit scores will appear here after you generate artwork
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
