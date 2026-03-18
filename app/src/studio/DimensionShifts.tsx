import { motion, AnimatePresence } from 'motion/react';
import type { Shifts } from './types';
import { dimensionConfig } from './types';

// ── Types ──────────────────────────────────────────────────────────

type ShiftMode = 'keep' | 'change' | 'reimagine';

interface DimensionShiftsProps {
    shifts: Shifts;
    onShiftsChange: (shifts: Shifts) => void;
    customInputs: Record<string, string>;
    onCustomInputChange: (key: string, value: string) => void;
}

// ── Helpers ─────────────────────────────────────────────────────────

function getShiftMode(shift: { keep: boolean; value: string }): ShiftMode {
    if (shift.keep) return 'keep';
    if (shift.value === '') return 'reimagine';
    return 'change';
}

function applyShiftMode(
    shifts: Shifts,
    key: keyof Shifts,
    mode: ShiftMode,
): Shifts {
    switch (mode) {
        case 'keep':
            return { ...shifts, [key]: { keep: true, value: '' } };
        case 'reimagine':
            return { ...shifts, [key]: { keep: false, value: '' } };
        case 'change':
            return { ...shifts, [key]: { keep: false, value: shifts[key].value } };
    }
}

// ── Component ──────────────────────────────────────────────────────

export default function DimensionShifts({
    shifts,
    onShiftsChange,
}: DimensionShiftsProps) {
    return (
        <div className="space-y-0.5">
            {dimensionConfig.map((dim) => {
                const mode = getShiftMode(shifts[dim.key]);
                return (
                    <div key={dim.key} className="py-1.5 border-b border-border-default/20 last:border-0">
                        {/* Row: label + dropdown */}
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-[12px] font-medium text-text-primary flex-shrink-0">
                                {dim.name}
                            </span>
                            <select
                                value={mode}
                                onChange={(e) => {
                                    const newMode = e.target.value as ShiftMode;
                                    onShiftsChange(applyShiftMode(shifts, dim.key, newMode));
                                }}
                                className={`text-[11px] font-medium rounded-lg border px-2 py-1 cursor-pointer transition-colors focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent ${mode === 'keep'
                                        ? 'bg-bg-surface2 border-border-default text-text-secondary'
                                        : mode === 'change'
                                            ? 'bg-yellow-50 border-yellow-400/50 text-yellow-700'
                                            : 'bg-accent/10 border-accent/30 text-accent'
                                    }`}
                            >
                                <option value="keep">Keep</option>
                                <option value="change">Change</option>
                                <option value="reimagine">Reimagine</option>
                            </select>
                        </div>

                        {/* Conditional text input for "change" mode */}
                        <AnimatePresence>
                            {mode === 'change' && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.15, ease: 'easeOut' }}
                                    style={{ overflow: 'hidden' }}
                                >
                                    <input
                                        type="text"
                                        placeholder={dim.placeholder}
                                        value={shifts[dim.key].value}
                                        onChange={(e) =>
                                            onShiftsChange({
                                                ...shifts,
                                                [dim.key]: { keep: false, value: e.target.value },
                                            })
                                        }
                                        className="w-full bg-bg-surface2 border border-border-default rounded-lg px-2.5 py-1 text-[11px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all mt-1.5"
                                    />
                                    <p className="text-[9px] text-text-tertiary mt-0.5">
                                        Give direction, or leave empty for AI surprise
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}
