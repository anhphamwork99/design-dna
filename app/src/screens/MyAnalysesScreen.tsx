import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Eye, Palette, Scale, Trash2 } from 'lucide-react';
import { listAnalyses, deleteAnalysis } from '../apiClient';
import { useAuth } from '../contexts/AuthContext';
import { DataGrid, ContextMenu } from '../components/shared';
import type { ContextMenuItem } from '../components/shared';

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

// ── Module-level cache (persists across mounts, resets on page reload) ──
const CACHE_TTL_MS = 30_000; // 30s
let cachedAnalyses: any[] | null = null;
let cacheTimestamp = 0;

function isCacheValid() {
    return cachedAnalyses !== null && Date.now() - cacheTimestamp < CACHE_TTL_MS;
}

export function invalidateAnalysesCache() {
    cachedAnalyses = null;
    cacheTimestamp = 0;
}

export default function MyAnalysesScreen({ hideTitle = false }: { hideTitle?: boolean }) {
    const { session } = useAuth();
    const navigate = useNavigate();

    const [analyses, setAnalyses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        document.title = 'DesignDNA — My Analyses';
    }, []);

    useEffect(() => {
        async function fetchAnalyses() {
            if (!session) return;

            // Serve from cache instantly, then revalidate in background
            if (isCacheValid()) {
                setAnalyses(cachedAnalyses!);
                setLoading(false);
                return; // still fresh — skip refetch
            }

            try {
                const data = await listAnalyses(session.access_token);
                cachedAnalyses = data;
                cacheTimestamp = Date.now();
                setAnalyses(data);
            } catch (err) {
                console.error('Failed to list analyses:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchAnalyses();
    }, [session]);

    const filteredAnalyses = analyses.filter((a) =>
        a.name?.toLowerCase().includes(searchValue.toLowerCase()),
    );

    const handleDelete = async (id: string) => {
        if (!session) return;
        if (!window.confirm('Delete this analysis?')) return;

        setDeletingId(id);
        try {
            await deleteAnalysis(session.access_token, id);
            const updated = analyses.filter((a) => a.id !== id);
            setAnalyses(updated);
            // Sync cache so navigating away and back reflects deletion
            cachedAnalyses = updated;
            cacheTimestamp = Date.now();
        } catch (err) {
            console.error('Failed to delete analysis:', err);
            alert('Failed to delete analysis');
        } finally {
            setDeletingId(null);
        }
    };

    const getMenuItems = (id: string): ContextMenuItem[] => [
        {
            label: 'View',
            icon: Eye,
            onClick: () => navigate(`/analyze/${id}`),
        },
        {
            label: 'Use in Studio',
            icon: Palette,
            onClick: () => navigate('/studio', { state: { analysisId: id } }),
        },
        {
            label: 'Compare',
            icon: Scale,
            onClick: () => navigate('/pattern/compare'),
        },
        {
            label: 'Delete',
            icon: Trash2,
            variant: 'danger' as const,
            onClick: () => handleDelete(id),
        },
    ];

    const renderGridItem = (analysis: any) => (
        <div
            key={analysis.id}
            onClick={() => navigate(`/analyze/${analysis.id}`)}
            className={`bg-bg-surface1 border border-border-default rounded-xl cursor-pointer hover:border-border-hover transition-colors ${deletingId === analysis.id ? 'opacity-50 pointer-events-none' : ''}`}
        >
            <div
                className="w-full aspect-[4/3] overflow-hidden flex items-center justify-center rounded-t-xl"
                style={{ backgroundColor: analysis.thumbnail ? '#e8e8e8' : undefined }}
            >
                {analysis.thumbnail ? (
                    <img
                        src={analysis.thumbnail}
                        alt={analysis.name}
                        className="w-full h-full object-contain"
                    />
                ) : (
                    <div className="w-full h-full bg-bg-surface2 flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-text-tertiary" />
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-[15px] font-semibold truncate flex-1">
                        {analysis.name}
                    </h3>
                    <ContextMenu
                        items={getMenuItems(analysis.id)}
                        trigger={
                            <button
                                className="p-1 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-state-hover transition-colors flex-shrink-0"
                                aria-label={`Actions for ${analysis.name}`}
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <circle cx="8" cy="3" r="1.5" fill="currentColor" />
                                    <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                                    <circle cx="8" cy="13" r="1.5" fill="currentColor" />
                                </svg>
                            </button>
                        }
                    />
                </div>
                <p className="text-[12px] text-text-tertiary mb-1.5">
                    {formatDate(analysis.created_at)}
                </p>
                {analysis.result_json?.visual_dna?.summary && (
                    <p className="text-[13px] text-text-secondary line-clamp-2">
                        {analysis.result_json.visual_dna.summary}
                    </p>
                )}
            </div>
        </div>
    );

    const renderListItem = (analysis: any) => (
        <div
            key={analysis.id}
            onClick={() => navigate(`/analyze/${analysis.id}`)}
            className={`bg-bg-surface1 border border-border-default rounded-xl p-3 hover:border-border-hover cursor-pointer flex items-center gap-4 transition-colors ${deletingId === analysis.id ? 'opacity-50 pointer-events-none' : ''}`}
        >
            <div
                className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
                style={{ backgroundColor: analysis.thumbnail ? '#e8e8e8' : undefined }}
            >
                {analysis.thumbnail ? (
                    <img src={analysis.thumbnail} alt="" className="w-full h-full object-contain" />
                ) : (
                    <BookOpen className="w-5 h-5 text-text-tertiary" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="text-[14px] font-semibold truncate">{analysis.name}</h3>
                <p className="text-[12px] text-text-tertiary">
                    {formatDate(analysis.created_at)}
                </p>
            </div>

            <ContextMenu
                items={getMenuItems(analysis.id)}
                trigger={
                    <button
                        className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-state-hover transition-colors flex-shrink-0"
                        aria-label={`Actions for ${analysis.name}`}
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="3" r="1.5" fill="currentColor" />
                            <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                            <circle cx="8" cy="13" r="1.5" fill="currentColor" />
                        </svg>
                    </button>
                }
            />
        </div>
    );

    return (
        <div className="max-w-[960px] mx-auto">
            {!hideTitle && (
                <div className="pt-8 mb-6">
                    <h1 className="text-[32px] font-bold tracking-tight mb-1">My Analyses</h1>
                    <p className="text-[14px] text-text-secondary">
                        {analyses.length} {analyses.length === 1 ? 'analysis' : 'analyses'}
                    </p>
                </div>
            )}

            <DataGrid
                items={filteredAnalyses}
                loading={loading}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                renderGridItem={renderGridItem}
                renderListItem={renderListItem}
                emptyIcon={BookOpen}
                emptyTitle="No analyses yet"
                emptyDescription="Upload a design and get an instant breakdown of its style, colors, and target audience."
                emptyActionLabel="Analyze a Design"
                emptyOnAction={() => navigate('/analyze/new')}
                searchPlaceholder="Search analyses..."
            />
        </div>
    );
}
