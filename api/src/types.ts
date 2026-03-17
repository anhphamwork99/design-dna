/**
 * Shared types used by prompt modules and routes.
 * Mirrors the types from app/src/api.ts for server-side usage.
 */

export interface SynthesizedConcept {
    title: string;
    description: string;
    visualDirection: string;
    targetBuyer: string;
    coherenceNotes: string;
    keyElements: string[];
    suggestedText: {
        primary: string;
        secondary?: string;
        textStyle: string;
        textLayout?: string;
    };
    colorPalette: Array<{
        hex: string;
        name: string;
        role: string;
    }>;
    madeForMeHook: string;
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

export interface ImageInput {
    data: string;
    name: string;
    type: string;
}
