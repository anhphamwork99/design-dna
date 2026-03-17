import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, UploadCloud, AlertTriangle, Settings, X, Microscope, Scale, Copy, Check, ImageOff, Layers, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeDesign, analyzeBatch } from './api';
import CreativeStudio from './CreativeStudio';
import { CompareUploadScreen, CompareAnalyzingScreen, CompareResultsScreen } from './CompareScreens';
import PatternLibrary from './PatternLibrary';
import PatternDetail from './PatternDetail';
import { getPatterns } from './patternStorage';
import { useAuth } from './contexts/AuthContext';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';

type Screen = 'landing' | 'upload' | 'analyzing' | 'results' | 'generation' | 'compare_upload' | 'compare_analyzing' | 'compare_results' | 'pattern_library' | 'pattern_detail';

export default function App() {
  const { user, loading, signOut } = useAuth();
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [uploadedImage, setUploadedImage] = useState<{ data: string; name: string; type: string } | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<{ type: string; message: string } | null>(null);
  const [initialGenMode, setInitialGenMode] = useState<string | undefined>(undefined);
  const [compareImages, setCompareImages] = useState<{ data: string; name: string; type: string }[]>([]);
  const [compareResult, setCompareResult] = useState<any>(null);
  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('designdna_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      setIsSettingsOpen(true);
    }

    const handleOpenSettings = () => setIsSettingsOpen(true);
    document.addEventListener('open-settings', handleOpenSettings);
    return () => document.removeEventListener('open-settings', handleOpenSettings);
  }, []);

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleCompareAnalyze = async () => {
    if (compareImages.length < 2) return;

    const currentApiKey = localStorage.getItem('designdna_api_key');
    if (!currentApiKey) {
      setIsSettingsOpen(true);
      return;
    }

    setCurrentScreen('compare_analyzing');
    setError(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('timeout')), 60000);
      });

      const result = await Promise.race([
        analyzeBatch(compareImages, currentApiKey),
        timeoutPromise
      ]);

      if (abortController.signal.aborted) return;

      setCompareResult(result);
      setCurrentScreen('compare_results');
    } catch (err: any) {
      if (abortController.signal.aborted) return;

      console.error(err);
      let errorType = 'network';
      let errorMsg = 'Could not reach the Gemini API. Check your internet connection and try again.';

      const errMsg = err?.message || String(err);

      if (errMsg === 'timeout') {
        errorType = 'timeout';
        errorMsg = 'The analysis took too long. Please try again.';
      } else if (errMsg.includes('location is not supported') || errMsg.includes('FAILED_PRECONDITION')) {
        errorType = 'api';
        errorMsg = 'Your location is not supported by Gemini API. Try turning off VPN or switching to a US/EU server.';
      } else if (errMsg.includes('400')) {
        errorType = 'api';
        errorMsg = 'Invalid request. The images may be too large or in an unsupported format.';
      } else if (errMsg.includes('403') || errMsg.includes('API key not valid')) {
        errorType = 'api';
        errorMsg = 'Invalid API key. Please check your key in Settings.';
      } else if (errMsg.includes('429') || errMsg.includes('quota')) {
        errorType = 'api';
        errorMsg = 'Rate limit exceeded. Please wait a moment and try again.';
      } else if (errMsg.includes('50') || errMsg.includes('unavailable')) {
        errorType = 'api';
        errorMsg = 'Gemini API is temporarily unavailable. Please try again later.';
      } else if (errMsg.includes('JSON') || errMsg.includes('parse') || errMsg.includes('SyntaxError')) {
        errorType = 'parse';
        errorMsg = 'Received an unexpected response format. Please try again.';
      }

      setError({ type: errorType, message: errorMsg });
      setCurrentScreen('compare_upload');
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedImage) return;

    const currentApiKey = localStorage.getItem('designdna_api_key');
    if (!currentApiKey) {
      setIsSettingsOpen(true);
      return;
    }

    setCurrentScreen('analyzing');
    setError(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('timeout')), 60000);
      });

      const result = await Promise.race([
        analyzeDesign(uploadedImage.data, uploadedImage.type, currentApiKey),
        timeoutPromise
      ]);

      if (abortController.signal.aborted) return;

      setAnalysisResult(result);
      setCurrentScreen('results');
    } catch (err: any) {
      if (abortController.signal.aborted) return;

      console.error(err);
      let errorType = 'network';
      let errorMsg = 'Could not reach the Gemini API. Check your internet connection and try again.';

      const errMsg = err?.message || String(err);

      if (errMsg === 'timeout') {
        errorType = 'timeout';
        errorMsg = 'The analysis took too long. Please try again.';
      } else if (errMsg.includes('location is not supported') || errMsg.includes('FAILED_PRECONDITION')) {
        errorType = 'api';
        errorMsg = 'Your location is not supported by Gemini API. Try turning off VPN or switching to a US/EU server.';
      } else if (errMsg.includes('400')) {
        errorType = 'api';
        errorMsg = 'Invalid request. The image may be too large or in an unsupported format.';
      } else if (errMsg.includes('403') || errMsg.includes('API key not valid')) {
        errorType = 'api';
        errorMsg = 'Invalid API key. Please check your key in Settings.';
      } else if (errMsg.includes('429') || errMsg.includes('quota')) {
        errorType = 'api';
        errorMsg = 'Rate limit exceeded. Please wait a moment and try again.';
      } else if (errMsg.includes('50') || errMsg.includes('unavailable')) {
        errorType = 'api';
        errorMsg = 'Gemini API is temporarily unavailable. Please try again later.';
      } else if (errMsg.includes('JSON') || errMsg.includes('parse')) {
        errorType = 'parse';
        errorMsg = 'Received an unexpected response format. Please try again.';
      }

      setError({ type: errorType, message: errorMsg });
    }
  };

  const handleCancelAnalysis = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setCurrentScreen(currentScreen === 'compare_analyzing' ? 'compare_upload' : 'upload');
  };

  const isStudioMode = currentScreen === 'generation';

  // Auth gate: show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="w-8 h-8 rounded ai-gradient animate-pulse" />
      </div>
    );
  }

  // Auth gate: show login/register if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-bg-base text-text-primary font-sans">
        <AnimatePresence mode="wait">
          {authScreen === 'login' ? (
            <LoginScreen key="login" onSwitchToRegister={() => setAuthScreen('register')} />
          ) : (
            <RegisterScreen key="register" onSwitchToLogin={() => setAuthScreen('login')} />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary font-sans">
      {!isStudioMode && (
        <header className="h-14 bg-bg-surface1 border-b border-border-default fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6">
          <button onClick={() => setCurrentScreen('landing')} className="flex items-center hover:opacity-80 transition-opacity" aria-label="Go to home page">
            <div className="w-6 h-6 rounded ai-gradient mr-3"></div>
            <span className="font-semibold text-[16px]">DesignDNA</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-text-tertiary hidden sm:inline">{user.email}</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Open settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={signOut}
              className="text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>
      )}
      <main className={isStudioMode ? '' : 'pt-14 max-w-[1200px] mx-auto px-8 pb-24'}>
        <AnimatePresence mode="wait">
          {currentScreen === 'landing' && (
            <LandingScreen key="landing" onNavigate={setCurrentScreen} />
          )}
          {currentScreen === 'upload' && (
            <UploadScreen
              key="upload"
              onNavigate={setCurrentScreen}
              uploadedImage={uploadedImage}
              setUploadedImage={setUploadedImage}
              onAnalyze={() => handleAnalyze()}
            />
          )}
          {currentScreen === 'analyzing' && (
            <AnalyzingScreen
              key="analyzing"
              uploadedImage={uploadedImage}
              error={error}
              onRetry={() => handleAnalyze()}
              onCancel={handleCancelAnalysis}
            />
          )}
          {currentScreen === 'results' && (
            <ResultsScreen
              key="results"
              uploadedImage={uploadedImage}
              analysisResult={analysisResult}
              onNavigate={setCurrentScreen}
              setInitialGenMode={setInitialGenMode}
            />
          )}
          {currentScreen === 'generation' && (
            <CreativeStudio
              key="generation"
              analysisResult={analysisResult}
              uploadedImage={uploadedImage}
              onNavigate={setCurrentScreen}
            />
          )}
          {currentScreen === 'compare_upload' && (
            <CompareUploadScreen
              key="compare_upload"
              onNavigate={setCurrentScreen}
              compareImages={compareImages}
              setCompareImages={setCompareImages}
              onAnalyze={handleCompareAnalyze}
              error={error}
              onDismissError={() => setError(null)}
            />
          )}
          {currentScreen === 'compare_analyzing' && (
            <CompareAnalyzingScreen
              key="compare_analyzing"
              onNavigate={setCurrentScreen}
              error={error}
              onRetry={handleCompareAnalyze}
              onCancel={handleCancelAnalysis}
            />
          )}
          {currentScreen === 'compare_results' && (
            <CompareResultsScreen
              key="compare_results"
              onNavigate={setCurrentScreen}
              compareImages={compareImages}
              setCompareImages={setCompareImages}
              compareResult={compareResult}
            />
          )}
          {currentScreen === 'pattern_library' && (
            <PatternLibrary
              key="pattern_library"
              onNavigate={(screen: string, data?: any) => {
                if (screen === 'pattern_detail' && data?.patternId) {
                  setSelectedPatternId(data.patternId);
                }
                setCurrentScreen(screen as Screen);
              }}
            />
          )}
          {currentScreen === 'pattern_detail' && selectedPatternId && (
            <PatternDetail
              key="pattern_detail"
              patternId={selectedPatternId}
              onNavigate={(screen: string) => setCurrentScreen(screen as Screen)}
            />
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal
            onClose={() => setIsSettingsOpen(false)}
            initialKey={apiKey}
            onSave={(key) => {
              setApiKey(key);
              localStorage.setItem('designdna_api_key', key);
              setIsSettingsOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SettingsModal({ onClose, initialKey, onSave }: { onClose: () => void, initialKey: string, onSave: (key: string) => void }) {
  const [keyInput, setKeyInput] = useState(initialKey);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-[400px] bg-bg-surface1 border border-border-default rounded-xl p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 id="settings-title" className="text-[20px] font-semibold mb-6">Settings</h2>

        <div className="flex flex-col gap-2 mb-8">
          <label className="text-[14px] text-text-secondary font-medium">Gemini API Key</label>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="Paste your API key here"
            className="w-full bg-bg-surface1 border border-border-default hover:border-border-hover focus:border-accent focus:ring-1 focus:ring-accent rounded-lg px-[14px] py-[10px] text-[14px] text-text-primary outline-none transition-all"
          />
          <p className="text-[12px] text-text-tertiary mt-1">
            Your key is stored locally in your browser and never sent to our servers.
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[14px] font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(keyInput)}
            disabled={!keyInput.trim()}
            className="px-5 py-3 text-[14px] font-medium bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function LandingScreen({ onNavigate }: { key?: string; onNavigate: (s: Screen) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex flex-col items-center pt-24 text-center"
    >
      <h1 className="text-[32px] font-bold tracking-tight mb-4">Decode Any Design's DNA</h1>
      <p className="text-[14px] text-text-secondary max-w-[540px] mb-8">
        Upload any design to uncover its Visual DNA and discover exactly who it's made for — and why.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-[900px]">
        <div
          onClick={() => onNavigate('upload')}
          className="bg-bg-surface1 border border-border-default rounded-xl p-6 text-left cursor-pointer hover:bg-bg-surface2 hover:border-border-hover hover:-translate-y-0.5 transition-all duration-150 group"
        >
          <Microscope className="w-7 h-7 text-accent mb-4 group-hover:scale-110 transition-transform origin-left" />
          <h3 className="text-[16px] font-semibold mb-1">Analyze Design</h3>
          <p className="text-[12px] text-text-secondary">Upload a design to decode its visual DNA and buyer psychology</p>
        </div>

        <div
          onClick={() => onNavigate('compare_upload')}
          className="bg-bg-surface1 border border-border-default rounded-xl p-6 text-left cursor-pointer hover:bg-bg-surface2 hover:border-border-hover hover:-translate-y-0.5 transition-all duration-150 group"
        >
          <Scale className="w-7 h-7 text-accent mb-4 group-hover:scale-110 transition-transform origin-left" />
          <h3 className="text-[16px] font-semibold mb-1">Compare Designs</h3>
          <p className="text-[12px] text-text-secondary">Upload 2-5 designs to find winning patterns</p>
        </div>

        <div
          onClick={() => onNavigate('pattern_library')}
          className="bg-bg-surface1 border border-border-default rounded-xl p-6 text-left cursor-pointer hover:bg-bg-surface2 hover:border-border-hover hover:-translate-y-0.5 transition-all duration-150 group"
        >
          <Layers className="w-7 h-7 text-[#a78bfa] mb-4 group-hover:scale-110 transition-transform origin-left" />
          <h3 className="text-[16px] font-semibold mb-1">Pattern Library</h3>
          <p className="text-[12px] text-text-secondary">Browse saved patterns from Compare analysis</p>
        </div>
      </div>
    </motion.div>
  );
}

function UploadScreen({
  onNavigate,
  uploadedImage,
  setUploadedImage,
  onAnalyze
}: {
  key?: string;
  onNavigate: (s: Screen) => void;
  uploadedImage: { data: string; name: string; type: string } | null;
  setUploadedImage: (img: { data: string; name: string; type: string } | null) => void;
  onAnalyze: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage({ data: event.target?.result as string, name: file.name, type: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage({ data: event.target?.result as string, name: file.name, type: file.type });
      };
      reader.readAsDataURL(file);
    }
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
        className="flex items-center text-text-secondary hover:text-text-primary text-[14px] mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Home
      </button>

      <div className="max-w-[640px] mx-auto">
        <h1 className="text-[32px] font-bold tracking-tight mb-2">Analyze a Design</h1>
        <p className="text-[14px] text-text-secondary mb-8">Upload a design image to decode its visual DNA and buyer psychology.</p>
        {!uploadedImage ? (
          <div
            className={`bg-bg-surface1 border-2 border-dashed rounded-xl py-12 px-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isDragging ? 'border-accent bg-accent/5' : 'border-white/15 hover:border-accent'}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <UploadCloud className="w-12 h-12 text-text-secondary mb-4" />
            <h3 className="text-[16px] font-medium text-text-primary mb-1">Drop your design here</h3>
            <p className="text-[14px] text-text-secondary mb-2">or click to browse</p>
            <p className="text-[12px] text-text-tertiary">PNG, JPG, WEBP</p>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="bg-bg-surface2 p-2 rounded-xl border border-border-default flex justify-center items-center">
              <img src={uploadedImage.data} alt="Uploaded design" className="max-h-[400px] w-full object-contain rounded-lg" />
            </div>

            <div className="h-6"></div>

            <button
              onClick={onAnalyze}
              className="w-full ai-gradient text-white font-medium py-[14px] px-6 rounded-lg hover:opacity-90 transition-opacity"
            >
              Analyze Design
            </button>

            <div className="h-2"></div>

            <button
              onClick={() => setUploadedImage(null)}
              className="w-full text-text-secondary text-[14px] py-2 hover:underline"
            >
              Change Image
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function AnalyzingScreen({
  uploadedImage,
  error,
  onRetry,
  onCancel
}: {
  key?: string;
  uploadedImage: { data: string; name: string; type: string } | null;
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
          {uploadedImage ? (
            <div className="relative overflow-hidden bg-bg-surface2 p-2 rounded-xl border border-border-default">
              <img src={uploadedImage.data} alt="Analyzing design" className="w-full max-h-[300px] md:max-h-none object-contain rounded-lg" />
              <div className="animate-scan-line"></div>
            </div>
          ) : (
            <div className="w-full aspect-square bg-bg-surface2 rounded-xl animate-shimmer border border-border-default"></div>
          )}
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
                <button onClick={onRetry} className="bg-accent text-white px-4 py-2 rounded-lg text-[14px] font-medium hover:bg-accent-hover">
                  Retry
                </button>
                {error.type === 'api' && error.message.includes('API key') && (
                  <button onClick={() => { document.dispatchEvent(new CustomEvent('open-settings')); onCancel(); }} className="text-text-secondary hover:text-text-primary px-4 py-2 rounded-lg text-[14px] font-medium border border-border-default hover:bg-bg-surface2">
                    Change API Key
                  </button>
                )}
                <button onClick={onCancel} className="text-text-secondary hover:text-text-primary px-4 py-2 rounded-lg text-[14px] font-medium">
                  Cancel
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              <div>
                <h1 className="text-[32px] font-bold tracking-tight mb-2">Analysis Results</h1>
                <p className="text-[14px] text-text-secondary">Here is the detailed breakdown of the original design and its target buyers.</p>
              </div>

              <div className="flex border-b border-border-default">
                <button className="py-3 px-5 text-[13px] font-medium uppercase tracking-[0.05em] relative text-text-primary">
                  Design Breakdown
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
                </button>
                <button className="py-3 px-5 text-[13px] font-medium uppercase tracking-[0.05em] text-text-secondary">
                  Target Audience
                </button>
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
            Analyzing... {elapsed}s
          </p>
          <button onClick={onCancel} className="text-[14px] text-text-tertiary hover:text-text-secondary hover:underline">
            Cancel
          </button>
        </div>
      )}
    </motion.div>
  );
}

function ResultsScreen({
  uploadedImage,
  analysisResult,
  onNavigate,
  setInitialGenMode
}: {
  key?: string;
  uploadedImage: { data: string; name: string } | null;
  analysisResult: any;
  onNavigate: (s: Screen) => void;
  setInitialGenMode: (mode: string | undefined) => void;
}) {
  const [activeTab, setActiveTab] = useState<'visual' | 'buyer'>('visual');
  const [copied, setCopied] = useState(false);

  const handleCopyDNA = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(analysisResult, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

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

  if (!analysisResult) return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-24 flex flex-col items-center text-center gap-4"
    >
      <ImageOff className="w-12 h-12 text-text-tertiary" />
      <h2 className="text-[20px] font-semibold">No Analysis Data</h2>
      <p className="text-[14px] text-text-secondary max-w-[400px]">It looks like there's no analysis to show. Upload a design to get started.</p>
      <button
        onClick={() => onNavigate('upload')}
        className="mt-2 px-5 py-3 rounded-lg ai-gradient text-white text-[14px] font-medium hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
      >
        Upload a Design
      </button>
    </motion.div>
  );
  const visualDNA = analysisResult.visual_dna;
  const buyerDNA = analysisResult.buyer_dna;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="pt-8 mb-24"
    >
      <button
        onClick={() => onNavigate('upload')}
        className="flex items-center text-text-secondary hover:text-text-primary text-[14px] mb-6 transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:rounded"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Upload
      </button>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        <div className="w-full md:w-[40%] md:sticky md:top-[80px] self-start">
          <div className="bg-bg-surface2 p-2 rounded-xl border border-border-default">
            {uploadedImage && (
              <img src={uploadedImage.data} alt="Analyzed design" className="w-full max-h-[300px] md:max-h-none object-contain rounded-lg" />
            )}
          </div>
          <p className="mt-4 text-[12px] text-text-secondary truncate" title={uploadedImage?.name}>{uploadedImage?.name}</p>
        </div>

        <div className="w-full md:w-[60%] flex flex-col gap-6">
          <div>
            <h1 className="text-[32px] font-bold tracking-tight mb-2">Analysis Results</h1>
            <p className="text-[14px] text-text-secondary">Here is the detailed breakdown of the original design and its target buyers.</p>
          </div>

          <div className="flex border-b border-border-default" role="tablist">
            <button
              onClick={() => setActiveTab('visual')}
              className={`py-3 px-5 text-[13px] font-medium uppercase tracking-[0.05em] relative transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base rounded-t ${activeTab === 'visual' ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
              role="tab"
              aria-selected={activeTab === 'visual'}
            >
              Design Breakdown
              {activeTab === 'visual' && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('buyer')}
              className={`py-3 px-5 text-[13px] font-medium uppercase tracking-[0.05em] relative transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base rounded-t ${activeTab === 'buyer' ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
              role="tab"
              aria-selected={activeTab === 'buyer'}
            >
              Target Audience
              {activeTab === 'buyer' && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
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
                    <div className="flex justify-between items-center border-b border-border-default pb-2">
                      <span className="text-text-secondary">Grid Type</span>
                      <span className="text-text-primary font-medium text-right">{visualDNA.composition?.grid_type}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-border-default pb-2">
                      <span className="text-text-secondary">Symmetry</span>
                      <span className="text-text-primary font-medium text-right">{visualDNA.composition?.symmetry}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-border-default pb-2">
                      <span className="text-text-secondary">Focal Point</span>
                      <span className="text-text-primary font-medium text-right">{visualDNA.composition?.focal_point}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-border-default pb-2">
                      <span className="text-text-secondary">Visual Flow</span>
                      <span className="text-text-primary font-medium text-right">{visualDNA.composition?.visual_flow}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-border-default pb-2">
                      <span className="text-text-secondary">Density</span>
                      <span className="text-text-primary font-medium text-right">{visualDNA.composition?.density}</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <h3 className="text-[16px] font-semibold mb-3">Color</h3>
                  <div className="flex h-10 w-full rounded-lg overflow-hidden mb-3">
                    {visualDNA.color?.palette?.map((c: any, i: number) => (
                      <div key={i} style={{ width: `${c.proportion || (100 / (visualDNA.color.palette.length || 1))}%`, backgroundColor: c.hex }} title={`${c.name} (${c.proportion}%)`} />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-4 mb-5">
                    {visualDNA.color?.palette?.map((c: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 bg-bg-surface2 px-3 py-2 rounded-lg">
                        <div className="w-5 h-5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: c.hex }}></div>
                        <div className="flex flex-col">
                          <span className="text-[12px] font-medium text-text-primary leading-tight">{c.name}</span>
                          <span className="text-[11px] text-text-tertiary uppercase tracking-wider">{c.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[14px]">
                    <div className="bg-bg-surface2 p-3 rounded-lg border border-border-default text-center">
                      <span className="block text-text-secondary text-[12px] mb-1">Harmony</span>
                      <span className="font-medium text-text-primary">{visualDNA.color?.harmony}</span>
                    </div>
                    <div className="bg-bg-surface2 p-3 rounded-lg border border-border-default text-center">
                      <span className="block text-text-secondary text-[12px] mb-1">Contrast</span>
                      <span className="font-medium text-text-primary">{visualDNA.color?.contrast}</span>
                    </div>
                    <div className="bg-bg-surface2 p-3 rounded-lg border border-border-default text-center">
                      <span className="block text-text-secondary text-[12px] mb-1">Temperature</span>
                      <span className="font-medium text-text-primary">{visualDNA.color?.temperature}</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <h3 className="text-[16px] font-semibold mb-3">Typography</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {visualDNA.typography?.fonts?.map((f: any, i: number) => (
                      <div key={i} className="bg-bg-surface2 p-3 rounded-lg border border-border-default">
                        <div className="text-[12px] text-accent font-medium mb-1 uppercase tracking-wider">{f.role}</div>
                        <div className="text-[14px] font-semibold text-text-primary truncate">{f.classification}</div>
                        <div className="text-[12px] text-text-secondary mt-1">{f.weight} · {f.case}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row items-baseline justify-between py-3 border-t border-border-default">
                    <span className="text-[14px] text-text-secondary">Hierarchy Levels</span>
                    <span className="text-[14px] font-medium text-text-primary bg-bg-surface2 px-3 py-1 rounded-full">{visualDNA.typography?.hierarchy_levels}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 py-3 border-t border-border-default">
                    <span className="text-[14px] text-text-secondary min-w-[150px]">Suggested Google Fonts</span>
                    <div className="flex flex-wrap gap-2">
                      {visualDNA.typography?.suggested_google_fonts?.map((f: string, i: number) => (
                        <span key={i} className="bg-bg-surface2 text-text-primary px-2 py-1 rounded-md text-[13px] border border-border-hover">{f}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <h3 className="text-[16px] font-semibold mb-3">Graphics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[14px] mb-4">
                    <div className="bg-bg-surface2 p-3 rounded-lg border border-border-default flex flex-col justify-between">
                      <span className="text-text-secondary text-[12px] block mb-1">Style</span>
                      <span className="font-medium text-text-primary leading-tight">{visualDNA.graphics?.style}</span>
                    </div>
                    <div className="bg-bg-surface2 p-3 rounded-lg border border-border-default flex flex-col justify-between">
                      <span className="text-text-secondary text-[12px] block mb-1">Primary Element</span>
                      <span className="font-medium text-text-primary leading-tight">{visualDNA.graphics?.primary_element}</span>
                    </div>
                    <div className="bg-bg-surface2 p-3 rounded-lg border border-border-default flex flex-col justify-between">
                      <span className="text-text-secondary text-[12px] block mb-1">Detail Level</span>
                      <span className="font-medium text-text-primary leading-tight">{visualDNA.graphics?.detail_level}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex sm:items-baseline flex-col sm:flex-row gap-2 border-t border-border-default pt-3">
                      <span className="text-[14px] text-text-secondary min-w-[150px]">Secondary Elements</span>
                      <div className="flex flex-wrap gap-2">
                        {visualDNA.graphics?.secondary_elements?.map((e: string, i: number) => (
                          <span key={i} className="bg-bg-surface2 text-text-primary px-2 py-1 rounded-md text-[13px] border border-border-hover">{e}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex sm:items-baseline flex-col sm:flex-row gap-2 border-t border-border-default pt-3">
                      <span className="text-[14px] text-text-secondary min-w-[150px]">Effects</span>
                      <div className="flex flex-wrap gap-2">
                        {visualDNA.graphics?.effects?.map((e: string, i: number) => (
                          <span key={i} className="bg-bg-surface2 text-text-primary px-2 py-1 rounded-md text-[13px] border border-border-hover">{e}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="pb-8">
                  <h3 className="text-[16px] font-semibold mb-3">Print Recommendations</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-[14px] mb-4">
                    <div className="flex justify-between items-center border-b border-border-default pb-2">
                      <span className="text-text-secondary">Best Print Method</span>
                      <span className="text-text-primary font-medium text-right">{visualDNA.pod_technical?.best_print_method}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-border-default pb-2">
                      <span className="text-text-secondary">Scalability</span>
                      <span className="text-text-primary font-medium text-right">{visualDNA.pod_technical?.scalability}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="text-[14px] text-text-secondary block mb-2">Suitable Products</span>
                      <div className="flex flex-wrap gap-2">
                        {visualDNA.pod_technical?.suitable_products?.map((p: string, i: number) => (
                          <span key={i} className="bg-bg-surface2 text-text-primary px-3 py-1.5 rounded-full text-[13px] shadow-sm border border-border-default">{p}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-[14px] text-text-secondary block mb-2">Recommended Garment Colors</span>
                      <div className="flex flex-wrap gap-2">
                        {visualDNA.pod_technical?.recommended_garment_colors?.map((c: any, i: number) => (
                          <div key={i} className="flex items-center gap-2 bg-bg-surface2 px-3 py-1.5 rounded-full shadow-sm border border-border-default">
                            <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: c.hex || c }}></div>
                            <span className="text-[13px] text-text-primary font-medium">{c.name || c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}

            {activeTab === 'buyer' && buyerDNA && (
              <>
                {/* ─── HERO TIER: The key insight ─── */}
                <motion.div variants={itemVariants} className="border-l-2 border-l-accent pl-5">
                  <h3 className="text-[18px] font-bold mb-1">Why It Feels Personal</h3>
                  <p className="text-[13px] text-text-tertiary mb-4">The specific design decisions that create "this was made for me" resonance</p>
                  <div className="flex flex-col gap-3">
                    {buyerDNA.made_for_me_decisions?.map((d: any, i: number) => (
                      <div key={i} className="bg-bg-surface2 p-4 rounded-lg">
                        <h4 className="text-[14px] font-semibold mb-1">{d.decision}</h4>
                        <p className="text-[14px] text-text-secondary italic">{d.why_it_works}</p>
                        {d.what_would_break && (
                          <p className="text-[12px] text-text-tertiary mt-2">
                            ⚠️ What breaks if you change it: {d.what_would_break}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* ─── PRIMARY TIER: Core buyer understanding ─── */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-[16px] font-semibold mb-3">Who Buys This</h3>
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[14px]">
                      <div className="bg-bg-surface2 p-3 rounded-lg border border-border-default">
                        <span className="text-text-secondary text-[12px] block mb-1">Age</span>
                        <span className="font-medium text-text-primary">{buyerDNA.persona?.age_range}</span>
                      </div>
                      <div className="bg-bg-surface2 p-3 rounded-lg border border-border-default">
                        <span className="text-text-secondary text-[12px] block mb-1">Gender</span>
                        <span className="font-medium text-text-primary">{buyerDNA.persona?.gender_lean}</span>
                      </div>
                      <div className="bg-bg-surface2 p-3 rounded-lg border border-border-default">
                        <span className="text-text-secondary text-[12px] block mb-1">Lifestyle</span>
                        <span className="font-medium text-text-primary leading-tight">{buyerDNA.persona?.lifestyle}</span>
                      </div>
                      <div className="bg-bg-surface2 p-3 rounded-lg border border-border-default">
                        <span className="text-text-secondary text-[12px] block mb-1">Spending</span>
                        <span className="font-medium text-text-primary leading-tight">{buyerDNA.persona?.spending_mindset}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-3">
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 pb-3 border-b border-border-default">
                        <span className="text-[14px] text-text-secondary min-w-[120px]">Interests</span>
                        <div className="flex flex-wrap gap-2">
                          {buyerDNA.persona?.interests?.map((t: string, i: number) => <span key={i} className="bg-bg-surface2 px-2 py-1 rounded-md text-[13px] border border-border-hover">{t}</span>)}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 pb-3 border-b border-border-default">
                        <span className="text-[14px] text-text-secondary min-w-[120px]">Values</span>
                        <div className="flex flex-wrap gap-2">
                          {buyerDNA.persona?.values?.map((t: string, i: number) => <span key={i} className="bg-bg-surface2 px-2 py-1 rounded-md text-[13px] border border-border-hover">{t}</span>)}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 pb-1">
                        <span className="text-[14px] text-text-secondary min-w-[120px]">Communities</span>
                        <div className="flex flex-wrap gap-2">
                          {buyerDNA.persona?.online_communities?.map((t: string, i: number) => <span key={i} className="bg-bg-surface2 px-2 py-1 rounded-md text-[13px] border border-border-hover">{t}</span>)}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <h3 className="text-[16px] font-semibold mb-3">Why People Buy This</h3>
                  <div className="flex flex-col gap-3">
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

                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 pt-2 pb-3 border-b border-border-default">
                      <span className="text-[14px] text-text-secondary min-w-[150px]">Secondary Emotions</span>
                      <div className="flex flex-wrap gap-2">
                        {buyerDNA.emotional_triggers?.secondary_emotions?.map((t: string, i: number) => <span key={i} className="bg-bg-surface2 text-text-primary px-2 py-1 rounded-md text-[13px] border border-border-hover">{t}</span>)}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between py-1">
                      <span className="text-[14px] text-text-secondary">Emotional Arc</span>
                      <span className="text-[14px] font-medium text-text-primary">{buyerDNA.emotional_triggers?.emotional_arc}</span>
                    </div>
                  </div>
                </motion.div>

                {/* ─── SUPPORTING TIER: Context & details ─── */}
                <motion.div variants={itemVariants} className="border-t border-border-default pt-8">
                  <h3 className="text-[16px] font-semibold mb-3">What This Design Communicates</h3>
                  <div className="flex flex-col gap-3 text-[14px]">
                    <div className="bg-bg-surface2 p-3 rounded-lg border border-border-default">
                      <span className="text-text-secondary text-[12px] block mb-1">Primary Signal</span>
                      <span className="font-medium text-text-primary leading-tight">{buyerDNA.identity_signals?.primary}</span>
                    </div>
                    <div className="bg-bg-surface2 p-3 rounded-lg border border-border-default">
                      <span className="text-text-secondary text-[12px] block mb-1">Message to World</span>
                      <span className="font-medium text-text-primary italic leading-tight">"{buyerDNA.identity_signals?.message_to_world}"</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-bg-surface2 p-3 rounded-lg border border-border-default">
                        <span className="text-text-secondary text-[12px] block mb-1">Tribe</span>
                        <span className="font-medium text-text-primary">{buyerDNA.identity_signals?.tribe}</span>
                      </div>
                      <div className="bg-bg-surface2 p-3 rounded-lg border border-border-default">
                        <span className="text-text-secondary text-[12px] block mb-1">Aesthetic Identity</span>
                        <span className="font-medium text-text-primary">{buyerDNA.identity_signals?.aesthetic_identity}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="pb-8">
                  <h3 className="text-[16px] font-semibold mb-3">When & Where It Sells</h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 pb-3 border-b border-border-default">
                      <span className="text-[14px] text-text-secondary min-w-[120px]">Best Seasons</span>
                      <div className="flex flex-wrap gap-2">
                        {buyerDNA.occasion_timing?.best_seasons?.map((t: string, i: number) => <span key={i} className="bg-bg-surface2 text-text-primary px-2 py-1 rounded-md text-[13px] border border-border-hover">{t}</span>)}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 pb-3 border-b border-border-default">
                      <span className="text-[14px] text-text-secondary min-w-[120px]">Events</span>
                      <div className="flex flex-wrap gap-2">
                        {buyerDNA.occasion_timing?.events?.map((t: string, i: number) => <span key={i} className="bg-bg-surface2 text-text-primary px-2 py-1 rounded-md text-[13px] border border-border-hover">{t}</span>)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[14px] pt-2">
                      <div className="bg-bg-surface2 p-3 rounded-lg border border-border-default">
                        <span className="text-text-secondary text-[12px] block mb-1">Wear Context</span>
                        <span className="font-medium text-text-primary">{buyerDNA.occasion_timing?.wear_context}</span>
                      </div>
                      <div className="bg-bg-surface2 p-3 rounded-lg border border-border-default">
                        <span className="text-text-secondary text-[12px] block mb-1">Mood Triggers</span>
                        <span className="font-medium text-text-primary">{buyerDNA.occasion_timing?.mood_triggers}</span>
                      </div>
                      <div className="bg-bg-surface2 p-3 rounded-lg border border-border-default">
                        <span className="text-text-secondary text-[12px] block mb-1">Gift Score</span>
                        <span className="font-medium text-text-primary">{buyerDNA.occasion_timing?.gift_potential?.score}/10</span>
                      </div>
                      <div className="bg-bg-surface2 p-3 rounded-lg border border-border-default">
                        <span className="text-text-secondary text-[12px] block mb-1">Longevity</span>
                        <span className="font-medium text-text-primary">{buyerDNA.occasion_timing?.evergreen_vs_viral}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}

            <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-border-default">
              <button
                onClick={() => { setInitialGenMode('same_buyer'); onNavigate('generation'); }}
                className="px-5 py-3 rounded-lg ai-gradient text-white text-[14px] font-medium hover:opacity-90 transition-opacity text-left focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
              >
                Create Similar Design
                <p className="text-[12px] text-white/70 font-normal mt-0.5">Same audience, fresh design</p>
              </button>
              <button
                onClick={() => { setInitialGenMode('new_buyer'); onNavigate('generation'); }}
                className="px-5 py-3 rounded-lg border border-border-default text-[14px] font-medium hover:bg-bg-surface2 transition-colors text-left focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
              >
                Remix for Different Audience
                <p className="text-[12px] text-text-tertiary font-normal mt-0.5">Keep the style, target new buyers</p>
              </button>
              <button
                onClick={() => onNavigate('upload')}
                className="px-5 py-2 rounded-lg text-text-secondary hover:text-text-primary text-[14px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
              >
                Analyze Another Design
              </button>
              <button
                onClick={handleCopyDNA}
                className="px-5 py-2 rounded-lg text-text-secondary hover:text-text-primary text-[14px] font-medium transition-colors flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
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
