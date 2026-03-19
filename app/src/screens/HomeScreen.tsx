import React, { useEffect, useState } from 'react';
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
                <div className="relative z-20 flex flex-col justify-center px-6 md:px-12 py-10 md:py-16 min-h-[180px] md:min-h-[220px]">
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
                    title={<>Decode the DNA of any <em className="font-logo font-normal italic text-accent opacity-90 pr-1">interface</em></>}
                    description="Upload any design—from t-shirts to landing pages—and let our AI analyze the core visual layout, styling, and buyer psychological triggers that make it work."
                    ctaText="Analyze Design"
                    ctaRoute="/analyze/new"
                    ctaVariant="primary"
                    illustration={<AnalyzeGraphic />}
                />

                <FeatureHeroBlock
                    reversed
                    title={<>Generate variants from your <em className="font-logo font-normal italic text-text-tertiary pr-1">library</em></>}
                    description="Enter the Studio to blend multiple successful patterns together. Give the AI an original graphic to get customized, print-ready variations maintaining the core visual DNA."
                    ctaText="Open Studio"
                    ctaRoute="/studio"
                    ctaVariant="secondary"
                    illustration={<StudioGraphic />}
                />

                <FeatureHeroBlock
                    title={<>Find the common <em className="font-logo font-normal italic text-text-tertiary pr-1">patterns</em></>}
                    description="Perform batch analysis on multiple winning designs to find their shared structural features. Extract and save these high-converting patterns to your personal library."
                    ctaText="Compare Designs"
                    ctaRoute="/compare"
                    ctaVariant="secondary"
                    illustration={<CompareGraphic />}
                />
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// Mini-UI Mockup Graphics for Hero Blocks
// ----------------------------------------------------------------------

const AnalyzeGraphic = () => (
    <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center p-6">
        {/* Main scanned image representation */}
        <div className="w-[180px] h-[220px] bg-bg-base rounded-xl border-2 border-accent/80 border-dashed relative shadow-lg flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/10 to-transparent animate-[shimmer_2s_infinite]" />
            {/* Corner anchors */}
            <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-accent" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent" />
            <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-accent" />
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-accent" />
            {/* Scanning line */}
            <div className="absolute top-1/3 left-0 right-0 h-[2px] bg-accent shadow-[0_0_8px_rgba(var(--color-accent),0.8)]" />
            <MousePointerClick className="w-12 h-12 text-accent opacity-50 relative z-10" />
        </div>

        {/* Floating detected elements */}
        <div className="absolute top-8 right-2 bg-bg-surface1 border border-border-default rounded-lg p-2.5 shadow-md backdrop-blur-md rotate-6 animate-in zoom-in spin-in-12 duration-700 delay-150">
            <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-full bg-[#ef4444] ring-1 ring-[#ef4444]/20" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#3b82f6] ring-1 ring-[#3b82f6]/20" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#10b981] ring-1 ring-[#10b981]/20" />
            </div>
        </div>

        <div className="absolute bottom-16 left-0 bg-bg-surface1 border border-border-default rounded-lg px-3 py-1.5 shadow-md backdrop-blur-md -rotate-3 text-[11px] font-mono text-text-secondary animate-in zoom-in spin-in-[-12] duration-700 delay-300">
            <span className="text-text-tertiary">{'<'}</span>h1<span className="text-text-tertiary">{'>'}</span> title
        </div>
    </div>
);

const StudioGraphic = () => (
    <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center p-6">
        {/* Original card behind Left */}
        <div className="absolute w-[140px] h-[190px] bg-bg-surface2 rounded-xl border border-border-default -rotate-[15deg] -translate-x-12 opacity-60 flex flex-col p-4 shadow-sm transition-transform duration-500 ease-out hover:-rotate-12 hover:-translate-x-14">
            <div className="w-full h-20 bg-text-tertiary/10 rounded-lg mb-4" />
            <div className="w-3/4 h-2.5 bg-text-tertiary/20 rounded-full mb-2" />
            <div className="w-1/2 h-2.5 bg-text-tertiary/10 rounded-full" />
        </div>
        {/* Original card behind Right */}
        <div className="absolute w-[140px] h-[190px] bg-bg-surface2 rounded-xl border border-border-default rotate-[15deg] translate-x-12 opacity-60 flex flex-col p-4 shadow-sm transition-transform duration-500 ease-out hover:rotate-12 hover:translate-x-14">
            <div className="w-full h-20 bg-text-tertiary/10 rounded-lg mb-4" />
            <div className="w-3/4 h-2.5 bg-text-tertiary/20 rounded-full mb-2" />
            <div className="w-2/3 h-2.5 bg-text-tertiary/10 rounded-full" />
        </div>
        {/* Generated output center */}
        <div className="relative w-[160px] h-[220px] bg-bg-surface1 rounded-xl border border-border-hover flex flex-col p-4 shadow-xl z-10 backdrop-blur-sm ring-4 ring-bg-surface1">
            <div className="absolute -top-3 -right-3 p-2 bg-text-tertiary text-white rounded-full shadow-lg">
                <Sparkles className="w-4 h-4 fill-white animate-pulse" />
            </div>
            <div className="w-full h-[100px] bg-gradient-to-br from-text-tertiary/20 to-text-tertiary/5 rounded-lg mb-5 border border-text-tertiary/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-text-tertiary/50" />
            </div>
            <div className="w-[85%] h-3 bg-text-secondary rounded-full mb-2.5" />
            <div className="w-[60%] h-3 bg-text-tertiary rounded-full" />
        </div>
    </div>
);

const CompareGraphic = () => (
    <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center gap-3 md:gap-4 p-4">
        {/* Highlight linking line */}
        <div className="absolute top-[35%] left-[15%] right-[15%] h-[1px] border-t-2 border-text-tertiary border-dashed opacity-40 z-0" />

        {/* Card 1 */}
        <div className="w-[80px] h-[130px] bg-bg-surface1 rounded-lg border border-border-default flex flex-col p-2.5 pt-8 shadow-sm relative z-10 hover:-translate-y-1 transition-transform">
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-10 h-10 border-2 border-text-tertiary border-dashed rounded-md bg-text-tertiary/5" />
            <div className="w-full h-1.5 bg-text-tertiary/30 rounded-full mb-1 mt-7" />
            <div className="w-2/3 h-1.5 bg-text-tertiary/30 rounded-full" />
        </div>

        {/* Card 2 (Hero) */}
        <div className="w-[90px] h-[150px] bg-bg-surface1 rounded-xl border-2 border-text-tertiary flex flex-col p-2.5 shadow-md relative z-10 -translate-y-2 hover:-translate-y-4 transition-transform">
            <div className="w-full h-1.5 bg-text-tertiary/30 rounded-full mb-1 mt-1.5" />
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-14 h-12 border-2 border-text-tertiary rounded-md bg-text-tertiary/10" />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-border-hover/50 flex items-center justify-center">
                <Layers className="w-4 h-4 text-text-secondary" />
            </div>
            {/* Found badge component */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-text-tertiary text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                MATCH
            </div>
        </div>

        {/* Card 3 */}
        <div className="w-[80px] h-[130px] bg-bg-surface1 rounded-lg border border-border-default flex flex-col p-2.5 pt-6 shadow-sm relative z-10 hover:-translate-y-1 transition-transform">
            <div className="w-full h-1.5 bg-text-tertiary/30 rounded-full mb-1" />
            <div className="w-3/4 h-1.5 bg-text-tertiary/30 rounded-full" />
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[52px] h-10 border-2 border-text-tertiary border-dashed rounded-md bg-text-tertiary/5" />
        </div>
    </div>
);
