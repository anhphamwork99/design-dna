import { LucideIcon } from 'lucide-react';

/**
 * SectionIcon — H3 section icon with AI gradient fill.
 * Uses SVG mask trick: renders icon shape as mask, fills with CSS gradient.
 */
export function SectionIcon({ icon: Icon }: { icon: LucideIcon }) {
    return (
        <span
            className="inline-flex items-center justify-center w-6 h-6 flex-shrink-0"
            style={{
                background: 'var(--gradient-mesh)',
                WebkitMask: 'url(#) no-repeat center',
                mask: 'url(#) no-repeat center',
            }}
        >
            {/* We use a simpler approach: icon with gradient text via background-clip */}
            <Icon className="w-5 h-5" style={{ visibility: 'hidden' }} />
        </span>
    );
}

/**
 * GradientIcon — Uses background-clip: text approach for gradient fill on lucide icons.
 * Since lucide icons use stroke, we use a wrapper with gradient background + SVG filter.
 *
 * Actually, simplest approach: wrap icon in a div with gradient background and use it as visual marker.
 */
export function GradientSectionIcon({ icon: Icon, useStroke = false }: { icon: LucideIcon; useStroke?: boolean }) {
    return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0 ai-gradient">
            {useStroke ? (
                <Icon className="w-4 h-4 text-white" strokeWidth={2.5} />
            ) : (
                <Icon className="w-4 h-4 text-white" fill="white" strokeWidth={0} />
            )}
        </span>
    );
}
