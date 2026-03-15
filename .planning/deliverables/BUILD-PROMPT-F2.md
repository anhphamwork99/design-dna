# DesignDNA — Build Prompts for AI Studio (F2 Creative Generation)

> **Prerequisites:**
> 1. AI Studio → Build Mode → React framework → Gemini 3.1 Pro Preview
> 2. App Shell + F1 already built and working (from `BUILD-PROMPT-SHELL-F1.md`)
>
> **Usage:** Send prompts below as user messages in order. Wait for each to complete before sending next.

---

## Prompt 1: Generation UI (Mock)

> Copy everything between the `---START---` and `---END---` markers.

---START PROMPT 1---

Now let's build the Creative Generation screen. This will branch off from the "Generate from DNA" button on the Results screen.

### 1. Enable Navigation
- Enable the "Generate from DNA" button on the DNA Card results screen. Remove the "DISABLED" state and lock icon.
- On click, navigate to a new screen: `currentScreen === "generation"`.
- Pass the parsed DNA data (both visual_dna and buyer_dna) to this new screen.

### 2. Generation Screen Header
- Centered container, max-width 800px, 32px padding.
- Top: Ghost button "← Back to DNA Card" (navigates back to "results").
- H1: "Generate New Design" (32px, bold).
- Subtitle: Show the primary characteristics from the source logic (e.g., "Based on: [Primary Element] for [Tribe]"). Use the actual parsed DNA data.

### 3. Generation Mode Selector
Add 3 radio-style cards in a row (CSS grid, 3 columns, 16px gap):
- Card 1: Icon 🎯, Title: "Same Buyer, New Design", Subtitle: "Keep the buyer, change the look". DEFAULT SELECTED.
- Card 2: Icon 🎨, Title: "New Buyer, Same Style", Subtitle: "Keep the style, target someone new".
- Card 3: Icon 🔀, Title: "Full Remix", Subtitle: "Remix everything".
When selected: accent border, subtle accent background tint.

### 4. Creativity Level
Add a horizontal slider below the modes:
- Label "Creativity Level" (14px, semi-bold).
- A slider with 5 discrete stops (min 1, max 5, step 1). Default: 2.
- Show numbered labels below the stops: 1: Faithful, 2: Inspired, 3: Remixed, 4: Original, 5: Radical.
- Below the slider, show dynamic helper text based on the value:
  - 1: "Closely follows the original DNA"
  - 2: "Keeps themes, reinterprets freely"
  - 3: "Recognizable roots, new direction"
  - 4: "Loose inspiration only"
  - 5: "Completely new, emotional core only"

### 5. SHIFT+B Controls
Add a section: "SHIFT+B Dimensions" (16px, semi-bold) + an info tooltip icon.
This section contains 6 rows (dimensions). For each row:
- Left: Dimension letter badge (24px circle, accent bg, white text: S, H, I, F, T, B) + full name (e.g., "Subject", "Harmony").
- Center: A pill-shaped toggle switch for "Keep" / "Change". When "Change" is active, use accent color.
- Right: A text input field. ONLY visible if toggle is "Change".
  
The 6 dimensions and their placeholders when "Change" is active:
- S (Subject): "e.g., Campfire scene instead of mountains"
- H (Harmony): "e.g., Cool blues and teals"
- I (Identity): "e.g., Target yoga enthusiasts"
- F (Form): "e.g., Watercolor style"
- T (Text): "e.g., 'Find Your Peace'"
- B (Buyer Emotion): "e.g., Calm & serenity instead of adventure"

**Auto-set defaults based on Generation Mode selected in step 3:**
- Same Buyer: I=Keep, B=Keep, S=Change, H=Change, F=Change, T=Change
- New Buyer: H=Keep, F=Keep, I=Change, B=Change, S=Change, T=Change
- Full Remix: All 6 = Change

### 6. Specificity Level
Add an inline radio selector for Prompt Specificity:
- Label: "Specificity Level"
- 3 pill buttons inline: "General", "Niche" (Default), "Hyper-niche".
- Below it, dynamic helper text based on selection:
  - General: "e.g., dog lover"
  - Niche: "e.g., golden retriever owner"
  - Hyper-niche: "e.g., golden retriever owner who works from home"

### 7. Action Button
Add a large, full-width button at the bottom: "Generate Design ✨", AI gradient background.
On click: Create a loading state (change text to "Generating...", show spinner), wait 3 seconds (simulated), then show the Result Section.

### 8. Result Section (Shown after Generation)
Scroll to this section or show it directly below the Generate button.
- **Generated Image**: Use a mock placeholder for now (a div 400px height, 12px radius, gradient background with a ✨ icon in center, "Generated design preview").
- **Buyer Fit Analysis**: A card (surface2 bg, 16px padding) with 4 metrics. Present each as a Label + % on the same line, with a progress bar underneath (8px height, rounded).
  - Buyer Match: 85% (bar filled green)
  - Emotion Match: 78% (bar filled green)
  - Originality: 92% (bar filled accent)
  - "Made For Me" Signals: 4/5 (just text, no bar needed or segment the bar)
- **Chat Refinement**:
  - A chat history area (empty initially).
  - Input field placeholder: "Tell me what to change..."
  - Send button (accent color, arrow icon).
- **Actions row**:
  - "Download" primary button (accent bg, download icon). onClick: alert("Download coming soon").
  - "Generate Another" secondary button. Relays back to top to change settings.

