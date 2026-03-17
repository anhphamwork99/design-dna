/**
 * Thin HTTP client for calling backend AI proxy routes.
 * Replaces direct Gemini SDK calls — all prompts live server-side.
 */

import type { SynthesizedConcept, SynthesizeInput, GenerateArtworkInput, CloneDesignInput } from './api';

// ── Config ─────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

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
