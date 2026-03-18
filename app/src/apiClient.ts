/**
 * Thin HTTP client for calling backend AI proxy routes.
 * Replaces direct Gemini SDK calls — all prompts live server-side.
 */

import type { SynthesizedConcept, SynthesizeInput, GenerateArtworkInput, CloneDesignInput } from './api';

// ── Config ─────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL ?? '';

// ── Core Fetch Helper ──────────────────────────────────────────────

async function coreFetch<T = any>(
    path: string,
    options: { method?: string; body?: any; token?: string } = {}
): Promise<T> {
    const headers: Record<string, string> = {};
    if (options.body) {
        headers['Content-Type'] = 'application/json';
    }
    if (options.token) {
        headers['Authorization'] = `Bearer ${options.token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
        method: options.method || 'POST',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ code: 'UNKNOWN', message: 'Request failed' }));
        throw new Error(err.message || `HTTP ${res.status}`);
    }

    return res.json();
}

async function authFetch<T = any>(path: string, body: any, token: string): Promise<T> {
    return coreFetch<T>(`/api/ai${path}`, { body, token, method: 'POST' });
}

// ── Analyses CRUD ──────────────────────────────────────────────────

export async function saveAnalysis(token: string, data: { name: string; thumbnail: string; resultJson: any }) {
    return coreFetch('/api/analyses', { method: 'POST', body: data, token });
}

export async function listAnalyses(token: string, limit?: number, offset?: number) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return coreFetch(`/api/analyses${query}`, { method: 'GET', token });
}

export async function getAnalysis(token: string, id: string) {
    return coreFetch(`/api/analyses/${id}`, { method: 'GET', token });
}

export async function deleteAnalysis(token: string, id: string) {
    return coreFetch(`/api/analyses/${id}`, { method: 'DELETE', token });
}

// ── Patterns CRUD ──────────────────────────────────────────────

/** Pattern as returned by the server (snake_case from DB). */
export interface SavedPattern {
    id: string;
    name: string;
    summary: string;
    source_image_count: number;
    thumbnails: string[];
    batch_analysis?: any;
    created_at: string;
}

/** List all user patterns (excludes batch_analysis for perf). */
export async function listPatterns(token: string): Promise<SavedPattern[]> {
    return coreFetch<SavedPattern[]>('/api/patterns', { method: 'GET', token });
}

/** Get a single pattern with full batch_analysis. */
export async function getPatternById(token: string, id: string): Promise<SavedPattern> {
    return coreFetch<SavedPattern>(`/api/patterns/${id}`, { method: 'GET', token });
}

/** Save a new pattern. Returns { id, name, created_at }. */
export async function savePattern(
    token: string,
    data: {
        name: string;
        summary: string;
        sourceImageCount: number;
        thumbnails: string[];
        batchAnalysis: any;
    },
): Promise<{ id: string; name: string; created_at: string }> {
    return coreFetch('/api/patterns', { method: 'POST', body: data, token });
}

/** Delete a pattern by ID. */
export async function deletePatternById(token: string, id: string): Promise<{ success: boolean }> {
    return coreFetch<{ success: boolean }>(`/api/patterns/${id}`, { method: 'DELETE', token });
}

/** Check if a pattern with the given summary already exists. */
export async function checkPatternSaved(token: string, summary: string): Promise<boolean> {
    if (!summary || summary === 'No summary') return false;
    const patterns = await listPatterns(token);
    return patterns.some(p => p.summary === summary);
}

// ── Thumbnail Helpers ──────────────────────────────────────────

/** Resize a data URI to a thumbnail (default 400px max, JPEG 0.85 quality). */
export function resizeToThumbnail(dataUri: string, maxSize = 400): Promise<string> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let w = img.width;
            let h = img.height;

            if (w > h) {
                if (w > maxSize) { h = Math.round(h * maxSize / w); w = maxSize; }
            } else {
                if (h > maxSize) { w = Math.round(w * maxSize / h); h = maxSize; }
            }

            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d')!;
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, w, h);

            resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.onerror = () => resolve(dataUri);
        img.src = dataUri;
    });
}

// ── AI Functions ──────────────────────────────────────────────────


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