### 9. Layout & Responsive
Use a single column layout for this screen. The slider and SHIFT+B rows should stack neatly on mobile. Use the design system colors (surface1, surface2, accent) as you did in the previous prompts.

---END PROMPT 1---

---

## Prompt 2: Wire Generation API

> Send this after Prompt 1 is complete and the mock generation UI is working.

---START PROMPT 2---

Now let's replace the mock delays and placeholders with real Gemini API calls.

### 1. Build the Generate Prompt
When "Generate Design ✨" is clicked, construct a text prompt string based on the user's SHIFT+B settings, Creativity Level, and Specificity Level.
Logic:
- Start with: "Generate a new design based on these specifications. Provide exactly ONE image."
- Append Visual Direction:
  - If H (Harmony) is Keep: "Use color palette from original DNA: [insert Original Harmony details here]"
  - If H (Harmony) is Change: "Use new color palette: [insert user text from H input]"
  - Repeat logic for S (Subject), F (Form), and T (Text).
- Append Buyer Targeting:
  - Target Buyer: [If I is Keep, use original persona. If Change, use user text]
  - Emotional Trigger: [If B is Keep, use original. If Change, use user text]
- Append Specificity modifier: Add a sentence enforcing General, Niche, or Hyper-niche context.
- Append Creativity modifier: Add a sentence enforcing the Creativity Level (1=extremely faithful to original layout/concept, 5=radical reinvention).

### 2. Call Image Generation API
Replace the simulated 3-second delay with a fetch to Gemini.
Endpoint (use the same API Key from settings):
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key={API_KEY}
```
In the request, you need to use the `gemini-2.5-pro` model, and enable image generation. 
*Note: Since the standard `generateContent` might not strictly output an image directly in all cases without tool calls, append an instruction: "OUTPUT FORMAT: Return a data URL of the generated image (e.g. data:image/jpeg;base64,...) inside a markdown image tag." or whatever format AI Studio uses for inline images if it has native multimodal gen.*
*If the Gemini REST API does not directly support image generation via generateContent natively in this region, use `gemini-2.5-flash` with a placeholder response that simulates a base64 image URL for the sake of this prototype. Try standard image-generation prompting first.*

*(For the prototype: If Gemini 2.5 Pro REST API doesn't return raw image bytes, simulate a successful image hook or use an external placeholder API like `https://placehold.co/600x600/png?text=Generated+Design` while appending the prompt as text, so the user sees a result.)*

### 3. Call Buyer Fit Analysis API
Immediately after the image is "generated", fire a second API call to `gemini-2.5-flash`:
Request body:
- Send the text prompt that was used for generation.
- Prompt: "Evaluate how well this design concept matches the target buyer. Score the following out of 100: buyer_match, emotion_match, originality. And a made_for_me_signal_count out of 5. Return ONLY a JSON object with these exactly 4 integer keys."
Parse this JSON and update the "Buyer Fit Analysis" progress bars.

### 4. Wire Chat Refinement
For the Chat Refinement input:
- When user types and hits send, append their message to a chatHistory array.
- Re-run the image generation (Step 2), but this time prepend the original constructed prompt, ALL previous chat history, and append the user's new message: "Refine the design with this change: [User Message]".
- Update the image and re-run Buyer Fit Analysis automatically.
- Show a loading spinner next to the chat input while waiting.

### 5. Wire Download
For the Download button:
If using a placeholder or base64 data URL, create an `<a>` tag with `download="designdna-generation.png"`, set `href` to the image source, and trigger a programmatic click.

### 6. Error Handling
Use the exact same robust error handling (try/catch, parsing error responses, 403 API Key, timeouts) as you did in the Upload flow. Display error cards in place of the image result if generation fails.

---END PROMPT 2---

---

## Prompt 3: Fix Templates

> Use these individually if something needs correction after Prompt 1 or 2.

### Fix 3A: SHIFT+B Layout
---START---
The SHIFT+B Layout on desktop is taking up too much vertical space or looks misaligned. Each dimension MUST be a single horizontal row on desktop. Left side: The 24px circular badge + Name. Center: The Keep/Change pill toggle. Right side: The text input field (only showing if Change is active), expanded to fill remaining width. Use a CSS grid `grid-template-columns: 150px 120px 1fr` to align them perfectly. On mobile (<768px), it's okay to stack them.
---END---

### Fix 3B: Creativity Slider
---START---
The creativity slider labels are missing or not aligned. Please ensure it uses an `<input type="range" min="1" max="5" step="1">`. Below it, put a flex container with `justify-content: space-between` containing 5 `<span>` elements (1, 2, 3, 4, 5) so they align perfectly under the slider stops. Below that, center the helper text ("Keeps themes, reinterprets freely" etc).
---END---

### Fix 3C: Buyer Fit Bars
---START---
The Buyer Fit metrics don't look like progress bars. Format each of the 3 percentage metrics like this:
1. A single line with `display: flex; justify-content: space-between` containing the Label ("Buyer Match") and the Percentage ("85%").
2. Immediately below it, a `div` with height 8px, background `surface2`, border-radius 4px, width 100%.
3. Inside it, a child `div` representing the fill, with width equal to the percentage. If >= 70% use a green background (`#10B981`), otherwise use the accent color (`#0096ED`).
The "Made For Me" metric can just be text.
---END---

---

*Phase: 04-build-prompt-f2*
*Last updated: 2026-03-15*
*Depends on: BUILD-PROMPT-SHELL-F1.md complete*
