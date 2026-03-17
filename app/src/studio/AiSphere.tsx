import './AiSphere.css';

/**
 * AI Sphere — A premium, animated glowing orb loading indicator.
 * Pure CSS gradient sphere with rotating inner mesh and pulsing glow.
 */
export default function AiSphere({ size = 80 }: { size?: number }) {
    return (
        <div
            className="ai-sphere"
            style={{ width: size, height: size }}
        >
            {/* Core orb */}
            <div className="ai-sphere__core" />
            {/* Rotating ring */}
            <div className="ai-sphere__ring" />
            {/* Outer glow pulse */}
            <div className="ai-sphere__glow" />
        </div>
    );
}
