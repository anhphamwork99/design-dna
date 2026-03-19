import { Settings, MousePointerClick, Sparkles, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export interface OnboardingChecklistProps {
    hasPatterns: boolean;
}

export function OnboardingChecklist({ hasPatterns }: OnboardingChecklistProps) {
    const { session } = useAuth();
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
            description: 'Configure your Gemini validation key to empower the analysis engine.',
            icon: <Settings className="w-5 h-5" />,
            isComplete: hasApiKey,
        },
        {
            title: 'Analyze Insights',
            description: 'Upload any design to decode its core layout and visual DNA.',
            icon: <MousePointerClick className="w-5 h-5" />,
            isComplete: hasPatterns,
        },
        {
            title: 'Free Creation',
            description: 'Enter the Studio to blend patterns into print‑ready artworks.',
            icon: <Sparkles className="w-5 h-5" />,
            isComplete: false,
        },
    ];

    return (
        <div className="bg-bg-surface1/60 backdrop-blur-xl border border-border-default rounded-[2rem] p-6 md:p-8 shadow-sm relative overflow-hidden">
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
                    <div
                        key={idx}
                        className={`relative p-5 md:p-6 rounded-2xl border transition-all duration-300 ease-in-out ${step.isComplete
                            ? 'bg-bg-surface2/50 border-border-default/50 opacity-60 scale-[0.98]'
                            : 'bg-bg-base border-accent/20 shadow-sm ring-1 ring-accent/5'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-2.5 rounded-xl transition-colors duration-300 ${step.isComplete ? 'bg-bg-surface1 text-text-tertiary shadow-none' : 'bg-accent/10 text-accent shadow-sm'}`}>
                                {step.icon}
                            </div>
                            {step.isComplete && (
                                <CheckCircle2 className="w-5 h-5 text-accent animate-in zoom-in duration-300" />
                            )}
                        </div>
                        <h3 className={`font-semibold text-[15px] mb-1.5 transition-colors duration-300 ${step.isComplete ? 'text-text-secondary' : 'text-text-primary'}`}>
                            {idx + 1}. {step.title}
                        </h3>
                        <p className={`text-[13px] leading-relaxed transition-colors duration-300 ${step.isComplete ? 'text-text-tertiary' : 'text-text-secondary'}`}>
                            {step.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
