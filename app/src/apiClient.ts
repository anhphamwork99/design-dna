/**
 * Thin HTTP client for calling backend AI proxy routes.
 * Replaces direct Gemini SDK calls — all prompts live server-side.
 */

import type { SynthesizedConcept, SynthesizeInput, GenerateArtworkInput, CloneDesignInput } from './api';

// ── Config ─────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// ── Auth Fetch Helper ──────────────────────────────────────────────

async function authFetch<T = any>(path: string, body: any, token: string): Promise<T> {
    const res = await fetch(`${API_BASE}/api/ai${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ code: 'UNKNOWN', message: 'Request failed' }));
        throw new Error(err.message || `HTTP ${res.status}`);
    }

    return res.json();
}

// ── API Functions ──────────────────────────────────────────────────

/**
 * Analyze a single design image — deep visual + buyer DNA.
 */
export async function analyzeDesign(
    token: string,
    imageData: string,
    mimeType: string,
) {
    return authFetch('/analyze', { imageData, mimeType }, token);
}

/**
 * Compare 2-5 design images — batch pattern analysis.
 */
export async function analyzeBatch(
    token: string,
    images: { data: string; name: string; type: string }[],
) {
    return authFetch('/compare', { images }, token);
}

/**
 * Generate 3 design concepts from DNA + user shifts.
 */
export async function synthesizeConcept(
    token: string,
    input: SynthesizeInput,
): Promise<SynthesizedConcept[]> {
    return authFetch<SynthesizedConcept[]>('/synthesize', input, token);
}

/**
 * Two-pass artwork generation: illustration → text decoration.
 * Returns { imageDataUrl: string }.
 */
export async function generateArtwork(
    token: string,
    input: Omit<GenerateArtworkInput, 'onProgress'>,
): Promise<string> {
    const result = await authFetch<{ imageDataUrl: string }>('/generate', input, token);
    return result.imageDataUrl;
}

/**
 * Clone/extract design from product surface — subtle mode.
 * Returns { imageDataUrl: string }.
 */
export async function cloneDesign(
    token: string,
    input: Omit<CloneDesignInput, 'onProgress'>,
): Promise<string> {
    const result = await authFetch<{ imageDataUrl: string }>('/clone', input, token);
    return result.imageDataUrl;
}

/**
 * Buyer fit scoring — evaluates how well concept matches target buyer.
 */
export async function analyzeBuyerFit(
    token: string,
    conceptText: string,
): Promise<any> {
    return authFetch('/buyer-fit', { conceptText }, token);
}
