import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarNavItemProps {
    icon: React.ReactNode;
    label: string;
    to: string;
    collapsed: boolean;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function SidebarNavItem({ icon, label, to, collapsed, onClick }: SidebarNavItemProps) {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) =>
                `flex items-center h-11 rounded-lg px-3 transition-colors duration-150 relative group ${isActive
                    ? 'bg-bg-surface2 font-semibold text-text-primary'
                    : 'text-text-secondary hover:bg-state-hover hover:text-text-primary'
                } ${collapsed ? 'justify-center' : 'gap-3'}`
            }
        >
            <span className="w-5 h-5 shrink-0 flex items-center justify-center">{icon}</span>
            <span
                className={`text-[14px] whitespace-nowrap transition-opacity duration-200 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                    }`}
            >
                {label}
            </span>
        </NavLink>
    );
}
