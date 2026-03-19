import { useEffect, useState } from 'react';
import { useMigratePatterns } from '../hooks/useMigratePatterns';
import { useAuth } from '../contexts/AuthContext';
import { listPatterns, SavedPattern } from '../apiClient';
import { FeatureHeroBlock } from '../components/home/FeatureHeroBlock';
import { OnboardingChecklist } from '../components/home/OnboardingChecklist';
import { RecentAnalysesCarousel } from '../components/home/RecentAnalysesCarousel';
import { MousePointerClick, Sparkles, Layers } from 'lucide-react';
import heroBanner from '../assets/hero-banner.png';

export default function HomeScreen() {
    const { session } = useAuth();
    const [patterns, setPatterns] = useState<SavedPattern[]>([]);
    const [loadingPatterns, setLoadingPatterns] = useState(true);

    const { state: migrationState, startMigration, dismiss: dismissMigration } = useMigratePatterns(
        session?.access_token ?? null
    );

    useEffect(() => {
        if (migrationState.status === 'done') {
            const timer = setTimeout(() => dismissMigration(), 3000);
            return () => clearTimeout(timer);
        }
    }, [migrationState.status, dismissMigration]);

    useEffect(() => {
        document.title = 'DesignDNA — Home';
    }, []);

    useEffect(() => {
        if (!session) {
            setLoadingPatterns(false);
            return;
        }
        listPatterns(session.access_token)
            .then(setPatterns)
            .catch((err) => {
                console.error('Failed to load patterns for home screen:', err);
            })
            .finally(() => setLoadingPatterns(false));
    }, [session]);

    return (
        <div className="flex flex-col w-full max-w-[1240px] px-6 mx-auto pb-24 pt-4 md:pt-10 min-h-[80vh]">
            {/* Migration banner */}
            {migrationState.status !== 'idle' && (
                <div className="mb-10 w-full relative z-20">
                    {/* Migration states... */}
                    {migrationState.status === 'detected' && (
                        <div className="bg-bg-surface1 border border-accent/30 rounded-xl px-5 py-3 flex items-center justify-between gap-4 shadow-lg shadow-accent/5">
                            <p className="text-[14px] text-text-secondary">
                                <span className="mr-3">📦</span>
                                Found <span className="text-text-primary font-medium">{migrationState.localPatternCount}</span> pattern{migrationState.localPatternCount !== 1 ? 's' : ''} in local storage. Migrate to your account?
                            </p>
                            <div className="flex items-center gap-3 shrink-0">
                                <button
                                    onClick={startMigration}
                                    className="px-5 py-2 rounded-lg ai-gradient text-white text-[13px] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                                >
                                    Migrate Now
                                </button>
                                <button
                                    onClick={dismissMigration}
                                    className="px-4 py-2 rounded-lg text-[13px] font-medium text-text-tertiary hover:text-text-secondary hover:bg-state-hover transition-colors whitespace-nowrap"
                                >
                                    Not Now
                                </button>
                            </div>
                        </div>
                    )}

                    {migrationState.status === 'migrating' && (
                        <div className="bg-bg-surface1 border border-accent/30 rounded-xl px-5 py-4 flex items-center gap-4 shadow-lg shadow-accent/5">
                            <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin shrink-0" />
                            <p className="text-[14px] text-text-secondary">
                                Migrating patterns… <span className="text-text-primary font-medium">{migrationState.migratedCount}/{migrationState.localPatternCount}</span>
                            </p>
                        </div>
                    )}

                    {migrationState.status === 'done' && (
                        <div className="bg-bg-surface1 border border-[#34d399]/30 rounded-xl px-5 py-4 flex items-center gap-4 shadow-lg shadow-[#34d399]/5">
                            <span className="text-[#34d399] font-bold text-lg">✓</span>
                            <p className="text-[14px] text-text-secondary">
                                <span className="text-text-primary font-medium border-b border-text-primary/20 pb-0.5">{migrationState.migratedCount}</span> pattern{migrationState.migratedCount !== 1 ? 's' : ''} migrated successfully{migrationState.skippedCount > 0 ? `, ${migrationState.skippedCount} already existed` : ''}
                            </p>
                        </div>
                    )}

                    {migrationState.status === 'error' && (
                        <div className="bg-bg-surface1 border border-error/30 rounded-xl px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-error/5">
                            <p className="text-[14px] text-text-secondary">
                                <span className="text-error font-medium mr-2">Migration failed:</span> {migrationState.error}. Your local patterns are safe.
                            </p>
                            <div className="flex items-center gap-3 shrink-0">
                                <button
                                    onClick={startMigration}
                                    className="px-5 py-2 rounded-lg bg-accent text-white text-[13px] font-semibold hover:bg-accent-hover transition-colors shadow-sm whitespace-nowrap"
                                >
                                    Retry
                                </button>
                                <button
                                    onClick={dismissMigration}
                                    className="px-4 py-2 rounded-lg text-[13px] font-medium text-text-tertiary hover:text-text-secondary hover:bg-state-hover transition-colors whitespace-nowrap"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Header / Hero Banner */}
            <div className="w-full flex justify-center mb-8 lg:mb-12">
                <div className="w-full max-w-[880px] rounded-2xl md:rounded-3xl overflow-hidden shadow-sm border border-border-default bg-bg-surface1">
                    <img
                        src={heroBanner}
                        alt="DesignDNA — Discover the DNA of great design"
                        className="w-full h-auto object-cover max-h-[300px] md:max-h-[440px]"
                        draggable={false}
                    />
                </div>
            </div>

            <div className="text-center mb-16 lg:mb-20">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary mb-4 lg:mb-6">
                    Welcome to DesignDNA
                </h1>
                <p className="text-[16px] md:text-[18px] text-text-secondary max-w-2xl mx-auto leading-relaxed">
                    Decode the visual formulas of winning designs, discover successful patterns, and generate fresh print-ready assets tailored to any niche.
                </p>
            </div>

            {/* Content Switcher: Onboarding or Recent Analyses */}
            <div className="mb-20 lg:mb-28 min-h-[140px]">
                {loadingPatterns ? (
                    <div className="animate-pulse">
                        <div className="h-6 w-32 bg-bg-surface1 rounded-md mb-4" />
                        <div className="flex gap-4 overflow-hidden">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-[140px] w-[200px] shrink-0 bg-bg-surface1/60 rounded-xl border border-border-default/50" />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in duration-500 ease-out fill-mode-forwards">
                        {patterns.length === 0 ? (
                            <OnboardingChecklist hasPatterns={false} />
                        ) : (
                            <RecentAnalysesCarousel patterns={patterns} />
                        )}
                    </div>
                )}
            </div>

            {/* Main Section: Feature Hero Blocks */}
            <div className="flex flex-col gap-24 lg:gap-40 pb-20">
                <FeatureHeroBlock
                    title={<>Decode the DNA of any <em className="font-logo font-normal italic text-accent opacity-90 pr-1">interface</em></>}
                    description="Upload any design—from t-shirts to landing pages—and let our AI analyze the core visual layout, styling, and buyer psychological triggers that make it work."
                    ctaText="Analyze Design"
                    ctaRoute="/analyze/new"
                    ctaVariant="primary"
                    illustration={<MousePointerClick className="w-32 h-32 text-accent/80 drop-shadow-lg" strokeWidth={1} />}
                />

                <FeatureHeroBlock
                    reversed
                    title={<>Generate variants from your <em className="font-logo font-normal italic text-text-tertiary pr-1">library</em></>}
                    description="Enter the Studio to blend multiple successful patterns together. Give the AI an original graphic to get customized, print-ready variations maintaining the core visual DNA."
                    ctaText="Open Studio"
                    ctaRoute="/studio"
                    ctaVariant="secondary"
                    illustration={<Sparkles className="w-32 h-32 text-text-tertiary drop-shadow-lg" strokeWidth={1} />}
                />

                <FeatureHeroBlock
                    title={<>Find the common <em className="font-logo font-normal italic text-text-tertiary pr-1">patterns</em></>}
                    description="Perform batch analysis on multiple winning designs to find their shared structural features. Extract and save these high-converting patterns to your personal library."
                    ctaText="Compare Designs"
                    ctaRoute="/compare"
                    ctaVariant="secondary"
                    illustration={<Layers className="w-32 h-32 text-text-tertiary drop-shadow-lg" strokeWidth={1} />}
                />
            </div>
        </div>
    );
}
