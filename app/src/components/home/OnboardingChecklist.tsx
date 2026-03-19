import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export interface OnboardingChecklistProps {
    hasPatterns: boolean;
}

/* ── Filled SVG icons with AI gradient ──────────────────────────── */

const GradientDefs = () => (
    <svg width="0" height="0" className="absolute">
        <defs>
            <linearGradient id="ai-icon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-accent, #a855f7)" />
                <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
        </defs>
    </svg>
);

const SettingsFilledIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="url(#ai-icon-grad)">
        <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z" />
    </svg>
);

const AnalyzeFilledIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="url(#ai-icon-grad)">
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
);

const SparklesFilledIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="url(#ai-icon-grad)">
        <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z" />
    </svg>
);

/* ── Component ──────────────────────────────────────────────────── */

export function OnboardingChecklist({ hasPatterns }: OnboardingChecklistProps) {
    const { session } = useAuth();
    const navigate = useNavigate();
    const [hasApiKey, setHasApiKey] = useState(false);

    useEffect(() => {
        if (!session) return;
        const API_BASE = import.meta.env.VITE_API_URL ?? '';
        fetch(`${API_BASE}/api/api-keys`, {
            headers: { 'Authorization': `Bearer ${session.access_token}` }
        })
            .then(res => res.json())
            .then(data => setHasApiKey(!!data.hasKey))
            .catch(console.error);
    }, [session]);

    const steps = [
        {
            title: 'Setting & API Key',
            description: 'Configure your Gemini API key to power the analysis engine.',
            icon: <SettingsFilledIcon />,
            isComplete: hasApiKey,
            onClick: () => document.dispatchEvent(new CustomEvent('open-settings')),
        },
        {
            title: 'Analyze Insights',
            description: 'Upload any design to decode its core layout and visual DNA.',
            icon: <AnalyzeFilledIcon />,
            isComplete: hasPatterns,
            onClick: () => navigate('/analyze/new'),
        },
        {
            title: 'Free Creation',
            description: 'Enter the Studio to blend patterns into print‑ready artworks.',
            icon: <SparklesFilledIcon />,
            isComplete: false,
            onClick: () => navigate('/studio'),
        },
    ];

    return (
        <div className="border border-border-default rounded-[2rem] p-6 md:p-8 relative overflow-hidden">
            {/* Shared gradient defs */}
            <GradientDefs />

            {/* Visual Flair */}
            <div className="absolute -top-[120px] -right-[120px] w-[300px] h-[300px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col mb-6">
                <span className="text-[13px] font-bold tracking-widest text-text-tertiary uppercase mb-1">
                    Getting Started
                </span>
                <h2 className="text-xl font-semibold text-text-primary">
                    3 Steps to Master the Studio
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 relative z-10">
                {steps.map((step, idx) => (
                    <button
                        key={idx}
                        onClick={step.onClick}
                        className={`relative p-5 md:p-6 rounded-2xl border text-left transition-all duration-300 ease-in-out cursor-pointer group ${step.isComplete
                            ? 'bg-bg-surface2/50 border-border-default/50 opacity-60 scale-[0.98]'
                            : 'bg-bg-base border-accent/20 shadow-sm ring-1 ring-accent/5 hover:shadow-md hover:scale-[1.01]'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-2.5 rounded-xl transition-colors duration-300 ${step.isComplete ? 'bg-bg-surface1 opacity-40' : 'bg-accent/10'}`}>
                                {step.icon}
                            </div>
                            {step.isComplete && (
                                <CheckCircle2 className="w-5 h-5 text-accent animate-in zoom-in duration-300" />
                            )}
                        </div>
                        <h3 className={`font-semibold text-[15px] mb-1.5 transition-colors duration-300 ${step.isComplete ? 'text-text-secondary' : 'text-text-primary group-hover:text-accent'}`}>
                            {idx + 1}. {step.title}
                        </h3>
                        <p className={`text-[13px] leading-relaxed transition-colors duration-300 ${step.isComplete ? 'text-text-tertiary' : 'text-text-secondary'}`}>
                            {step.description}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}
