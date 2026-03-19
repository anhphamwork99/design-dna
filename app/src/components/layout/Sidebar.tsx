import { useState } from 'react';
import {
    Home,
    Layers,
    Palette,
    Microscope,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { SidebarNavItem } from './SidebarNavItem';

interface SidebarProps {
    signOut: () => void;
    onSettingsClick: () => void;
}

export function Sidebar({ signOut, onSettingsClick }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={`h-screen sticky top-0 bg-bg-surface1 border-r border-border-default flex flex-col transition-all duration-300 ease-in-out shrink-0 ${collapsed ? 'w-16' : 'w-60'
                }`}
            role="navigation"
            aria-label="Main navigation"
        >
            {/* Logo + Collapse toggle */}
            <div className={`h-14 flex items-center shrink-0 ${collapsed ? 'justify-center px-3' : 'justify-between px-6'}`}>
                {!collapsed && (
                    <span className="font-logo text-2xl font-bold text-text-primary truncate">
                        DesignDNA
                    </span>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-surface2 transition-colors"
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <ChevronLeft className="w-4 h-4" />
                    )}
                </button>
            </div>

            {/* Main nav — single flat list */}
            <div className="px-3 mt-4">
                <nav className="flex flex-col gap-1">
                    <SidebarNavItem
                        icon={<Home className="w-5 h-5" />}
                        label="Home"
                        to="/"
                        collapsed={collapsed}
                    />
                    <SidebarNavItem
                        icon={<Palette className="w-5 h-5" />}
                        label="Studio"
                        to="/studio"
                        collapsed={collapsed}
                    />
                    <SidebarNavItem
                        icon={<Microscope className="w-5 h-5" />}
                        label="Deep Analyze"
                        to="/analyze"
                        collapsed={collapsed}
                    />
                    <SidebarNavItem
                        icon={<Layers className="w-5 h-5" />}
                        label="Winning Patterns"
                        to="/pattern"
                        collapsed={collapsed}
                    />
                </nav>
            </div>

            {/* Spacer */}
            <div className="flex-grow" />

            {/* FOOTER section */}
            <div className="border-t border-border-default mx-3 pt-2 pb-3">
                <nav className="flex flex-col gap-1">
                    <SidebarNavItem
                        icon={<Settings className="w-5 h-5" />}
                        label="Settings"
                        to="/settings"
                        collapsed={collapsed}
                        onClick={(e) => {
                            e.preventDefault();
                            onSettingsClick();
                        }}
                    />
                    <button
                        onClick={signOut}
                        className={`flex items-center rounded-lg text-text-secondary hover:bg-state-hover hover:text-text-primary transition-colors duration-150 ${collapsed ? 'justify-center w-10 h-10 mx-auto' : 'h-11 px-3 gap-3'
                            }`}
                    >
                        <span className="w-5 h-5 shrink-0 flex items-center justify-center">
                            <LogOut className="w-5 h-5" />
                        </span>
                        <span
                            className={`text-[14px] whitespace-nowrap transition-opacity duration-200 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                                }`}
                        >
                            Sign Out
                        </span>
                    </button>
                </nav>
            </div>
        </aside>
    );
}
