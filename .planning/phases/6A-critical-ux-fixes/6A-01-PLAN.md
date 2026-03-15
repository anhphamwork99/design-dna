---
phase: 6A-critical-ux-fixes
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: [app/src/App.tsx]
autonomous: true

must_haves:
  truths:
    - "Landing screen shows exactly 2 action cards: Analyze Design + Compare Designs"
    - "No 'Generate Design' or 'Coming Soon' card visible on landing"
    - "DNA results action buttons say 'Create Similar Design' and 'Remix for Different Audience'"
    - "Each action button has a subtitle explaining what it does"
  artifacts:
    - path: "app/src/App.tsx"
      provides: "Simplified landing + clear result action labels"
---

<objective>
Simplify the landing screen and clarify DNA result action buttons.

Purpose: User testing revealed the 3rd card "Generate Design (Coming Soon)" causes confusion, and "Create Same Buyer" / "Create New Buyer" labels don't match users' mental models.

Output: Updated App.tsx with simplified landing + clearer action labels
</objective>

<execution_context>
@.agent/skills/gsd/gsd-execution/execute-plan.md
@.agent/skills/gsd/_gsd-shared/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@app/src/App.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Remove "Generate Design" card from LandingScreen</name>
  <files>app/src/App.tsx</files>
  <action>
In the `LandingScreen` component (around line 355-397):

1. Remove the 3rd card div entirely — the one with `opacity-50 cursor-not-allowed` that contains "Generate Design" + "Coming Soon" badge + Sparkles icon
2. Change the grid from `grid-cols-1 md:grid-cols-3` to `grid-cols-1 md:grid-cols-2`
3. Keep the 2 remaining cards (Analyze Design + Compare Designs) unchanged

Remove the `Sparkles` import from lucide-react at the top of the file if it's no longer used elsewhere. Check GenerationScreen and CompareScreens imports before removing.
  </action>
  <verify>
- `npm run build` passes
- LandingScreen renders 2 cards in a 2-column grid on desktop
- No "Generate Design" or "Coming Soon" text in LandingScreen
  </verify>
  <done>Landing screen shows exactly 2 action cards</done>
</task>

<task type="auto">
  <name>Task 2: Rename action buttons on ResultsScreen</name>
  <files>app/src/App.tsx</files>
  <action>
In the `ResultsScreen` component (around line 633-964), find the action buttons that say "Create: Same Buyer" and "Create: New Buyer" (or similar labels).

Replace with:
- **"Create Similar Design"** — keep the same onClick handler (sets initialGenMode to 'same_buyer' and navigates to generation)
  - Add subtitle: `<p className="text-[11px] text-text-tertiary font-normal mt-0.5">Same audience, fresh design</p>`
- **"Remix for Different Audience"** — keep the same onClick handler (sets initialGenMode to 'new_buyer')
  - Add subtitle: `<p className="text-[11px] text-text-tertiary font-normal mt-0.5">Keep the style, target new buyers</p>`

Do NOT change the onClick logic, just the display labels and add subtitles.
  </action>
  <verify>
- `npm run build` passes
- Visual check: buttons show new labels with subtitles below
  </verify>
  <done>Result action buttons relabeled with descriptive text + subtitles</done>
</task>

</tasks>

<verification>
1. `npm run build` passes without errors
2. Landing screen: exactly 2 cards, no "Generate Design" remnants
3. Results screen: action buttons have new labels + subtitles
4. All navigation flows still work (Analyze → Upload → Results → Generation)
</verification>

<success_criteria>
- Landing has exactly 2 action cards (Analyze + Compare) in 2-column grid
- No "Coming Soon" badge, no disabled card
- Result action buttons are self-explanatory with subtitles
- Build compiles cleanly
</success_criteria>

<output>
After completion, create `.planning/phases/6A-critical-ux-fixes/6A-01-SUMMARY.md`
</output>
