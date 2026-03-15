# DesignDNA — Build Prompts for AI Studio (Shell + F1)

> **Prerequisites:**
> 1. AI Studio → Build Mode → React framework → Gemini 3.1 Pro Preview
> 2. System Instructions from `AI-STUDIO-CONFIG.md` Part 2 already pasted
>
> **Usage:** Send prompts below as user messages in order. Wait for each to complete before sending next.

---

## Prompt 1: App Scaffold (Mock Data)

> Copy everything between the `---START---` and `---END---` markers.

---START PROMPT 1---

Build a complete DesignDNA app following the design system in your System Instructions. Use React with useState for state management. No external packages.

The app has 4 screens controlled by a `currentScreen` state: "landing", "upload", "analyzing", "results".

### App Shell

A topbar fixed at top, 56px height, surface1 background, 1px bottom border. Left side: a small 24px gradient square icon (accent to purple gradient) + "DesignDNA" text in 16px semi-bold. The topbar spans full width.

Below the topbar, a content area centered with max-width 1200px, 32px horizontal padding.

### Landing Screen (currentScreen === "landing")

Center-aligned content:
- H1: "Decode Any Design's DNA" (32px, bold)
- Subtitle below: "Upload any design to uncover its Visual DNA and discover exactly who it's made for — and why." (14px, secondary text color, max-width 540px)
- 32px gap, then 3 action cards in a row (CSS grid, 3 columns, 16px gap):

Card 1 — "Analyze Design":
- A large icon area: magnifying glass or DNA helix (use an SVG or emoji 🔬)
- Title: "Analyze Design" (16px, semi-bold)
- Description: "Upload a design to decode its visual DNA and buyer psychology" (12px, secondary)
- This card has accent border on hover and onClick navigates to "upload" screen

Card 2 — "Compare Designs":
- Icon: ⚖️
- Title: "Compare Designs"
- Description: "Upload 2-5 designs to find winning patterns"
- Has a small "Coming Soon" badge (11px, accent background, pill shape, top-right of card)
- Card is visually muted (0.5 opacity), cursor not-allowed, no click handler

Card 3 — "Generate Design":
- Icon: ✨
- Title: "Generate Design"
- Description: "Create new designs targeting specific buyers"
- Same "Coming Soon" badge and disabled treatment as Card 2

All cards: surface1 background, 1px border, 12px radius, 24px padding. Hover on active cards: surface2 bg + brighter border + slight translateY(-2px).

### Upload Screen (currentScreen === "upload")

Top-left: a back button (← icon + "Home" text, ghost style) that returns to landing.

Centered container, max-width 640px:

