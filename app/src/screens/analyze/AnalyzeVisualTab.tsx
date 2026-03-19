import { motion } from 'motion/react';
import { LayoutGrid, Palette, Type, Shapes, Printer } from 'lucide-react';
import { DataPairRow, DataPointCard, TagChip } from '../../components/shared';
import { GradientSectionIcon } from './SectionIcon';

interface AnalyzeVisualTabProps {
    visualDNA: any;
    itemVariants: any;
}

export function AnalyzeVisualTab({ visualDNA, itemVariants }: AnalyzeVisualTabProps) {
    const palette = visualDNA.color?.palette ?? [];

    return (
        <>
            {visualDNA.summary && (
                <motion.div
                    variants={itemVariants}
                    className="bg-bg-surface2 p-4 rounded-lg text-[14px] leading-relaxed italic text-text-secondary border border-border-default"
                >
                    {visualDNA.summary}
                </motion.div>
            )}

            <motion.div variants={itemVariants}>
                <h3 className="text-[16px] font-semibold mb-3 flex items-center gap-2.5"><GradientSectionIcon icon={LayoutGrid} />Composition</h3>
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-[14px]">
                    <DataPairRow label="Grid Type" value={visualDNA.composition?.grid_type} />
                    <DataPairRow label="Symmetry" value={visualDNA.composition?.symmetry} />
                    <DataPairRow label="Focal Point" value={visualDNA.composition?.focal_point} />
                    <DataPairRow label="Visual Flow" value={visualDNA.composition?.visual_flow} />
                    <DataPairRow label="Density" value={visualDNA.composition?.density} />
                </div>
            </motion.div>

            <motion.div variants={itemVariants}>
                <h3 className="text-[16px] font-semibold mb-3 flex items-center gap-2.5"><GradientSectionIcon icon={Palette} />Color</h3>
                <div className="flex h-10 w-full rounded-lg overflow-hidden mb-3">
                    {palette.map((color: any, i: number) => (
                        <div
                            key={i}
                            style={{
                                width: `${color.proportion || (100 / (palette.length || 1))}%`,
                                backgroundColor: color.hex,
                            }}
                            title={`${color.name} (${color.proportion}%)`}
                        />
                    ))}
                </div>
                <div className="flex flex-wrap gap-4 mb-5">
                    {palette.map((color: any, i: number) => (
                        <div key={i} className="flex items-center gap-2 bg-bg-surface2 px-3 py-2 rounded-lg">
                            <div
                                className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                                style={{ backgroundColor: color.hex }}
                            />
                            <div className="flex flex-col">
                                <span className="text-[12px] font-medium text-text-primary leading-tight">
                                    {color.name}
                                </span>
                                <span className="text-[11px] text-text-tertiary uppercase tracking-wider">
                                    {color.role}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[14px]">
                    <DataPointCard label="Harmony" value={visualDNA.color?.harmony} centered />
                    <DataPointCard label="Contrast" value={visualDNA.color?.contrast} centered />
                    <DataPointCard label="Temperature" value={visualDNA.color?.temperature} centered />
                </div>
            </motion.div>

            <motion.div variants={itemVariants}>
                <h3 className="text-[16px] font-semibold mb-3 flex items-center gap-2.5"><GradientSectionIcon icon={Type} useStroke />Typography</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {visualDNA.typography?.fonts?.map((font: any, i: number) => (
                        <div key={i} className="bg-bg-surface2 p-3 rounded-lg border border-border-default">
                            <div className="text-[12px] text-accent font-medium mb-1 uppercase tracking-wider">
                                {font.role}
                            </div>
                            <div className="text-[14px] font-semibold text-text-primary truncate">
                                {font.classification}
                            </div>
                            <div className="text-[12px] text-text-secondary mt-1">
                                {font.weight} · {font.case}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col sm:flex-row items-baseline justify-between py-3 border-t border-border-default">
                    <span className="text-[14px] text-text-secondary">Hierarchy Levels</span>
                    <span className="text-[14px] font-medium text-text-primary bg-bg-surface2 px-3 py-1 rounded-full">
                        {visualDNA.typography?.hierarchy_levels}
                    </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 py-3 border-t border-border-default">
                    <span className="text-[14px] text-text-secondary min-w-[150px]">
                        Suggested Google Fonts
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {visualDNA.typography?.suggested_google_fonts?.map((font: string, i: number) => (
                            <TagChip key={`${font}-${i}`}>{font}</TagChip>
                        ))}
                    </div>
                </div>
            </motion.div>

            <motion.div variants={itemVariants}>
                <h3 className="text-[16px] font-semibold mb-3 flex items-center gap-2.5"><GradientSectionIcon icon={Shapes} />Graphics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[14px] mb-4">
                    <DataPointCard label="Style" value={visualDNA.graphics?.style} />
                    <DataPointCard label="Primary Element" value={visualDNA.graphics?.primary_element} />
                    <DataPointCard label="Detail Level" value={visualDNA.graphics?.detail_level} />
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex sm:items-baseline flex-col sm:flex-row gap-2 border-t border-border-default pt-3">
                        <span className="text-[14px] text-text-secondary min-w-[150px]">Secondary Elements</span>
                        <div className="flex flex-wrap gap-2">
                            {visualDNA.graphics?.secondary_elements?.map((item: string, i: number) => (
                                <TagChip key={`${item}-${i}`}>{item}</TagChip>
                            ))}
                        </div>
                    </div>
                    <div className="flex sm:items-baseline flex-col sm:flex-row gap-2 border-t border-border-default pt-3">
                        <span className="text-[14px] text-text-secondary min-w-[150px]">Effects</span>
                        <div className="flex flex-wrap gap-2">
                            {visualDNA.graphics?.effects?.map((item: string, i: number) => (
                                <TagChip key={`${item}-${i}`}>{item}</TagChip>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="pb-8">
                <h3 className="text-[16px] font-semibold mb-3 flex items-center gap-2.5"><GradientSectionIcon icon={Printer} />Print Recommendations</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-[14px] mb-4">
                    <DataPairRow label="Best Print Method" value={visualDNA.pod_technical?.best_print_method} />
                    <DataPairRow label="Scalability" value={visualDNA.pod_technical?.scalability} />
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <span className="text-[14px] text-text-secondary block mb-2">Suitable Products</span>
                        <div className="flex flex-wrap gap-2">
                            {visualDNA.pod_technical?.suitable_products?.map((product: string, i: number) => (
                                <TagChip key={`${product}-${i}`} rounded="full">
                                    {product}
                                </TagChip>
                            ))}
                        </div>
                    </div>
                    <div>
                        <span className="text-[14px] text-text-secondary block mb-2">
                            Recommended Garment Colors
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {visualDNA.pod_technical?.recommended_garment_colors?.map((color: any, i: number) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 bg-bg-surface2 px-3 py-1.5 rounded-full shadow-sm border border-border-default"
                                >
                                    <div
                                        className="w-3.5 h-3.5 rounded-full border border-black/10"
                                        style={{ backgroundColor: color.hex || color }}
                                    />
                                    <span className="text-[13px] text-text-primary font-medium">
                                        {color.name || color}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
