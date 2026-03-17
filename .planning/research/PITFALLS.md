# Redesign Pitfalls

**Context:** Full UI redesign of existing React+Vite app (~35 files, ~6,500 LOC) — dark→light theme, landing→sidebar navigation  
**Researched:** 2026-03-17  
**Confidence:** HIGH — synthesized from 15+ sources including NN/g, Martin Fowler, healthcare.gov case study, and multiple React engineering blogs

---

## Critical Pitfalls

> These mistakes cause **major breakage** — broken features, data loss, or unusable app states.

### P1: Big-Bang CSS Rewrite Breaks Working Features

**What happens:** Rewriting all CSS at once in `index.css` (currently the single style file) introduces cascading breakpoints. Styles that silently depend on specificity chains, inheritance, or dark-mode-specific values break unpredictably across screens.

**Why it's dangerous for DesignDNA:** All CSS is in a single `index.css` file. Changing tokens (e.g., `--bg-primary` from dark to light) affects every component simultaneously. Modals, tooltips, dropdowns, and overlays — which use shadow/depth techniques optimized for dark backgrounds — lose visual hierarchy.

**Real-world evidence:** 
- Healthcare.gov team chose incremental rewrite over big-bang specifically because "maintaining a completely different branch separate from the production master branch" caused integration hell ([hannaliebl.com](https://www.hannaliebl.com/blog/evergreen-software-development-shipping-a-redesign-of-enrollment-apps-on-healthcare-dot-gov/))
- Tricension research: "A rewrite creates a long 'no benefit until cutover' window. Dependencies surface late, scope expands, and governance tightens." ([LinkedIn](https://www.linkedin.com/posts/phelfe_legacy-application-modernisation))
- potapov.dev: "Facebook didn't rewrite their app — they evolved the language. Twitter didn't rebuild all at once — they replaced components over five years."

**Prevention:**
1. Create new design tokens as CSS custom properties alongside old ones (e.g., `--v3-bg-primary`)
2. Migrate component-by-component, not file-by-file
3. Keep the app functional at every commit — "if you can't ship a measurable slice with rollback, you're planning a rewrite"
4. Use a `[data-theme="v3"]` attribute pattern to scope new styles

**Phase warning:** Foundation/token setup phase — MOST DANGEROUS if done carelessly

---

### P2: Losing Functional Behavior During Component Restructuring

**What happens:** When reorganizing component tree for sidebar layout, event handlers, state management, and props chains break silently. Features appear to render but interactions fail (buttons don't respond, forms don't submit, state doesn't update).

**Why it's dangerous for DesignDNA:** The app has complex state flows — AI analysis with streaming results, multi-step Creative Studio pipeline (original → modify → patterns → synthesis → generation), Compare with batch processing. Moving these into a sidebar-based layout means re-parenting components, which can sever React state connections.

**Real-world evidence:**
- Martin Fowler: "More often than not, people squeeze different things into React components or hooks [...] this everything-in-component shows problems. The effort of understanding such type of code is relatively high, as well as the increased risk to code modification." ([martinfowler.com](https://martinfowler.com/articles/modularizing-react-apps.html))
- LinkedIn Engineering: "I've never, and I do mean never, seen [YOLO rewrites] work well. It has always resulted in tons of bugs surfacing to customers."

**Prevention:**
1. **Separate layout from logic** — extract business logic into custom hooks BEFORE restructuring JSX
2. **Keep state management untouched** — move visual containers, not state holders
3. **Test each screen's core interactions** after restructuring (analyze upload, generation trigger, compare selection)
4. Verify all `useEffect` dependencies still resolve correctly after re-parenting

**Phase warning:** Layout/navigation restructuring phase + individual screen redesign phases

---

### P3: Dark→Light Mode Token Mismatch Across Surfaces

**What happens:** Shadows, depth, overlays, and contrast that work in dark mode fail completely in light mode. Dark mode uses lighter overlays for depth; light mode uses shadows. Simply inverting colors produces an ugly, unreadable, or unusable interface.

**Why it's dangerous for DesignDNA:** The current app uses dark mode elevation patterns (lighter overlays on dark backgrounds for depth). Switching to light mode requires fundamentally rethinking depth strategy — shadows replace overlays, and contrast relationships invert non-linearly.

**Real-world evidence:**
- NN/g: "Placing a black element on a black background can be problematic because a lighter 'shadow' does not create the same layered effect — it makes the top element look like it's glowing." Same principle applies in reverse — dark-mode-optimized depth cues look wrong in light mode. ([nngroup.com](https://www.nngroup.com/articles/dark-mode-users-issues/))
- webwave.me: "Interfaces that feel flat, lifeless, and confusing" when depth techniques aren't rethought for the target mode
- supercharge.design: "Leave shadows for the [opposite] mode! To show depth and elevation, use overlapping elements, different color contrasts, and opacities."

**Prevention:**
1. Don't "invert" dark mode — **design light mode from scratch** using the Krea AI reference
2. Build a complete token layer: primitives → semantic → component tokens
3. Test depth/elevation tokens specifically: modals, dropdowns, cards, toast notifications
4. Use `oklch()` or `hsl()` for color tokens — they produce perceptually linear contrast in both modes

**Phase warning:** Token/design system foundation phase — must be done CORRECTLY before any screen work

---

### P4: Navigation Model Change Breaks User Mental Model

**What happens:** Users who know the current landing-screen-based navigation can't find features after switching to sidebar navigation. Features feel "gone" even though they're just moved. Back button behavior changes. Deep links may break.

**Why it's dangerous for DesignDNA:** Currently, the app uses a landing screen where users select their feature (Analyze, Studio, Compare, etc.). Moving to sidebar navigation means every feature's entry point changes simultaneously. Since this is a tool app (not a content app), workflow disruption has high impact.

**Real-world evidence:**
- XB Software: "People don't just learn features — they learn where those features live. When familiar design changes, users don't automatically go hunting. If a key tool moves or looks different, they might assume it's gone entirely." ([xbsoftware.com](https://xbsoftware.com/blog/legacy-app-ui-redesign-mistakes/))
- Experience Dynamics: "'Why the hell are you redesigning it again? You better NOT MAKE ME LEARN it all over again!'" — Senior user at major bank during redesign testing ([expdyn.medium.com](https://expdyn.medium.com/incremental-vs-big-bang-redesigns-evaluating-design-changes-for-users-2cb15dea05a4))
- NN/g: "Before you throw out the old and bring in the new, make sure you have solid evidence that doing so is necessary to achieve user-centered goals."

**Prevention:**
1. Map current user flows to new navigation BEFORE building — ensure every current path has an equivalent
2. Keep URL structure consistent or add redirects (`/analyze`, `/studio`, `/compare`, etc.)
3. Sidebar labels should match current feature names exactly
4. Consider "what's new" indicators for returning users

**Phase warning:** Navigation/layout architecture phase

---

### P5: Auth Flow Integration Breaks with Layout Change

**What happens:** The auth gate (mandatory authentication before accessing features) was built around the current layout. Restructuring to sidebar layout can cause auth state to not propagate correctly, creating unprotected routes or infinite redirect loops.

**Why it's dangerous for DesignDNA:** Supabase Auth with mandatory auth gate is a core security feature. The current auth flow was designed for the landing-page model. Wrapping everything in a sidebar layout means the auth boundary component must be repositioned without losing its gate behavior.

**Prevention:**
1. Keep auth boundary as the outermost wrapper — ABOVE the sidebar layout
2. Test: unauthenticated user → redirect to login (not sidebar with empty content)
3. Test: token expiry mid-session → graceful re-auth (not broken sidebar state)
4. Test: Google OAuth callback → lands in correct post-auth state with sidebar

**Phase warning:** Layout restructuring phase — verify auth IMMEDIATELY after layout changes

---

## Moderate Pitfalls

> These mistakes cause **delays, rework, or inconsistent quality** but don't break core functionality.

### P6: Inconsistent Styling Between Redesigned and Unredesigned Screens

**What happens:** When redesigning screen-by-screen, some screens have the new look while others retain the old dark theme. This creates a jarring, unprofessional experience during the transition period.

**Prevention:**
1. Define a strict migration order: Foundation → Layout → Screen-by-screen (all screens in queue)
2. Never merge a partial redesign to production — complete all screens before considering "done"
3. Use CSS custom properties so switching themes is a single toggle at the root level

**Phase warning:** Individual screen redesign phases

---

### P7: CSS Specificity Conflicts During Migration

**What happens:** New CSS rules conflict with existing ones due to specificity chains. The single `index.css` file means every rule competes globally. New `.sidebar-nav` styles accidentally override existing `.nav` styles. Media queries for responsive design interact unpredictably.

**Prevention:**
1. Use BEM or data-attribute selectors for new components to avoid class name collisions
2. Audit existing CSS for global selectors (element selectors like `button`, `input`, `a`) that will bleed into new components
3. Consider CSS layers (`@layer`) to control specificity ordering during migration
4. Keep old and new styles in separate logical sections (or separate files) during transition

**Phase warning:** Foundation phase + every screen redesign phase

---

### P8: Missing Edge Case Screens (Empty States, Errors, Loading)

**What happens:** Main screens get redesigned beautifully, but edge cases are forgotten: empty states (no analyses yet), error states (API failure), loading states (AI processing), and transition states (uploading image). These retain the old dark theme or break visually.

**Why it's dangerous for DesignDNA:** The app has many async operations (AI analysis, image generation, pattern saving). Each has loading/error/success states that must be redesigned consistently.

**Prevention:**
1. Create a checklist of ALL states per screen: default, loading, error, empty, success, partial
2. Redesign states alongside their parent screen, not separately
3. Create shared loading/error components with the new design system first

**Phase warning:** Individual screen redesign phases

---

### P9: Responsive Design Regression

**What happens:** Desktop redesign looks great, but mobile/tablet views break because responsive media queries were tied to the old layout model. Sidebar navigation doesn't collapse properly on small screens.

**Prevention:**
1. Design mobile breakpoints for sidebar navigation from the start (collapse to bottom nav or hamburger)
2. Test each redesigned screen at 3 breakpoints: mobile (375px), tablet (768px), desktop (1280px)
3. Don't defer responsive testing — do it alongside each screen redesign

**Phase warning:** Layout phase + every screen redesign phase

---

### P10: Performance Regression from Layout Restructuring

**What happens:** Moving from a simple page-swap model to a persistent sidebar layout causes:
- Parent component re-renders that cascade to all children (sidebar state changes trigger content re-renders)
- Context providers placed too high in tree causing unnecessary re-renders
- Larger initial bundle if sidebar loads all route components eagerly

**Real-world evidence:**
- React re-render optimization: "When the user changes the top level counter, the component re-renders along with ALL child components. In a large application this means if the top level component re-renders, the app is potentially doing a lot of unnecessary work." ([medium.com/@ztolley](https://medium.com/@ztolley/react-re-render-optimisation-d16ba64754a5))

**Prevention:**
1. Memoize sidebar component separately from content area (`React.memo`)
2. Keep route content inside `<Outlet>` or equivalent — don't render all routes simultaneously
3. Use `React.lazy()` for route-level code splitting
4. Profile with React DevTools before/after layout change to catch re-render regressions

**Phase warning:** Layout restructuring phase

---

### P11: Accessibility Regression

**What happens:** New navigation structure breaks keyboard navigation, focus management, and screen reader announcements. Sidebar navigation needs proper ARIA roles (`navigation`, `menubar`). Page title doesn't update on route change. Skip-to-content link breaks.

**Real-world evidence:**
- CSS-Tricks SPA accessibility: "Client-side routing in a SPA means that only a part of the page will update; there isn't a full page reload. [...] It was difficult for a keyboard user to use our 'Jump to Content' link." ([css-tricks.com](https://css-tricks.com/how-we-improved-the-accessibility-of-our-single-page-app-menu/))
- Vispero: "Single page app frameworks have been around for over a decade, and yet we're still exploring solutions for how to use them inclusively."

**Prevention:**
1. Add `role="navigation"` and `aria-label` to sidebar
2. Manage focus on route change — move focus to main content area
3. Update `document.title` on every route change
4. Test with keyboard-only navigation after each layout/screen change

**Phase warning:** Layout phase + verification phase

---

## Minor Pitfalls

> These are **annoyances or quality issues** — fixable but worth preventing proactively.

### P12: Image/Asset Contrast Issues in Light Mode

**What happens:** Icons, illustrations, or images designed for dark backgrounds look washed out or invisible on light backgrounds. Dark-colored icons on light backgrounds may need inverted variants.

**Prevention:**
1. Audit all SVG icons and images for contrast on light backgrounds
2. Use `currentColor` for SVG icons so they inherit text color
3. Test any hardcoded image assets (if any) against new backgrounds

---

### P13: CSS File Size Bloat During Transition

**What happens:** During migration, both old and new styles coexist in `index.css`, potentially doubling its size. Unused old styles remain after migration is complete.

**Prevention:**
1. Track which old rules are superseded and comment them for removal
2. After full migration, do a CSS cleanup pass to remove dead code
3. Consider CSS-in-JS or CSS modules for new components to avoid global conflicts

---

### P14: Loading State Aesthetic Mismatch

**What happens:** AI processing shows a dark-themed spinner while the rest of the page is light-themed. Toast notifications, modal overlays, and skeleton screens retain old styling.

**Prevention:**
1. Build shared UI primitives (Spinner, Toast, Modal, Skeleton) with new design system FIRST
2. These shared components should be redesigned in the foundation phase, not the screen phases

---

### P15: Font/Typography Rendering Differences

**What happens:** Fonts optimized for dark backgrounds (often lighter weight) look thin or hard to read on light backgrounds. Typography scale that worked in dark mode may need adjustment.

**Prevention:**
1. Re-evaluate font-weight for light mode — typically needs heavier weights than dark mode
2. Test body text readability (16px minimum) and heading hierarchy on light backgrounds
3. Verify Google Fonts are loaded correctly in new design

---

## Phase-Specific Warnings

| Phase | Pitfalls | Risk Level | Key Actions |
|-------|----------|------------|-------------|
| **Design System Foundation** (tokens, primitives) | P1, P3, P7, P15 | 🔴 CRITICAL | Build complete token layer from scratch. Don't invert — design for light. Test depth/elevation tokens for all surface types. |
| **Layout/Navigation Restructuring** | P2, P4, P5, P9, P10, P11 | 🔴 CRITICAL | Separate logic from layout BEFORE restructuring. Keep auth boundary above layout. Test responsive + keyboard nav immediately. Build sidebar as isolated component. |
| **Screen Redesigns (each)** | P2, P6, P7, P8, P9, P12 | 🟡 MODERATE | Redesign ALL states (loading/error/empty). Test core interactions after visual changes. Maintain cross-screen consistency. |
| **Shared Components** (Modal, Toast, Spinner) | P3, P8, P14 | 🟡 MODERATE | Build these BEFORE screen redesigns so screens can use them. |
| **Final Polish/Verification** | P6, P11, P13, P15 | 🟢 LOW | CSS cleanup, accessibility audit, performance profile, full cross-screen consistency check. |

---

## Prevention Strategy Summary

### The "Incremental Migration" Golden Rule

Based on evidence from healthcare.gov, Facebook, Twitter, Shopify, and multiple engineering blogs:

> **"Default to incremental modernisation — a sequence of small, testable releases — even for monolithic [frontends]. Use big-bang only if the business can truly tolerate freeze + cutover risk."** — Tricension

For DesignDNA specifically:
1. **Keep app working at every commit** — never have a "broken middle" state
2. **Foundation first** — design tokens, shared primitives, layout shell
3. **Screen-by-screen migration** — each screen gets new tokens/layout but core logic untouched
4. **Verify after each screen** — interactions, auth, responsive, accessibility
5. **Clean up last** — remove old CSS, dead code, unused imports

### The Anti-Pattern Hierarchy

| Rank | Anti-Pattern | Impact |
|------|-------------|--------|
| 1 | Rewriting all CSS at once | Cascading breakage across all screens |
| 2 | Moving component logic during visual restructuring | Silent functional regression |
| 3 | Treating light mode as "inverted dark mode" | Ugly and unusable depth/contrast |
| 4 | Changing navigation without mapping old→new flows | Users can't find features |
| 5 | Deferring edge case states to "later" | Inconsistent, unprofessional feel |

---

## Sources

| Source | Topic | Confidence |
|--------|-------|------------|
| [NN/g — Radical vs Incremental Redesign](https://www.nngroup.com/articles/radical-incremental-redesign/) | Big-bang vs incremental strategy | ⭐⭐⭐⭐⭐ |
| [NN/g — Dark Mode Users Issues](https://www.nngroup.com/articles/dark-mode-users-issues/) | Dark/light mode depth, contrast, overlays | ⭐⭐⭐⭐⭐ |
| [Healthcare.gov Redesign Case Study](https://www.hannaliebl.com/blog/evergreen-software-development-shipping-a-redesign-of-enrollment-apps-on-healthcare-dot-gov/) | Real-world incremental redesign (Angular→React) | ⭐⭐⭐⭐⭐ |
| [Martin Fowler — Modularizing React Apps](https://martinfowler.com/articles/modularizing-react-apps.html) | Component restructuring patterns | ⭐⭐⭐⭐⭐ |
| [potapov.dev — Why Big Rewrites Fail](https://potapov.dev/blog/why-rewrites-fail/) | 25 years of rewrite failure evidence | ⭐⭐⭐⭐⭐ |
| [XB Software — Legacy UI Redesign Mistakes](https://xbsoftware.com/blog/legacy-app-ui-redesign-mistakes/) | Navigation restructuring UX traps | ⭐⭐⭐⭐ |
| [Experience Dynamics — Incremental vs Big Bang](https://expdyn.medium.com/incremental-vs-big-bang-redesigns-evaluating-design-changes-for-users-2cb15dea05a4) | Change-shock management, real user quotes | ⭐⭐⭐⭐ |
| [CSS-Tricks — SPA Menu Accessibility](https://css-tricks.com/how-we-improved-the-accessibility-of-our-single-page-app-menu/) | SPA navigation accessibility patterns | ⭐⭐⭐⭐ |
| [Vispero — Client-side Routing Accessibility](https://vispero.com/resources/client-side-routing-accessibility/) | Focus management, page titles in SPAs | ⭐⭐⭐⭐ |
| [supercharge.design — Dark UI Mistakes](https://supercharge.design/articles/6-mistakes-to-avoid-in-dark-ui-design) | Dark mode depth, saturation, contrast | ⭐⭐⭐⭐ |
| [webwave.me — Dark Mode Design](https://webwave.me/blog/dark-mode-design-trends) | Common dark mode myths and mistakes | ⭐⭐⭐ |
| [Strangler Fig Approach — Medium](https://medium.com/@ss_54118/the-strangler-fig-approach-why-incremental-modernization-beats-big-bang-rewrites-f88bb584390a) | Incremental migration framework | ⭐⭐⭐ |
| [CSS-Tricks — Easy Dark Mode in React](https://css-tricks.com/easy-dark-mode-and-multiple-color-themes-in-react/) | CSS custom property approach for theming | ⭐⭐⭐ |
| [WalkMe — Incremental vs Big Bang](https://www.walkme.com/blog/incremental-change/) | Change management pros/cons | ⭐⭐⭐ |
| [React.dev — Incremental Adoption](https://react.dev/learn/react-compiler/incremental-adoption) | Directory-based incremental adoption patterns | ⭐⭐⭐ |

---

## Quality Gate Checklist

- [x] At least 10 specific pitfalls documented (15 documented)
- [x] Each with prevention strategy (all 15 have specific prevention steps)
- [x] Phase-specific warnings included (5 phases mapped with pitfalls and risk levels)
- [x] Real-world case studies or sources referenced (15 sources with confidence ratings)
