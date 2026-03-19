import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export interface FeatureHeroBlockProps {
    title: string;
    description: string;
    ctaText: string;
    ctaRoute: string;
    illustration: ReactNode;
    reversed?: boolean;
}

export function FeatureHeroBlock({
    title,
    description,
    ctaText,
    ctaRoute,
    illustration,
    reversed = false,
}: FeatureHeroBlockProps) {
    return (
        <div className={`flex flex-col gap-12 lg:gap-24 items-center ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
            <div className="flex-1 space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-text-primary">
                    {title}
                </h2>
                <p className="text-[17px] text-text-secondary max-w-md leading-relaxed">
                    {description}
                </p>
                <div className="pt-4">
                    <Link
                        to={ctaRoute}
                        className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-[15px] font-semibold transition-all ai-gradient text-white hover:opacity-90 shadow-md shadow-accent/20"
                    >
                        {ctaText}
                    </Link>
                </div>
            </div>
            <div className="flex-1 w-full bg-bg-surface1 rounded-[2rem] border border-border-default overflow-hidden flex items-center justify-center min-h-[360px] lg:min-h-[440px] shadow-sm relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-bg-surface1 to-bg-surface2 opacity-50 pointer-events-none" />
                <div className="relative z-10 transition-transform duration-700 ease-out group-hover:scale-105">
                    {illustration}
                </div>
            </div>
        </div>
    );
}
