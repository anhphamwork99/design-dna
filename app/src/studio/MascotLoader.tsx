import mascotGif from '../assets/mascot-loading.gif';

/**
 * MascotLoader — Cute chibi Leonardo da Vinci mascot loading indicator.
 * Replaces AiSphere with a fun, branded GIF.
 */
export default function MascotLoader({ size = 120 }: { size?: number }) {
    return (
        <img
            src={mascotGif}
            alt="AI is working..."
            width={size}
            height={size}
            className="rounded-2xl"
            style={{ objectFit: 'contain' }}
        />
    );
}