**Before upload (no image selected):**
- Upload zone: surface1 bg, 2px dashed border (rgba(255,255,255,0.15)), 12px radius, 48px vertical / 24px horizontal padding
- Center content: upload cloud icon (48px, secondary color), "Drop your design here" (16px, primary), "or click to browse" (14px, secondary), "PNG, JPG, WEBP" (12px, tertiary)
- Drag state: border changes to accent color solid, background gets subtle accent tint
- Hidden file input triggered by click, accepts image/*

**After upload (image selected):**
Replace upload zone with:
1. Image preview: the uploaded image, max-height 400px, width 100%, object-fit contain, 12px radius, 1px border, surface2 bg behind for contrast
2. 24px gap
3. Mode selector — two cards side by side (grid, 2 columns, 12px gap):
   - Card "Quick Scan": radio-style selectable card. Icon ⚡, title "Quick Scan" (14px semi-bold), subtitle "Visual DNA only · ~10 seconds" (12px secondary). When selected: accent border, subtle accent background tint. DEFAULT SELECTED.
   - Card "Deep Analysis": radio-style selectable card. Icon 🔬, title "Deep Analysis", subtitle "Visual + Buyer DNA · ~30 seconds". When selected: same accent treatment.
   - Only one can be selected at a time (radio behavior)
4. 24px gap
5. "Analyze Design" button: full width, AI gradient background (accent to purple), white text, 14px padding 24px horizontal, 8px radius. onClick: set screen to "analyzing", simulate 2-second delay, then set screen to "results"
6. 8px gap
7. "Change Image" ghost button: secondary text, underline on hover. Clears the image and shows upload zone again.

### Analyzing Screen (currentScreen === "analyzing")

Same layout as results screen but with skeleton placeholders:

Left panel (40% width, sticky):
- A skeleton rectangle matching image dimensions, shimmer animation

Right panel (60% width):
- Tab bar skeleton (2 blocks)
- Below: 5 section groups, each with:
  - A skeleton title bar (200px wide, 20px tall)
  - 3-4 skeleton text lines (varying width: 100%, 80%, 60%)
  - 16px gap between sections
- All skeleton blocks: surface2 background with shimmer sweep animation (gradient moving left to right, 1.5s, linear, infinite)

Text centered below skeleton: "Analyzing your design..." (14px, secondary) + mode label "(Quick Scan)" or "(Deep Analysis)" in accent color.

After 2 seconds, transition to results screen.

### Results Screen (currentScreen === "results")

**Layout:** Split — 40% left panel, 60% right panel, 16px gap between.

**Left panel** (sticky, top: 80px, align-self: start):
- The uploaded image, width 100%, border-radius 12px on left side, 1px border
- Below image (16px gap): file name in 12px secondary text

**Right panel** (overflow-y auto):
- Tab bar at top: two tabs "Visual DNA" and "Buyer DNA"
  - Active tab: accent color underline (2px), primary text
  - Inactive tab: no underline, secondary text
  - 150ms transition on switch

**Visual DNA tab content:**
- Summary paragraph at top: "This outdoor-themed design uses a hand-drawn illustration style with earth-tone colors and slab serif typography, creating an authentic, rugged aesthetic suited for DTG printing on apparel." in a surface2 background card, 16px padding, 8px radius, 14px text.

- Then 5 sections (24px gap between). Each section has H3 title (16px, semi-bold) and content below:

1. **Composition**: Grid Type: Rule of thirds · Symmetry: Asymmetrical · Focal Point: Center-upper · Visual Flow: Top-to-bottom · Density: Moderate (all as inline Label: Value pairs, label in secondary color, value in primary, separated by · )

2. **Color**: A proportional color bar (horizontal, 100% width, 8px tall, 8px radius, overflow hidden). 5 segments — Forest Green 60% (#2D5016), Warm Cream 20% (#F5E6C8), Saddle Brown 10% (#8B4513), Slate Gray 6% (#6B7B8D), Burnt Orange 4% (#CC5500). Below the bar: 5 small circles (16px) with color + name + hex underneath each in 11px. Then: Harmony: Analogous · Contrast: Medium · Temperature: Warm earthy

3. **Typography**: Two font entries, each as a mini row: "Slab Serif · Bold · Uppercase · Headline" and "Handwritten Script · Regular · Mixed · Tagline". Then: Hierarchy Levels: 2. Then "Suggested Google Fonts:" with font pair names as pill badges (surface2 bg, 8px radius, 12px text): "Bitter + Caveat", "Roboto Slab + Dancing Script"

4. **Graphics**: Style: Hand-drawn illustration · Primary Element: Mountain landscape with pine trees · Detail Level: Medium. Then "Secondary Elements:" with badges: "Compass rose", "Banner ribbon". "Effects:" with badge: "Distressed texture"

5. **POD Technical**: Best Print Method: DTG · Scalability: Good. "Suitable Products:" with badges: "T-shirt", "Hoodie", "Mug", "Poster". "Recommended Garment Colors:" with color dots + names: forest green, charcoal, cream

**Buyer DNA tab content:**

If mode was Quick Scan: show a centered message "Buyer DNA requires Deep Analysis" with a button "Run Deep Analysis" (accent, onClick runs analysis again as Deep).

If mode was Deep Analysis, show sections (24px gap):

1. **Made For Me** (FIRST section, most prominent):
   Five mini-cards (surface2 bg, 8px radius, 16px padding, 12px gap between cards):
   - Card title (14px, semi-bold): "Hand-drawn illustration style (not stock vector)"
   - Card body (14px, secondary text, italic): "Signals authenticity and craftsmanship — same values as the outdoor community. Mass-produced vector art would feel 'corporate' to this buyer."
   - (Repeat for all 5 made_for_me_decisions from mock data below)

2. **Persona**: Display as Label: Value pairs.
   - Age Range: 28-42
   - Gender Lean: Slightly male
   - Interests: (as pill badges) Hiking, Camping, Nature photography, Craft beer
   - Values: (as pill badges) Freedom, Simplicity, Connection with nature, Authenticity
   - Lifestyle: "Weekend warrior — works office job during week, lives for outdoor weekends" (paragraph style)
   - Spending Mindset: "Willing to pay $28-35 for a tee that 'gets them'. Not price-sensitive for identity purchases."
   - Communities: (as pill badges) r/hiking, r/CampingGear, Instagram #getoutside

3. **Identity Signals**:
   - Primary Signal: Tribal belonging
   - Message to World: "I'm not a city person at heart. Nature is where I feel alive." (italic, in quotes)
   - Tribe: Outdoor enthusiasts who see nature as identity, not just hobby
   - Aesthetic Identity: Rustic-modern — vintage illustration style but contemporary layout

4. **Emotional Triggers**:
   - Primary Emotion: Nostalgia mixed with longing
   - Trigger: "The feeling of remembering your last great hike and craving the next one. Wearing this at the office on a Monday = silent protest against the cubicle." (paragraph)
   - Secondary Emotions: (badges) Pride in lifestyle, Belonging to tribe
   - Emotional Arc: See design → Feel recognized ('that's ME') → Purchase as identity reinforcement

5. **Occasion & Timing**:
   - Best Seasons: (badges) Spring, Summer, Early fall
   - Events: (badges) National Parks Week, Earth Day, Father's Day gift
   - Mood Triggers: "End of workweek — dreaming about weekend outdoors"
   - Gift Potential: High — "Partner buys for outdoor-loving SO, friend buys for hiking buddy"
   - Evergreen vs Viral: Evergreen
   - Wear Context: Casual weekend, camping trips, farmers market, dog walks

**Staggered reveal animation:** When results screen loads, each section fades in with translateY(12px) → 0, opacity 0 → 1, 300ms duration, 100ms stagger delay between sections.

**Action buttons below content** (24px gap from last section, horizontal row, 12px gap):
- "Analyze Another" — secondary button (transparent bg, border), onClick goes to "upload" screen
- "Generate from DNA" — AI gradient button, DISABLED, title="Coming Soon"
- "Compare Designs" — secondary button, DISABLED, title="Coming Soon"

**Mobile responsive (<768px):** Stack left/right panels vertically. Image full width, max-height 300px. Remove sticky. Content below.

### Screen Transitions

When switching screens, new content fades in: opacity 0 → 1, translateY(8px) → 0, 200ms ease-out.

---END PROMPT 1---

---

## Prompt 2: Wire Live Gemini API

> Send this after Prompt 1 is complete and the mock app is working.

---START PROMPT 2---

Now replace the mock data and simulated delay with real Gemini API calls. Keep all the UI exactly as built.

### 1. API Key Settings

Add a gear icon (⚙️) button to the right side of the topbar. On click, open a modal:
- Title: "Settings" (H2)
- Label: "Gemini API Key"
- Password input field (surface1 bg, border, 8px radius), placeholder "Paste your API key here"
- "Save" primary button — saves to localStorage key "designdna_api_key"
- "Cancel" ghost button — closes modal
- If already saved, pre-fill the input (masked)
- Close on backdrop click or Escape key

On app load, check localStorage for API key. If missing, show the settings modal automatically.

### 2. Analysis API Call

Replace the simulated 2-second delay with a real fetch call:

**Quick Scan:**
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={API_KEY}
```

Request body:
- contents: [{ parts: [{ inlineData: { mimeType: imageType, data: base64ImageData }}, { text: quickScanPrompt }]}]
- generationConfig: { responseMimeType: "application/json" }

The quickScanPrompt should be:
"Analyze this design's Visual DNA. Output JSON with these exact top-level keys: composition (grid_type, symmetry, focal_point, visual_flow, density), color (palette array of exactly 5 objects with hex/name/role, harmony, contrast, temperature), typography (fonts array with classification/weight/case/role, hierarchy_levels number, suggested_google_fonts array), graphics (style, primary_element, secondary_elements array, effects array, detail_level), pod_technical (best_print_method, suitable_products array, recommended_garment_colors array, scalability). All values are descriptive strings."

**Deep Analysis:**
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key={API_KEY}
```

Same structure but the prompt adds Buyer DNA:
"Analyze this design completely. Output JSON with two top-level keys: visual_dna and buyer_dna.

visual_dna: same structure as Quick Scan.

buyer_dna: persona (age_range string like '25-35', gender_lean, interests array, values array, lifestyle string, spending_mindset string, online_communities array), identity_signals (primary, message_to_world, tribe, aesthetic_identity), emotional_triggers (primary_emotion, trigger_description 2-3 sentences, secondary_emotions array, emotional_arc), occasion_timing (best_seasons array, events array, mood_triggers, gift_potential object with score and who_buys_for_whom, evergreen_vs_viral, wear_context), made_for_me_decisions array of exactly 3-5 objects each with decision string and why_it_works string.

For made_for_me_decisions: decision should be an analytical title, why_it_works should be conversational and insightful. Commit to one primary buyer profile. If design is ambiguous, add a brief note in the lifestyle field."

### 3. Response Handling

Parse the response JSON. The actual data will be in `response.candidates[0].content.parts[0].text`. JSON.parse that string.

For Quick Scan: wrap result as `{ visual_dna: parsedData, buyer_dna: null }`.
For Deep Analysis: use parsedData directly (it already has visual_dna and buyer_dna).

Update the DNA card component to render from this parsed data instead of the hardcoded mock.

### 4. Loading State

While waiting for API response:
- Show the skeleton layout (already built)
- Add an elapsed time counter: "Analyzing... 5s" that ticks every second
- Add a "Cancel" ghost button that aborts the fetch (use AbortController)

### 5. Error Handling

Wrap the fetch in try/catch. Handle these cases:

- **No API key:** Before calling, check localStorage. If missing, open settings modal with a warning message "Please add your API key to analyze designs."

- **Network error** (fetch throws): Show an error card (surface1 bg, error color left border, 12px radius, 16px padding):
  - Icon: ⚠️
  - Title: "Connection Failed" (14px, semi-bold, error color)
  - Message: "Could not reach the Gemini API. Check your internet connection and try again."
  - "Retry" primary button + "Change API Key" ghost button

- **API error** (response not ok): Parse error body if possible. Show error card:
  - 400: "Invalid request. The image may be too large or in an unsupported format."
  - 403: "Invalid API key. Please check your key in Settings." + open settings button
  - 429: "Rate limit exceeded. Please wait a moment and try again." + auto-retry after 10s
  - 500+: "Gemini API is temporarily unavailable. Please try again later."
  - "Retry" button + "Try Quick Scan Instead" if was Deep Analysis

- **Timeout** (>60 seconds): Abort the request. Show:
  - "Analysis is taking longer than expected."
  - "Retry" button + "Try Quick Scan" button (if was Deep Analysis)

- **Parse error** (response not valid JSON): Show:
  - "Received an unexpected response format. Please try again."
  - "Retry" button

All error cards appear in the same area where skeleton was showing. Include a fade-in animation.

---END PROMPT 2---

---

## Prompt 3: Fix Templates

> Use these individually if something needs correction after Prompt 1 or 2.

### Fix 3A: Colors
---START---
The colors don't match the design system. Review the color tokens in your System Instructions and update all hardcoded color values. Key tokens: page bg #0B0F19, cards #111827, nested #1E293B, borders rgba(255,255,255,0.06), accent #0096ED, text primary rgba(255,255,255,0.92), text secondary rgba(255,255,255,0.60). Remove any shadows or glows not specified in the design system.
---END---

### Fix 3B: Layout
---START---
The DNA Card split layout needs fixing. Desktop (≥1024px): left panel 40% width with sticky positioning (top: 80px, align-self: start) containing the image, right panel 60% width with overflow-y auto containing tabs and content. Tablet (768-1023px): stack vertically, image full width max-height 300px. Mobile (<768px): same stacking, reduce padding to 16px.
---END---

### Fix 3C: Typography
---START---
Update all typography to use the Inter font family from Google Fonts. Import: @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'). Apply font-family: 'Inter', sans-serif to body. Sizes: H1 32px/700, H2 20px/600, body 14px/400, small 12px/400 with 0.02em letter-spacing, caption 11px/400.
---END---

### Fix 3D: Loading Skeleton
---START---
The loading skeleton doesn't match the DNA Card content layout. Create skeleton blocks that mirror the actual content: a tab bar area (2 short blocks), then 5 section groups each with a title block (200px wide, 20px tall) and 3-4 text line blocks (varying widths: 100%, 80%, 60%, 40%). For the color section, add a horizontal bar block. Use shimmer animation: background linear-gradient(90deg, #1E293B 25%, rgba(255,255,255,0.05) 50%, #1E293B 75%), background-size 200% 100%, animate 1.5s linear infinite.
---END---

### Fix 3E: Responsive
---START---
Apply responsive breakpoints: Desktop ≥1024px uses split layouts and 3-column grid for action cards. Tablet 768-1023px stacks the DNA card panels vertically with 2-column grid for action cards. Mobile <768px uses single column everywhere. Reduce padding: desktop 32px, tablet 24px, mobile 16px. H1 sizes: desktop 32px, tablet 28px, mobile 24px.
---END---

---

*Phase: 03-build-prompt-shell-f1*
*Last updated: 2026-03-15*
*Depends on: AI-STUDIO-CONFIG.md System Instructions already pasted*
