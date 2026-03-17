import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, AlertTriangle, ImageOff, Copy, Check } from 'lucide-react';
import { getAnalysis } from '../apiClient';
import { useAuth } from '../contexts/AuthContext';

export default function ViewAnalysisScreen() {
    const { session } = useAuth();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'visual' | 'buyer'>('visual');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        document.title = 'DesignDNA — View Analysis';
    }, []);

    useEffect(() => {
        async function fetchAnalysis() {
            if (!session || !id) return;
            setLoading(true);
            setError(null);
            try {
                const data = await getAnalysis(session.access_token, id);
                setAnalysis(data);
                if (data?.name) {
                    document.title = `DesignDNA — ${data.name}`;
                }
            } catch (err: any) {
                console.error('Failed to fetch analysis:', err);
                setError(err.message || 'Failed to load analysis');
            } finally {
                setLoading(false);
            }
        }
        fetchAnalysis();
    }, [session, id]);

    const handleCopyDNA = async () => {
        if (!analysis?.result_json) return;
        try {
            await navigator.clipboard.writeText(JSON.stringify(analysis.result_json, null, 2));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    if (loading) {
        return (
            <div className="pt-24 flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded ai-gradient animate-pulse mb-4" />
                <p className="text-[14px] text-text-secondary">Loading analysis...</p>
            </div>
        );
    }

    if (error || !analysis) {
        return (
            <div className="pt-24 flex flex-col items-center text-center gap-4">
                <AlertTriangle className="w-12 h-12 text-error" />
                <h2 className="text-[20px] font-semibold">Failed to Load Analysis</h2>
                <p className="text-[14px] text-text-secondary max-w-[400px]">{error}</p>
                <button
                    onClick={() => navigate('/library')}
                    className="mt-2 px-5 py-3 rounded-lg border border-border-default hover:bg-bg-surface1 text-text-primary text-[14px] font-medium transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const analysisResult = analysis.result_json;
    const visualDNA = analysisResult?.visual_dna;
    const buyerDNA = analysisResult?.buyer_dna;
    const uploadedImage = { name: analysis.name, data: analysis.thumbnail || '' };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pt-8 mb-24"
        >
            <button
                onClick={() => navigate('/library')}
                className="flex items-center text-text-secondary hover:text-text-primary text-[14px] mb-6 transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:rounded"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
            </button>

            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                <div className="w-full md:w-[40%] md:sticky md:top-[80px] self-start">
                    <div className="bg-bg-surface2 p-2 rounded-xl border border-border-default">
                        {uploadedImage.data && (
                            <img src={uploadedImage.data} alt="Analyzed design" className="w-full max-h-[300px] md:max-h-none object-contain rounded-lg" />
                        )}
                    </div>
                    <p className="mt-4 text-[12px] text-text-secondary truncate" title={uploadedImage.name}>{uploadedImage.name}</p>
                </div>

                <div className="w-full md:w-[60%] flex flex-col gap-6">
                    <div>
                        <h1 className="text-[32px] font-bold tracking-tight mb-2">Analysis Results</h1>
                        <p className="text-[14px] text-text-secondary">Here is the detailed breakdown of the original design and its target buyers.</p>
                    </div>

                    <div className="flex border-b border-border-default" role="tablist">
                        <button
                            onClick={() => setActiveTab('visual')}
                            className={`py-3 px-5 text-[13px] font-medium uppercase tracking-[0.05em] relative transition-colors duration-150 rounded-t ${activeTab === 'visual' ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                            role="tab"
                            aria-selected={activeTab === 'visual'}
                        >
                            Design Breakdown
                            {activeTab === 'visual' && (
                                <motion.div layoutId="viewActiveTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('buyer')}
                            className={`py-3 px-5 text-[13px] font-medium uppercase tracking-[0.05em] relative transition-colors duration-150 rounded-t ${activeTab === 'buyer' ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                            role="tab"
                            aria-selected={activeTab === 'buyer'}
                        >
                            Target Audience
                            {activeTab === 'buyer' && (
                                <motion.div layoutId="viewActiveTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
                            )}
                        </button>
                    </div>

                    <motion.div
                        key={activeTab}
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="flex flex-col gap-10"
                        role="tabpanel"
                    >
                        {activeTab === 'visual' && visualDNA && (
                            <>
                                {visualDNA.summary && (
                                    <motion.div variants={itemVariants} className="bg-bg-surface2 p-4 rounded-lg text-[14px] leading-relaxed italic text-text-secondary border border-border-default">
                                        {visualDNA.summary}
                                    </motion.div>
                                )}

                                <motion.div variants={itemVariants}>
                                    <h3 className="text-[16px] font-semibold mb-3">Composition</h3>
                                    <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-[14px]">
                                        {[
                                            ['Grid Type', visualDNA.composition?.grid_type],
                                            ['Symmetry', visualDNA.composition?.symmetry],
                                            ['Focal Point', visualDNA.composition?.focal_point],
                                            ['Visual Flow', visualDNA.composition?.visual_flow],
                                            ['Density', visualDNA.composition?.density],
                                        ].map(([label, value]) => (
                                            <div key={label as string} className="flex justify-between items-center border-b border-border-default pb-2">
                                                <span className="text-text-secondary">{label}</span>
                                                <span className="text-text-primary font-medium text-right">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <h3 className="text-[16px] font-semibold mb-3">Color</h3>
                                    <div className="flex h-10 w-full rounded-lg overflow-hidden mb-3">
                                        {visualDNA.color?.palette?.map((c: any, i: number) => (
                                            <div key={i} style={{ width: `${c.proportion || (100 / (visualDNA.color.palette.length || 1))}%`, backgroundColor: c.hex }} title={`${c.name} (${c.proportion}%)`} />
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[14px]">
                                        {[
                                            ['Harmony', visualDNA.color?.harmony],
                                            ['Contrast', visualDNA.color?.contrast],
                                            ['Temperature', visualDNA.color?.temperature],
                                        ].map(([label, value]) => (
                                            <div key={label as string} className="bg-bg-surface2 p-3 rounded-lg border border-border-default text-center">
                                                <span className="block text-text-secondary text-[12px] mb-1">{label}</span>
                                                <span className="font-medium text-text-primary">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </>
                        )}

                        {activeTab === 'buyer' && buyerDNA && (
                            <>
                                <motion.div variants={itemVariants} className="border-l-2 border-l-accent pl-5">
                                    <h3 className="text-[18px] font-bold mb-1">Why It Feels Personal</h3>
                                    <p className="text-[13px] text-text-tertiary mb-4">The specific design decisions that create "this was made for me" resonance</p>
                                    <div className="flex flex-col gap-3">
                                        {buyerDNA.made_for_me_decisions?.map((d: any, i: number) => (
                                            <div key={i} className="bg-bg-surface2 p-4 rounded-lg">
                                                <h4 className="text-[14px] font-semibold mb-1">{d.decision}</h4>
                                                <p className="text-[14px] text-text-secondary italic">{d.why_it_works}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <h3 className="text-[16px] font-semibold mb-3">Who Buys This</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[14px]">
                                        {[
                                            ['Age', buyerDNA.persona?.age_range],
                                            ['Gender', buyerDNA.persona?.gender_lean],
                                            ['Lifestyle', buyerDNA.persona?.lifestyle],
                                            ['Spending', buyerDNA.persona?.spending_mindset],
                                        ].map(([label, value]) => (
                                            <div key={label as string} className="bg-bg-surface2 p-3 rounded-lg border border-border-default">
                                                <span className="text-text-secondary text-[12px] block mb-1">{label}</span>
                                                <span className="font-medium text-text-primary">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <h3 className="text-[16px] font-semibold mb-3">Why People Buy This</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[14px]">
                                        <div className="bg-bg-surface2 p-3 rounded-lg border border-border-default">
                                            <span className="text-text-secondary text-[12px] block mb-1">Primary Emotion</span>
                                            <span className="font-medium text-text-primary">{buyerDNA.emotional_triggers?.primary_emotion}</span>
                                        </div>
                                        <div className="bg-bg-surface2 p-3 rounded-lg border border-border-default">
                                            <span className="text-text-secondary text-[12px] block mb-1">Trigger</span>
                                            <span className="font-medium text-text-primary leading-tight">{buyerDNA.emotional_triggers?.trigger_description}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}

                        <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-border-default">
                            <button
                                onClick={handleCopyDNA}
                                className="px-5 py-2 rounded-lg text-text-secondary hover:text-text-primary text-[14px] font-medium transition-colors flex items-center gap-2"
                            >
                                {copied ? (
                                    <><Check className="w-4 h-4 text-success" /> Copied!</>
                                ) : (
                                    <><Copy className="w-4 h-4" /> Copy DNA JSON</>
                                )}
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
