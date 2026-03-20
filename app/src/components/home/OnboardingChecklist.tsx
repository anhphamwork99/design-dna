import { Settings, Microscope, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export interface OnboardingChecklistProps {
    hasPatterns: boolean;
}

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
            icon: Settings,
            cta: 'Configure',
            isComplete: hasApiKey,
            onClick: () => document.dispatchEvent(new CustomEvent('open-settings')),
        },
        {
            title: 'Analyze Insights',
            description: 'Upload any design to decode its core layout and visual DNA.',
            icon: Microscope,
            cta: 'Analyze',
            isComplete: hasPatterns,
            onClick: () => navigate('/analyze/new'),
        },
        {
            title: 'Free Creation',
            description: 'Enter the Studio to blend patterns into print‑ready artworks.',
            icon: Sparkles,
            cta: 'Open Studio',
            isComplete: false,
            onClick: () => navigate('/studio'),
        },
    ];

    return (
        <div>
            <div className="flex flex-col mb-5">
                <span className="text-[13px] font-bold tracking-widest text-text-tertiary uppercase mb-1">
                    Getting Started
                </span>
                <h2 className="text-xl font-semibold text-text-primary">
                    3 Steps to Master the Studio
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                {steps.map((step, idx) => {
                    const Icon = step.icon;
                    return (
                        <button
                            key={idx}
                            onClick={step.onClick}
                            className={`relative p-5 rounded-xl border text-left transition-colors duration-200 cursor-pointer group ${step.isComplete
                                ? 'bg-bg-surface2/50 border-border-default opacity-50'
                                : 'bg-bg-surface1 border-border-default hover:bg-state-hover hover:border-border-hover'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className={`p-2 rounded-lg transition-colors duration-200 ${step.isComplete ? 'bg-bg-surface2' : 'bg-bg-surface2 group-hover:bg-bg-surface3'}`}>
                                    <Icon className={`w-[18px] h-[18px] ${step.isComplete ? 'text-text-tertiary' : 'text-text-secondary'}`} />
                                </div>
                                {step.isComplete && (
                                    <CheckCircle2 className="w-[18px] h-[18px] text-success" />
                                )}
                            </div>
                            <h3 className={`font-semibold text-[14px] mb-1 ${step.isComplete ? 'text-text-tertiary' : 'text-text-primary'}`}>
                                {idx + 1}. {step.title}
                            </h3>
                            <p className={`text-[13px] leading-relaxed mb-3 ${step.isComplete ? 'text-text-tertiary' : 'text-text-secondary'}`}>
                                {step.description}
                            </p>
                            {!step.isComplete && (
                                <span className="inline-flex items-center gap-1 text-[13px] font-medium text-accent group-hover:gap-1.5 transition-all duration-200">
                                    {step.cta}
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
