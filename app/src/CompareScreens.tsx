import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, UploadCloud, X, AlertTriangle, Bookmark, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { savePattern, isCompareResultSaved } from './patternStorage';

type Screen = 'landing' | 'upload' | 'analyzing' | 'results' | 'generation' | 'compare_upload' | 'compare_analyzing' | 'compare_results';

interface CompareUploadScreenProps {
  key?: string;
  onNavigate: (s: Screen) => void;
  compareImages: { data: string; name: string; type: string }[];
  setCompareImages: React.Dispatch<React.SetStateAction<{ data: string; name: string; type: string }[]>>;
  onAnalyze: () => void;
}

export function CompareUploadScreen({ onNavigate, compareImages, setCompareImages, onAnalyze }: CompareUploadScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    addFiles(files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []) as File[];
    addFiles(files);
  };

  const addFiles = (files: File[]) => {
    const validFiles = files.filter(f => f.type.startsWith('image/'));
    const remainingSlots = 5 - compareImages.length;
    const filesToAdd = validFiles.slice(0, remainingSlots);

    filesToAdd.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = { data: event.target?.result as string, name: file.name, type: file.type };
        setCompareImages(prev => {
          if (prev.length >= 5) return prev;
          return [...prev, newImage];
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setCompareImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="pt-8"
    >
      <button
        onClick={() => onNavigate('landing')}
        className="flex items-center text-text-secondary hover:text-text-primary text-[14px] mb-8 transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:rounded"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Home
      </button>

      <div className="max-w-[800px] mx-auto text-center mb-8">
        <h1 className="text-[32px] font-bold tracking-tight mb-2">Compare Winning Designs</h1>
        <p className="text-[14px] text-text-secondary">
          Upload 2-5 successful designs to uncover their shared DNA and extract the winning formula.
        </p>
      </div>

      <div className="max-w-[800px] mx-auto">
        <div className="bg-bg-surface1 border border-border-default rounded-xl p-6 mb-6">
          <div className="flex flex-wrap gap-4 mb-4">
            {compareImages.map((img, index) => (
              <div key={index} className="relative w-[150px] h-[150px] rounded-lg overflow-hidden border border-border-default group">
                <img src={img.data} alt={img.name} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-accent focus-visible:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {compareImages.length < 5 && (
              <div
                className={`w-[150px] h-[150px] bg-bg-surface2 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isDragging ? 'border-accent bg-accent/10' : 'border-white/15 hover:border-white/25'}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <UploadCloud className="w-8 h-8 text-text-secondary mb-2" />
                <span className="text-[12px] text-text-secondary">Add Image</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>
          <p className="text-[14px] text-text-secondary text-center">
            {compareImages.length}/5 images selected
          </p>
        </div>

        <button
          onClick={onAnalyze}
          disabled={compareImages.length < 2}
          className="w-full ai-gradient text-white font-medium py-[14px] px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
        >
          Extract Winning Formula ✨
        </button>
      </div>
    </motion.div>
  );
}

export function CompareAnalyzingScreen({
  onNavigate,
  error,
  onRetry,
  onCancel
}: {
  key?: string;
  onNavigate: (s: Screen) => void;
  error: { type: string; message: string } | null;
  onRetry: () => void;
  onCancel: () => void;
}) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (error) return;
    const interval = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [error]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="pt-8"
    >
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        <div className="w-full md:w-[40%] md:sticky md:top-[80px] self-start">
          <div className="w-full aspect-square bg-bg-surface2 rounded-xl animate-shimmer border border-border-default"></div>
        </div>

        <div className="w-full md:w-[60%] flex flex-col gap-6">
          {error ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-bg-surface1 border-l-4 border-l-error rounded-xl p-4 flex flex-col gap-3"
            >
              <div className="flex items-center gap-2 text-error">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-[14px] font-semibold">Connection Failed</h3>
              </div>
              <p className="text-[14px] text-text-secondary">{error.message}</p>
              <div className="flex flex-wrap gap-3 mt-2">
                <button onClick={onRetry} className="bg-accent text-white px-4 py-2 rounded-lg text-[14px] font-medium hover:bg-accent-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base">
                  Retry
                </button>
                {error.type === 'api' && error.message.includes('API key') && (
                  <button onClick={() => { onCancel(); document.dispatchEvent(new CustomEvent('open-settings')); }} className="text-text-secondary hover:text-text-primary px-4 py-2 rounded-lg text-[14px] font-medium border border-border-default hover:bg-bg-surface2 focus-visible:ring-2 focus-visible:ring-accent">
                    Change API Key
                  </button>
                )}
                <button onClick={onCancel} className="text-text-secondary hover:text-text-primary px-4 py-2 rounded-lg text-[14px] font-medium focus-visible:ring-2 focus-visible:ring-accent">
                  Cancel
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="flex gap-4 border-b border-border-default pb-2">
                <div className="h-6 w-24 bg-bg-surface2 rounded animate-shimmer"></div>
                <div className="h-6 w-24 bg-bg-surface2 rounded animate-shimmer"></div>
              </div>

              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="h-5 w-[200px] bg-bg-surface2 rounded animate-shimmer"></div>
                  <div className="h-4 w-full bg-bg-surface2 rounded animate-shimmer"></div>
                  <div className="h-4 w-[80%] bg-bg-surface2 rounded animate-shimmer"></div>
                  <div className="h-4 w-[60%] bg-bg-surface2 rounded animate-shimmer"></div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {!error && (
        <div className="mt-8 text-center flex flex-col items-center gap-2">
          <p className="text-[14px] text-text-secondary">
            Analyzing patterns across designs... {elapsed}s
          </p>
          <button onClick={onCancel} className="text-[14px] text-text-tertiary hover:text-text-secondary hover:underline">
            Cancel
          </button>
        </div>
      )}
    </motion.div>
  );
}

export function CompareResultsScreen({
  onNavigate,
  compareImages,
  setCompareImages,
  compareResult
}: {
  key?: string;
  onNavigate: (s: Screen) => void;
  compareImages: { data: string; name: string; type: string }[];
  setCompareImages: React.Dispatch<React.SetStateAction<{ data: string; name: string; type: string }[]>>;
  compareResult: any;
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  // ── Save as Pattern state ──
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [patternName, setPatternName] = useState('');
  const [isSaved, setIsSaved] = useState(() => isCompareResultSaved(compareResult?.batch_analysis));
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePattern = async () => {
    if (!patternName.trim() || isSaving) return;
    setIsSaving(true);
    try {
      await savePattern(patternName.trim(), compareResult?.batch_analysis, compareImages);
      setIsSaved(true);
      setShowSavePopup(false);
      setPatternName('');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (err) {
      console.error('Failed to save pattern:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewComparison = () => {
    if (window.confirm('Start a new comparison? Current results will be lost.')) {
      setCompareImages([]);
      onNavigate('compare_upload');
    }
  };

  const analysis = compareResult?.batch_analysis;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="pt-8"
    >
      <div className="mb-8">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center text-text-secondary hover:text-text-primary text-[14px] mb-4 transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:rounded"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Home
        </button>
        <h1 className="text-[32px] font-bold tracking-tight">Winning Formula</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-[30%] md:sticky md:top-[80px] self-start">
          <div className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
            {compareImages.map((img, index) => (
              <div key={index} className="flex-shrink-0 w-[100px] h-[100px] md:w-full md:h-auto md:aspect-square bg-bg-surface2 rounded-xl border border-border-default overflow-hidden">
                <img src={img.data} alt={img.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <motion.div
          className="w-full md:w-[70%] flex flex-col gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Section A: The Winning Formula */}
          <motion.div variants={itemVariants} className="bg-bg-surface2 border-2 border-accent rounded-xl p-6">
            <h2 className="text-[18px] font-bold text-accent mb-4">The Winning Formula</h2>
            <p className="text-[14px] text-text-primary mb-6 leading-relaxed">
              {analysis?.winning_formula?.summary || 'No summary available.'}
            </p>

            {/* Keep / Experiment / Avoid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {/* Keep */}
              <div className="bg-success-subtle border border-success/20 rounded-lg p-4">
                <span className="text-[12px] text-success uppercase tracking-wider font-semibold block mb-2">✅ Keep</span>
                <ul className="flex flex-col gap-1.5">
                  {analysis?.winning_formula?.keep?.map((item: string, i: number) => (
                    <li key={i} className="text-[13px] text-text-primary">{item}</li>
                  ))}
                </ul>
              </div>
              {/* Experiment With */}
              <div className="bg-warning-subtle border border-warning/20 rounded-lg p-4">
                <span className="text-[12px] text-warning uppercase tracking-wider font-semibold block mb-2">🧪 Experiment</span>
                <ul className="flex flex-col gap-1.5">
                  {analysis?.winning_formula?.experiment_with?.map((item: string, i: number) => (
                    <li key={i} className="text-[13px] text-text-primary">{item}</li>
                  ))}
                </ul>
              </div>
              {/* Avoid */}
              <div className="bg-error-subtle border border-error/20 rounded-lg p-4">
                <span className="text-[12px] text-error uppercase tracking-wider font-semibold block mb-2">❌ Avoid</span>
                <ul className="flex flex-col gap-1.5">
                  {analysis?.winning_formula?.avoid?.map((item: string, i: number) => (
                    <li key={i} className="text-[13px] text-text-primary">{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-bg-base rounded-lg p-4 mb-6 border border-border-default">
              <p className="text-[14px] text-text-secondary italic">
                "{analysis?.winning_formula?.suggested_brief || 'No suggested brief available.'}"
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {isSaved ? (
                <button
                  disabled
                  className="flex-1 border border-success/30 text-success font-medium py-3 px-6 rounded-lg opacity-70 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" /> Saved
                </button>
              ) : (
                <button
                  onClick={() => setShowSavePopup(true)}
                  className="flex-1 border border-border-default text-text-primary font-medium py-3 px-6 rounded-lg hover:bg-bg-surface2 transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base flex items-center justify-center gap-2"
                >
                  <Bookmark className="w-4 h-4" /> Save as Pattern
                </button>
              )}
              <button
                onClick={handleNewComparison}
                className="flex-1 border border-border-default text-text-primary font-medium py-3 px-6 rounded-lg hover:bg-bg-surface2 transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
              >
                New Comparison
              </button>
            </div>
          </motion.div>

          {/* Section: Visual Patterns */}
          {analysis?.visual_patterns && (
            <motion.div variants={itemVariants}>
              <h3 className="text-[16px] font-semibold mb-4">Visual Patterns</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-bg-surface1 border border-border-default rounded-lg p-4">
                  <span className="text-[12px] text-text-secondary uppercase tracking-wider font-semibold block mb-1">Common Colors</span>
                  <span className="text-[14px] text-text-primary">{analysis.visual_patterns.common_colors || 'N/A'}</span>
                </div>
                <div className="bg-bg-surface1 border border-border-default rounded-lg p-4">
                  <span className="text-[12px] text-text-secondary uppercase tracking-wider font-semibold block mb-1">Typography Trends</span>
                  <span className="text-[14px] text-text-primary">{analysis.visual_patterns.typography_trends || 'N/A'}</span>
                </div>
                <div className="bg-bg-surface1 border border-border-default rounded-lg p-4">
                  <span className="text-[12px] text-text-secondary uppercase tracking-wider font-semibold block mb-1">Composition Patterns</span>
                  <span className="text-[14px] text-text-primary">{analysis.visual_patterns.composition_patterns || 'N/A'}</span>
                </div>
                <div className="bg-bg-surface1 border border-border-default rounded-lg p-4">
                  <span className="text-[12px] text-text-secondary uppercase tracking-wider font-semibold block mb-1">Illustration Styles</span>
                  <span className="text-[14px] text-text-primary">{analysis.visual_patterns.illustration_styles || 'N/A'}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Section B: Buyer Overlap Map */}
          <motion.div variants={itemVariants}>
            <h3 className="text-[16px] font-semibold mb-4">Buyer Overlap</h3>
            <div className="flex flex-col gap-3">
              <div className="bg-bg-surface1 border border-border-default rounded-lg p-4">
                <span className="text-[12px] text-text-secondary uppercase tracking-wider font-semibold block mb-1">Shared Persona</span>
                <span className="text-[14px] text-text-primary">{analysis?.buyer_overlap?.shared_persona || 'N/A'}</span>
              </div>
              <div className="bg-bg-surface1 border border-border-default rounded-lg p-4">
                <span className="text-[12px] text-text-secondary uppercase tracking-wider font-semibold block mb-1">Shared Identity</span>
                <span className="text-[14px] text-text-primary">{analysis?.buyer_overlap?.shared_identity || 'N/A'}</span>
              </div>
              <div className="bg-bg-surface1 border border-border-default rounded-lg p-4">
                <span className="text-[12px] text-text-secondary uppercase tracking-wider font-semibold block mb-1">Shared Emotion</span>
                <span className="text-[14px] text-text-primary">{analysis?.buyer_overlap?.shared_emotion || 'N/A'}</span>
              </div>
              <div className="bg-bg-surface1 border border-border-default rounded-lg p-4">
                <span className="text-[12px] text-text-secondary uppercase tracking-wider font-semibold block mb-1">Shared Occasion</span>
                <span className="text-[14px] text-text-primary">{analysis?.buyer_overlap?.shared_occasion || 'N/A'}</span>
              </div>
            </div>
          </motion.div>

          {/* Section C: "Made For Me" Pattern Analysis */}
          <motion.div variants={itemVariants}>
            <h3 className="text-[16px] font-semibold mb-4">Pattern Analysis</h3>
            <ul className="flex flex-col gap-3 mb-8">
              {analysis?.made_for_me_patterns?.map((pattern: string, index: number) => (
                <li key={index} className="flex items-start gap-3 bg-bg-surface1 border border-border-default rounded-lg p-4">
                  <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0"></div>
                  <span className="text-[14px] text-text-primary">{pattern}</span>
                </li>
              ))}
            </ul>

            <h4 className="text-[14px] font-semibold text-text-secondary uppercase tracking-wider mb-4">Specificity Ladder</h4>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4 bg-bg-surface1 border border-border-default rounded-lg p-4 opacity-60">
                <div className="w-6 h-6 rounded-full bg-bg-surface2 flex items-center justify-center text-[12px] font-bold text-text-secondary">1</div>
                <span className="text-[14px] text-text-secondary flex-1">{analysis?.specificity_ladder?.generic || 'Generic'}</span>
              </div>
              <div className="flex items-center gap-4 bg-bg-surface1 border border-border-default rounded-lg p-4">
                <div className="w-6 h-6 rounded-full bg-bg-surface2 flex items-center justify-center text-[12px] font-bold text-text-primary">2</div>
                <span className="text-[14px] text-text-primary flex-1">{analysis?.specificity_ladder?.niche || 'Niche'}</span>
              </div>
              <div className="flex items-center gap-4 bg-bg-surface1 border border-accent rounded-lg p-4">
                <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-[12px] font-bold text-white">3</div>
                <span className="text-[14px] font-bold text-accent flex-1">{analysis?.specificity_ladder?.hyper_niche || 'Hyper Niche'}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Save as Pattern Popup ── */}
      <AnimatePresence>
        {showSavePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={() => setShowSavePopup(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-bg-surface1 border border-border-default rounded-xl shadow-lg p-6 w-[400px] max-w-[90vw]"
            >
              <h3 className="text-[16px] font-semibold mb-4">Save as Pattern</h3>
              <input
                type="text"
                placeholder="Name your pattern..."
                value={patternName}
                onChange={(e) => setPatternName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSavePattern()}
                autoFocus
                className="w-full bg-bg-surface2 border border-border-default rounded-lg px-4 py-2.5 text-[14px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent mb-4"
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => { setShowSavePopup(false); setPatternName(''); }}
                  className="px-4 py-2 text-[13px] text-text-secondary hover:text-text-primary rounded-lg hover:bg-bg-surface2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePattern}
                  disabled={!patternName.trim() || isSaving}
                  className="px-5 py-2 ai-gradient text-white text-[13px] font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toast Notification ── */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-success text-white px-5 py-2.5 rounded-lg shadow-lg text-[14px] font-medium flex items-center gap-2 z-50"
          >
            <Check className="w-4 h-4" /> Pattern saved!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
