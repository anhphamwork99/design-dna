import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PanelLeftClose, PanelLeft } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────

interface FloatingPanelProps {
    isVisible: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}

// ── Component ──────────────────────────────────────────────────────

export default function FloatingPanel({
    isVisible,
    onToggle,
    children,
}: FloatingPanelProps) {
    return (
        <div className="floating-panel-wrapper" style={{
            position: 'absolute',
            top: 16,
            left: 16,
            bottom: 16,
            zIndex: 30,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
        }}>
            {/* Toggle button — always visible, always at top */}
            <button
                onClick={onToggle}
                className="flex items-center justify-center w-8 h-8 bg-white rounded-lg shadow-md border border-border-default/50 hover:bg-bg-surface2 transition-colors"
                style={{
                    pointerEvents: 'auto',
                    flexShrink: 0,
                    alignSelf: 'flex-start',
                }}
                aria-label={isVisible ? 'Hide panel' : 'Show panel'}
            >
                {isVisible ? (
                    <PanelLeftClose className="w-4 h-4 text-text-secondary" />
                ) : (
                    <PanelLeft className="w-4 h-4 text-text-secondary" />
                )}
            </button>

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="bg-white rounded-2xl shadow-xl overflow-y-auto"
                        style={{
                            width: 260,
                            padding: 16,
                            pointerEvents: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                            maxHeight: '100%',
                        }}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
