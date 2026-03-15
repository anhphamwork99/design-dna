# DesignDNA — Build Prompts for AI Studio (F3 Batch Compare)

> **Prerequisites:**
> 1. AI Studio → Build Mode → React framework → Gemini 3.1 Pro Preview
> 2. App Shell, F1, and F2 already built and working (from `BUILD-PROMPT-SHELL-F1.md` and `BUILD-PROMPT-F2.md`)
>
> **Usage:** Send prompts below as user messages in order. Wait for each to complete before sending next.

---

## Prompt 1: Batch Compare UI (Mock)

> Copy everything between the `---START---` and `---END---` markers.

---START PROMPT 1---

Now let's build the Batch Compare flow (F3). This will allow users to upload multiple successful designs to extract a winning formula.

### 1. Enable Navigation
- On the Landing screen (`currentScreen === "landing"`), enable the "Compare Designs" button. Remove the "DISABLED" state/badge.
- On click, navigate to a new screen state: `currentScreen === "compare_upload"`.

### 2. Compare Upload Screen
Create a new view for `currentScreen === "compare_upload"`:
- **Header:** "Compare Winning Designs" (H1, 32px, bold) + Subtitle: "Upload 2-5 successful designs to uncover their shared DNA and extract the winning formula."
- **Back Button:** "← Home" (ghost button, navigates to "landing") positioned at top-left.
- **Upload Area Container:**
  - An area to hold selected images and the upload trigger.
  - Show a list/grid of added image thumbnails. For each thumbnail, add a tiny "X" button in the top-right corner to remove it.
  - Show an "Add Image" dropped area box (similar to single upload, but smaller, e.g., 150x150px) that acts as the file input trigger.
  - Below the area, add text: "[N]/5 images selected" (e.g., "2/5 images selected").
- **Action Button:**
  - A large button at the bottom: "Extract Winning Formula ✨" (AI gradient background).
  - IMPORTANT: This button MUST be disabled if the number of selected images is less than 2.
- **On Click:** Change screen to "compare_analyzing". 

### 3. Compare Analyzing Screen
Create a new view for `currentScreen === "compare_analyzing"`:
- Reuse the shimmering skeleton loader from the F1 analysis loading state.
- Change the loading text to: "Analyzing patterns across designs..."
- Wait 3 seconds (simulated), then navigate to `currentScreen === "compare_results"`.

### 4. Compare Results Screen
Create a new view for `currentScreen === "compare_results"`:
- **Header:** "Winning Formula" (32px, bold) + Back button: "← New Comparison" (navigates to "compare_upload" and clears images).
- **Layout:** A split view on desktop. Left side (30% width, sticky) shows thumbnails of the analyzed images. Right side (70% width) shows the analysis content. On mobile, the images should form a horizontal scrolling row at the top, and content stacks below.

**Right Side Content Layout:**

**Section A: The Winning Formula (Top Highlight)**
- A large highlight card (surface2 bg, 2px accent border, 24px padding).
- Title: "The Winning Formula" (18px, bold, accent color).
- Text block (Mock data): "Kawaii illustration + pastel palette + handwritten font. Combined with breed-specific references, first-person voice, and daily-life humor."
- Suggested Brief section: A darker inset box with the text: "Create a kawaii-style illustration of a Golden Retriever in a work-from-home setting, with first-person humorous text about pet-parent life. Pastel palette, handwritten font."
- Action Button: "Generate from Formula" (AI gradient bg). On click, navigate to `currentScreen === "generation"` (the F2 screen you built previously), passing this Suggested Brief as a parameter to pre-fill the generation.

**Section B: Buyer Overlap Map**
- Section title: "Buyer Overlap" (16px, semi-bold).
- Add 4 list items (Mock data):
  - Shared Persona: "Women 25-35, pet owners, work-from-home"
  - Shared Identity: "Defines self through pet relationship"
  - Shared Emotion: "Warmth + gentle humor about pet parenting"
  - Shared Occasion: "Everyday casual wear, gifts between pet-parent friends"

**Section C: "Made For Me" Pattern Analysis**
- Section title: "Pattern Analysis" (16px, semi-bold).
- Add a bulleted or pill-badge list (Mock data):
  - "All top sellers use BREED-SPECIFIC references (not generic 'dog')"
  - "4/5 use FIRST-PERSON voice ('I'd rather be with my dog')"
  - "3/5 use cute/kawaii illustration style"
  - "0/5 use realistic photo style — all illustrated"
