import { motion, AnimatePresence } from 'motion/react';
import { Copy, Download, RefreshCw, RotateCcw } from 'lucide-react';
import AiSphere from './AiSphere';

interface CloneStudioProps {
    stage: 'studio' | 'cloning' | 'clone-result';
    uploadedImage: { data: string; name: string; type: string };
    analysisResult: any;
    clonedImage: string | null;
    error: string | null;
    aspectRatio: string;
    onAspectRatioChange: (ratio: string) => void;
    onClone: () => void;
    onReClone: () => void;
    onDownload: () => void;
    onStartOver: () => void;
}

const ASPECT_RATIOS = ['1:1', '4:5', '3:4', '4:3', '16:9', '9:16'];

// ── Clone Preview ───────────────────────────────────────────────────

function ClonePreview({
    uploadedImage,
    aspectRatio,
    onAspectRatioChange,
    onClone,
    error,
}: Pick<
    CloneStudioProps,
    'uploadedImage' | 'aspectRatio' | 'onAspectRatioChange' | 'onClone' | 'error'
>) {
    return (
        <div
            className="flex gap-8 items-center justify-center min-h-screen py-12 px-6"
        >
            {/* Left — original image */}
            <div className="flex flex-col items-center gap-3 max-w-[480px] flex-1">
                <p className="text-[12px] font-medium text-text-tertiary uppercase tracking-wider">
                    Original
                </p>
                <img
                    src={uploadedImage.data}
                    alt={uploadedImage.name}
                    className="w-full rounded-2xl border border-border-default shadow-sm object-contain max-h-[60vh]"
                />
                <p className="text-[12px] text-text-tertiary truncate max-w-[240px]">
                    {uploadedImage.name}
                </p>
            </div>

            {/* Right — config sidebar */}
            <div className="w-[260px] flex-shrink-0 flex flex-col gap-6 pt-6">
                {/* Aspect ratio picker */}
                <div>
                    <p className="text-[13px] font-medium text-text-primary mb-3">Aspect Ratio</p>
                    <div className="grid grid-cols-3 gap-2">
                        {ASPECT_RATIOS.map((ratio) => (
                            <button
                                key={ratio}
                                onClick={() => onAspectRatioChange(ratio)}
                                className={`px-3 py-2 rounded-lg text-[13px] font-medium border transition-all ${aspectRatio === ratio
                                    ? 'bg-text-primary text-white border-text-primary'
                                    : 'bg-bg-surface1 text-text-secondary border-border-default hover:border-border-hover'
                                    }`}
                            >
                                {ratio}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Error display */}
                {error && (
                    <motion.div
                        className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[13px] text-red-700"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {error}
                    </motion.div>
                )}

                {/* CTA */}
                <motion.button
                    className="w-full py-3.5 rounded-xl text-[15px] font-semibold text-white transition-all"
                    style={{
                        background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))',
                    }}
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClone}
                >
                    <Copy className="w-4 h-4 mr-1.5 inline" /> Clone This Design
                </motion.button>

                <p className="text-[11px] text-text-tertiary text-center leading-relaxed">
                    AI will extract and recreate this design on a clean canvas with
                    the selected aspect ratio.
                </p>
            </div>
        </div>
    );
}

// ── Cloning Loading ─────────────────────────────────────────────────

function CloningLoader({ image }: { image: { data: string; name: string } }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6">
            {/* Title */}
            <h2 className="text-[22px] font-semibold text-text-primary mb-10 tracking-tight">
                Extracting &amp; recreating design
            </h2>

            {/* AI Sphere */}
            <div className="mb-10">
                <AiSphere size={100} />
            </div>

            {/* Image indicator */}
            <div className="flex items-center gap-3 bg-bg-surface1 border border-border-default rounded-xl px-4 py-3">
                <img
                    src={image.data}
                    alt={image.name}
                    className="w-10 h-10 rounded-lg object-cover border border-border-default"
                />
                <span className="text-[13px] text-text-secondary max-w-[180px] truncate">
                    {image.name}
                </span>
            </div>
        </div>
    );
}

// ── Clone Result ────────────────────────────────────────────────────

function CloneResult({
    uploadedImage,
    clonedImage,
    onReClone,
    onDownload,
    onStartOver,
}: Pick<CloneStudioProps, 'uploadedImage' | 'clonedImage' | 'onReClone' | 'onDownload' | 'onStartOver'>) {
    return (
        <motion.div
            className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] py-10 px-6 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Side-by-side images */}
            <div className="flex gap-8 items-start max-w-[960px] w-full">
                {/* Original */}
                <motion.div
                    className="flex-1 flex flex-col items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <p className="text-[12px] font-medium text-text-tertiary uppercase tracking-wider">
                        Original
                    </p>
                    <img
                        src={uploadedImage.data}
                        alt="Original"
                        className="w-full rounded-2xl border border-border-default shadow-sm object-contain max-h-[55vh]"
                    />
                </motion.div>

                {/* Clone */}
                <motion.div
                    className="flex-1 flex flex-col items-center gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <p className="text-[12px] font-medium text-text-tertiary uppercase tracking-wider">
                        Clone
                    </p>
                    {clonedImage ? (
                        <img
                            src={clonedImage}
                            alt="Clone"
                            className="w-full rounded-2xl border border-border-default shadow-sm object-contain max-h-[55vh]"
                        />
                    ) : (
                        <div className="w-full aspect-square rounded-2xl border border-border-default bg-bg-surface1 flex items-center justify-center text-text-tertiary text-[14px]">
                            No result
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Action buttons */}
            <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
            >
                <button
                    onClick={onDownload}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-text-primary text-white text-[13px] font-medium hover:opacity-90 transition-opacity"
                >
                    <Download className="w-4 h-4" />
                    Download
                </button>
                <button
                    onClick={onReClone}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bg-surface1 border border-border-default text-text-primary text-[13px] font-medium hover:border-border-hover transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Re-clone
                </button>
                <button
                    onClick={onStartOver}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bg-surface1 border border-border-default text-text-secondary text-[13px] font-medium hover:border-border-hover transition-colors"
                >
                    <RotateCcw className="w-4 h-4" />
                    Start Over
                </button>
            </motion.div>
        </motion.div>
    );
}

// ── Main Component ──────────────────────────────────────────────────

export default function CloneStudio(props: CloneStudioProps) {
    const { stage } = props;

    return (
        <AnimatePresence mode="wait">
            {stage === 'studio' && (
                <ClonePreview
                    key="preview"
                    uploadedImage={props.uploadedImage}
                    aspectRatio={props.aspectRatio}
                    onAspectRatioChange={props.onAspectRatioChange}
                    onClone={props.onClone}
                    error={props.error}
                />
            )}
            {stage === 'cloning' && (
                <CloningLoader key="cloning" image={props.uploadedImage} />
            )}
            {stage === 'clone-result' && (
                <CloneResult
                    key="result"
                    uploadedImage={props.uploadedImage}
                    clonedImage={props.clonedImage}
                    onReClone={props.onReClone}
                    onDownload={props.onDownload}
                    onStartOver={props.onStartOver}
                />
            )}
        </AnimatePresence>
    );
}
