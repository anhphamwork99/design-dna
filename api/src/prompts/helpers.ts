/**
 * Prompt helpers — pure business logic moved from frontend api.ts.
 * No DOM dependencies. Used by all prompt modules.
 */

// ── cleanJsonResponse ──────────────────────────────────────────────

export function cleanJsonResponse(text: string): string {
    let clean = text.trim();
    if (clean.startsWith('```json')) clean = clean.substring(7);
    else if (clean.startsWith('```')) clean = clean.substring(3);
    if (clean.endsWith('```')) clean = clean.substring(0, clean.length - 3);
    return clean.trim();
}

// ── Creativity: Fidelity Gradient ──────────────────────────────────

export const CREATIVITY_FIDELITY: Record<number, string> = {
    1: `Fidelity: VERY HIGH.
KEEP dimensions → must feel recognizably the same (same palette hex, same typography, same composition structure).
CHANGE dimensions → follow user direction closely, minimal artistic license.
REIMAGINE dimensions → vary within the same family (e.g., still earthy tones, still similar style).`,

    2: `Fidelity: HIGH.
KEEP dimensions → same visual language, can vary details (similar palette, same style family).
CHANGE dimensions → follow user direction, allow creative interpretation.
REIMAGINE dimensions → different but in the same creative neighborhood.`,

    3: `Fidelity: MODERATE.
KEEP dimensions → maintain the feeling/essence, execution can differ significantly.
CHANGE dimensions → user direction as starting point, push it further.
REIMAGINE dimensions → genuinely new approach, only loosely inspired by original.`,

    4: `Fidelity: LOW.
KEEP dimensions → vague echo of the original at most.
CHANGE dimensions → user direction as loose seed, interpret freely.
REIMAGINE dimensions → complete freedom, any direction.`,

    5: `Fidelity: MINIMAL.
KEEP dimensions → thematic whisper only, no visual resemblance needed.
CHANGE dimensions → user keywords as loose inspiration.
REIMAGINE dimensions → absolute creative freedom, surprise the user.`,
};

// ── Creativity: Image Roles ────────────────────────────────────────

export const CREATIVITY_IMAGE_ROLES: Record<number, string> = {
    1: "Use the provided image as a STRONG REFERENCE. The new design should closely resemble the original in style and composition.",
    2: "Use the provided image as a STRONG REFERENCE. Keep the visual language but allow creative reinterpretation of elements.",
    3: "Use the provided image as a STYLE REFERENCE. Draw inspiration from its visual language but create a distinctly new design.",
    4: "The provided image is for CONTEXT ONLY. Create a substantially different design that shares only thematic elements.",
    5: "The provided image is for CONTEXT ONLY. Create a completely new design — only the emotional essence should carry over.",
};

// ── Dimension Labels with Rich DNA Context ─────────────────────────

