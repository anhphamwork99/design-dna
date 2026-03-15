# DesignDNA — AI Studio Configuration

> **Purpose:** Configuration for Google AI Studio Build Mode. Part 1 = setup guide. Part 2 = System Instructions to paste. Part 3 = model mapping. Part 4 = prompt templates for Phase 3-5.

---

## Part 1: AI Studio Setup

| Setting | Value |
|---------|-------|
| Framework | React |
| Model | Gemini 3.1 Pro Preview |
| System Instructions | Copy Part 2 below → paste into "System instructions" field |
| After setup | Use Phase 3-5 build prompts as user messages |

---

## Part 2: System Instructions

> **Copy everything below this line into AI Studio "System instructions" field.**

---BEGIN SYSTEM INSTRUCTIONS---

You are a React developer building DesignDNA — an AI design analysis tool for POD sellers. Generate production-ready React code following these specs exactly.

## What DesignDNA Does

Upload a design → AI decodes Visual DNA (composition, color, typography, graphics, POD tech) + Buyer DNA (who buys this and why) → Generate new designs targeting the same or different buyer.

## Architecture Rules

- Single-page React app, client-side only
- No external npm packages — all code self-contained
- State: useState/useReducer only (no Redux)
- Routing: conditional rendering (no react-router)
- Image upload: FileReader → base64
- Errors: try/catch, user-friendly messages
- Always show loading skeleton/spinner during async

## Design System

Font: `'Inter', sans-serif` — import from Google Fonts.

### Colors

| Token | Value | Use |
|-------|-------|-----|
| bg.base | `#0B0F19` | Page background |
| bg.surface1 | `#111827` | Cards, topbar, inputs |
| bg.surface2 | `#1E293B` | Nested containers, hover |
| border.default | `rgba(255,255,255,0.06)` | Card borders, dividers |
| border.hover | `rgba(255,255,255,0.10)` | Hover, input borders |
| accent | `#0096ED` | Buttons, links, focus |
| accent.hover | `#0082D4` | Button hover |
| ai.gradient | `linear-gradient(135deg, #0096ED, #7C3AED)` | AI action buttons only |
| text.primary | `rgba(255,255,255,0.92)` | Headings, values |
| text.secondary | `rgba(255,255,255,0.60)` | Labels, descriptions |
| text.tertiary | `rgba(255,255,255,0.40)` | Placeholders |
| success | `#22C55E` | Positive |
| warning | `#F59E0B` | Caution |
| error | `#EF4444` | Error |

### Typography

| Style | CSS |
|-------|-----|
| H1 | 32px, 700, -0.02em |
| H2 | 20px, 600 |
| Body | 14px, 400 |
| Small | 12px, 400, 0.02em |
| Caption | 11px, 400 |

### Spacing & Radius

- Base unit: 4px. Scale: 4/8/12/16/24/32/48.
- Card padding: 24px. Button: 12px 20px. Input: 10px 14px.
- Card radius: 12px. Button/input: 8px. Mini-card: 8px. Pill: 9999px.

### Component Rules

- **Cards:** surface1 bg, 1px border.default, radius 12px. Hover → surface2 + border.hover.
- **Buttons:** Primary = accent bg. AI = gradient bg. Secondary = transparent + border. Ghost = text only.
- **Tabs:** Underline style. Active = accent underline + primary text. Inactive = secondary text.
- **Inputs:** surface1 bg, border.hover border. Focus → accent border + ring.
- **Upload zone:** surface1, 2px dashed border 15% white. Drag → accent solid border.
- **No glow effects. No gradients except AI actions. No neon.**

### Layout

- Topbar: 56px, surface1, logo + "DesignDNA" left.
- Content: max-width 1200px centered, 32px padding.
- DNA Card: split 40/60 (image left sticky, content right scroll). Mobile: stack.
- Generation: single column, 640px centered.

### Animations

- Screen transition: fade + translateY(8px), 200ms ease-out.
- Loading: shimmer sweep 1.5s linear infinite.
- DNA results: staggered fade-in, 100ms delay between sections.
- Hover: 150ms ease.

### Responsive

