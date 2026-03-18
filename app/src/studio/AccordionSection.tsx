import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────

interface AccordionSectionProps {
    title: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}

// ── Component ──────────────────────────────────────────────────────

export default function AccordionSection({
    title,
    defaultOpen = false,
    children,
}: AccordionSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="accordion-section">
            {/* Header — clickable toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full py-1.5 group"
            >
                <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">
                    {title}
                </span>
                <ChevronDown
                    className={`w-3.5 h-3.5 text-text-tertiary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {/* Collapsible content */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div className="pt-1.5 pb-0.5">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
