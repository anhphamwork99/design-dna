import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Copy, Check, ArrowLeft } from 'lucide-react';
import { getAnalysis } from '../apiClient';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/shared';
import { AnalyzeVisualTab } from './analyze/AnalyzeVisualTab';
import { AnalyzeBuyerTab } from './analyze/AnalyzeBuyerTab';

export default function ViewAnalysisScreen() {
    const { session } = useAuth();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'visual' | 'buyer'>('visual');
    const [copied, setCopied] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const [imagePinned, setImagePinned] = useState(false);

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
                if (data?.name) document.title = `DesignDNA — ${data.name}`;
            } catch (err: any) {
                console.error('Failed to fetch analysis:', err);
                setError(err.message || 'Failed to load analysis');
            } finally {
                setLoading(false);
            }
        }
        fetchAnalysis();
    }, [session, id]);

    // Mobile thumbnail pin via IntersectionObserver
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;
        const observer = new IntersectionObserver(
            ([entry]) => setImagePinned(!entry.isIntersecting),
            { threshold: 0 }
        );
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [analysis]);

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

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.08 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
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
                    onClick={() => navigate(-1)}
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pt-8 mb-24 max-w-[960px] mx-auto"
        >
            {/* Back link */}
            <div className="pb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
            </div>

            {/* Mobile pinned thumbnail */}
            <AnimatePresence>
                {imagePinned && uploadedImage.data && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden fixed top-0 left-0 right-0 z-30 bg-bg-surface1/95 backdrop-blur-sm border-b border-border-default px-4 py-2 flex items-center gap-3"
                    >
                        <img src={uploadedImage.data} alt="Preview" className="w-10 h-10 object-contain rounded-md border border-border-default bg-bg-surface2" />
                        <span className="text-[12px] text-text-secondary truncate">{uploadedImage.name}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sentinel */}
            <div ref={sentinelRef} className="md:hidden h-px" aria-hidden="true" />

            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                {/* Left: Image */}
                <div className="w-full md:w-[40%] md:sticky md:top-8 self-start">
                    <div className="bg-bg-surface2 p-2 rounded-xl border border-border-default">
                        {uploadedImage.data && (
                            <img src={uploadedImage.data} alt="Analyzed design" className="w-full max-h-[300px] md:max-h-none object-contain rounded-lg" />
                        )}
                    </div>
                    <p className="mt-4 text-[12px] text-text-secondary truncate" title={uploadedImage.name}>{uploadedImage.name}</p>
                </div>

                {/* Right: Content */}
                <div className="w-full md:w-[60%] flex flex-col gap-6">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-[32px] font-bold tracking-tight mb-2">Analysis Results</h1>
                            <p className="text-[14px] text-text-secondary">Here is the detailed breakdown of the original design and its target buyers.</p>
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleCopyDNA}
                            className="flex-shrink-0 mt-1"
                        >
                            {copied ? (
                                <><Check className="w-4 h-4 text-success" /> Copied!</>
                            ) : (
                                <><Copy className="w-4 h-4" /> Copy Analysis</>
                            )}
                        </Button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-border-default" role="tablist">
                        <button
                            onClick={() => setActiveTab('visual')}
                            className={`py-3 px-5 text-[13px] font-medium uppercase tracking-[0.05em] relative transition-colors duration-150 focus-visible:outline-none rounded-t ${activeTab === 'visual' ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                            role="tab"
                            aria-selected={activeTab === 'visual'}
                        >
                            Design Breakdown
                            {activeTab === 'visual' && (
                                <motion.div layoutId="viewActiveTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-text-primary" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('buyer')}
                            className={`py-3 px-5 text-[13px] font-medium uppercase tracking-[0.05em] relative transition-colors duration-150 focus-visible:outline-none rounded-t ${activeTab === 'buyer' ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                            role="tab"
                            aria-selected={activeTab === 'buyer'}
                        >
                            Target Audience
                            {activeTab === 'buyer' && (
                                <motion.div layoutId="viewActiveTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-text-primary" />
                            )}
                        </button>
                    </div>

                    {/* Tab content */}
                    <motion.div
                        key={activeTab}
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="flex flex-col gap-10"
                        role="tabpanel"
                    >
                        {activeTab === 'visual' && visualDNA && (
                            <AnalyzeVisualTab visualDNA={visualDNA} itemVariants={itemVariants} />
                        )}
                        {activeTab === 'buyer' && buyerDNA && (
                            <AnalyzeBuyerTab buyerDNA={buyerDNA} itemVariants={itemVariants} />
                        )}

                        {/* Bottom actions */}
                        <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-border-default justify-end">
                            <Button variant="ghost" onClick={() => navigate(-1)}>
                                <ArrowLeft className="w-4 h-4" /> Back to List
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
