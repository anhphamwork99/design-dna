import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Target, Palette, Shuffle, Info, Send, Download, AlertCircle } from 'lucide-react';
import { generateDesignImage, analyzeBuyerFit } from './api';

type GenerationMode = 'same_buyer' | 'new_buyer' | 'full_remix';
type SpecificityLevel = 'general' | 'niche' | 'hyper_niche';

interface GenerationScreenProps {
  key?: string;
  analysisResult: any;
  onNavigate: (screen: any) => void;
  prefilledBrief?: string;
  initialGenMode?: string;
}

export default function GenerationScreen({ analysisResult, onNavigate, prefilledBrief, initialGenMode }: GenerationScreenProps) {
  const [mode, setMode] = useState<GenerationMode>(
    prefilledBrief ? 'full_remix'
      : (initialGenMode === 'new_buyer' ? 'new_buyer'
        : initialGenMode === 'full_remix' ? 'full_remix'
          : 'same_buyer')
  );
  const [creativity, setCreativity] = useState<number>(2);
  const [specificity, setSpecificity] = useState<SpecificityLevel>('niche');

  const [shifts, setShifts] = useState({
    S: { keep: false, value: prefilledBrief || '' },
    H: { keep: false, value: '' },
    I: { keep: prefilledBrief ? false : true, value: '' },
    F: { keep: false, value: '' },
    T: { keep: false, value: '' },
    B: { keep: prefilledBrief ? false : true, value: '' },
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [buyerFitScores, setBuyerFitScores] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const isFirstMount = useRef(true);
  const prevPrefilledBrief = useRef(prefilledBrief);

  useEffect(() => {
    if (prefilledBrief !== prevPrefilledBrief.current) {
      prevPrefilledBrief.current = prefilledBrief;
      setMode('full_remix');
      setShifts({
        S: { keep: false, value: prefilledBrief || '' },
        H: { keep: false, value: '' },
        I: { keep: false, value: '' },
        F: { keep: false, value: '' },
        T: { keep: false, value: '' },
        B: { keep: false, value: '' },
      });
      return;
    }

    if (isFirstMount.current && prefilledBrief) {
      isFirstMount.current = false;
      return;
    }
    isFirstMount.current = false;

    if (mode === 'same_buyer') {
      setShifts({
        S: { keep: false, value: '' },
        H: { keep: false, value: '' },
        I: { keep: true, value: '' },
        F: { keep: false, value: '' },
        T: { keep: false, value: '' },
        B: { keep: true, value: '' },
      });
    } else if (mode === 'new_buyer') {
      setShifts({
        S: { keep: false, value: '' },
        H: { keep: true, value: '' },
        I: { keep: false, value: '' },
        F: { keep: true, value: '' },
        T: { keep: false, value: '' },
        B: { keep: false, value: '' },
      });
    } else {
      setShifts({
        S: { keep: false, value: '' },
        H: { keep: false, value: '' },
        I: { keep: false, value: '' },
        F: { keep: false, value: '' },
        T: { keep: false, value: '' },
        B: { keep: false, value: '' },
      });
    }
  }, [mode, prefilledBrief]);

  const creativityLabels: Record<number, string> = {
    1: "Closely follows the original DNA",
    2: "Keeps themes, reinterprets freely",
    3: "Recognizable roots, new direction",
    4: "Loose inspiration only",
    5: "Completely new, emotional core only"
  };

  const constructPrompt = (chatMessage?: string) => {
    let prompt = "Generate a new design based on these specifications. Provide exactly ONE image.\n\n";

    prompt += "Visual Direction:\n";
    if (shifts.S.keep) prompt += `- Subject: Use original DNA (${analysisResult?.visual_dna?.graphics?.primary_element || 'N/A'})\n`;
    else prompt += `- Subject: ${shifts.S.value || 'New subject'}\n`;

    if (shifts.H.keep) prompt += `- Harmony: Use original DNA (${analysisResult?.visual_dna?.color?.harmony || 'N/A'})\n`;
    else prompt += `- Harmony: ${shifts.H.value || 'New harmony'}\n`;

    if (shifts.F.keep) prompt += `- Form: Use original DNA (${analysisResult?.visual_dna?.graphics?.style || 'N/A'})\n`;
    else prompt += `- Form: ${shifts.F.value || 'New form'}\n`;

    if (shifts.T.keep) prompt += `- Text: Use original DNA (Typography: ${analysisResult?.visual_dna?.typography?.fonts?.[0]?.classification || 'N/A'})\n`;
    else prompt += `- Text: ${shifts.T.value || 'New text'}\n`;

    prompt += "\nBuyer Targeting:\n";
    if (shifts.I.keep) prompt += `- Target Buyer: Use original persona (${analysisResult?.buyer_dna?.persona?.age_range || 'N/A'}, ${analysisResult?.buyer_dna?.identity_signals?.tribe || 'N/A'})\n`;
    else prompt += `- Target Buyer: ${shifts.I.value || 'New target buyer'}\n`;

    if (shifts.B.keep) prompt += `- Emotional Trigger: Use original (${analysisResult?.buyer_dna?.emotional_triggers?.primary_emotion || 'N/A'})\n`;
    else prompt += `- Emotional Trigger: ${shifts.B.value || 'New emotional trigger'}\n`;

    prompt += `\nSpecificity: Enforce a ${specificity} context.\n`;
    prompt += `Creativity Level: ${creativity}/5 (${creativityLabels[creativity]}).\n`;

    if (chatHistory.length > 0 || chatMessage) {
      prompt += "\nChat History:\n";
      chatHistory.forEach((msg) => {
        prompt += `User: ${msg}\n`;
      });
      if (chatMessage) {
        prompt += `User: ${chatMessage}\n`;
        prompt += `\nRefine the design with this change: ${chatMessage}\n`;
      }
    }

    return prompt;
  };

  const handleGenerate = async () => {
    const apiKey = localStorage.getItem('designdna_api_key');
    if (!apiKey) {
      window.dispatchEvent(new CustomEvent('open-settings'));
      return;
    }

    setIsGenerating(true);
    setShowResult(false);
    setError(null);
    setChatHistory([]);

    try {
      const prompt = constructPrompt();
      const imageBase64 = await generateDesignImage(apiKey, prompt);
      setGeneratedImage(imageBase64);

      const fitScores = await analyzeBuyerFit(apiKey, prompt);
      setBuyerFitScores(fitScores);

      setShowResult(true);
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message || "An unexpected error occurred.";
      if (errMsg.includes('403') || errMsg.includes('API key not valid')) {
        errMsg = "Invalid API Key. Please check your settings.";
      }
      setError(errMsg);
      setShowResult(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || isChatting) return;

    const apiKey = localStorage.getItem('designdna_api_key');
    if (!apiKey) {
      window.dispatchEvent(new CustomEvent('open-settings'));
      return;
    }

    const newMessage = chatInput.trim();
    setChatInput('');
    setIsChatting(true);
    setError(null);

    try {
      const prompt = constructPrompt(newMessage);
      const imageBase64 = await generateDesignImage(apiKey, prompt);
      setGeneratedImage(imageBase64);

      const fitScores = await analyzeBuyerFit(apiKey, prompt);
      setBuyerFitScores(fitScores);

      setChatHistory(prev => [...prev, newMessage]);
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message || "An unexpected error occurred.";
      if (errMsg.includes('403') || errMsg.includes('API key not valid')) {
        errMsg = "Invalid API Key. Please check your settings.";
      }
      setError(errMsg);
    } finally {
      setIsChatting(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = 'designdna-generation.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const primaryElement = analysisResult?.visual_dna?.graphics?.primary_element || 'Design';
  const tribe = analysisResult?.buyer_dna?.identity_signals?.tribe || 'Audience';

  const specificityLabels: Record<SpecificityLevel, string> = {
    general: "Reaches the widest audience",
    niche: "Targets a specific interest group",
    hyper_niche: "Laser-focused on a micro-community"
  };

  const shiftConfig = [
    { key: 'S', name: 'Visual Style', placeholder: "e.g., Campfire scene instead of mountains" },
    { key: 'H', name: 'Colors', placeholder: "e.g., Cool blues and teals" },
    { key: 'I', name: 'Graphics & Characters', placeholder: "e.g., Target yoga enthusiasts" },
    { key: 'F', name: 'Typography', placeholder: "e.g., Watercolor style" },
    { key: 'T', name: 'Theme & Mood', placeholder: "e.g., 'Find Your Peace'" },
    { key: 'B', name: 'Target Audience', placeholder: "e.g., Calm & serenity instead of adventure" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="pt-20 pb-24 px-6 max-w-[800px] mx-auto w-full"
    >
      <button
        onClick={() => onNavigate(prefilledBrief ? 'compare_results' : 'results')}
        className="flex items-center text-text-secondary hover:text-text-primary text-[14px] font-medium mb-6 transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:rounded"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {prefilledBrief ? 'Back to Winning Formula' : 'Back to DNA Card'}
      </button>

      <div className="mb-8">
        <h1 className="text-[32px] font-bold tracking-tight mb-2">Generate New Design</h1>
        <p className="text-text-secondary text-[14px]">
          Based on: <span className="text-text-primary font-medium">{primaryElement}</span> for <span className="text-text-primary font-medium">{tribe}</span>
        </p>
      </div>

      <div className="space-y-8">
        {/* Mode Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setMode('same_buyer')}
            className={`p-4 rounded-xl border text-left transition-all focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base ${mode === 'same_buyer' ? 'border-accent bg-accent/10' : 'border-border-default bg-bg-surface1 hover:border-border-hover'}`}
          >
            <Target className={`w-6 h-6 mb-3 ${mode === 'same_buyer' ? 'text-accent' : 'text-text-secondary'}`} />
            <div className="font-semibold text-[14px] mb-1">Same Buyer, New Design</div>
            <div className="text-[12px] text-text-secondary">Keep the buyer, change the look</div>
          </button>
          <button
            onClick={() => setMode('new_buyer')}
            className={`p-4 rounded-xl border text-left transition-all focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base ${mode === 'new_buyer' ? 'border-accent bg-accent/10' : 'border-border-default bg-bg-surface1 hover:border-border-hover'}`}
          >
            <Palette className={`w-6 h-6 mb-3 ${mode === 'new_buyer' ? 'text-accent' : 'text-text-secondary'}`} />
            <div className="font-semibold text-[14px] mb-1">New Buyer, Same Style</div>
            <div className="text-[12px] text-text-secondary">Keep the style, target someone new</div>
          </button>
          <button
            onClick={() => setMode('full_remix')}
            className={`p-4 rounded-xl border text-left transition-all focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base ${mode === 'full_remix' ? 'border-accent bg-accent/10' : 'border-border-default bg-bg-surface1 hover:border-border-hover'}`}
          >
            <Shuffle className={`w-6 h-6 mb-3 ${mode === 'full_remix' ? 'text-accent' : 'text-text-secondary'}`} />
            <div className="font-semibold text-[14px] mb-1">Full Remix</div>
            <div className="text-[12px] text-text-secondary">Remix everything</div>
          </button>
        </div>

        {/* Creativity Level */}
        <div className="bg-bg-surface1 p-6 rounded-xl border border-border-default">
          <div className="font-semibold text-[14px] mb-1">How Different?</div>
          <div className="text-[12px] text-text-secondary mb-6">From subtle tweaks to radical redesign</div>
          <div className="px-2">
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={creativity}
              onChange={(e) => setCreativity(parseInt(e.target.value))}
              className="w-full accent-accent h-1.5 bg-bg-surface2 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-text-secondary mt-3 font-medium">
              <span>1: Faithful</span>
              <span>2: Inspired</span>
              <span>3: Remixed</span>
              <span>4: Original</span>
              <span>5: Radical</span>
            </div>
            <div className="text-[13px] text-text-primary mt-4 text-center bg-bg-surface2 py-2 rounded-lg">
              {creativityLabels[creativity]}
            </div>
          </div>
        </div>

        {/* SHIFT+B Controls */}
        <div className="bg-bg-surface1 p-6 rounded-xl border border-border-default">
          <div className="flex items-center gap-2 mb-6">
            <div className="font-semibold text-[14px]">Design Controls</div>
            <Info className="w-4 h-4 text-text-secondary" />
          </div>

          <div className="space-y-4">
            {shiftConfig.map((dim) => {
              const state = shifts[dim.key as keyof typeof shifts];
              return (
                <div key={dim.key} className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 rounded-lg bg-bg-surface2/50 border border-border-default/50">
                  <div className="flex items-center gap-3 w-40 shrink-0">
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white text-[12px] font-bold">
                      {dim.key}
                    </div>
                    <span className="text-[14px] font-medium">{dim.name}</span>
                  </div>

                  <div className="flex items-center shrink-0 bg-bg-surface2 p-1 rounded-full border border-border-default">
                    <button
                      onClick={() => setShifts(s => ({ ...s, [dim.key]: { ...s[dim.key as keyof typeof shifts], keep: true } }))}
                      className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-accent ${state.keep ? 'bg-bg-surface1 text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                    >
                      Keep original
                    </button>
                    <button
                      onClick={() => setShifts(s => ({ ...s, [dim.key]: { ...s[dim.key as keyof typeof shifts], keep: false } }))}
                      className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-accent ${!state.keep ? 'bg-accent text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                    >
                      Change this
                    </button>
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    {!state.keep && (
                      <input
                        type="text"
                        placeholder={dim.placeholder}
                        value={state.value}
                        onChange={(e) => setShifts(s => ({ ...s, [dim.key]: { ...s[dim.key as keyof typeof shifts], value: e.target.value } }))}
                        className="w-full bg-bg-surface1 border border-border-default rounded-lg px-3 py-2 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Specificity Level */}
        <div className="bg-bg-surface1 p-6 rounded-xl border border-border-default">
          <div className="font-semibold text-[14px] mb-1">Audience Focus</div>
          <div className="text-[12px] text-text-secondary mb-4">How niche should the target be?</div>
          <div className="flex flex-wrap gap-2 mb-3">
            {(['general', 'niche', 'hyper_niche'] as SpecificityLevel[]).map((level) => {
              const levelName = level === 'general' ? 'Broad Appeal' : level === 'niche' ? 'Focused' : 'Ultra-Specific';
              return (
                <button
                  key={level}
                  onClick={() => setSpecificity(level)}
                  className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base ${specificity === level ? 'bg-accent/10 border-accent text-accent' : 'bg-bg-surface2 border-border-default text-text-secondary hover:text-text-primary hover:border-border-hover'}`}
                >
                  {levelName}
                </button>
              );
            })}
          </div>
          <div className="text-[13px] text-text-secondary">
            {specificityLabels[specificity]}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-4 rounded-xl ai-gradient text-white font-semibold text-[16px] shadow-lg hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
              Generating...
            </>
          ) : (
            "Generate Design ✨"
          )}
        </button>

        {/* Result Section */}
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-8 border-t border-border-default space-y-6"
          >
            {error ? (
              <div className="bg-error/10 border border-error/20 p-6 rounded-xl text-center">
                <AlertCircle className="w-8 h-8 text-error mx-auto mb-3" />
                <h3 className="text-error font-medium mb-2">Generation Failed</h3>
                <p className="text-text-secondary text-[14px]">{error}</p>
              </div>
            ) : (
              <>
                <div className="w-full rounded-xl border border-border-default overflow-hidden bg-bg-surface1">
                  {generatedImage ? (
                    <img src={generatedImage} alt="Generated Design" className="w-full h-auto object-contain" />
                  ) : (
                    <div className="h-[400px] w-full bg-gradient-to-br from-bg-surface2 to-bg-surface1 flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
                      <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4 backdrop-blur-sm border border-accent/30">
                        <span className="text-2xl">✨</span>
                      </div>
                      <div className="text-text-primary font-medium text-[16px]">Generated design preview</div>
                      <div className="text-text-secondary text-[13px] mt-2">Mock placeholder</div>
                    </div>
                  )}
                </div>

                {buyerFitScores && (
                  <div className="bg-bg-surface2 p-6 rounded-xl border border-border-default">
                    <h3 className="text-[14px] font-semibold mb-4">Buyer Fit Analysis</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-[13px] mb-1.5">
                          <span className="text-text-secondary">Buyer Match</span>
                          <span className="text-text-primary font-medium">{buyerFitScores.buyer_match || 0}%</span>
                        </div>
                        <div className="h-2 w-full bg-bg-surface1 rounded-full overflow-hidden">
                          <div className="h-full bg-success rounded-full transition-all duration-1000" style={{ width: `${buyerFitScores.buyer_match || 0}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[13px] mb-1.5">
                          <span className="text-text-secondary">Emotion Match</span>
                          <span className="text-text-primary font-medium">{buyerFitScores.emotion_match || 0}%</span>
                        </div>
                        <div className="h-2 w-full bg-bg-surface1 rounded-full overflow-hidden">
                          <div className="h-full bg-success rounded-full transition-all duration-1000" style={{ width: `${buyerFitScores.emotion_match || 0}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[13px] mb-1.5">
                          <span className="text-text-secondary">Originality</span>
                          <span className="text-text-primary font-medium">{buyerFitScores.originality || 0}%</span>
                        </div>
                        <div className="h-2 w-full bg-bg-surface1 rounded-full overflow-hidden">
                          <div className="h-full bg-accent rounded-full transition-all duration-1000" style={{ width: `${buyerFitScores.originality || 0}%` }}></div>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-border-default">
                        <div className="flex justify-between text-[13px]">
                          <span className="text-text-secondary">"Made For Me" Signals</span>
                          <span className="text-text-primary font-medium">{buyerFitScores.made_for_me_signal_count || 0}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-bg-surface1 p-4 rounded-xl border border-border-default flex flex-col h-[250px]">
                  <div className="flex-1 overflow-y-auto mb-4 flex flex-col gap-3 pr-2">
                    {chatHistory.length === 0 ? (
                      <div className="flex-1 flex items-end justify-center">
                        <div className="text-center text-text-tertiary text-[12px]">Chat history empty.</div>
                      </div>
                    ) : (
                      chatHistory.map((msg, i) => (
                        <div key={i} className="bg-bg-surface2 p-3 rounded-lg rounded-br-none self-end max-w-[85%] border border-border-default">
                          <p className="text-[13px] text-text-primary">{msg}</p>
                        </div>
                      ))
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleChatSend();
                      }}
                      disabled={isChatting}
                      placeholder="Tell me what to change..."
                      className="w-full bg-bg-surface2 border border-border-default rounded-lg pl-4 pr-12 py-3 text-[14px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all disabled:opacity-50"
                    />
                    <button
                      onClick={handleChatSend}
                      disabled={isChatting || !chatInput.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-accent text-white rounded-md flex items-center justify-center hover:bg-accent-hover transition-colors disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
                    >
                      {isChatting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleDownload}
                    disabled={!generatedImage}
                    className="flex-1 py-3 rounded-lg bg-accent text-white font-medium text-[14px] hover:bg-accent-hover transition-colors flex items-center justify-center disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </button>
                  <button
                    onClick={() => {
                      setShowResult(false);
                      setGeneratedImage(null);
                      setBuyerFitScores(null);
                      setChatHistory([]);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex-1 py-3 rounded-lg bg-bg-surface2 border border-border-default text-text-primary font-medium text-[14px] hover:bg-bg-surface1 transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
                  >
                    Generate Another
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
