import { motion } from 'motion/react';
import { Copy, Layers, Sparkles } from 'lucide-react';
import type { StudioGoal } from './types';
import { goalCards } from './types';

const iconMap = {
    copy: Copy,
    layers: Layers,
    sparkles: Sparkles,
} as const;

interface GoalPickerProps {
    onSelectGoal: (goal: StudioGoal) => void;
    preloadedImage?: { data: string; name: string } | null;
}

export default function GoalPicker({ onSelectGoal, preloadedImage }: GoalPickerProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-[28px] font-bold tracking-tight mb-2">
                    What do you want to create?
                </h1>
                <p className="text-text-secondary text-[15px]">
                    Choose a creative direction for your design
                </p>
            </div>

            {/* Preloaded image indicator */}
            {preloadedImage && (
                <motion.div
                    className="flex items-center gap-3 mb-8 bg-bg-surface1 border border-border-default rounded-xl px-4 py-3"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <img
                        src={preloadedImage.data}
                        alt={preloadedImage.name}
                        className="w-10 h-10 rounded-lg object-cover border border-border-default"
                    />
                    <span className="text-[13px] text-text-secondary">
                        Using: <span className="font-medium text-text-primary">{preloadedImage.name}</span>
                    </span>
                </motion.div>
            )}

            {/* Goal cards grid */}
            <div className="flex gap-5 max-w-[920px] w-full">
                {goalCards.map((card, index) => {
                    const IconComponent = iconMap[card.iconName];
                    return (
                        <motion.button
                            key={card.goal}
                            className="flex-1 flex flex-col items-start text-left bg-bg-surface1 border border-border-default rounded-2xl p-7 cursor-pointer transition-colors hover:border-border-hover group"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.4,
                                delay: index * 0.1,
                                ease: [0.25, 0.46, 0.45, 0.94],
                            }}
                            whileHover={{
                                scale: 1.02,
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelectGoal(card.goal)}
                        >
                            <div className="w-12 h-12 rounded-xl ai-gradient flex items-center justify-center mb-4">
                                <IconComponent className="w-6 h-6 text-white" fill="currentColor" strokeWidth={0} />
                            </div>
                            <h2 className="text-[18px] font-semibold mb-2">{card.title}</h2>
                            <p className="text-[13px] text-text-secondary leading-relaxed mb-6 flex-1">
                                {card.description}
                            </p>
                            <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent group-hover:text-accent-hover transition-colors">
                                {card.cta}
                                <span className="transition-transform group-hover:translate-x-0.5">→</span>
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
