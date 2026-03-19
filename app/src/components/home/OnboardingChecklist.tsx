import { MousePointerClick, Layers, Sparkles, CheckCircle2 } from 'lucide-react';

export interface OnboardingChecklistProps {
    hasPatterns: boolean;
}

export function OnboardingChecklist({ hasPatterns }: OnboardingChecklistProps) {
    const steps = [
        {
            title: 'Upload & Analyze',
            description: 'Decode the DNA of any top-selling design or graphic.',
            icon: <MousePointerClick className="w-5 h-5" />,
            isComplete: hasPatterns,
        },
        {
            title: 'Save to Library',
            description: 'Compare multiple designs and save the winning visual patterns.',
            icon: <Layers className="w-5 h-5" />,
            isComplete: hasPatterns,
        },
        {
            title: 'Generate Artwork',
            description: 'Provide an original, select patterns, and generate new POD-ready art.',
            icon: <Sparkles className="w-5 h-5" />,
            isComplete: false,
        },
    ];

    return (
        <div className="bg-bg-surface1/60 backdrop-blur-xl border border-border-default rounded-[2rem] p-8 lg:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute -top-[120px] -right-[120px] w-[300px] h-[300px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-2xl font-bold tracking-tight text-text-primary mb-3">
                Welcome to DesignDNA
            </h2>
            <p className="text-[15px] text-text-secondary mb-10 max-w-lg">
                Your journey starts here. Complete these three key steps to master the creative AI workflow and start generating high-converting designs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {steps.map((step, idx) => (
                    <div
                        key={idx}
                        className={`relative p-6 rounded-2xl border transition-all duration-300 ${step.isComplete
                                ? 'bg-bg-surface2/50 border-border-default/50 opacity-70'
                                : 'bg-bg-base border-accent/20 shadow-sm ring-1 ring-accent/5'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-5">
                            <div className={`p-3 rounded-xl ${step.isComplete ? 'bg-bg-surface1 text-text-tertiary shadow-sm' : 'bg-accent/10 text-accent shadow-sm'}`}>
                                {step.icon}
                            </div>
                            {step.isComplete && (
                                <CheckCircle2 className="w-6 h-6 text-accent animate-in zoom-in duration-300" />
                            )}
                        </div>
                        <h3 className={`font-semibold text-[16px] mb-2 ${step.isComplete ? 'text-text-secondary' : 'text-text-primary'}`}>
                            {step.title}
                        </h3>
                        <p className={`text-[14px] leading-relaxed ${step.isComplete ? 'text-text-tertiary' : 'text-text-secondary'}`}>
                            {step.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