export const DIMENSION_LABELS: Record<string, {
    name: string;
    richContext: (dna: any) => string;
    shortLabel: (dna: any) => string;
}> = {
    S: {
        name: 'Visual Style',
        richContext: (d) => `Style: ${d?.visual_dna?.graphics?.style || 'N/A'}, Primary element: ${d?.visual_dna?.graphics?.primary_element || 'N/A'}, Secondary: ${(d?.visual_dna?.graphics?.secondary_elements || []).join(', ') || 'none'}, Detail level: ${d?.visual_dna?.graphics?.detail_level || 'N/A'}, Effects: ${(d?.visual_dna?.graphics?.effects || []).join(', ') || 'none'}`,
        shortLabel: (d) => d?.visual_dna?.graphics?.style || 'N/A',
    },
    H: {
        name: 'Colors',
        richContext: (d) => {
            const palette = (d?.visual_dna?.color?.palette || []).map((c: any) => `${c.name} ${c.hex} (${c.role}, ${c.proportion}%)`).join(', ');
            return `Harmony: ${d?.visual_dna?.color?.harmony || 'N/A'}, Temperature: ${d?.visual_dna?.color?.temperature || 'N/A'}, Contrast: ${d?.visual_dna?.color?.contrast || 'N/A'}, Palette: [${palette}]`;
        },
        shortLabel: (d) => d?.visual_dna?.color?.harmony || 'N/A',
    },
    I: {
        name: 'Graphics',
        richContext: (d) => `Primary: ${d?.visual_dna?.graphics?.primary_element || 'N/A'}, Secondary: ${(d?.visual_dna?.graphics?.secondary_elements || []).join(', ') || 'none'}, Effects: ${(d?.visual_dna?.graphics?.effects || []).join(', ') || 'none'}`,
        shortLabel: (d) => d?.visual_dna?.graphics?.primary_element || 'N/A',
    },
    F: {
        name: 'Typography',
        richContext: (d) => {
            const fonts = (d?.visual_dna?.typography?.fonts || []).map((f: any) => `${f.classification} ${f.weight} ${f.case} (${f.role})`).join(', ');
            return `Fonts: [${fonts}], Hierarchy levels: ${d?.visual_dna?.typography?.hierarchy_levels || 'N/A'}, Suggested Google Fonts: ${(d?.visual_dna?.typography?.suggested_google_fonts || []).join(', ') || 'N/A'}`;
        },
        shortLabel: (d) => d?.visual_dna?.typography?.fonts?.[0]?.classification || 'N/A',
    },
    T: {
        name: 'Theme & Mood',
        richContext: (d) => `Primary emotion: ${d?.buyer_dna?.emotional_triggers?.primary_emotion || 'N/A'}, Trigger: ${d?.buyer_dna?.emotional_triggers?.trigger_description || 'N/A'}, Secondary: ${(d?.buyer_dna?.emotional_triggers?.secondary_emotions || []).join(', ') || 'none'}, Arc: ${d?.buyer_dna?.emotional_triggers?.emotional_arc || 'N/A'}`,
        shortLabel: (d) => d?.buyer_dna?.emotional_triggers?.primary_emotion || 'N/A',
    },
    B: {
        name: 'Audience',
        richContext: (d) => `Tribe: ${d?.buyer_dna?.identity_signals?.tribe || 'N/A'}, Age: ${d?.buyer_dna?.persona?.age_range || 'N/A'}, Interests: ${(d?.buyer_dna?.persona?.interests || []).join(', ') || 'N/A'}, Values: ${(d?.buyer_dna?.persona?.values || []).join(', ') || 'N/A'}, Identity message: "${d?.buyer_dna?.identity_signals?.message_to_world || 'N/A'}", Lifestyle: ${d?.buyer_dna?.persona?.lifestyle || 'N/A'}`,
        shortLabel: (d) => `${d?.buyer_dna?.persona?.age_range || 'N/A'}, ${d?.buyer_dna?.identity_signals?.tribe || 'N/A'}`,
    },
    Q: {
        name: 'Quotes & Text Content',
        richContext: (d) => {
            const texts = d?.visual_dna?.typography?.text_content;
            if (texts) return `Primary: "${texts.primary || ''}", Secondary: "${texts.secondary || ''}"`;
            return `Text from original design (preserve exactly as-is)`;
        },
        shortLabel: (d) => d?.visual_dna?.typography?.text_content?.primary || 'original text',
    },
};

// ── Full DNA Packager ──────────────────────────────────────────────

