import React, { type ReactNode, useRef, useState } from 'react';
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
    const cardRef = useRef<HTMLDivElement>(null);
    const [tiltStyles, setTiltStyles] = useState({});

    // Lightweight 3D Tilt effect
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element.
        const y = e.clientY - rect.top; // y position within the element.
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        // Calculate rotation degrees (max 4 degrees)
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        setTiltStyles({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
            transition: 'transform 0.1s ease-out',
        });
    };

    const handleMouseLeave = () => {
        setTiltStyles({
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            transition: 'transform 0.6s ease-out',
        });
    };

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

            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={() => setTiltStyles({ transition: 'transform 0.1s ease-out' })}
                className="flex-1 w-full flex items-center justify-center min-h-[360px] lg:min-h-[480px] relative group cursor-default"
                style={{ perspective: '1000px' }}
            >
                <div
                    className="absolute inset-0 w-full h-full flex items-center justify-center transition-transform"
                    style={tiltStyles}
                >
                    {illustration}
                </div>
            </div>
        </div>
    );
}
