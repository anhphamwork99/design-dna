import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle, Palette, Trash2, ArrowLeft } from 'lucide-react';
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
            <div className="pt-8 max-w-[960px] mx-auto">
                <div className="animate-pulse flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-[40%] space-y-3">
                        <div className="w-full aspect-square bg-bg-surface2 rounded-xl" />
                        <div className="grid grid-cols-2 gap-3">
                            <div className="aspect-square bg-bg-surface2 rounded-xl" />
                            <div className="aspect-square bg-bg-surface2 rounded-xl" />
                        </div>
                    </div>
                    <div className="w-full md:w-[60%] space-y-4">
                        <div className="h-8 bg-bg-surface2 rounded w-3/4" />
                        <div className="h-4 bg-bg-surface2 rounded w-1/2" />
                        <div className="h-32 bg-bg-surface2 rounded-xl" />
                        <div className="h-24 bg-bg-surface2 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !pattern) {
        return (
            <div className="pt-8 max-w-[960px] mx-auto flex flex-col items-center justify-center py-20 text-center">
                <AlertTriangle className="w-10 h-10 text-warning mb-4" />
                <p className="text-[16px] text-text-secondary mb-4">{error || 'Pattern not found.'}</p>
                <Button variant="secondary" onClick={() => navigate('/pattern')}>
                    Go Back
                </Button>
            </div>
        );
    }

    const analysis = pattern.batch_analysis;

    return (
        <div className="pt-8 max-w-[960px] mx-auto pb-8">
            <button
                onClick={() => navigate('/pattern')}
                className="flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-text-primary transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Library</span>
            </button>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-[40%] md:sticky md:top-[80px] self-start">
                    <div className="grid grid-cols-2 gap-3">
                        {pattern.thumbnails.map((thumb, i) => (
                            <div
                                key={i}
                                className="aspect-square bg-bg-surface2 rounded-xl border border-border-default overflow-hidden"
                            >
                                <img
                                    src={thumb}
                                    alt={`Source design ${i + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                    <p className="text-[12px] text-text-tertiary mt-3">
                        {pattern.source_image_count} design{pattern.source_image_count !== 1 ? 's' : ''} compared · {new Date(pattern.created_at).toLocaleDateString()}
                    </p>
                </div>

                <div className="w-full md:w-[60%] flex flex-col gap-6">
                    <div>
                        <h1 className="text-[32px] font-bold tracking-tight mb-1">{pattern.name}</h1>
                        <p className="text-[14px] text-text-secondary">
                            {pattern.source_image_count} design{pattern.source_image_count !== 1 ? 's' : ''} compared · {new Date(pattern.created_at).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="bg-bg-surface2 p-4 rounded-lg">
                        <p className="text-[14px] text-text-secondary italic">{pattern.summary}</p>
                    </div>

                    {analysis && (
                        <div className="flex flex-col gap-6">
                            {renderAnalysisSection('Winning Formula', analysis.winning_formula)}
                            {renderAnalysisSection('Visual Patterns', analysis.visual_patterns)}
                            {renderAnalysisSection('Buyer Overlap', analysis.buyer_overlap)}
                            {renderAnalysisSection('Pattern Analysis', analysis.made_for_me_patterns)}
                            {analysis.specificity_ladder && renderAnalysisSection('Specificity Ladder', analysis.specificity_ladder)}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border-default flex items-center gap-3 flex-wrap">
                <Button
                    variant="primary"
                    onClick={() => navigate('/studio', { state: { patternId: id } })}
                >
                    <Palette className="w-4 h-4 mr-2" />
                    Use in Studio
                </Button>
                <Button
                    variant="secondary"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isDeleting ? 'Deleting...' : 'Delete Pattern'}
                </Button>
            </div>
        </div>
    );
}

function renderAnalysisSection(title: string, data: unknown): React.ReactNode | null {
    if (!data) return null;

    const isFormula = title === 'Winning Formula';

    return (
        <div key={title} className="flex flex-col gap-2">
            <div>
                <h3 className={isFormula
                    ? 'text-[24px] font-extrabold text-text-primary tracking-tight mb-1'
                    : 'text-[13px] font-semibold text-text-primary uppercase tracking-[0.06em] mb-1'
                }>
                    {isFormula ? 'The Formula' : title}
                </h3>
                {isFormula ? (
                    <svg width="80" height="10" viewBox="0 0 80 10" fill="none" className="mb-4">
                        <defs>
                            <linearGradient id="detail-formula-underline" x1="0" y1="0" x2="80" y2="0" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#f472b6" />
                                <stop offset="50%" stopColor="#a78bfa" />
                                <stop offset="100%" stopColor="#60a5fa" />
                            </linearGradient>
                        </defs>
                        <path d="M2 7 C12 2, 20 2, 28 6 S44 10, 52 5 S68 1, 78 5" stroke="url(#detail-formula-underline)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    </svg>
                ) : (
                    <div className="w-12 h-1 rounded-full ai-gradient mb-4"></div>
                )}
            </div>
            <div className="text-[14px] text-text-primary leading-relaxed">
                {renderValue(data)}
            </div>
        </div>
    );
}

function renderValue(value: unknown): React.ReactNode {
    if (value === null || value === undefined) return null;

    if (typeof value === 'string') {
        return <p className="leading-relaxed">{value}</p>;
    }

    if (Array.isArray(value)) {
        return (
            <ul className="flex flex-col gap-1.5">
                {value.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                        <span>{typeof item === 'string' ? item : JSON.stringify(item)}</span>
                    </li>
                ))}
            </ul>
        );
    }

    if (typeof value === 'object') {
        const entries = Object.entries(value as Record<string, unknown>);
        return (
            <div className="flex flex-col gap-2">
                {entries.map(([key, val]) => (
                    <div key={key}>
                        <span className="text-[12px] text-text-tertiary uppercase tracking-wider font-medium">
                            {key.replace(/_/g, ' ')}
                        </span>
                        <div className="mt-0.5">{renderValue(val)}</div>
                    </div>
                ))}
            </div>
        );
    }

    return <p>{String(value)}</p>;
}
