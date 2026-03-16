import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Layers, Trash2 } from 'lucide-react';
import { getPatterns, deletePattern, SavedPattern } from './patternStorage';

interface PatternLibraryProps {
    onNavigate: (screen: string, data?: any) => void;
}

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

export default function PatternLibrary({ onNavigate }: PatternLibraryProps) {
    const [patterns, setPatterns] = useState<SavedPattern[]>([]);

    useEffect(() => {
        setPatterns(getPatterns());
    }, []);

    const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(`Delete pattern "${name}"?`)) {
            deletePattern(id);
            setPatterns(getPatterns());
        }
    };

    if (patterns.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-8"
            >
                <button
                    onClick={() => onNavigate('landing')}
                    className="flex items-center text-text-secondary hover:text-text-primary text-[14px] mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Home
                </button>
                <div className="flex flex-col items-center justify-center text-center py-20">
                    <Layers className="w-12 h-12 text-text-tertiary mb-4" />
                    <h2 className="text-[18px] font-semibold mb-2">No patterns saved yet</h2>
                    <p className="text-[14px] text-text-secondary max-w-[400px]">
                        Use Compare to analyze multiple designs, then save the results as reusable patterns.
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-8"
        >
            <button
                onClick={() => onNavigate('landing')}
                className="flex items-center text-text-secondary hover:text-text-primary text-[14px] mb-8 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Home
            </button>

            <div className="max-w-[800px] mx-auto">
                <div className="mb-8">
                    <h1 className="text-[32px] font-bold tracking-tight mb-2">Pattern Library</h1>
                    <p className="text-[14px] text-text-secondary">
                        {patterns.length} saved pattern{patterns.length !== 1 ? 's' : ''} from Compare analysis
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {patterns.map((pattern) => (
                        <motion.div
                            key={pattern.id}
                            whileHover={{ scale: 1.01 }}
                            onClick={() => onNavigate('pattern_detail', { patternId: pattern.id })}
                            className="bg-bg-surface1 border border-border-default rounded-xl p-5 cursor-pointer hover:bg-bg-surface2/50 transition-colors group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-[16px] font-semibold truncate flex-1 mr-3">
                                    {pattern.name}
                                </h3>
                                <button
                                    onClick={(e) => handleDelete(pattern.id, pattern.name, e)}
                                    className="p-1.5 text-text-tertiary hover:text-error rounded-lg hover:bg-error/10 transition-colors opacity-0 group-hover:opacity-100"
                                    aria-label={`Delete pattern ${pattern.name}`}
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Thumbnails row */}
                            <div className="flex gap-1.5 mb-3">
                                {pattern.thumbnails.slice(0, 5).map((thumb, i) => (
                                    <div
                                        key={i}
                                        className="w-10 h-10 rounded-lg overflow-hidden border border-border-default flex-shrink-0"
                                    >
                                        <img src={thumb} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[12px] text-text-tertiary">
                                    {timeAgo(pattern.createdAt)}
                                </span>
                                <span className="text-[12px] text-text-tertiary">·</span>
                                <span className="text-[12px] text-text-tertiary">
                                    {pattern.sourceImageCount} design{pattern.sourceImageCount !== 1 ? 's' : ''}
                                </span>
                            </div>

                            <p className="text-[13px] text-text-secondary line-clamp-2">
                                {pattern.summary}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