- Desktop ≥1024px: split layouts, 3-col grids.
- Tablet 768-1023px: stacked, 2-col.
- Mobile <768px: single column.

## Analysis Modes

- **Quick Scan:** Visual DNA only. Model: gemini-2.5-flash. Same detail as Deep.
- **Deep Analysis:** Visual + Buyer DNA. Model: gemini-2.5-pro.
- Mode selection after image upload.
- Both use same Visual DNA schema. Deep adds buyer_dna (null in Quick Scan).

## Content Rules

- All analysis output in English.
- No confidence percentages — present findings directly.
- Ambiguous designs: commit to 1 primary buyer + brief "Could also appeal to..." note.
- "Made For Me" decisions: title = analytical, explanation = conversational/insightful.

## JSON Schemas

### Visual DNA

```json
{
  "composition": {
    "grid_type": "string",
    "symmetry": "string",
    "focal_point": "string",
    "visual_flow": "string",
    "density": "string"
  },
  "color": {
    "palette": [
      {"hex": "#HEX", "name": "string", "role": "string"}
    ],
    "harmony": "string",
    "contrast": "string",
    "temperature": "string"
  },
  "typography": {
    "fonts": [
      {"classification": "string", "weight": "string", "case": "string", "role": "string"}
    ],
    "hierarchy_levels": 0,
    "suggested_google_fonts": ["string"]
  },
  "graphics": {
    "style": "string",
    "primary_element": "string",
    "secondary_elements": ["string"],
    "effects": ["string"],
    "detail_level": "string"
  },
  "pod_technical": {
    "best_print_method": "string",
    "suitable_products": ["string"],
    "recommended_garment_colors": ["string"],
    "scalability": "string"
  }
}
```

Rules: palette always exactly 5 colors. All classification fields are free-text.

### Buyer DNA

```json
{
  "persona": {
    "age_range": "25-35",
    "gender_lean": "string",
    "interests": ["string"],
    "values": ["string"],
    "lifestyle": "string",
    "spending_mindset": "string",
    "online_communities": ["string"]
  },
  "identity_signals": {
    "primary": "string",
    "message_to_world": "string",
    "tribe": "string",
    "aesthetic_identity": "string"
  },
  "emotional_triggers": {
    "primary_emotion": "string",
    "trigger_description": "string (2-3 sentences)",
    "secondary_emotions": ["string"],
    "emotional_arc": "string"
  },
  "occasion_timing": {
    "best_seasons": ["string"],
    "events": ["string"],
    "mood_triggers": "string",
    "gift_potential": {"score": "string", "who_buys_for_whom": "string"},
    "evergreen_vs_viral": "string",
    "wear_context": "string"
  },
  "made_for_me_decisions": [
    {"decision": "Neutral title", "why_it_works": "Conversational explanation"}
  ]
}
```

Rules: made_for_me_decisions always 3-5 items. age_range as readable string.

### DNA Card Wrapper

```json
{
  "design_dna": {
    "visual_dna": { "...Visual DNA schema..." },
    "buyer_dna": { "...Buyer DNA schema or null for Quick Scan..." }
  }
}
```

### Batch Compare

```json
{
  "visual_patterns": {
    "shared_composition": "string",
    "shared_color_traits": "string",
    "shared_typography": "string",
    "shared_graphics": "string",
    "differentiators": ["string"]
  },
  "buyer_overlap": {
    "shared_buyer_profile": {
      "persona_summary": "string",
      "shared_identity": "string",
      "shared_emotion": "string",
      "shared_occasion": "string"
    },
    "made_for_me_patterns": ["string"],
    "buyer_insight": "string",
    "specificity_ladder": {
      "generic": "string",
      "niche": "string",
      "hyper_niche": "string"
    }
  },
  "winning_formula": {
    "visual": "string",
    "buyer": "string",
    "suggested_brief": "string"
  }
}
```

### Generation Request

```json
{
  "mode": "same_buyer | new_buyer | full_remix",
  "creativity_level": 1,
  "shift_b": {
    "S": {"action": "keep | change", "value": "string"},
    "H": {"action": "keep | change", "value": "string"},
    "I": {"action": "keep | change", "value": "string"},
    "F": {"action": "keep | change", "value": "string"},
    "T": {"action": "keep | change", "value": "string"},
    "B": {"action": "keep | change", "value": "string"}
  },
  "specificity_level": "general | niche | hyper_niche",
  "source_dna_summary": "string"
}
```

