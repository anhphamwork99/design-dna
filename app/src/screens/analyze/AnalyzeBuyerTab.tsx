import { motion } from 'motion/react';
import { Heart, Users, Zap, MessageCircle, CalendarDays } from 'lucide-react';
import { DataPointCard, TagChip } from '../../components/shared';
import { GradientSectionIcon } from './SectionIcon';

interface AnalyzeBuyerTabProps {
    buyerDNA: any;
    itemVariants: any;
}

function TagListRow({
    label,
    items,
    compact = false,
}: {
    label: string;
    items?: string[];
    compact?: boolean;
}) {
    if (!items?.length) return null;

    return (
        <div className={`flex flex-col sm:flex-row sm:items-baseline gap-2 ${compact ? 'pb-1' : 'pb-3 border-b border-border-default'}`}>
            <span className="text-[14px] text-text-secondary min-w-[120px]">{label}</span>
            <div className="flex flex-wrap gap-2">
                {items.map((item, i) => (
                    <span
                        key={`${label}-${item}-${i}`}
                        className="contents"
                    >
                        <TagChip>{item}</TagChip>
                    </span>
                ))}
            </div>
        </div>
    );
}

export function AnalyzeBuyerTab({ buyerDNA, itemVariants }: AnalyzeBuyerTabProps) {
    return (
        <>
            <motion.div variants={itemVariants}>
                <h3 className="text-[18px] font-bold mb-1 flex items-center gap-2.5"><GradientSectionIcon icon={Heart} />Why It Feels Personal</h3>
                <p className="text-[13px] text-text-tertiary mb-4">
                    The specific design decisions that create "this was made for me" resonance
                </p>
                <div className="flex flex-col gap-3">
                    {buyerDNA.made_for_me_decisions?.map((decision: any, i: number) => (
                        <div key={i} className="bg-bg-surface2 p-4 rounded-lg">
                            <h4 className="text-[14px] font-semibold mb-1">{decision.decision}</h4>
                            <p className="text-[14px] text-text-secondary italic">{decision.why_it_works}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            <motion.div variants={itemVariants}>
                <h3 className="text-[16px] font-semibold mb-3 flex items-center gap-2.5"><GradientSectionIcon icon={Users} />Who Buys This</h3>
                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[14px]">
                        <DataPointCard label="Age" value={buyerDNA.persona?.age_range} />
                        <DataPointCard label="Gender" value={buyerDNA.persona?.gender_lean} />
                        <DataPointCard label="Lifestyle" value={buyerDNA.persona?.lifestyle} />
                        <DataPointCard label="Spending" value={buyerDNA.persona?.spending_mindset} />
                    </div>

                    <div className="flex flex-col gap-3 pt-3">
                        <TagListRow label="Interests" items={buyerDNA.persona?.interests} />
                        <TagListRow label="Values" items={buyerDNA.persona?.values} />
                        <TagListRow label="Communities" items={buyerDNA.persona?.online_communities} compact />
                    </div>
                </div>
            </motion.div>

            <motion.div variants={itemVariants}>
                <h3 className="text-[16px] font-semibold mb-3 flex items-center gap-2.5"><GradientSectionIcon icon={Zap} />Why People Buy This</h3>
                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[14px]">
                        <DataPointCard label="Primary Emotion" value={buyerDNA.emotional_triggers?.primary_emotion} />
                        <DataPointCard label="Trigger" value={buyerDNA.emotional_triggers?.trigger_description} />
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                        <TagListRow label="Secondary Emotions" items={buyerDNA.emotional_triggers?.secondary_emotions} />
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between py-1">
                            <span className="text-[14px] text-text-secondary">Emotional Arc</span>
                            <span className="text-[14px] font-medium text-text-primary">
                                {buyerDNA.emotional_triggers?.emotional_arc}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="border-t border-border-default pt-8">
                <h3 className="text-[16px] font-semibold mb-3 flex items-center gap-2.5"><GradientSectionIcon icon={MessageCircle} />What This Design Communicates</h3>
                <div className="flex flex-col gap-3 text-[14px]">
                    <DataPointCard label="Primary Signal" value={buyerDNA.identity_signals?.primary} />
                    <DataPointCard
                        label="Message to World"
                        value={<span className="italic">{buyerDNA.identity_signals?.message_to_world}</span>}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <DataPointCard label="Tribe" value={buyerDNA.identity_signals?.tribe} />
                        <DataPointCard label="Aesthetic Identity" value={buyerDNA.identity_signals?.aesthetic_identity} />
                    </div>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="pb-8">
                <h3 className="text-[16px] font-semibold mb-3 flex items-center gap-2.5"><GradientSectionIcon icon={CalendarDays} />When & Where It Sells</h3>
                <div className="flex flex-col gap-3">
                    <TagListRow label="Best Seasons" items={buyerDNA.occasion_timing?.best_seasons} />
                    <TagListRow label="Events" items={buyerDNA.occasion_timing?.events} />

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[14px] pt-2">
                        <DataPointCard label="Wear Context" value={buyerDNA.occasion_timing?.wear_context} />
                        <DataPointCard label="Mood Triggers" value={buyerDNA.occasion_timing?.mood_triggers} />
                        <DataPointCard
                            label="Gift Score"
                            value={buyerDNA.occasion_timing?.gift_potential?.score != null
                                ? `${buyerDNA.occasion_timing.gift_potential.score}/10`
                                : undefined}
                        />
                        <DataPointCard label="Longevity" value={buyerDNA.occasion_timing?.evergreen_vs_viral} />
                    </div>
                </div>
            </motion.div>
        </>
    );
}
