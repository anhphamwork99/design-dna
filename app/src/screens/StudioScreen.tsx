import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Stage, StudioGoal, Shifts, AppliedPatternData, SynthesizedConcept } from '../studio/types';
import { getDefaultShifts, goalCards } from '../studio/types';
import StudioTopBar from '../studio/StudioTopBar';
import GoalPicker from '../studio/GoalPicker';
import UploadStage from '../studio/UploadStage';
import AnalyzingStage from '../studio/AnalyzingStage';
import CloneStudio from '../studio/CloneStudio';
import VariationStudio from '../studio/VariationStudio';
import ConceptDetailDialog from '../studio/ConceptDetailDialog';
import { useAuth } from '../contexts/AuthContext';
import { analyzeDesign, cloneDesign, synthesizeConcept, generateArtwork } from '../apiClient';
import { setStudioActive } from '../studio/useStudioActive';

export default function StudioScreen() {
    // ── Auth ──
    const { session } = useAuth();
    const token = session?.access_token ?? '';
    const navigate = useNavigate();

    // ── State machine ──
    const [stage, setStage] = useState<Stage>('goals');
    const [goal, setGoal] = useState<StudioGoal | null>(null);
    const [uploadedImage, setUploadedImage] = useState<{ data: string; name: string; type: string } | null>(null);
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    // ── Deferred analysis state ──
    const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'pending' | 'complete' | 'error'>('idle');
    const analysisPromiseRef = useRef<Promise<any> | null>(null);
    const analyzingAnimDone = useRef(false);

    // Clone-specific state
    const [clonedImage, setClonedImage] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [error, setError] = useState<string | null>(null);

    // Variation/Explore state
    const [shifts, setShifts] = useState<Shifts>(() => getDefaultShifts('variations'));
    const [appliedPattern, setAppliedPattern] = useState<AppliedPatternData | null>(null);
    const [concepts, setConcepts] = useState<SynthesizedConcept[]>([]);
    const [conceptArtworks, setConceptArtworks] = useState<Map<number, string>>(new Map());
    const [selectedConceptIndex, setSelectedConceptIndex] = useState<number | null>(null);
    const [generatingCardIds, setGeneratingCardIds] = useState<Set<number>>(new Set());
    const [generationStep, setGenerationStep] = useState('');

    // ── Page title ──
    useEffect(() => {
        document.title = 'DesignDNA — Studio';
    }, []);

    // ── Signal AppShell to hide/show sidebar ──
    useEffect(() => {
        setStudioActive(stage !== 'goals');
        return () => setStudioActive(false);
    }, [stage]);

    // ── Handle "entry from Analyze" via route state ──
    const location = useLocation();
    useEffect(() => {
        const state = location.state as { analysisResult?: any; uploadedImage?: any } | null;
        if (state?.analysisResult && state?.uploadedImage) {
            setAnalysisResult(state.analysisResult);
            setUploadedImage(state.uploadedImage);
            // Image+DNA preloaded — stay on goal picker, but show preloaded indicator
        }
    }, [location.state]);

    // ── Goal Selection ──
    const handleSelectGoal = (selectedGoal: StudioGoal) => {
        setGoal(selectedGoal);
        setError(null);
        setClonedImage(null);
        setConcepts([]);
        setConceptArtworks(new Map());
        setSelectedConceptIndex(null);
        setGeneratingCardIds(new Set());
        // Set default shifts for the selected goal
        setShifts(getDefaultShifts(selectedGoal));
        setAppliedPattern(null);

        if (uploadedImage && analysisResult) {
            // Image+DNA already loaded (from Analyze) → skip upload, go to studio
            setStage('studio');
        } else {
            // Need to upload first
            setStage('upload');
        }
    };

    // ── Image Upload + Deferred Analysis ──
    const handleImageReady = useCallback(
        (image: { data: string; name: string; type: string }) => {
            setUploadedImage(image);
            setError(null);
            analyzingAnimDone.current = false;

            // Clone doesn't need DNA analysis — go straight to studio
            if (goal === 'clone') {
                setStage('studio');
                return;
            }

            // Variations/Explore: show analyzing animation + start analysis in background
            setStage('analyzing');
            setAnalysisStatus('pending');

            // Fire-and-forget: analysis runs in background
            const promise = analyzeDesign(token, image.data, image.type)
                .then((result) => {
                    setAnalysisResult(result);
                    setAnalysisStatus('complete');
                    return result;
                })
                .catch((err: any) => {
                    setAnalysisStatus('error');
                    setError(err.message || 'Analysis failed. Please try again.');
                    throw err;
                });
            analysisPromiseRef.current = promise;
        },
        [token, goal],
    );

    // ── Callback when analyzing animation (5 dots) completes ──
    const handleAnalyzingAnimComplete = useCallback(() => {
        analyzingAnimDone.current = true;
        // Transition to studio regardless of analysis status
        setStage('studio');
    }, []);

    // ── Clone Handlers ──
    const handleClone = useCallback(async () => {
        if (!uploadedImage) return;
        setError(null);
        setStage('cloning');
        try {
            const result = await cloneDesign(token, {
                originalDna: analysisResult ?? {},
                originalImage: uploadedImage.data,
                originalMimeType: uploadedImage.type,
                aspectRatio,
            });
            setClonedImage(result);
            setStage('clone-result');
        } catch (err: any) {
            setError(err.message || 'Clone failed. Please try again.');
            setStage('studio');
        }
    }, [token, uploadedImage, analysisResult, aspectRatio]);

    const handleReClone = useCallback(() => {
        setClonedImage(null);
        setError(null);
        handleClone();
    }, [handleClone]);

    const handleCloneDownload = useCallback(() => {
        if (!clonedImage) return;
        const link = document.createElement('a');
        link.href = clonedImage;
        link.download = `clone-${uploadedImage?.name || 'design'}.png`;
        link.click();
    }, [clonedImage, uploadedImage]);

    // ── Variation/Explore Handlers ──

    const handleCreateConcepts = useCallback(async () => {
        if (!session) return;
        setError(null);
        setConcepts([]);
        setConceptArtworks(new Map());
        setSelectedConceptIndex(null);
        setGeneratingCardIds(new Set());
        setStage('synthesizing');

        try {
            // If analysis still pending, wait for it
            let dna = analysisResult;
            if (!dna && analysisPromiseRef.current) {
                dna = await analysisPromiseRef.current;
            }
            if (!dna) {
                setError('Analysis not available. Please try again.');
                setStage('studio');
                return;
            }

            const result = await synthesizeConcept(token, {
                originalDna: dna,
                shifts,
                creativity: goal === 'explore' ? 4 : 2,
                appliedPattern: appliedPattern ? {
                    selectedSections: appliedPattern.selectedSections,
                    data: appliedPattern.data,
                } : undefined,
            });
            setConcepts(result);
            setStage('concepts');
        } catch (err: any) {
            setError(err.message || 'Failed to create concepts');
            setStage('studio');
        }
    }, [token, session, analysisResult, shifts, goal, appliedPattern]);

    const handleGenerateArtwork = useCallback(async (conceptIndex: number) => {
        if (!session || concepts.length === 0 || !uploadedImage) return;
        const selectedConcept = concepts[conceptIndex];

        setGenerationStep('Generating artwork...');
        // Per-card generating: add to set instead of global stage
        setGeneratingCardIds(prev => {
            const next = new Set(prev);
            next.add(conceptIndex);
            return next;
        });

        try {
            const imageBase64 = await generateArtwork(token, {
                concept: selectedConcept,
                originalImage: uploadedImage.data,
                originalMimeType: uploadedImage.type,
                aspectRatio,
                creativity: goal === 'explore' ? 4 : 2,
            });

            setConceptArtworks(prev => {
                const next = new Map(prev);
                next.set(conceptIndex, imageBase64);
                return next;
            });
            // Remove from generating set
            setGeneratingCardIds(prev => {
                const next = new Set(prev);
                next.delete(conceptIndex);
                return next;
            });
            setStage('result');
        } catch (err: any) {
            setError(err.message || 'Failed to generate artwork');
            setGeneratingCardIds(prev => {
                const next = new Set(prev);
                next.delete(conceptIndex);
                return next;
            });
            setStage('concepts');
        }
    }, [token, session, concepts, uploadedImage, aspectRatio, goal]);

    const handleRegenerateArtwork = useCallback((conceptIndex: number) => {
        // Remove existing artwork and re-generate
        setConceptArtworks(prev => {
            const next = new Map(prev);
            next.delete(conceptIndex);
            return next;
        });
        handleGenerateArtwork(conceptIndex);
    }, [handleGenerateArtwork]);

    const handleDownload = useCallback((imageDataUrl: string, title: string) => {
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
        const a = document.createElement('a');
        a.href = imageDataUrl;
        a.download = `designdna-${slug}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }, []);

    // ── Navigation Handlers ──

    const handleStartOver = () => {
        // Keep image + DNA, reset everything else
        setGoal(null);
        setClonedImage(null);
        setError(null);
        setConcepts([]);
        setConceptArtworks(new Map());
        setSelectedConceptIndex(null);
        setGeneratingCardIds(new Set());
        setStage('goals');
    };

    const handleBackToGoals = () => {
        setGoal(null);
        setStage('goals');
    };

    const handleRetryUpload = () => {
        setUploadedImage(null);
        setError(null);
        setStage('upload');
    };

    // Quick action handler for concept cards
    const handleQuickAction = useCallback((index: number, action: 'download' | 'regenerate' | 'zoom') => {
        if (action === 'download') {
            const artwork = conceptArtworks.get(index);
            if (artwork) handleDownload(artwork, concepts[index]?.title || 'design');
        } else if (action === 'regenerate') {
            handleRegenerateArtwork(index);
        } else if (action === 'zoom') {
            setSelectedConceptIndex(index);
        }
    }, [conceptArtworks, concepts, handleDownload, handleRegenerateArtwork]);

    // Whether we're in variation/explore flow
    const isVariationFlow = goal !== null && goal !== 'clone';
    const showVariationStudio = isVariationFlow && (
        stage === 'studio' || stage === 'synthesizing' || stage === 'concepts' ||
        stage === 'result'
    );

    // ── Render by stage ──
    const showTopBar = goal !== null && stage !== 'goals';
    const goalLabel = goal ? (goalCards.find(c => c.goal === goal)?.title ?? '') : '';

    return (
        <div className="flex flex-col h-full min-h-screen bg-bg-base">
            {/* Top bar — Home icon + breadcrumb */}
            {showTopBar && (
                <StudioTopBar
                    goalLabel={goalLabel}
                    onExit={() => navigate('/')}
                    onBackToGoals={handleBackToGoals}
                />
            )}

            {stage === 'goals' && (
                <div className="flex-1">
                    <GoalPicker
                        onSelectGoal={handleSelectGoal}
                        preloadedImage={uploadedImage ? { data: uploadedImage.data, name: uploadedImage.name } : null}
                    />
                </div>
            )}

            {stage === 'upload' && goal && (
                <div className="flex-1">
                    <UploadStage
                        goal={goal}
                        onImageReady={handleImageReady}
                        onBack={handleBackToGoals}
                    />
                    {/* Inline error from failed analysis */}
                    {error && (
                        <div className="fixed inset-0 flex items-center justify-center bg-bg-base/80 z-50">
                            <div className="bg-bg-surface1 border border-border-default rounded-2xl p-8 max-w-[400px] text-center shadow-lg">
                                <p className="text-[15px] text-text-primary font-medium mb-2">
                                    Analysis Failed
                                </p>
                                <p className="text-[13px] text-text-secondary mb-6">{error}</p>
                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={() => {
                                            setError(null);
                                            if (uploadedImage) handleImageReady(uploadedImage);
                                        }}
                                        className="px-4 py-2 rounded-xl bg-text-primary text-white text-[13px] font-medium hover:opacity-90 transition-opacity"
                                    >
                                        Try Again
                                    </button>
                                    <button
                                        onClick={handleRetryUpload}
                                        className="px-4 py-2 rounded-xl bg-bg-surface1 border border-border-default text-text-secondary text-[13px] font-medium hover:border-border-hover transition-colors"
                                    >
                                        Upload Different Image
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {stage === 'analyzing' && uploadedImage && (
                <div className="flex-1">
                    <AnalyzingStage
                        image={{ data: uploadedImage.data, name: uploadedImage.name }}
                        onComplete={handleAnalyzingAnimComplete}
                    />
                </div>
            )}

            {/* Clone flow stages */}
            {(stage === 'studio' || stage === 'cloning' || stage === 'clone-result') && goal === 'clone' && uploadedImage && (
                <div className="flex-1">
                    <CloneStudio
                        stage={stage as 'studio' | 'cloning' | 'clone-result'}
                        uploadedImage={uploadedImage}
                        analysisResult={analysisResult}
                        clonedImage={clonedImage}
                        error={error}
                        aspectRatio={aspectRatio}
                        onAspectRatioChange={setAspectRatio}
                        onClone={handleClone}
                        onReClone={handleReClone}
                        onDownload={handleCloneDownload}
                        onStartOver={handleStartOver}
                    />
                </div>
            )}

            {/* Variation/Explore flow */}
            {showVariationStudio && uploadedImage && (
                <div className="flex-1">
                    <VariationStudio
                        goal={goal as 'variations' | 'explore'}
                        stage={stage}
                        uploadedImage={uploadedImage}
                        analysisResult={analysisResult}
                        analysisStatus={analysisStatus}
                        shifts={shifts}
                        onShiftsChange={setShifts}
                        appliedPattern={appliedPattern}
                        onApplyPattern={setAppliedPattern}
                        onRemovePattern={() => setAppliedPattern(null)}
                        aspectRatio={aspectRatio}
                        onAspectRatioChange={setAspectRatio}
                        concepts={concepts}
                        conceptArtworks={conceptArtworks}
                        generatingCardIds={generatingCardIds}
                        onCreateConcepts={handleCreateConcepts}
                        onSelectConcept={(index) => setSelectedConceptIndex(index)}
                        onQuickAction={handleQuickAction}
                        onGenerateArtwork={handleGenerateArtwork}
                        onStartOver={handleStartOver}
                        error={error}
                    />
                </div>
            )}

            {/* Concept Detail Dialog — overlays on top */}
            {selectedConceptIndex !== null && concepts[selectedConceptIndex] && (
                <ConceptDetailDialog
                    concept={concepts[selectedConceptIndex]}
                    artwork={conceptArtworks.get(selectedConceptIndex) || null}
                    isGenerating={generatingCardIds.has(selectedConceptIndex)}
                    generationStep={generationStep}
                    onGenerateArtwork={() => handleGenerateArtwork(selectedConceptIndex)}
                    onRegenerateArtwork={() => handleRegenerateArtwork(selectedConceptIndex)}
                    onDownload={() => {
                        const art = conceptArtworks.get(selectedConceptIndex);
                        if (art) handleDownload(art, concepts[selectedConceptIndex].title);
                    }}
                    onStartOver={handleStartOver}
                    onClose={() => setSelectedConceptIndex(null)}
                />
            )}
        </div>
    );
}
