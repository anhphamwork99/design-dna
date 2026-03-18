import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Eye, Palette, Trash2 } from 'lucide-react';
import { listPatterns, deletePatternById, SavedPattern } from '../apiClient';
import { useAuth } from '../contexts/AuthContext';
import { DataGrid, ContextMenu } from '../components/shared';
import type { ContextMenuItem } from '../components/shared';

// ── Helpers ────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
}

// ── LibraryScreen ──────────────────────────────────────────────────

export default function LibraryScreen() {
    const { session } = useAuth();
    const navigate = useNavigate();

    const [patterns, setPatterns] = useState<SavedPattern[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        document.title = 'DesignDNA — Library';
    }, []);

    useEffect(() => {
        if (!session) return;
        setLoading(true);
        listPatterns(session.access_token)
            .then(setPatterns)
            .catch((err) => {
                console.error('Failed to load patterns:', err);
                setError('Failed to load patterns');
            })
            .finally(() => setLoading(false));
    }, [session]);

    // ── Search filter (local) ──────────────────────────────────────
    const filteredPatterns = patterns.filter((p) =>
        p.name.toLowerCase().includes(searchValue.toLowerCase()),
    );

    // ── Context menu actions ───────────────────────────────────────
    const handleDelete = async (id: string, name: string) => {
        if (!session) return;
        if (!window.confirm(`Delete pattern "${name}"?`)) return;
        setDeletingId(id);
        try {
            await deletePatternById(session.access_token, id);
            setPatterns((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.error('Failed to delete pattern:', err);
        } finally {
            setDeletingId(null);
        }
    };

    const menuItems = (pattern: SavedPattern): ContextMenuItem[] => [
        {
            label: 'View',
            icon: Eye,
            onClick: () => navigate(`/library/pattern/${pattern.id}`),
        },
        {
            label: 'Use in Studio',
            icon: Palette,
            onClick: () => navigate('/studio', { state: { patternId: pattern.id } }),
        },
        {
            label: 'Delete',
            icon: Trash2,
            variant: 'danger',
            onClick: () => handleDelete(pattern.id, pattern.name),
        },
    ];

    // ── Render: grid card ──────────────────────────────────────────
    const renderGridItem = (pattern: SavedPattern) => (
        <div
            key={pattern.id}
            onClick={() => navigate(`/library/pattern/${pattern.id}`)}
            className={`bg-bg-surface1 border border-border-default rounded-xl cursor-pointer hover:border-border-hover transition-colors ${deletingId === pattern.id ? 'opacity-50 pointer-events-none' : ''}`}
        >
            {/* Thumbnail area */}
            <div className="w-full aspect-[4/3] bg-bg-surface2 overflow-hidden flex items-center justify-center rounded-t-xl">
                {pattern.thumbnails.length > 0 ? (
                    <img
                        src={pattern.thumbnails[0]}
                        alt={pattern.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <Layers className="w-8 h-8 text-text-tertiary" />
                )}
            </div>

            {/* Info area */}
            <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-[15px] font-semibold truncate flex-1">
                        {pattern.name}
                    </h3>
                    <ContextMenu
                        items={menuItems(pattern)}
                        trigger={
                            <button
                                className="p-1 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-state-hover transition-colors flex-shrink-0"
                                aria-label={`Actions for ${pattern.name}`}
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
                    {pattern.source_image_count} design{pattern.source_image_count !== 1 ? 's' : ''} · {timeAgo(pattern.created_at)}
                </p>
                <p className="text-[13px] text-text-secondary line-clamp-2">
                    {pattern.summary}
                </p>
            </div>
        </div>
    );

    // ── Render: list row ───────────────────────────────────────────
    const renderListItem = (pattern: SavedPattern) => (
        <div
            key={pattern.id}
            onClick={() => navigate(`/library/pattern/${pattern.id}`)}
            className={`bg-bg-surface1 border border-border-default rounded-xl p-3 hover:border-border-hover cursor-pointer flex items-center gap-4 transition-colors ${deletingId === pattern.id ? 'opacity-50 pointer-events-none' : ''}`}
        >
            {/* Thumbnail */}
            <div className="w-12 h-12 rounded-lg bg-bg-surface2 overflow-hidden flex-shrink-0 flex items-center justify-center">
                {pattern.thumbnails.length > 0 ? (
                    <img
                        src={pattern.thumbnails[0]}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <Layers className="w-5 h-5 text-text-tertiary" />
                )}
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
                <h3 className="text-[14px] font-semibold truncate">{pattern.name}</h3>
                <p className="text-[12px] text-text-tertiary">
                    {pattern.source_image_count} design{pattern.source_image_count !== 1 ? 's' : ''} · {timeAgo(pattern.created_at)}
                </p>
            </div>

            {/* Context menu */}
            <ContextMenu
                items={menuItems(pattern)}
                trigger={
                    <button
                        className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-state-hover transition-colors flex-shrink-0"
                        aria-label={`Actions for ${pattern.name}`}
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

    // ── Error state ────────────────────────────────────────────────
    if (error && !loading) {
        return (
            <div className="pt-8 text-center">
                <p className="text-text-secondary">{error}</p>
            </div>
        );
    }

    // ── Main render ────────────────────────────────────────────────
    return (
        <div className="pt-8 max-w-[960px] mx-auto">
            <div className="mb-6">
                <h1 className="text-[32px] font-bold tracking-tight mb-1">Pattern Library</h1>
                <p className="text-[14px] text-text-secondary">
                    {patterns.length} pattern{patterns.length !== 1 ? 's' : ''}
                </p>
            </div>

            <DataGrid<SavedPattern>
                items={filteredPatterns}
                loading={loading}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                renderGridItem={renderGridItem}
                renderListItem={renderListItem}
                emptyIcon={Layers}
                emptyTitle="No patterns yet"
                emptyDescription="Compare multiple designs to discover shared patterns you can reuse."
                emptyActionLabel="Go to Compare"
                emptyOnAction={() => navigate('/compare')}
                searchPlaceholder="Search patterns..."
            />
        </div>
    );
}
