import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useStudioActive } from '../../studio/useStudioActive';

interface AppShellProps {
    children: React.ReactNode;
    onSettingsClick: () => void;
}

export function AppShell({ children, onSettingsClick }: AppShellProps) {
    const { signOut } = useAuth();
    const location = useLocation();
    const studioActive = useStudioActive();

    // Hide sidebar when studio is actively in use (past goal picker).
    // Goal picker still shows sidebar for navigation context.
    const isStudioRoute = location.pathname === '/studio';
    const hideSidebar = isStudioRoute && studioActive;

    return (
        <div className="flex min-h-screen bg-bg-base">
            {!hideSidebar && (
                <Sidebar signOut={signOut} onSettingsClick={onSettingsClick} />
            )}
            <main className={`flex-1 overflow-x-clip ${hideSidebar ? 'p-0' : 'p-8'}`}>
                {children}
            </main>
        </div>
    );
}
