import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle, Palette, Trash2, ArrowLeft, CircleCheck, FlaskConical, CircleX, Dna, Users, BarChart2, Trophy, Sparkles, RefreshCw } from 'lucide-react';
import { getPatternById, deletePatternById, SavedPattern } from '../apiClient';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/shared';

export default function PatternDetailScreen() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { session } = useAuth();

    const [pattern, setPattern] = useState<SavedPattern | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!session || !id) return;
        setLoading(true);
        getPatternById(session.access_token, id)
            .then((p) => {
                setPattern(p);
                document.title = `DesignDNA — ${p.name}`;
            })
            .catch((err) => {
                console.error('Failed to load pattern:', err);
                setError('Pattern not found or failed to load.');
            })
            .finally(() => setLoading(false));
    }, [session, id]);

    const handleDelete = async () => {
        if (!session || !id) return;
        if (!window.confirm(`Delete "${pattern?.name}"? This cannot be undone.`)) return;
        setIsDeleting(true);
        try {
            await deletePatternById(session.access_token, id);
            navigate('/pattern');
        } catch (err) {
            console.error('Failed to delete pattern:', err);
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="pt-8 max-w-[900px] mx-auto">
                <div className="animate-pulse flex flex-col gap-6">
                    <div className="h-4 bg-bg-surface2 rounded w-32" />
                    <div className="h-10 bg-bg-surface2 rounded w-3/4" />
                    <div className="h-4 bg-bg-surface2 rounded w-1/2" />
                    <div className="flex gap-2">
                        <div className="w-16 h-16 bg-bg-surface2 rounded-lg" />
                        <div className="w-16 h-16 bg-bg-surface2 rounded-lg" />
                    </div>
                    <div className="h-48 bg-bg-surface2 rounded-xl" />
                    <div className="h-32 bg-bg-surface2 rounded-xl" />
                </div>
            </div>
        );
    }

    if (error || !pattern) {
        return (
            <div className="pt-8 max-w-[900px] mx-auto flex flex-col items-center justify-center py-20 text-center">
                <AlertTriangle className="w-10 h-10 text-warning mb-4" />
                <p className="text-[16px] text-text-secondary mb-4">{error || 'Pattern not found.'}</p>
                <Button variant="secondary" onClick={() => navigate('/pattern')}>Go Back</Button>
            </div>
        );
    }

    const analysis = pattern.batch_analysis;

    return (
        <div className="pt-8 pb-16">
            {/* Back breadcrumb */}
            <div className="max-w-[900px] mx-auto mb-6">
                <button
                    onClick={() => navigate('/pattern')}
                    className="flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Patterns
                </button>
            </div>

            {/* Header */}
            <div className="max-w-[900px] mx-auto mb-8">
                <h1 className="text-[32px] font-bold tracking-tight mb-1">{pattern.name}</h1>
                <p className="text-[14px] text-text-secondary mb-5">
                    {pattern.source_image_count} design{pattern.source_image_count !== 1 ? 's' : ''} compared · {new Date(pattern.created_at).toLocaleDateString()}
                </p>

                {/* Thumbnails */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {pattern.thumbnails.map((thumb, i) => (
                        <div key={i} className="flex-shrink-0 w-[64px] h-[64px] rounded-lg overflow-hidden border border-border-default">
                            <img src={thumb} alt={`Source ${i + 1}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Content sections — same layout as CompareResults */}
            <div className="max-w-[900px] mx-auto flex flex-col gap-6">
                {/* The Formula card */}
                <div className="bg-bg-surface1 rounded-xl p-6" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
                    <h2 className="text-[24px] font-extrabold text-text-primary tracking-tight mb-1">
                        The Formula
                    </h2>
                    <svg width="80" height="10" viewBox="0 0 80 10" fill="none" className="mb-5">
                        <defs>
                            <linearGradient id="detail-formula-ul" x1="0" y1="0" x2="80" y2="0" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#f472b6" />
                                <stop offset="50%" stopColor="#a78bfa" />
                                <stop offset="100%" stopColor="#60a5fa" />
                            </linearGradient>
                        </defs>
                        <path d="M2 7 C12 2, 20 2, 28 6 S44 10, 52 5 S68 1, 78 5" stroke="url(#detail-formula-ul)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    </svg>
                    <p className="text-[15px] text-text-primary leading-relaxed mb-6">
                        {analysis?.winning_formula?.summary || pattern.summary}
                    </p>

                    {/* Keep / Try / Stop */}
                    {analysis?.winning_formula && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                            {analysis.winning_formula.keep && (
                                <div className="bg-success-subtle border border-success/20 rounded-lg p-4">
                                    <span className="text-[12px] text-success uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-2">
                                        <CircleCheck className="w-4 h-4" /> Keep Doing
                                    </span>
                                    <ul className="flex flex-col gap-1.5">
                                        {analysis.winning_formula.keep.map((item: string, i: number) => (
                                            <li key={i} className="text-[13px] text-text-primary">{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {analysis.winning_formula.experiment_with && (
                                <div className="bg-warning-subtle border border-warning/20 rounded-lg p-4">
                                    <span className="text-[12px] text-warning uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-2">
                                        <FlaskConical className="w-4 h-4" /> Try Changing
                                    </span>
                                    <ul className="flex flex-col gap-1.5">
                                        {analysis.winning_formula.experiment_with.map((item: string, i: number) => (
                                            <li key={i} className="text-[13px] text-text-primary">{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {analysis.winning_formula.avoid && (
                                <div className="bg-error-subtle border border-error/20 rounded-lg p-4">
                                    <span className="text-[12px] text-error uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-2">
                                        <CircleX className="w-4 h-4" /> Stop Doing
                                    </span>
                                    <ul className="flex flex-col gap-1.5">
                                        {analysis.winning_formula.avoid.map((item: string, i: number) => (
                                            <li key={i} className="text-[13px] text-text-primary">{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Quick Brief */}
                    {analysis?.winning_formula?.suggested_brief && (
                        <div className="bg-bg-base rounded-lg p-4 mb-6 border border-border-default">
                            <span className="text-[11px] text-text-tertiary uppercase tracking-wider font-semibold block mb-1">Quick Brief</span>
                            <p className="text-[14px] text-text-secondary italic">
                                "{analysis.winning_formula.suggested_brief}"
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/studio', { state: { patternId: id } })}
                                className="flex-1 border border-border-default text-text-primary font-medium py-3.5 px-6 rounded-xl text-[15px] hover:bg-bg-surface2 transition-colors flex items-center justify-center gap-2"
                            >
                                <Sparkles className="w-5 h-5" /> Use in Studio
                            </button>
                            <button
                                onClick={() => navigate('/pattern/compare')}
                                className="flex-1 border border-border-default text-text-primary font-medium py-3.5 px-6 rounded-xl text-[15px] hover:bg-bg-surface2 transition-colors flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-5 h-5" /> New Comparison
                            </button>
                        </div>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="text-[13px] text-text-tertiary hover:text-red-500 transition-colors text-center py-2"
                        >
                            <Trash2 className="w-3.5 h-3.5 inline mr-1" />
                            {isDeleting ? 'Deleting...' : 'Delete Pattern'}
                        </button>
                    </div>
                </div>

                {/* Design DNA */}
                {analysis?.visual_patterns && (
                    <div className="bg-bg-surface1 border border-border-default rounded-xl p-6">
                        <h3 className="text-[16px] font-semibold mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md ai-gradient flex items-center justify-center flex-shrink-0">
                                <Dna className="w-3.5 h-3.5 text-white" />
                            </span>
                            Design DNA
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="bg-bg-base border border-border-default rounded-lg p-4">
                                <span className="text-[12px] text-text-tertiary uppercase tracking-wider font-semibold block mb-1">Colors</span>
                                <span className="text-[14px] text-text-primary">{analysis.visual_patterns.common_colors || 'N/A'}</span>
                            </div>
                            <div className="bg-bg-base border border-border-default rounded-lg p-4">
                                <span className="text-[12px] text-text-tertiary uppercase tracking-wider font-semibold block mb-1">Typography</span>
                                <span className="text-[14px] text-text-primary">{analysis.visual_patterns.typography_trends || 'N/A'}</span>
                            </div>
                            <div className="bg-bg-base border border-border-default rounded-lg p-4">
                                <span className="text-[12px] text-text-tertiary uppercase tracking-wider font-semibold block mb-1">Composition</span>
                                <span className="text-[14px] text-text-primary">{analysis.visual_patterns.composition_patterns || 'N/A'}</span>
                            </div>
                            <div className="bg-bg-base border border-border-default rounded-lg p-4">
                                <span className="text-[12px] text-text-tertiary uppercase tracking-wider font-semibold block mb-1">Illustration Style</span>
                                <span className="text-[14px] text-text-primary">{analysis.visual_patterns.illustration_styles || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Shared Audience */}
                {analysis?.buyer_overlap && (
                    <div className="bg-bg-surface1 border border-border-default rounded-xl p-6">
                        <h3 className="text-[16px] font-semibold mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md ai-gradient flex items-center justify-center flex-shrink-0">
                                <Users className="w-3.5 h-3.5 text-white" />
                            </span>
                            Shared Audience
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="bg-bg-base border border-border-default rounded-lg p-4">
                                <span className="text-[12px] text-text-tertiary uppercase tracking-wider font-semibold block mb-1">Who Buys</span>
                                <span className="text-[14px] text-text-primary">{analysis.buyer_overlap.shared_persona || 'N/A'}</span>
                            </div>
                            <div className="bg-bg-base border border-border-default rounded-lg p-4">
                                <span className="text-[12px] text-text-tertiary uppercase tracking-wider font-semibold block mb-1">Their Identity</span>
                                <span className="text-[14px] text-text-primary">{analysis.buyer_overlap.shared_identity || 'N/A'}</span>
                            </div>
                            <div className="bg-bg-base border border-border-default rounded-lg p-4">
                                <span className="text-[12px] text-text-tertiary uppercase tracking-wider font-semibold block mb-1">What They Feel</span>
                                <span className="text-[14px] text-text-primary">{analysis.buyer_overlap.shared_emotion || 'N/A'}</span>
                            </div>
                            <div className="bg-bg-base border border-border-default rounded-lg p-4">
                                <span className="text-[12px] text-text-tertiary uppercase tracking-wider font-semibold block mb-1">When They Buy</span>
                                <span className="text-[14px] text-text-primary">{analysis.buyer_overlap.shared_occasion || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Why They Sell */}
                {analysis?.made_for_me_patterns && (
                    <div className="bg-bg-surface1 border border-border-default rounded-xl p-6">
                        <h3 className="text-[16px] font-semibold mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md ai-gradient flex items-center justify-center flex-shrink-0">
                                <BarChart2 className="w-3.5 h-3.5 text-white" />
                            </span>
                            Why They Sell
                        </h3>
                        <ul className="flex flex-col gap-2 mb-6">
                            {analysis.made_for_me_patterns.map((pattern: string, index: number) => (
                                <li key={index} className="flex items-start gap-3 bg-bg-base border border-border-default rounded-lg p-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-text-tertiary mt-[7px] flex-shrink-0"></div>
                                    <span className="text-[14px] text-text-primary">{pattern}</span>
                                </li>
                            ))}
                        </ul>

                        {analysis.specificity_ladder && (
                            <>
                                <h4 className="text-[13px] font-semibold text-text-secondary uppercase tracking-wider mb-3">
                                    Niche Level
                                </h4>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-4 bg-bg-base border border-border-default rounded-lg p-3 opacity-60">
                                        <div className="w-6 h-6 rounded-full bg-bg-surface2 flex items-center justify-center text-[12px] font-bold text-text-secondary">1</div>
                                        <div className="flex-1">
                                            <span className="text-[11px] text-text-tertiary uppercase tracking-wider font-semibold block">Broad Market</span>
                                            <span className="text-[14px] text-text-secondary">{analysis.specificity_ladder.generic || '—'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 bg-bg-base border border-border-default rounded-lg p-3">
                                        <div className="w-6 h-6 rounded-full bg-bg-surface2 flex items-center justify-center text-[12px] font-bold text-text-primary">2</div>
                                        <div className="flex-1">
                                            <span className="text-[11px] text-text-tertiary uppercase tracking-wider font-semibold block">Focused Niche</span>
                                            <span className="text-[14px] text-text-primary">{analysis.specificity_ladder.niche || '—'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 ai-gradient rounded-lg p-3">
                                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[12px] font-bold text-white">3</div>
                                        <div className="flex-1">
                                            <span className="text-[11px] text-white/80 uppercase tracking-wider font-semibold block">Your Sweet Spot</span>
                                            <span className="text-[14px] font-bold text-white">{analysis.specificity_ladder.hyper_niche || '—'}</span>
                                        </div>
                                        <Trophy className="w-4 h-4 text-white/80 flex-shrink-0" />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
