import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Trash2, BookOpen } from 'lucide-react';
import { listAnalyses, deleteAnalysis } from '../apiClient';
import { useAuth } from '../contexts/AuthContext';

interface Props {
    onNavigate: (s: string) => void;
    onViewAnalysis: (id: string) => void;
}

export default function MyAnalysesList({ onNavigate, onViewAnalysis }: Props) {
    const { session } = useAuth();
    const [analyses, setAnalyses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchAnalyses() {
            if (!session) return;
            try {
                const data = await listAnalyses(session.access_token);
                setAnalyses(data);
            } catch (err) {
                console.error('Failed to list analyses:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchAnalyses();
    }, [session]);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!session) return;
        if (!window.confirm("Are you sure you want to delete this analysis?")) return;

        setDeletingId(id);
        try {
            await deleteAnalysis(session.access_token, id);
            setAnalyses(prev => prev.filter(a => a.id !== id));
        } catch (err) {
            console.error('Failed to delete analysis:', err);
            alert('Failed to delete analysis');
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pt-8 mb-24 max-w-[1200px] mx-auto"
        >
            <button
                onClick={() => onNavigate('upload')}
                className="flex items-center text-text-secondary hover:text-text-primary text-[14px] mb-8 transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:rounded"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </button>

            <div className="mb-8">
                <h1 className="text-[32px] font-bold tracking-tight mb-2 flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-[#34d399]" />
                    My Analyses
                </h1>
                <p className="text-[14px] text-text-secondary">Browse your saved design analyses.</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-bg-surface1 border border-border-default rounded-xl overflow-hidden">
                            <div className="w-full aspect-[4/3] bg-bg-surface2 animate-pulse"></div>
                            <div className="p-4 flex flex-col gap-2">
                                <div className="h-5 w-[150px] bg-bg-surface2 animate-pulse rounded"></div>
                                <div className="h-4 w-[100px] bg-bg-surface2 animate-pulse rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : analyses.length === 0 ? (
                <div className="bg-bg-surface1 border border-border-default rounded-xl p-12 text-center flex flex-col items-center justify-center">
                    <BookOpen className="w-12 h-12 text-text-tertiary mb-4" />
                    <h3 className="text-[18px] font-semibold mb-2">No analyses yet</h3>
                    <p className="text-[14px] text-text-secondary max-w-[400px] mb-6">
                        You haven't saved any design analyses yet. Analyze a design to get started.
                    </p>
                    <button
                        onClick={() => onNavigate('upload')}
                        className="px-5 py-3 rounded-lg ai-gradient text-white text-[14px] font-medium hover:opacity-90 transition-opacity"
                    >
                        Analyze a Design
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {analyses.map(analysis => (
                        <div
                            key={analysis.id}
                            onClick={() => onViewAnalysis(analysis.id)}
                            className="bg-bg-surface1 border border-border-default rounded-xl overflow-hidden cursor-pointer hover:bg-bg-surface2 hover:border-border-hover hover:-translate-y-1 transition-all group flex flex-col"
                        >
                            <div className="w-full aspect-[4/3] bg-bg-surface2 border-b border-border-default overflow-hidden flex items-center justify-center">
                                {analysis.thumbnail ? (
                                    <img src={analysis.thumbnail} alt={analysis.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                ) : (
                                    <BookOpen className="w-10 h-10 text-text-tertiary" />
                                )}
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-[16px] font-semibold truncate pr-4 text-text-primary group-hover:text-accent transition-colors" title={analysis.name}>
                                        {analysis.name}
                                    </h3>
                                    <button
                                        onClick={(e) => handleDelete(e, analysis.id)}
                                        disabled={deletingId === analysis.id}
                                        className="text-text-tertiary hover:text-error transition-colors p-1 -mr-1 rounded-md hover:bg-error/10 disabled:opacity-50"
                                        aria-label="Delete analysis"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-[12px] text-text-secondary flex-1">
                                    {analysis.result_json?.visual_dna?.summary ? (
                                        <span className="line-clamp-2" title={analysis.result_json.visual_dna.summary}>
                                            {analysis.result_json.visual_dna.summary}
                                        </span>
                                    ) : 'No summary available.'}
                                </p>
                                <div className="text-[11px] text-text-tertiary mt-4">
                                    Reviewed: {formatDate(analysis.created_at)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
