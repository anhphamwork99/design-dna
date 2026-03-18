import mascotGif from '../assets/mascot-loading.gif';

/**
 * MascotLoader — Cute chibi Leonardo da Vinci mascot loading indicator.
 * Replaces AiSphere with a fun, branded GIF.
 * Uses only width to preserve natural aspect ratio (no distortion).
 */
export default function MascotLoader({ size = 120 }: { size?: number }) {
    return (
        <img
            src={mascotGif}
            alt="AI is working..."
            style={{ width: size, height: 'auto', objectFit: 'contain' }}
            className="rounded-2xl"
        />
    );
}
