import React from 'react';
import { Search, LayoutGrid, List, LucideIcon } from 'lucide-react';
import { EmptyState } from './EmptyState';

interface DataGridProps<T> {
    items: T[];
    loading: boolean;
    searchValue: string;
    onSearchChange: (value: string) => void;
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
    renderGridItem: (item: T) => React.ReactNode;
    renderListItem: (item: T) => React.ReactNode;
    emptyIcon: LucideIcon;
    emptyTitle: string;
    emptyDescription: string;
    emptyActionLabel?: string;
    emptyOnAction?: () => void;
    searchPlaceholder?: string;
    skeletonCount?: number;
}

export function DataGrid<T>({
    items,
    loading,
    searchValue,
    onSearchChange,
    viewMode,
    onViewModeChange,
    renderGridItem,
    renderListItem,
    emptyIcon,
    emptyTitle,
    emptyDescription,
    emptyActionLabel,
    emptyOnAction,
    searchPlaceholder = 'Search...',
    skeletonCount = 6,
}: DataGridProps<T>) {
    const hasSearch = searchValue.trim().length > 0;
    const showNoResults = !loading && items.length === 0 && hasSearch;
    const showEmpty = !loading && items.length === 0 && !hasSearch;

    return (
        <div className="flex flex-col gap-5">
            {/* Header: Search + View Toggle */}
            <div className="flex items-center justify-between gap-3">
                <div className="relative w-full max-w-[320px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="bg-bg-surface2 border border-border-default rounded-[10px] pl-9 pr-3 py-2 text-[13px] text-text-primary placeholder:text-text-tertiary w-full outline-none focus:border-border-hover transition-colors"
                    />
                </div>

                <div className="flex items-center gap-1 bg-bg-surface2 rounded-[10px] p-1">
                    <button
                        onClick={() => onViewModeChange('grid')}
                        className={`p-1.5 rounded-[8px] transition-colors ${viewMode === 'grid'
                                ? 'bg-bg-surface1 text-text-primary shadow-sm'
                                : 'text-text-tertiary hover:text-text-secondary'
                            }`}
                        aria-label="Grid view"
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onViewModeChange('list')}
                        className={`p-1.5 rounded-[8px] transition-colors ${viewMode === 'list'
                                ? 'bg-bg-surface1 text-text-primary shadow-sm'
                                : 'text-text-tertiary hover:text-text-secondary'
                            }`}
                        aria-label="List view"
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: skeletonCount }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-bg-surface1 border border-border-default rounded-xl overflow-hidden animate-pulse"
                        >
                            <div className="w-full aspect-[4/3] bg-bg-surface2" />
                            <div className="p-4 space-y-2">
                                <div className="h-3 bg-bg-surface2 rounded w-3/4" />
                                <div className="h-3 bg-bg-surface2 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showEmpty && (
                <EmptyState
                    icon={emptyIcon}
                    title={emptyTitle}
                    description={emptyDescription}
                    actionLabel={emptyActionLabel}
                    onAction={emptyOnAction}
                />
            )}

            {showNoResults && (
                <div className="flex items-center justify-center py-12">
                    <p className="text-[14px] text-text-secondary">
                        No results for "<span className="font-medium text-text-primary">{searchValue}</span>"
                    </p>
                </div>
            )}

            {!loading && items.length > 0 && (
                <>
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {items.map((item, i) => (
                                <React.Fragment key={i}>{renderGridItem(item)}</React.Fragment>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {items.map((item, i) => (
                                <React.Fragment key={i}>{renderListItem(item)}</React.Fragment>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
