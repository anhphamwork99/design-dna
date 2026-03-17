import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

interface AppShellProps {
    children: React.ReactNode;
    onSettingsClick: () => void;
}

export function AppShell({ children, onSettingsClick }: AppShellProps) {
    const { signOut } = useAuth();
    const location = useLocation();

    // Studio is a full-canvas experience — hide sidebar
    const isStudioRoute = location.pathname === '/studio';

    return (
        <div className="flex min-h-screen bg-bg-base">
            {!isStudioRoute && (
                <Sidebar signOut={signOut} onSettingsClick={onSettingsClick} />
            )}
            <main className={`flex-1 overflow-auto ${isStudioRoute ? 'p-0' : 'p-8'}`}>
                {children}
            </main>
        </div>
    );
}
