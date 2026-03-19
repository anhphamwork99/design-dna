import React, { useEffect, useState } from 'react';
import { useMigratePatterns } from '../hooks/useMigratePatterns';
import { useAuth } from '../contexts/AuthContext';
import { listPatterns, SavedPattern } from '../apiClient';
import { FeatureHeroBlock } from '../components/home/FeatureHeroBlock';
import { OnboardingChecklist } from '../components/home/OnboardingChecklist';
import { RecentAnalysesCarousel } from '../components/home/RecentAnalysesCarousel';
import heroBanner from '../assets/hero-banner.png';
import bgAnalyze from '../assets/bg-analyze.png';
import bgStudio from '../assets/bg-studio.png';
import bgCompare from '../assets/bg-compare.png';

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
            <div className="w-full relative rounded-2xl md:rounded-[2rem] overflow-hidden shadow-sm border border-border-default bg-bg-surface2 mb-10 lg:mb-12 group">
                {/* Background Banner with Cover */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={heroBanner}
                        alt="DesignDNA Cover"
                        className="w-full h-full object-cover"
                        draggable={false}
                    />
                </div>

                {/* Dark/Gradient Overlays to preserve text readability */}
                <div className="absolute inset-0 bg-black/40 z-10 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />

                {/* Content Overlay */}
                <div className="relative z-20 flex flex-col justify-center px-6 md:px-12 py-10 md:py-16 min-h-[160px] md:min-h-[220px]">
                    <h1 className="text-3xl md:text-[42px] font-bold tracking-tight text-white mb-2 md:mb-3 drop-shadow-md">
                        Welcome to DesignDNA
                    </h1>
                    <p className="text-[15px] md:text-[16px] text-white/80 max-w-[500px] leading-relaxed drop-shadow-sm font-medium">
                        Decode the visual formulas of winning designs, discover successful patterns, and generate fresh print-ready assets tailored to any niche.
                    </p>
                </div>
            </div>

            {/* Content Switcher: Onboarding or Recent Analyses */}
            <div className="mb-20 lg:mb-24 min-h-[140px]">
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
            <div className="flex flex-col gap-24 lg:gap-32 pb-20">
                <FeatureHeroBlock
                    title={<>Decode the DNA of any <em className="font-logo font-normal italic text-accent opacity-90 pr-1 px-1">graphic</em></>}
                    description="Upload any print-on-demand artwork or illustration and let our AI analyze the core visual composition, typography, and color palettes that make it successful."
                    ctaText="Analyze Design"
                    ctaRoute="/analyze/new"
                    ctaVariant="primary"
                    illustration={
                        <img
                            src={bgAnalyze}
                            alt="Analyze Graphic"
                            className="w-full h-full object-contain mix-blend-darken scale-110 md:scale-125"
                            draggable={false}
                        />
                    }
                />

                <FeatureHeroBlock
                    reversed
                    title={<>Generate variants from your <em className="font-logo font-normal italic text-accent opacity-90 pr-1 px-1">library</em></>}
                    description="Enter the Studio to blend multiple successful patterns together. Give the AI an original graphic to get customized, print-ready variations maintaining the core visual DNA."
                    ctaText="Open Studio"
                    ctaRoute="/studio"
                    ctaVariant="primary"
                    illustration={
                        <img
                            src={bgStudio}
                            alt="Studio Graphic"
                            className="w-full h-full object-contain mix-blend-darken scale-110 md:scale-125"
                            draggable={false}
                        />
                    }
                />

                <FeatureHeroBlock
                    title={<>Find the common <em className="font-logo font-normal italic text-accent opacity-90 pr-1 px-1">patterns</em></>}
                    description="Perform batch analysis on multiple winning designs to find their shared structural features. Extract and save these high-converting patterns to your personal library."
                    ctaText="Compare Designs"
                    ctaRoute="/compare"
                    ctaVariant="primary"
                    illustration={
                        <img
                            src={bgCompare}
                            alt="Compare Graphic"
                            className="w-full h-full object-contain mix-blend-darken scale-110 md:scale-125"
                            draggable={false}
                        />
                    }
                />
            </div>

            {/* Simple Elegant Footer */}
            <footer className="mt-8 pt-8 border-t border-border-default flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-[14px] text-text-tertiary">
                    &copy; 2026 DesignDNA. Empowered by AI.
                </p>
                <div className="flex items-center gap-6">
                    <a href="#" className="text-[14px] font-medium text-text-tertiary hover:text-text-primary transition-colors">Documentation</a>
                    <a href="#" className="text-[14px] font-medium text-text-tertiary hover:text-text-primary transition-colors">Support</a>
                    <a href="#" className="text-[14px] font-medium text-text-tertiary hover:text-text-primary transition-colors">Terms</a>
                </div>
            </footer>
        </div>
    );
}
