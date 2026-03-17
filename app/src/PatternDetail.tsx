import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trash2, Loader2 } from 'lucide-react';
import { getPatternById, deletePatternById, SavedPattern } from './apiClient';
import { useAuth } from './contexts/AuthContext';

interface PatternDetailProps {
    patternId: string;
    onNavigate: (screen: string) => void;
}

export default function PatternDetail({ patternId, onNavigate }: PatternDetailProps) {
    const { session } = useAuth();
    const [pattern, setPattern] = useState<SavedPattern | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!session) return;
        setIsLoading(true);
        getPatternById(session.access_token, patternId)
            .then(setPattern)
            .catch((err) => {
                console.error('Failed to load pattern:', err);
                setPattern(null);
            })
            .finally(() => setIsLoading(false));
    }, [session, patternId]);

    const handleDelete = async () => {
        if (!session) return;
        setIsDeleting(true);
        try {
            await deletePatternById(session.access_token, patternId);
            onNavigate('pattern_library');
        } catch (err) {
            console.error('Failed to delete pattern:', err);
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="pt-8 flex flex-col items-center justify-center text-center py-20">
                <Loader2 className="w-8 h-8 text-accent animate-spin mb-4" />
                <p className="text-[14px] text-text-secondary">Loading pattern...</p>
            </div>
        );
    }

    if (!pattern) {
        return (
            <div className="pt-8 text-center">
                <p className="text-text-secondary">Pattern not found.</p>
                <button
                    onClick={() => onNavigate('pattern_library')}
                    className="mt-4 text-accent hover:underline text-[14px]"
                >
                    Back to Library
                </button>
            </div>
        );
    }

    const analysis = pattern.batch_analysis;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-8"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-[24px] font-bold tracking-tight">{pattern.name}</h1>
                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-2 text-text-tertiary hover:text-error rounded-lg hover:bg-error/10 transition-colors"
                    aria-label="Delete pattern"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar: Thumbnails + Metadata */}
                <div className="w-full md:w-[30%] md:sticky md:top-[80px] self-start">
                    <div className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 mb-4">
                        {pattern.thumbnails.map((thumb, i) => (
                            <div key={i} className="flex-shrink-0 w-[80px] h-[80px] md:w-full md:h-auto md:aspect-square bg-bg-surface2 rounded-xl border border-border-default overflow-hidden">
                                <img src={thumb} alt="" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                    <div className="text-[12px] text-text-tertiary space-y-1">
                        <p>{pattern.source_image_count} source design{pattern.source_image_count !== 1 ? 's' : ''}</p>
                        <p>Saved {new Date(pattern.created_at).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full md:w-[70%] flex flex-col gap-8">
                    {/* Winning Formula */}
                    <div className="bg-bg-surface2 border-2 border-accent rounded-xl p-6">
                        <h2 className="text-[18px] font-bold text-accent mb-4">The Winning Formula</h2>
                        <p className="text-[14px] text-text-primary mb-6 leading-relaxed">
                            {analysis?.winning_formula?.summary || 'No summary available.'}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                            <div className="bg-success-subtle border border-success/20 rounded-lg p-4">
                                <span className="text-[12px] text-success uppercase tracking-wider font-semibold block mb-2">✅ Keep</span>
                                <ul className="flex flex-col gap-1.5">
                                    {analysis?.winning_formula?.keep?.map((item: string, i: number) => (
                                        <li key={i} className="text-[13px] text-text-primary">{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-warning-subtle border border-warning/20 rounded-lg p-4">
                                <span className="text-[12px] text-warning uppercase tracking-wider font-semibold block mb-2">🧪 Experiment</span>
                                <ul className="flex flex-col gap-1.5">
                                    {analysis?.winning_formula?.experiment_with?.map((item: string, i: number) => (
                                        <li key={i} className="text-[13px] text-text-primary">{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-error-subtle border border-error/20 rounded-lg p-4">
                                <span className="text-[12px] text-error uppercase tracking-wider font-semibold block mb-2">❌ Avoid</span>
                                <ul className="flex flex-col gap-1.5">
                                    {analysis?.winning_formula?.avoid?.map((item: string, i: number) => (
                                        <li key={i} className="text-[13px] text-text-primary">{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-bg-base rounded-lg p-4 border border-border-default">
                            <p className="text-[14px] text-text-secondary italic">
                                "{analysis?.winning_formula?.suggested_brief || 'No suggested brief available.'}"
                            </p>
                        </div>
                    </div>

                    {/* Visual Patterns */}
                    {analysis?.visual_patterns && (
                        <div>
                            <h3 className="text-[16px] font-semibold mb-4">Visual Patterns</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                    { label: 'Common Colors', value: analysis.visual_patterns.common_colors },
                                    { label: 'Typography Trends', value: analysis.visual_patterns.typography_trends },
                                    { label: 'Composition Patterns', value: analysis.visual_patterns.composition_patterns },
                                    { label: 'Illustration Styles', value: analysis.visual_patterns.illustration_styles },
                                ].map(({ label, value }) => (
                                    <div key={label} className="bg-bg-surface1 border border-border-default rounded-lg p-4">
                                        <span className="text-[12px] text-text-secondary uppercase tracking-wider font-semibold block mb-1">{label}</span>
                                        <span className="text-[14px] text-text-primary">{value || 'N/A'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Buyer Overlap */}
                    <div>
                        <h3 className="text-[16px] font-semibold mb-4">Buyer Overlap</h3>
                        <div className="flex flex-col gap-3">
                            {[
                                { label: 'Shared Persona', value: analysis?.buyer_overlap?.shared_persona },
                                { label: 'Shared Identity', value: analysis?.buyer_overlap?.shared_identity },
                                { label: 'Shared Emotion', value: analysis?.buyer_overlap?.shared_emotion },
                                { label: 'Shared Occasion', value: analysis?.buyer_overlap?.shared_occasion },
                            ].map(({ label, value }) => (
                                <div key={label} className="bg-bg-surface1 border border-border-default rounded-lg p-4">
                                    <span className="text-[12px] text-text-secondary uppercase tracking-wider font-semibold block mb-1">{label}</span>
                                    <span className="text-[14px] text-text-primary">{value || 'N/A'}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Made For Me Patterns */}
                    {analysis?.made_for_me_patterns && analysis.made_for_me_patterns.length > 0 && (
                        <div>
                            <h3 className="text-[16px] font-semibold mb-4">Pattern Analysis</h3>
                            <ul className="flex flex-col gap-3 mb-8">
                                {analysis.made_for_me_patterns.map((pattern: string, index: number) => (
                                    <li key={index} className="flex items-start gap-3 bg-bg-surface1 border border-border-default rounded-lg p-4">
                                        <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0"></div>
                                        <span className="text-[14px] text-text-primary">{pattern}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Specificity Ladder */}
                            {analysis?.specificity_ladder && (
                                <>
                                    <h4 className="text-[14px] font-semibold text-text-secondary uppercase tracking-wider mb-4">Specificity Ladder</h4>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-4 bg-bg-surface1 border border-border-default rounded-lg p-4 opacity-60">
                                            <div className="w-6 h-6 rounded-full bg-bg-surface2 flex items-center justify-center text-[12px] font-bold text-text-secondary">1</div>
                                            <span className="text-[14px] text-text-secondary flex-1">{analysis.specificity_ladder.generic || 'Generic'}</span>
                                        </div>
                                        <div className="flex items-center gap-4 bg-bg-surface1 border border-border-default rounded-lg p-4">
                                            <div className="w-6 h-6 rounded-full bg-bg-surface2 flex items-center justify-center text-[12px] font-bold text-text-primary">2</div>
                                            <span className="text-[14px] text-text-primary flex-1">{analysis.specificity_ladder.niche || 'Niche'}</span>
                                        </div>
                                        <div className="flex items-center gap-4 bg-bg-surface1 border border-accent rounded-lg p-4">
                                            <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-[12px] font-bold text-white">3</div>
                                            <span className="text-[14px] font-bold text-accent flex-1">{analysis.specificity_ladder.hyper_niche || 'Hyper Niche'}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
                    onClick={() => setShowDeleteConfirm(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-bg-surface1 border border-border-default rounded-xl shadow-lg p-6 w-[400px] max-w-[90vw]"
                    >
                        <h3 className="text-[16px] font-semibold mb-2">Delete Pattern</h3>
                        <p className="text-[14px] text-text-secondary mb-4">
                            Delete "{pattern.name}"? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 text-[13px] text-text-secondary hover:text-text-primary rounded-lg hover:bg-bg-surface2 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-5 py-2 bg-error text-white text-[13px] font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
