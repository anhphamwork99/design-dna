import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import type { SavedPattern } from '../../apiClient';

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

export interface RecentAnalysesCarouselProps {
    patterns: SavedPattern[];
}

export function RecentAnalysesCarousel({ patterns }: RecentAnalysesCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    if (!patterns || patterns.length === 0) return null;

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = window.innerWidth < 768 ? 200 : 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="relative group/carousel max-w-full">
            <div className="flex items-center justify-between mb-4 px-1">
                <div>
                    <h2 className="text-[17px] font-semibold tracking-tight text-text-primary">
                        Recent Analyses
                    </h2>
                </div>
                {patterns.length > 4 && (
                    <div className="flex items-center gap-1.5 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200">
                        <button
                            onClick={() => scroll('left')}
                            className="p-1.5 rounded-full border border-border-default bg-bg-surface1 text-text-secondary hover:text-text-primary hover:bg-state-hover hover:border-border-hover transition-all focus:outline-none shadow-sm"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="p-1.5 rounded-full border border-border-default bg-bg-surface1 text-text-secondary hover:text-text-primary hover:bg-state-hover hover:border-border-hover transition-all focus:outline-none shadow-sm"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 px-1 -mx-1 hide-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {patterns.map((pattern) => (
                    <div
                        key={pattern.id}
                        onClick={() => navigate(`/pattern/${pattern.id}`)}
                        className="snap-start shrink-0 w-[160px] sm:w-[220px] aspect-[4/3] bg-bg-surface1 border border-border-default rounded-xl cursor-pointer hover:border-border-hover hover:shadow-md transition-all flex flex-col overflow-hidden group/card relative"
                    >
                        <div
                            className="absolute inset-0 w-full h-full bg-[#f8f9fa] flex items-center justify-center overflow-hidden"
                        >
                            {pattern.thumbnails.length > 0 ? (
                                <img
                                    src={pattern.thumbnails[0]}
                                    alt={pattern.name}
                                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500 ease-out"
                                />
                            ) : (
                                <Layers className="w-8 h-8 text-text-tertiary" />
                            )}
                        </div>

                        {/* Overlay gradient for text */}
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                        {/* Text overlay */}
                        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 flex flex-col justify-end">
                            <h3 className="text-[13px] sm:text-[14px] font-semibold truncate text-white drop-shadow-sm mb-0.5">
                                {pattern.name}
                            </h3>
                            <p className="text-[11px] sm:text-[12px] text-white/80 truncate">
                                {pattern.source_image_count} design{pattern.source_image_count !== 1 ? 's' : ''} · {timeAgo(pattern.created_at)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}