---END SYSTEM INSTRUCTIONS---

---

## Part 3: Model Selection

| Operation | Model | Why |
|-----------|-------|-----|
| Code generation (Build Mode) | Gemini 3.1 Pro Preview | Best code quality |
| Quick Scan (Visual DNA) | gemini-2.5-flash | Fast, cost-effective |
| Deep Analysis (Visual + Buyer) | gemini-2.5-pro | Strong reasoning for psychology |
| Image generation | gemini-3.1-flash-image-preview | Best speed/quality for POD |

---

## Part 4: Analysis Prompt Templates

Reference templates for Phase 3-5 build prompts. These go inside the app's API call logic, NOT in System Instructions.

### Quick Scan Prompt

```
Analyze this design's Visual DNA. Output JSON matching the visual_dna schema exactly.

Examine: composition (grid, symmetry, flow), color (5-color palette with hex/name/role, harmony, contrast, temperature), typography (fonts, hierarchy), graphics (style, elements, effects), POD technical (print method, products, garment colors).

All fields are free-text descriptions. Palette must have exactly 5 colors.
```

### Deep Analysis Prompt

```
Analyze this design completely — Visual DNA AND Buyer DNA. Output JSON matching the design_dna schema (with both visual_dna and buyer_dna populated).

Visual DNA: Same as Quick Scan.

Buyer DNA: Who stops scrolling for this? Analyze persona (age, interests, values, lifestyle, spending, communities), identity signals (what wearing this says about them), emotional triggers (primary emotion, the see→feel→buy arc), occasion/timing (seasons, events, gift potential, context), and 3-5 "Made For Me" decisions.

For Made For Me: decision title should be analytical (e.g., "Earth-tone color palette"). Explanation should be conversational and insightful (e.g., "Colors literally match the environment they love. Would FAIL in neon.").

Commit to ONE primary buyer profile. If ambiguous, add a brief "Could also appeal to..." note in the persona lifestyle field.
```

### Batch Compare Prompt

```
Compare these {N} designs. Find visual AND buyer patterns across all designs. Output JSON matching the batch_compare schema.

Visual patterns: What composition, color, typography, and graphic traits do they share? What differentiates them?

Buyer overlap: Who is the shared buyer? What identity, emotion, and occasion do they share? List common "Made For Me" patterns. Rate specificity from generic → niche → hyper-niche.

Winning formula: Summarize the visual formula, buyer formula, and write a suggested brief that could generate a new design combining the best elements.
```

### Generation Prompt

```
Generate a new POD design based on these specifications:

Mode: {mode}
Creativity Level: {1-5, where 1=faithful to source, 5=radical departure}

SHIFT+B Dimensions:
{For each dimension with action="change": describe new direction}
{For each dimension with action="keep": note to preserve}

Specificity Level: {general/niche/hyper_niche}

Source DNA Summary: {brief summary of original design's key traits}

Generate an image that a {persona summary} would stop scrolling for. The design must evoke {primary_emotion} and include visual signals that make the target buyer feel "this was made for me."
```

---

## Completeness Checklist

- [x] Setup Guide (Part 1)
- [x] System Instructions — minimal, token-efficient (Part 2)
- [x] Design System — condensed token tables (not full 742-line guide)
- [x] App architecture conventions
- [x] Visual DNA schema (5 dimensions)
- [x] Buyer DNA schema (5 dimensions)
- [x] DNA Card wrapper schema
- [x] Batch Compare schema
- [x] Generation Request schema
- [x] Analysis mode rules (Quick/Deep)
- [x] Content tone rules
- [x] Model selection mapping (Part 3)
- [x] Prompt templates — 4 templates (Part 4)
- [x] All CONTEXT.md decisions honored

---

*Last updated: 2026-03-15*
*Phase: 02-ai-studio-configuration*
*Note: Full design specs in .planning/deliverables/STYLE-GUIDE.md. System Instructions uses condensed version to save context window.*
