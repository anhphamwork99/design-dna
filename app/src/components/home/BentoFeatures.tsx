import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import bgAnalyze from '../../assets/home-1.png';
import bgStudio from '../../assets/home-2.png';
import bgCompare from '../../assets/home-3.png';

interface BentoCardProps {
    to: string;
    image: string;
    title: React.ReactNode;
    description: string;
    cta: string;
    size: 'large' | 'small';
}

function BentoCard({ to, image, title, description, cta, size }: BentoCardProps) {
    const isLarge = size === 'large';

    return (
        <Link
            to={to}
            className={`relative rounded-2xl overflow-hidden border border-border-default group block ${isLarge ? 'md:row-span-2 min-h-[280px]' : 'min-h-[200px]'
                }`}
        >
            {/* Background image */}
            <img
                src={image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                draggable={false}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/5 transition-colors duration-300 group-hover:from-black/80" />

            {/* Content */}
            <div className={`relative z-10 flex flex-col justify-end h-full ${isLarge ? 'p-6 md:p-8' : 'p-5 md:p-6'}`}>
                <h3 className={`font-bold text-white tracking-tight mb-1.5 ${isLarge ? 'text-xl md:text-2xl' : 'text-lg'}`}>
                    {title}
                </h3>
                <p className={`text-white/70 leading-relaxed mb-3 ${isLarge ? 'text-[14px] max-w-md' : 'text-[13px]'}`}>
                    {description}
                </p>
                <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/90 group-hover:gap-2.5 transition-all duration-200">
                    {cta}
                    <ArrowRight className="w-3.5 h-3.5" />
                </span>
            </div>
        </Link>
    );
}

export function BentoFeatures() {
    return (
        <div>
            <div className="flex flex-col mb-5">
                <span className="text-[13px] font-bold tracking-widest text-text-tertiary uppercase mb-1">
                    Explore
                </span>
                <h2 className="text-xl font-semibold text-text-primary">
                    What You Can Do
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BentoCard
                    size="large"
                    to="/analyze/new"
                    image={bgAnalyze}
                    title={<>Decode the DNA of any <em className="font-logo font-normal italic opacity-90">graphic</em></>}
                    description="Upload any artwork and let AI analyze its visual composition, typography, and color palettes."
                    cta="Analyze Design"
                />
                <BentoCard
                    size="small"
                    to="/studio"
                    image={bgStudio}
                    title={<>Generate from your <em className="font-logo font-normal italic opacity-90">library</em></>}
                    description="Blend successful patterns into print-ready variations."
                    cta="Open Studio"
                />
                <BentoCard
                    size="small"
                    to="/compare"
                    image={bgCompare}
                    title={<>Find common <em className="font-logo font-normal italic opacity-90">patterns</em></>}
                    description="Batch analyze winning designs to extract shared features."
                    cta="Compare Designs"
                />
            </div>
        </div>
    );
}
