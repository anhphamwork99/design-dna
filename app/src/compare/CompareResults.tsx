import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Bookmark, Sparkles, RefreshCw, CircleCheck, FlaskConical, CircleX } from 'lucide-react';
import { savePattern, checkPatternSaved, resizeToThumbnail } from '../apiClient';
import { useAuth } from '../contexts/AuthContext';
import { Modal } from '../components/shared/Modal';
import type { CompareImage } from './types';

interface CompareResultsProps {
    images: CompareImage[];
    compareResult: any;
    onNewComparison: () => void;
}

export default function CompareResults({
    images,
    compareResult,
    onNewComparison,
}: CompareResultsProps) {
    const navigate = useNavigate();
    const { session } = useAuth();
    const analysis = compareResult?.batch_analysis;

    // ── Save as Pattern state ──
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [patternName, setPatternName] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // Check if already saved on mount
    useEffect(() => {
        if (!session || !analysis?.winning_formula?.summary) return;
        const summary = analysis.winning_formula.summary;
        checkPatternSaved(session.access_token, summary)
            .then((saved) => setIsSaved(saved))
            .catch(() => { });
    }, [session, analysis]);

    const handleSavePattern = async () => {
        if (!patternName.trim() || isSaving || !session) return;
        setIsSaving(true);
        try {
            const thumbnails = await Promise.all(
                images.map((img) => resizeToThumbnail(img.data))
            );
            const summary =
                analysis?.winning_formula?.summary || 'No summary';
            await savePattern(session.access_token, {
                name: patternName.trim(),
                summary,
                sourceImageCount: images.length,
                thumbnails,
                batchAnalysis: analysis,
            });
            setIsSaved(true);
            setShowSaveModal(false);
            setPatternName('');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2500);
        } catch (err) {
            console.error('Failed to save pattern:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleUseInStudio = () => {
        // Navigate to Studio with winning formula pre-loaded
        // Studio accepts { analysisResult, uploadedImage } — we pass the batch analysis
        // and set autoGoal to 'explore' so it auto-selects Explore flow
        navigate('/studio', {
            state: {
                analysisResult: analysis,
                autoGoal: 'explore',
            },
        });
    };

    return (
        <div className="pt-8 pb-16">
            {/* Header with image strip */}
            <div className="max-w-[900px] mx-auto mb-8">
                <h1 className="text-[32px] font-bold tracking-tight mb-3">
                    Your Winning Formula
                </h1>
                <p className="text-[14px] text-text-secondary mb-5">
                    Here's what your best designs have in common — use these insights to create more winners.
                </p>

                {/* Compact image strip */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 w-[64px] h-[64px] rounded-lg overflow-hidden border border-border-default"
                        >
                            <img
                                src={img.data}
                                alt={img.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                    <div className="flex-shrink-0 w-[64px] h-[64px] rounded-lg bg-bg-surface2 border border-border-default flex items-center justify-center">
                        <span className="text-[12px] text-text-tertiary font-medium">
                            {images.length} designs
                        </span>
                    </div>
                </div>
            </div>

            {/* Main content — single column, scannable sections */}
            <div className="max-w-[900px] mx-auto flex flex-col gap-6">
                {/* ── Section 1: Winning Formula (hero section) ── */}
                <div className="bg-bg-surface1 border-2 border-accent rounded-xl p-6">
                    <h2 className="text-[18px] font-bold text-accent mb-3">
                        The Formula
                    </h2>
                    <p className="text-[15px] text-text-primary leading-relaxed mb-6">
                        {analysis?.winning_formula?.summary ||
                            'No summary available.'}
                    </p>

                    {/* Keep / Experiment / Avoid — 3-column grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                        {/* Keep */}
                        <div className="bg-success-subtle border border-success/20 rounded-lg p-4">
                            <span className="text-[12px] text-success uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-2">
                                <CircleCheck className="w-4 h-4" /> Keep Doing
                            </span>
                            <ul className="flex flex-col gap-1.5">
                                {analysis?.winning_formula?.keep?.map(
                                    (item: string, i: number) => (
                                        <li
                                            key={i}
                                            className="text-[13px] text-text-primary"
                                        >
                                            {item}
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                        {/* Experiment */}
                        <div className="bg-warning-subtle border border-warning/20 rounded-lg p-4">
                            <span className="text-[12px] text-warning uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-2">
                                <FlaskConical className="w-4 h-4" /> Try Changing
                            </span>
                            <ul className="flex flex-col gap-1.5">
                                {analysis?.winning_formula?.experiment_with?.map(
                                    (item: string, i: number) => (
                                        <li
                                            key={i}
                                            className="text-[13px] text-text-primary"
                                        >
                                            {item}
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                        {/* Avoid */}
                        <div className="bg-error-subtle border border-error/20 rounded-lg p-4">
                            <span className="text-[12px] text-error uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-2">
                                <CircleX className="w-4 h-4" /> Stop Doing
                            </span>
                            <ul className="flex flex-col gap-1.5">
                                {analysis?.winning_formula?.avoid?.map(
                                    (item: string, i: number) => (
                                        <li
                                            key={i}
                                            className="text-[13px] text-text-primary"
                                        >
                                            {item}
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Suggested brief */}
                    {analysis?.winning_formula?.suggested_brief && (
                        <div className="bg-bg-base rounded-lg p-4 mb-6 border border-border-default">
                            <span className="text-[11px] text-text-tertiary uppercase tracking-wider font-semibold block mb-1">
                                Quick Brief
                            </span>
                            <p className="text-[14px] text-text-secondary italic">
                                "{analysis.winning_formula.suggested_brief}"
                            </p>
                        </div>
                    )}

                    {/* ── Action Buttons (2-row layout per CONTEXT.md) ── */}
                    <div className="flex flex-col gap-3">
                        {/* Row 1: Save as Pattern — full-width, primary */}
                        {isSaved ? (
                            <button
                                disabled
                                className="w-full border border-success/30 text-success font-medium py-3.5 px-6 rounded-xl text-[15px] opacity-70 cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Check className="w-5 h-5" /> Pattern Saved
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowSaveModal(true)}
                                className="w-full ai-gradient text-white font-medium py-3.5 px-6 rounded-xl text-[15px] hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base flex items-center justify-center gap-2"
                            >
                                <Bookmark className="w-5 h-5" /> Save as Pattern
                            </button>
                        )}

                        {/* Row 2: Use in Studio + New Comparison — identical secondary style */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleUseInStudio}
                                className="flex-1 border border-border-default text-text-primary font-medium py-3.5 px-6 rounded-xl text-[15px] hover:bg-bg-surface2 transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base flex items-center justify-center gap-2"
                            >
                                <Sparkles className="w-5 h-5" /> Use in Studio
                            </button>
                            <button
                                onClick={onNewComparison}
                                className="flex-1 border border-border-default text-text-primary font-medium py-3.5 px-6 rounded-xl text-[15px] hover:bg-bg-surface2 transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-5 h-5" /> New Comparison
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Section 2: Visual Patterns ── */}
                {analysis?.visual_patterns && (
                    <div className="bg-bg-surface1 border border-border-default rounded-xl p-6">
                        <h3 className="text-[16px] font-semibold mb-4">
                            Design DNA
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="bg-bg-base border border-border-default rounded-lg p-4">
                                <span className="text-[12px] text-text-tertiary uppercase tracking-wider font-semibold block mb-1">
                                    Colors
                                </span>
                                <span className="text-[14px] text-text-primary">
                                    {analysis.visual_patterns.common_colors || 'N/A'}
                                </span>
                            </div>
                            <div className="bg-bg-base border border-border-default rounded-lg p-4">
                                <span className="text-[12px] text-text-tertiary uppercase tracking-wider font-semibold block mb-1">
                                    Typography
                                </span>
                                <span className="text-[14px] text-text-primary">
                                    {analysis.visual_patterns.typography_trends || 'N/A'}
                                </span>
                            </div>
                            <div className="bg-bg-base border border-border-default rounded-lg p-4">
                                <span className="text-[12px] text-text-tertiary uppercase tracking-wider font-semibold block mb-1">
                                    Composition
                                </span>
                                <span className="text-[14px] text-text-primary">
                                    {analysis.visual_patterns.composition_patterns || 'N/A'}
                                </span>
                            </div>
                            <div className="bg-bg-base border border-border-default rounded-lg p-4">
                                <span className="text-[12px] text-text-tertiary uppercase tracking-wider font-semibold block mb-1">
                                    Illustration Style
                                </span>
                                <span className="text-[14px] text-text-primary">
                                    {analysis.visual_patterns.illustration_styles || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Section 3: Buyer Overlap ── */}
                <div className="bg-bg-surface1 border border-border-default rounded-xl p-6">
                    <h3 className="text-[16px] font-semibold mb-4">
                        Shared Audience
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-bg-base border border-border-default rounded-lg p-4">
                            <span className="text-[12px] text-text-tertiary uppercase tracking-wider font-semibold block mb-1">
                                Who Buys
                            </span>
                            <span className="text-[14px] text-text-primary">
                                {analysis?.buyer_overlap?.shared_persona || 'N/A'}
                            </span>
                        </div>
                        <div className="bg-bg-base border border-border-default rounded-lg p-4">
                            <span className="text-[12px] text-text-tertiary uppercase tracking-wider font-semibold block mb-1">
                                Their Identity
                            </span>
                            <span className="text-[14px] text-text-primary">
                                {analysis?.buyer_overlap?.shared_identity || 'N/A'}
                            </span>
                        </div>
                        <div className="bg-bg-base border border-border-default rounded-lg p-4">
                            <span className="text-[12px] text-text-tertiary uppercase tracking-wider font-semibold block mb-1">
                                What They Feel
                            </span>
                            <span className="text-[14px] text-text-primary">
                                {analysis?.buyer_overlap?.shared_emotion || 'N/A'}
                            </span>
                        </div>
                        <div className="bg-bg-base border border-border-default rounded-lg p-4">
                            <span className="text-[12px] text-text-tertiary uppercase tracking-wider font-semibold block mb-1">
                                When They Buy
                            </span>
                            <span className="text-[14px] text-text-primary">
                                {analysis?.buyer_overlap?.shared_occasion || 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Section 4: Pattern Analysis ── */}
                <div className="bg-bg-surface1 border border-border-default rounded-xl p-6">
                    <h3 className="text-[16px] font-semibold mb-4">
                        Why They Sell
                    </h3>
                    <ul className="flex flex-col gap-2 mb-6">
                        {analysis?.made_for_me_patterns?.map(
                            (pattern: string, index: number) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-3 bg-bg-base border border-border-default rounded-lg p-3"
                                >
                                    <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0"></div>
                                    <span className="text-[14px] text-text-primary">
                                        {pattern}
                                    </span>
                                </li>
                            )
                        )}
                    </ul>

                    {/* Specificity Ladder → renamed "Niche Level" */}
                    {analysis?.specificity_ladder && (
                        <>
                            <h4 className="text-[13px] font-semibold text-text-secondary uppercase tracking-wider mb-3">
                                Niche Level
                            </h4>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-4 bg-bg-base border border-border-default rounded-lg p-3 opacity-60">
                                    <div className="w-6 h-6 rounded-full bg-bg-surface2 flex items-center justify-center text-[12px] font-bold text-text-secondary">
                                        1
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-[11px] text-text-tertiary uppercase tracking-wider font-semibold block">
                                            Broad Market
                                        </span>
                                        <span className="text-[14px] text-text-secondary">
                                            {analysis.specificity_ladder.generic || '—'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-bg-base border border-border-default rounded-lg p-3">
                                    <div className="w-6 h-6 rounded-full bg-bg-surface2 flex items-center justify-center text-[12px] font-bold text-text-primary">
                                        2
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-[11px] text-text-tertiary uppercase tracking-wider font-semibold block">
                                            Focused Niche
                                        </span>
                                        <span className="text-[14px] text-text-primary">
                                            {analysis.specificity_ladder.niche || '—'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-bg-base border border-accent rounded-lg p-3">
                                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-[12px] font-bold text-white">
                                        3
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-[11px] text-accent uppercase tracking-wider font-semibold block">
                                            Your Sweet Spot
                                        </span>
                                        <span className="text-[14px] font-bold text-accent">
                                            {analysis.specificity_ladder.hyper_niche || '—'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* ── Save as Pattern Modal ── */}
            <Modal
                open={showSaveModal}
                onClose={() => {
                    setShowSaveModal(false);
                    setPatternName('');
                }}
                title="Save as Pattern"
                width="max-w-[400px]"
            >
                <div className="flex flex-col gap-4">
                    <p className="text-[13px] text-text-secondary">
                        Give your winning formula a name so you can apply it in the Studio later.
                    </p>
                    <input
                        type="text"
                        placeholder="e.g., Retro Cat Lovers, Bold Minimalist..."
                        value={patternName}
                        onChange={(e) => setPatternName(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === 'Enter' && handleSavePattern()
                        }
                        autoFocus
                        className="w-full bg-bg-surface2 border border-border-default rounded-lg px-4 py-2.5 text-[14px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    />
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={() => {
                                setShowSaveModal(false);
                                setPatternName('');
                            }}
                            className="px-4 py-2 text-[13px] text-text-secondary hover:text-text-primary rounded-lg hover:bg-bg-surface2 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSavePattern}
                            disabled={!patternName.trim() || isSaving}
                            className="px-5 py-2 ai-gradient text-white text-[13px] font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? 'Saving...' : 'Save Pattern'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* ── Toast Notification ── */}
            {showToast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-success text-white px-5 py-2.5 rounded-lg shadow-lg text-[14px] font-medium flex items-center gap-2 z-50">
                    <Check className="w-4 h-4" /> Pattern saved!
                </div>
            )}
        </div>
    );
}
