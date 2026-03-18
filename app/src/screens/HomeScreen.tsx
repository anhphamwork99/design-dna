import { useEffect } from 'react';
import { useMigratePatterns } from '../hooks/useMigratePatterns';
import { useAuth } from '../contexts/AuthContext';
import heroBanner from '../assets/hero-banner.png';

export default function HomeScreen() {
    const { session } = useAuth();

    // localStorage → Supabase migration
    const { state: migrationState, startMigration, dismiss: dismissMigration } = useMigratePatterns(
        session?.access_token ?? null
    );

    // Auto-dismiss migration banner after success
    useEffect(() => {
        if (migrationState.status === 'done') {
            const timer = setTimeout(() => dismissMigration(), 3000);
            return () => clearTimeout(timer);
        }
    }, [migrationState.status, dismissMigration]);

    useEffect(() => {
        document.title = 'DesignDNA — Home';
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            {/* Migration banner */}
            {migrationState.status !== 'idle' && (
                <div className="mb-6 w-full max-w-[640px]">
                    {migrationState.status === 'detected' && (
                        <div className="bg-bg-surface1 border border-accent/30 rounded-lg px-5 py-3 flex items-center justify-between gap-4 shadow-lg">
                            <p className="text-[13px] text-text-secondary">
                                <span className="mr-2">📦</span>
                                Found <span className="text-text-primary font-medium">{migrationState.localPatternCount}</span> pattern{migrationState.localPatternCount !== 1 ? 's' : ''} in local storage. Migrate to your account?
                            </p>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={startMigration}
                                    className="px-4 py-1.5 rounded-md ai-gradient text-white text-[12px] font-medium hover:opacity-90 transition-opacity"
                                >
                                    Migrate Now
                                </button>
                                <button
                                    onClick={dismissMigration}
                                    className="px-3 py-1.5 rounded-md text-[12px] text-text-tertiary hover:text-text-secondary transition-colors"
                                >
                                    Not Now
                                </button>
                            </div>
                        </div>
                    )}

                    {migrationState.status === 'migrating' && (
                        <div className="bg-bg-surface1 border border-accent/30 rounded-lg px-5 py-3 flex items-center gap-3 shadow-lg">
                            <div className="w-4 h-4 rounded-full border-2 border-accent border-t-transparent animate-spin shrink-0" />
                            <p className="text-[13px] text-text-secondary">
                                Migrating patterns… <span className="text-text-primary font-medium">{migrationState.migratedCount}/{migrationState.localPatternCount}</span>
                            </p>
                        </div>
                    )}

                    {migrationState.status === 'done' && (
                        <div className="bg-bg-surface1 border border-[#34d399]/30 rounded-lg px-5 py-3 flex items-center gap-3 shadow-lg">
                            <span className="text-[#34d399]">✓</span>
                            <p className="text-[13px] text-text-secondary">
                                <span className="text-text-primary font-medium">{migrationState.migratedCount}</span> pattern{migrationState.migratedCount !== 1 ? 's' : ''} migrated successfully{migrationState.skippedCount > 0 ? `, ${migrationState.skippedCount} already existed` : ''}
                            </p>
                        </div>
                    )}

                    {migrationState.status === 'error' && (
                        <div className="bg-bg-surface1 border border-error/30 rounded-lg px-5 py-3 flex items-center justify-between gap-4 shadow-lg">
                            <p className="text-[13px] text-text-secondary">
                                Migration failed: {migrationState.error}. Your local patterns are safe — try again later.
                            </p>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={startMigration}
                                    className="px-4 py-1.5 rounded-md bg-accent text-white text-[12px] font-medium hover:bg-accent-hover transition-colors"
                                >
                                    Retry
                                </button>
                                <button
                                    onClick={dismissMigration}
                                    className="px-3 py-1.5 rounded-md text-[12px] text-text-tertiary hover:text-text-secondary transition-colors"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Hero Banner */}
            <div className="w-full max-w-[800px] mb-8 overflow-hidden rounded-2xl">
                <img
                    src={heroBanner}
                    alt="DesignDNA — Discover the DNA of great design"
                    className="w-full max-h-[440px] object-cover"
                    draggable={false}
                />
            </div>

            <h1 className="text-[32px] font-bold tracking-tight text-text-primary mb-3">
                Welcome to DesignDNA
            </h1>
            <p className="text-[14px] text-text-secondary max-w-[400px]">
                Home dashboard coming soon. Use the sidebar to navigate to your tools.
            </p>
        </div>
    );
}
