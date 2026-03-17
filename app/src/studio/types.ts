// ── Studio Types ───────────────────────────────────────────────────
// Replacement for the boolean-soup state management in CreativeStudio.tsx.
// This file defines the Stage enum, StudioGoal, shift types, goal cards,
// and dimension config used across all studio sub-components.

// Goal replaces creativity slider
export type StudioGoal = 'clone' | 'variations' | 'explore';

// Stage enum replaces 17 boolean useState calls
export type Stage =
    | 'goals'        // Goal picker (entry point)
    | 'upload'       // Goal-aware upload zone
    | 'analyzing'    // Auto-analyze loading
    | 'studio'       // Main studio canvas (clone preview OR variation config)
    | 'synthesizing' // Creating concepts (variations/explore only)
    | 'concepts'     // Concept cards visible
    | 'generating'   // Creating artwork
    | 'result'       // Artwork on cards
    | 'cloning'      // Clone in progress
    | 'clone-result' // Side-by-side clone result

// Re-export existing types that don't change
export type { SynthesizedConcept, SynthesizeInput, GenerateArtworkInput, CloneDesignInput } from '../api';
export type { SavedPattern } from '../apiClient';

// Shift state (unchanged from current code)
export interface ShiftState {
    keep: boolean;
    value: string;
}

export interface Shifts {
    S: ShiftState;
    H: ShiftState;
    I: ShiftState;
    F: ShiftState;
    T: ShiftState;
    Q: ShiftState;
    B: ShiftState;
}

export interface AppliedPatternData {
    patternId: string;
    patternName: string;
    selectedSections: string[];
    data: Record<string, any>;
}

// Dimension config for shift controls
export const dimensionConfig = [
    { key: 'S' as const, name: 'Visual Style', placeholder: 'e.g., Watercolor landscape' },
    { key: 'H' as const, name: 'Colors', placeholder: 'e.g., Cool blues and teals' },
    { key: 'I' as const, name: 'Graphics', placeholder: 'e.g., Cat instead of dog' },
    { key: 'F' as const, name: 'Typography', placeholder: 'e.g., Bold hand-lettered' },
    { key: 'Q' as const, name: 'Quotes & Text', placeholder: "e.g., 'Live, Laugh, Love'" },
    { key: 'T' as const, name: 'Theme & Mood', placeholder: 'e.g., Calm serenity' },
    { key: 'B' as const, name: 'Audience', placeholder: 'e.g., Yoga moms 30-40' },
];

// Default shifts per goal
export function getDefaultShifts(goal: StudioGoal): Shifts {
    if (goal === 'explore') {
        // All REIMAGINE = all change, no keep
        return {
            S: { keep: false, value: '' },
            H: { keep: false, value: '' },
            I: { keep: false, value: '' },
            F: { keep: false, value: '' },
            T: { keep: false, value: '' },
            Q: { keep: false, value: '' },
            B: { keep: false, value: '' },
        };
    }
    // Variations: Style=CHANGE, Colors=CHANGE, rest=KEEP
    return {
        S: { keep: false, value: '' },
        H: { keep: false, value: '' },
        I: { keep: true, value: '' },
        F: { keep: true, value: '' },
        T: { keep: true, value: '' },
        Q: { keep: true, value: '' },
        B: { keep: true, value: '' },
    };
}

// Goal card metadata — icon references Lucide icon names
export const goalCards = [
    {
        goal: 'clone' as StudioGoal,
        iconName: 'copy' as const,
        title: 'Clone Design',
        description: 'Extract and recreate the design on a clean canvas. Preserves every detail — style, colors, composition, text.',
        cta: 'Clone This Design',
    },
    {
        goal: 'variations' as StudioGoal,
        iconName: 'layers' as const,
        title: 'Make Variations',
        description: 'Keep what works, change what you want. AI creates 3 concept directions based on your shifts.',
        cta: 'Configure & Create',
    },
    {
        goal: 'explore' as StudioGoal,
        iconName: 'sparkles' as const,
        title: 'Explore New Ideas',
        description: 'Use your design as a loose starting point. AI reimagines every dimension for wildly fresh concepts.',
        cta: 'Start Exploring',
    },
];
