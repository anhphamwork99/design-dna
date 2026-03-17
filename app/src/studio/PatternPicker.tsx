import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, X } from 'lucide-react';
import type { AppliedPatternData, SavedPattern } from './types';
import { listPatterns } from '../apiClient';
import { useAuth } from '../contexts/AuthContext';

interface PatternPickerProps {
    appliedPattern: AppliedPatternData | null;
    onApply: (pattern: AppliedPatternData) => void;
    onRemove: () => void;
}

const SECTION_OPTIONS = [
    { key: 'winning_formula', label: 'Winning Formula', desc: 'keep / experiment / avoid' },
    { key: 'visual_patterns', label: 'Visual Patterns', desc: 'colors, style, graphics' },
    { key: 'buyer_overlap', label: 'Buyer Overlap', desc: 'shared traits, emotions' },
    { key: 'made_for_me_patterns', label: 'Made For Me Patterns', desc: 'hooks, differentiation' },
    { key: 'specificity_ladder', label: 'Specificity Ladder', desc: 'specificity insights' },
];

export default function PatternPicker({
    appliedPattern,
    onApply,
    onRemove,
}: PatternPickerProps) {
    const { session } = useAuth();
    const [showPanel, setShowPanel] = useState(false);
    const [patterns, setPatterns] = useState<SavedPattern[]>([]);
    const [loading, setLoading] = useState(false);

    // Section dialog state
    const [showSectionDialog, setShowSectionDialog] = useState(false);
    const [pendingPattern, setPendingPattern] = useState<SavedPattern | null>(null);
    const [selectedSections, setSelectedSections] = useState<Record<string, boolean>>({});

    const handleTogglePanel = async () => {
        if (!showPanel && session) {
            setLoading(true);
            try {
                const result = await listPatterns(session.access_token);
                setPatterns(result);
            } catch (err) {
                console.error('Failed to load patterns:', err);
            } finally {
                setLoading(false);
            }
        }
        setShowPanel(!showPanel);
    };

    const handleSelectPattern = (pattern: SavedPattern) => {
        setPendingPattern(pattern);
        setSelectedSections({
            winning_formula: true,
            visual_patterns: true,
            buyer_overlap: true,
            made_for_me_patterns: true,
            specificity_ladder: true,
        });
        setShowSectionDialog(true);
        setShowPanel(false);
    };

    const handleApply = () => {
        if (!pendingPattern) return;
        const sections = Object.entries(selectedSections)
            .filter(([, v]) => v)
            .map(([k]) => k);
        const data: Record<string, any> = {};
        sections.forEach(s => {
            if (pendingPattern.batch_analysis?.[s]) {
                data[s] = pendingPattern.batch_analysis[s];
            }
        });
        onApply({
            patternId: pendingPattern.id,
            patternName: pendingPattern.name,
            selectedSections: sections,
            data,
        });
        setShowSectionDialog(false);
        setPendingPattern(null);
        setShowPanel(false);
    };

    return (
        <>
            <div className="bg-bg-surface1 p-3 rounded-xl border border-border-default">
                <div className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-2">
                    Applied Patterns
                </div>

                {appliedPattern ? (
                    <div className="flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent/10 text-accent text-[11px] rounded-lg border border-accent/20 max-w-full">
                            <Bookmark className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate max-w-[160px]">{appliedPattern.patternName}</span>
                            <button
                                onClick={onRemove}
                                className="flex-shrink-0 hover:text-white transition-colors rounded-full"
                                aria-label="Remove pattern"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    </div>
                ) : (
                    <button
                        onClick={handleTogglePanel}
                        className="px-3 py-1.5 text-[12px] text-accent bg-accent/10 rounded-lg border border-accent/20 hover:bg-accent/15 transition-colors"
                    >
                        + Add Pattern
                    </button>
                )}

                {/* Pattern list panel */}
                <AnimatePresence>
                    {showPanel && !appliedPattern && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-2"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center py-4">
                                    <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : patterns.length === 0 ? (
                                <p className="text-[12px] text-text-tertiary py-2">
                                    No saved patterns. Use Compare to save patterns.
                                </p>
                            ) : (
                                <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto">
                                    {patterns.map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => handleSelectPattern(p)}
                                            className="flex items-start gap-2 p-2 rounded-lg text-left hover:bg-bg-surface2 transition-colors"
                                        >
                                            <div className="flex gap-0.5 flex-shrink-0 mt-0.5">
                                                {p.thumbnails.slice(0, 3).map((t, i) => (
                                                    <img key={i} src={t} alt="" className="w-5 h-5 rounded" />
                                                ))}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-[12px] font-medium text-text-primary truncate">{p.name}</div>
                                                <div className="text-[11px] text-text-tertiary truncate">{p.summary}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Section Selection Dialog ── */}
            <AnimatePresence>
                {showSectionDialog && pendingPattern && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
                        onClick={() => { setShowSectionDialog(false); setPendingPattern(null); }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-bg-surface1 border border-border-default rounded-xl shadow-lg p-6 w-[420px] max-w-[90vw]"
                        >
                            <h3 className="text-[16px] font-semibold mb-1">Apply Pattern</h3>
                            <p className="text-[13px] text-text-secondary mb-4">
                                Select sections from "{pendingPattern.name}"
                            </p>

                            <div className="flex flex-col gap-2 mb-5">
                                {SECTION_OPTIONS.map(({ key, label, desc }) => {
                                    const hasData = pendingPattern.batch_analysis?.[key];
                                    return (
                                        <label
                                            key={key}
                                            className={`flex items-center gap-3 p-2.5 rounded-lg border transition-colors cursor-pointer ${selectedSections[key]
                                                    ? 'border-accent/30 bg-accent/5'
                                                    : 'border-border-default hover:bg-bg-surface2'
                                                } ${!hasData ? 'opacity-40 cursor-not-allowed' : ''}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={!!selectedSections[key]}
                                                disabled={!hasData}
                                                onChange={() => setSelectedSections(prev => ({ ...prev, [key]: !prev[key] }))}
                                                className="accent-accent w-4 h-4 rounded"
                                            />
                                            <div>
                                                <div className="text-[13px] font-medium text-text-primary">{label}</div>
                                                <div className="text-[11px] text-text-tertiary">{desc}</div>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => { setShowSectionDialog(false); setPendingPattern(null); }}
                                    className="px-4 py-2 text-[13px] text-text-secondary hover:text-text-primary rounded-lg hover:bg-bg-surface2 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleApply}
                                    disabled={!Object.values(selectedSections).some(v => v)}
                                    className="px-5 py-2 ai-gradient text-white text-[13px] font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Apply
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
