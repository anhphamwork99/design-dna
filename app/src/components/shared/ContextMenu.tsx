import React, { useState, useRef, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';

export interface ContextMenuItem {
    label: string;
    icon?: LucideIcon;
    onClick: () => void;
    variant?: 'default' | 'danger';
}

interface ContextMenuProps {
    items: ContextMenuItem[];
    trigger: React.ReactNode;
    align?: 'left' | 'right';
}

export function ContextMenu({ items, trigger, align = 'right' }: ContextMenuProps) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close on click-outside
    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [open]);

    const handleTriggerClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setOpen((prev) => !prev);
    };

    const handleItemClick = (e: React.MouseEvent, item: ContextMenuItem) => {
        e.stopPropagation();
        e.preventDefault();
        item.onClick();
        setOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative inline-flex">
            <div onClick={handleTriggerClick} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen((prev) => !prev); } }}>
                {trigger}
            </div>

            {open && (
                <div
                    className={`absolute top-full mt-1 bg-bg-surface1 border border-border-default rounded-[12px] shadow-xl p-1 min-w-[180px] z-50 ${align === 'right' ? 'right-0' : 'left-0'}`}
                >
                    {items.map((item, idx) => {
                        const Icon = item.icon;
                        const isDanger = item.variant === 'danger';
                        return (
                            <button
                                key={idx}
                                onClick={(e) => handleItemClick(e, item)}
                                className={`w-full px-3 py-2 rounded-[8px] text-[13px] flex items-center gap-2.5 transition-colors cursor-pointer text-left ${isDanger
                                        ? 'text-error hover:bg-error/10'
                                        : 'text-text-primary hover:bg-state-hover'
                                    }`}
                            >
                                {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