- **Specificity Ladder:** Underneath, show 3 steps to visualize the specificity.
  - Step 1 (Generic, muted): "I love dogs ❌ (too broad)"
  - Step 2 (Niche, normal): "I love golden retrievers ✅"
  - Step 3 (Hyper-niche, accent color, bold): "My golden retriever is my coworker ✅✅ (highest conversion)"

---END PROMPT 1---

---

## Prompt 2: Wire Batch Compare API

> Send this after Prompt 1 is complete and the mock batch compare UI is working.

---START PROMPT 2---

Now let's replace the mock delays and data with a real Gemini API call.

### 1. Call Multi-Image Gemini Analysis
When "Extract Winning Formula ✨" is clicked, replace the 3-second delay with a fetch call to Gemini.
- Endpoint:
  ```
  POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key={API_KEY}
  ```
- Make sure to pass ALL the uploaded images into the `contents` array as separate `inlineData` parts along with the text prompt.
- **The Text Prompt:**
  "Act as a Print-on-Demand merchandising analyst. Analyze these successful designs as a batch to find their shared visual and buyer psychological patterns. Output ONLY a valid JSON object with EXACTLY this structure, no markdown formatting outside the JSON: 
  {
    \"batch_analysis\": {
      \"buyer_overlap\": {
        \"shared_persona\": \"string\",
        \"shared_identity\": \"string\",
        \"shared_emotion\": \"string\",
        \"shared_occasion\": \"string\"
      },
      \"made_for_me_patterns\": [ \"string\", \"string\" ],
      \"specificity_ladder\": {
        \"generic\": \"string\",
        \"niche\": \"string\",
        \"hyper_niche\": \"string\"
      },
      \"winning_formula\": {
        \"summary\": \"string\",
        \"suggested_brief\": \"string\"
      }
    }
  }"

### 2. Handle Response and Update State
- Parse the JSON string from the response.
- Replace all the mock data in the "compare_results" screen with the data from the JSON.
- If the API fails or JSON parsing fails, use the same robust Error Card display and Retry logic you used in F1 and F2. Do not leave the user stuck in a loading state.

### 3. Wire "Generate from Formula" Routing
Update the "Generate from Formula" button:
- When clicked, navigate to the `generation` screen.
- Set the Generation Mode to "Full Remix".
- We need the generation screen to know it is coming from the formula. Pass the `suggested_brief` into the generation component's state. 
- In the generation component, if it receives a `suggested_brief` from batch compare, it should automatically use that brief as the core design intent (S, H, F, T, etc.) or just override the text prompt it builds with the provided brief. Ensure the user doesn't have to manually type the brief again.

---END PROMPT 2---

---

## Prompt 3: Fix Templates

> Use these individually if something needs correction after Prompt 1 or 2.

### Fix 3A: File Upload UX
---START---
The multiple image uploader is clunky. We need to allow picking multiple files at once. Ensure the file input uses `<input type='file' multiple accept='image/*'>` and is hidden behind the 'Add Images' dropzone `div`. When images are selected, append them to the existing array in state, but enforce a maximum of 5 images overall. Display a tiny 'X' button positioned absolutely in the top-right corner over a dark semi-transparent circle on each image thumbnail so the user can easily remove one.
---END---

### Fix 3B: Specificity Ladder UI
---START---
The Specificity Ladder doesn't look like steps. We want a visual progression. Stack the 3 items vertically. Use a left border line (e.g., `border-left: 2px solid var(--surface2)`) spanning the 3 items with padding to connect them mentally. For the 'Generic' item, use a muted text color. For the 'Hyper-niche' item, use the accent color and make it `font-weight: 600`. Add the ❌ and ✅ emojis next to the text exactly as passed in the data if the AI outputs them, or hardcode them if it doesn't.
---END---

### Fix 3C: Formula Routing & Pre-fill
---START---
The "Generate from Formula" button is just navigating to the screen but not pre-filling the prompt. Make sure that when the user clicks it, it calls `setCurrentScreen('generation')` and passes the `winning_formula.suggested_brief`. On the Generation screen, add a `useEffect` or initialization logic so that if it receives this brief, it sets the overall text prompt for the next image generation to use this brief instead of relying strictly on the original single-image DNA values.
---END---

---

*Phase: 05-build-prompt-f3*
*Last updated: 2026-03-15*
*Depends on: BUILD-PROMPT-SHELL-F1.md and BUILD-PROMPT-F2.md complete*
