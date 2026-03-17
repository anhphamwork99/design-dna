import React from 'react';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

interface AppShellProps {
    children: React.ReactNode;
    onSettingsClick: () => void;
}

export function AppShell({ children, onSettingsClick }: AppShellProps) {
    const { signOut } = useAuth();

    return (
        <div className="flex min-h-screen bg-bg-base">
            <Sidebar signOut={signOut} onSettingsClick={onSettingsClick} />
            <main className="flex-1 overflow-auto p-8">
                {children}
            </main>
        </div>
    );
}
