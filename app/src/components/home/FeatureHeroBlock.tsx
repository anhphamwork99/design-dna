import React, { type ReactNode } from 'react';
import { Link } from 'react-router-dom';

export interface FeatureHeroBlockProps {
    title: ReactNode;
    description: string;
    ctaText: string;
    ctaRoute: string;
    illustration: ReactNode;
    ctaVariant?: 'primary' | 'secondary';
    reversed?: boolean;
}

export function FeatureHeroBlock({
    title,
    description,
    ctaText,
    ctaRoute,
    illustration,
    ctaVariant = 'primary',
    reversed = false,
}: FeatureHeroBlockProps) {
    const isPrimary = ctaVariant === 'primary';

    return (
        <div className={`flex flex-col gap-12 lg:gap-24 items-center ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
            <div className="flex-1 space-y-6">
                <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-text-primary leading-[1.15]">
                    {title}
                </h2>
                <p className="text-[17px] text-text-secondary max-w-md leading-relaxed">
                    {description}
                </p>
                <div className="pt-4">
                    <Link
                        to={ctaRoute}
                        className={`inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-[15px] font-semibold transition-all duration-250 ease-out shadow-sm ${isPrimary
                            ? 'ai-gradient text-white hover:opacity-90 shadow-accent/20 hover:scale-[1.02]'
                            : 'bg-bg-surface1 border border-border-default text-text-primary hover:bg-bg-surface2 hover:border-border-hover'
                            }`}
                    >
                        {ctaText}
                    </Link>
                </div>
            </div>

            <div className="flex-1 w-full flex items-center justify-center min-h-[280px] lg:min-h-[380px]">
                <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
                    {illustration}
                </div>
            </div>
        </div>
    );
}
