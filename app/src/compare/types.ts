// ── Compare Types ──────────────────────────────────────────────────
// Shared types for the Compare screen flow.
// Mirrors the stage-machine pattern from studio/types.ts.

/** Current step in the compare flow */
export type Step = 'upload' | 'analyzing' | 'results';

/** Image uploaded for comparison */
export interface CompareImage {
    data: string;
    name: string;
    type: string;
}

/** Error during comparison analysis */
export interface CompareError {
    type: string;
    message: string;
}