export function packageFullDna(dna: any): string {
    if (!dna) return 'No DNA available.';

    const v = dna.visual_dna || {};
    const b = dna.buyer_dna || {};

    const paletteStr = (v.color?.palette || []).map((c: any) =>
        `${c.name} ${c.hex} (${c.role}, ${c.proportion}%)`
    ).join(', ');

    const fontsStr = (v.typography?.fonts || []).map((f: any) =>
        `${f.classification} ${f.weight} ${f.case} (${f.role})`
    ).join(', ');

    const garmentColorsStr = (v.pod_technical?.recommended_garment_colors || []).map((c: any) =>
        `${c.name} ${c.hex}`
    ).join(', ');

    const madeForMeStr = (b.made_for_me_decisions || []).map((d: any) =>
        `• ${d.decision}: ${d.why_it_works}`
    ).join('\n');

    return `### Visual DNA
Summary: ${v.summary || 'N/A'}
Composition: ${v.composition?.grid_type || 'N/A'}, ${v.composition?.symmetry || 'N/A'}, focal: ${v.composition?.focal_point || 'N/A'}, flow: ${v.composition?.visual_flow || 'N/A'}, density: ${v.composition?.density || 'N/A'}
Color Palette: [${paletteStr}]
Color Harmony: ${v.color?.harmony || 'N/A'}, Temperature: ${v.color?.temperature || 'N/A'}, Contrast: ${v.color?.contrast || 'N/A'}
Typography: [${fontsStr}], Hierarchy: ${v.typography?.hierarchy_levels || 'N/A'} levels
Graphics: Style: ${v.graphics?.style || 'N/A'}, Primary: ${v.graphics?.primary_element || 'N/A'}, Secondary: ${(v.graphics?.secondary_elements || []).join(', ') || 'none'}, Effects: ${(v.graphics?.effects || []).join(', ') || 'none'}, Detail: ${v.graphics?.detail_level || 'N/A'}
POD Technical: Print: ${v.pod_technical?.best_print_method || 'N/A'}, Products: ${(v.pod_technical?.suitable_products || []).join(', ') || 'N/A'}, Garment colors: [${garmentColorsStr}]

### Buyer DNA
Persona: ${b.persona?.age_range || 'N/A'}, ${b.persona?.gender_lean || 'N/A'}, Interests: [${(b.persona?.interests || []).join(', ')}], Values: [${(b.persona?.values || []).join(', ')}], Lifestyle: ${b.persona?.lifestyle || 'N/A'}, Spending: ${b.persona?.spending_mindset || 'N/A'}
Identity: Primary: ${b.identity_signals?.primary || 'N/A'}, Message: "${b.identity_signals?.message_to_world || 'N/A'}", Tribe: ${b.identity_signals?.tribe || 'N/A'}, Aesthetic: ${b.identity_signals?.aesthetic_identity || 'N/A'}
Emotions: Primary: ${b.emotional_triggers?.primary_emotion || 'N/A'}, Trigger: "${b.emotional_triggers?.trigger_description || 'N/A'}", Secondary: [${(b.emotional_triggers?.secondary_emotions || []).join(', ')}], Arc: ${b.emotional_triggers?.emotional_arc || 'N/A'}
Occasion: Seasons: [${(b.occasion_timing?.best_seasons || []).join(', ')}], Events: [${(b.occasion_timing?.events || []).join(', ')}], Wear: ${b.occasion_timing?.wear_context || 'N/A'}, Gift: ${b.occasion_timing?.gift_potential?.score || 'N/A'} (${b.occasion_timing?.gift_potential?.who_buys_for_whom || 'N/A'})
Made-for-me decisions:
${madeForMeStr || '• N/A'}`;
}

// ── Format Pattern Insights ────────────────────────────────────────

export function formatPatternInsights(pattern: { selectedSections: string[]; data: Record<string, any> }): string {
    const parts: string[] = ['## PATTERN INSIGHTS (from cross-design analysis)\n'];

    if (pattern.data.winning_formula) {
        const wf = pattern.data.winning_formula;
        parts.push('### Winning Formula');
        if (wf.summary) parts.push(wf.summary);
        if (wf.keep?.length) parts.push(`**Keep:** ${wf.keep.join(', ')}`);
        if (wf.experiment_with?.length) parts.push(`**Experiment with:** ${wf.experiment_with.join(', ')}`);
        if (wf.avoid?.length) parts.push(`**Avoid:** ${wf.avoid.join(', ')}`);
        if (wf.suggested_brief) parts.push(`**Suggested brief:** ${wf.suggested_brief}`);
    }

    if (pattern.data.visual_patterns) {
        const vp = pattern.data.visual_patterns;
        parts.push('\n### Visual Patterns');
        if (vp.common_colors) parts.push(`- Colors: ${vp.common_colors}`);
        if (vp.typography_trends) parts.push(`- Typography: ${vp.typography_trends}`);
        if (vp.composition_patterns) parts.push(`- Composition: ${vp.composition_patterns}`);
        if (vp.illustration_styles) parts.push(`- Illustration: ${vp.illustration_styles}`);
    }

    if (pattern.data.buyer_overlap) {
        const bo = pattern.data.buyer_overlap;
        parts.push('\n### Buyer Overlap');
        if (bo.shared_persona) parts.push(`- Persona: ${bo.shared_persona}`);
        if (bo.shared_identity) parts.push(`- Identity: ${bo.shared_identity}`);
        if (bo.shared_emotion) parts.push(`- Emotion: ${bo.shared_emotion}`);
        if (bo.shared_occasion) parts.push(`- Occasion: ${bo.shared_occasion}`);
    }

    if (pattern.data.made_for_me_patterns?.length) {
        parts.push('\n### Made For Me Patterns');
        pattern.data.made_for_me_patterns.forEach((p: string) => parts.push(`- ${p}`));
    }

    if (pattern.data.specificity_ladder) {
        const sl = pattern.data.specificity_ladder;
        parts.push('\n### Specificity Ladder');
        if (sl.generic) parts.push(`- Generic: ${sl.generic}`);
        if (sl.niche) parts.push(`- Niche: ${sl.niche}`);
        if (sl.hyper_niche) parts.push(`- Hyper-niche: ${sl.hyper_niche}`);
    }

    parts.push('\nUse these insights to inform your concept generation. They are creative input, not strict rules.\n');

    return parts.join('\n');
}
