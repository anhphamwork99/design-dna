// ── Pattern Storage Utility ─────────────────────────────────────
// Persist patterns (Compare results) to localStorage with CRUD ops

export interface SavedPattern {
    id: string;
    name: string;
    createdAt: string;
    sourceImageCount: number;
    thumbnails: string[];     // resized base64 data URIs (~100x100px)
    summary: string;          // from winning_formula.summary
    batchAnalysis: any;       // full batch_analysis object
}

const STORAGE_KEY = 'designdna_patterns';

// ── CRUD ────────────────────────────────────────────────────────

export function getPatterns(): SavedPattern[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const patterns: SavedPattern[] = JSON.parse(raw);
        // Sort newest first
        return patterns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch {
        return [];
    }
}

export function getPattern(id: string): SavedPattern | null {
    const patterns = getPatterns();
    return patterns.find(p => p.id === id) || null;
}

export async function savePattern(
    name: string,
    batchAnalysis: any,
    sourceImages: { data: string }[]
): Promise<SavedPattern> {
    const thumbnails = await Promise.all(
        sourceImages.map(img => resizeToThumbnail(img.data))
    );

    const pattern: SavedPattern = {
        id: crypto.randomUUID(),
        name,
        createdAt: new Date().toISOString(),
        sourceImageCount: sourceImages.length,
        thumbnails,
        summary: batchAnalysis?.winning_formula?.summary || 'No summary',
        batchAnalysis,
    };

    const existing = getPatterns();
    existing.unshift(pattern);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

    return pattern;
}

export function deletePattern(id: string): void {
    const patterns = getPatterns().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patterns));
}

// ── Duplicate Check ─────────────────────────────────────────────

export function isCompareResultSaved(batchAnalysis: any): boolean {
    if (!batchAnalysis) return false;
    const summary = batchAnalysis?.winning_formula?.summary || '';
    const patterns = getPatterns();
    return patterns.some(p => p.summary === summary && p.summary !== 'No summary');
}

// ── Thumbnail Resize ────────────────────────────────────────────

function resizeToThumbnail(dataUri: string, maxSize = 100): Promise<string> {
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
