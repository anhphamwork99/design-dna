// ── Pattern Storage Utility ─────────────────────────────────────
// DEPRECATED: This module uses localStorage. Use apiClient.ts for all new code.
// Legacy functions retained for Phase 13 migration only.

// DEPRECATED: Use SavedPattern from apiClient.ts for new code
export interface LegacySavedPattern {
    id: string;
    name: string;
    createdAt: string;
    sourceImageCount: number;
    thumbnails: string[];     // resized base64 data URIs (~100x100px)
    summary: string;          // from winning_formula.summary
    batchAnalysis: any;       // full batch_analysis object
}

const STORAGE_KEY = 'designdna_patterns';

// ── DEPRECATED: For Phase 13 migration only ────────────────────

/** @deprecated Use listPatterns() from apiClient.ts */
export function legacyGetPatterns(): LegacySavedPattern[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const patterns: LegacySavedPattern[] = JSON.parse(raw);
        // Sort newest first
        return patterns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch {
        return [];
    }
}

/** @deprecated Use getPattern() from apiClient.ts */
export function legacyGetPattern(id: string): LegacySavedPattern | null {
    const patterns = legacyGetPatterns();
    return patterns.find(p => p.id === id) || null;
}

/** @deprecated Use deletePattern() from apiClient.ts */
export function legacyDeletePattern(id: string): void {
    const patterns = legacyGetPatterns().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patterns));
}

// ── Backward-compat re-exports (Phase 13 will remove) ──────────
// Re-export legacy functions under original names so existing UI
// components keep compiling until Plan 12-03 migrates them.

/** @deprecated Import SavedPattern from apiClient.ts instead */
export type SavedPattern = LegacySavedPattern;

/** @deprecated Use listPatterns() from apiClient.ts */
export const getPatterns = legacyGetPatterns;

/** @deprecated Use getPattern() from apiClient.ts */
export const getPattern = legacyGetPattern;

/** @deprecated Use deletePattern() from apiClient.ts */
export const deletePattern = legacyDeletePattern;

// ── Thumbnail Resize (moved to apiClient.ts as exported) ────────
// Kept here as internal helper for legacy compatibility only.

/** @deprecated Use resizeToThumbnail() from apiClient.ts */
export function resizeToThumbnail(dataUri: string, maxSize = 100): Promise<string> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let w = img.width;
            let h = img.height;

            // Scale down maintaining aspect ratio
            if (w > h) {
                if (w > maxSize) { h = Math.round(h * maxSize / w); w = maxSize; }
            } else {
                if (h > maxSize) { w = Math.round(w * maxSize / h); h = maxSize; }
            }

            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0, w, h);

            resolve(canvas.toDataURL('image/jpeg', 0.6));
        };
        img.onerror = () => resolve(dataUri); // fallback to original
        img.src = dataUri;
    });
}
