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
            const scrollAmount = window.innerWidth < 768 ? 300 : 400;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="relative group">
            <div className="flex items-center justify-between mb-8 px-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-text-primary mb-1">
                        Recent Analyses
                    </h2>
                    <p className="text-[14px] text-text-secondary">
                        Jump back into your saved DNA patterns.
                    </p>
                </div>
                {patterns.length > 3 && (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => scroll('left')}
                            className="p-2.5 rounded-full border border-border-default bg-bg-surface1 text-text-secondary hover:text-text-primary hover:bg-state-hover hover:border-border-hover transition-all shadow-sm focus:outline-none"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="p-2.5 rounded-full border border-border-default bg-bg-surface1 text-text-secondary hover:text-text-primary hover:bg-state-hover hover:border-border-hover transition-all shadow-sm focus:outline-none"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>

            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 px-2 -mx-2 hide-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {patterns.map((pattern) => (
                    <div
                        key={pattern.id}
                        onClick={() => navigate(`/pattern/${pattern.id}`)}
                        className="snap-start shrink-0 w-[280px] sm:w-[340px] bg-bg-surface1 border border-border-default rounded-2xl cursor-pointer hover:border-border-hover transition-all shadow-sm hover:shadow-md flex flex-col overflow-hidden group/card"
                    >
                        <div
                            className="w-full aspect-[4/3] flex flex-col items-center justify-center bg-[#f5f5f5] overflow-hidden"
                        >
                            {pattern.thumbnails.length > 0 ? (
                                <img
                                    src={pattern.thumbnails[0]}
                                    alt={pattern.name}
                                    className="w-full h-full object-contain group-hover/card:scale-105 transition-transform duration-700 ease-out"
                                />
                            ) : (
                                <Layers className="w-10 h-10 text-text-tertiary" />
                            )}
                        </div>
                        <div className="p-5 flex-1 bg-bg-base border-t border-border-default/50">
                            <h3 className="text-[16px] font-semibold truncate mb-1.5 text-text-primary">
                                {pattern.name}
                            </h3>
                            <p className="text-[13px] text-text-tertiary mb-3">
                                {pattern.source_image_count} design{pattern.source_image_count !== 1 ? 's' : ''} · {timeAgo(pattern.created_at)}
                            </p>
                            <p className="text-[14px] leading-relaxed text-text-secondary line-clamp-2">
                                {pattern.summary}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Need to inject hide-scrollbar utility inline since index.css may not have it */}
            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}
