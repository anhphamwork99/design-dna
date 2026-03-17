/**
 * Shared types and browser-only utilities.
 * All Gemini SDK calls and prompts have been moved to the backend (api/src/prompts/).
 * This file retains only type exports and the image resize utility (uses Canvas API).
 */

// ── Types ──────────────────────────────────────────────────────────

export interface SynthesizedConcept {
  title: string;
  description: string;
  visualDirection: string;
  targetBuyer: string;
  coherenceNotes: string;
  keyElements: string[];
  // Enriched fields (Phase 7B.1)
  suggestedText: {
    primary: string;      // Main quote/slogan ON the design
    secondary?: string;   // Tagline or subtitle
    textStyle: string;    // "bold hand-lettered" / "clean sans-serif" etc.
    textLayout?: string;  // "primary arched above, secondary below" etc.
  };
  colorPalette: Array<{
    hex: string;          // "#1E3A5F"
    name: string;         // "Deep Ocean"
    role: string;         // "Dominant" | "Secondary" | "Accent"
  }>;
  madeForMeHook: string; // Why buyer feels "this was made for ME"
}

export interface SynthesizeInput {
  originalDna: any;
  shifts: Record<string, { keep: boolean; value: string }>;
  creativity: number;
  appliedPattern?: {
    selectedSections: string[];
    data: Record<string, any>;
  };
}

export interface GenerateArtworkInput {
  concept: SynthesizedConcept;
  originalImage: string;
  originalMimeType: string;
  aspectRatio: string;
  creativity: number;
}

export interface CloneDesignInput {
  originalDna: any;
  originalImage: string;
  originalMimeType: string;
  aspectRatio: string;
}

// ── Image Resize (browser-only, uses Canvas API) ──────────────────
const MAX_IMAGE_DIMENSION = 1536; // px — Gemini works best at ≤1536px
const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4MB

export async function resizeImageIfNeeded(dataUrl: string): Promise<string> {
  // Extract base64 size estimate (base64 is ~33% larger than binary)
  const base64Part = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
  const estimatedBytes = (base64Part.length * 3) / 4;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const needsResize =
        img.width > MAX_IMAGE_DIMENSION ||
        img.height > MAX_IMAGE_DIMENSION ||
        estimatedBytes > MAX_IMAGE_BYTES;

      if (!needsResize) {
        resolve(dataUrl);
        return;
      }

      // Calculate new dimensions maintaining aspect ratio
      let newWidth = img.width;
      let newHeight = img.height;
      if (newWidth > MAX_IMAGE_DIMENSION || newHeight > MAX_IMAGE_DIMENSION) {
        const scale = Math.min(
          MAX_IMAGE_DIMENSION / newWidth,
          MAX_IMAGE_DIMENSION / newHeight
        );
        newWidth = Math.round(newWidth * scale);
        newHeight = Math.round(newHeight * scale);
      }

      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // Use JPEG for large images (much smaller than PNG), keep PNG for small
      let quality = 0.85;
      let result = canvas.toDataURL('image/jpeg', quality);

      // If still too large, reduce quality
      while (
        ((result.split(',')[1].length * 3) / 4) > MAX_IMAGE_BYTES &&
        quality > 0.4
      ) {
        quality -= 0.1;
        result = canvas.toDataURL('image/jpeg', quality);
      }

      resolve(result);
    };
    img.onerror = () => resolve(dataUrl); // fallback to original
    img.src = dataUrl;
  });
}

/**
 * Generate a small thumbnail from a data URL (canvas-based).
 */
export async function generateThumbnail(dataUrl: string, maxWidth: number = 200): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let newWidth = img.width;
      let newHeight = img.height;
      if (newWidth > maxWidth) {
        const scale = maxWidth / newWidth;
        newWidth = Math.round(newWidth * scale);
        newHeight = Math.round(newHeight * scale);
      }

      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // Output as JPEG quality 0.7 for small size
      const result = canvas.toDataURL('image/jpeg', 0.7);
      resolve(result);
    };
    img.onerror = () => resolve(dataUrl); // fallback to original if error
    img.src = dataUrl;
  });
}
