# Phase 18 Context: Home Screen

## 🎯 Phase Goal
Build the Home Screen as a premium Dashboard hub for DesignDNA v3.0, replacing the initial "Upload Zone" concept with a structured feature-exploration and horizontal carousel layout.

---

## 🔒 Decisions Made
*Downstream agents MUST honor these constraints. Do not research alternatives or design outside these boundaries.*

1. **No Upload Zone on Home:** The Home screen must NOT contain an immediate file drop/upload zone. Uploading is explicitly deferred to `/analyze/new` or the Compare screen.
2. **Hero-Style Feature Sections:** Instead of small Action Cards, the dashboard features distinct "Hero-style block" sections (e.g., Analyze, Creative Studio, Compare). Each block must clearly communicate the *benefit* of the feature, accompanied by a primary CTA and a mini-illustration or supportive graphic.
3. **Recent Analyses Carousel:** "Recent Analyses" must be displayed in a horizontal Carousel. The carousel MUST include explicit Left/Right navigation arrows (`<`, `>`) alongside native scroll/trackpad support.
4. **No Empty State:** The traditional "No analyses found" empty state is completely removed.
5. **Onboarding Checklist (Option A):** For new users with no history, a "Getting Started" checklist (e.g., "[ ] Analyze a design, [ ] Generate artwork in Studio") replaces the empty state. This module sits prominently on the Home screen and provides direct CTAs to complete the core user pathways. It should occupy the space where the Carousel would normally be, or sit immediately above the Feature sections.

---

## 🧭 Agent's Discretion
*Downstream agents have freedom to explore and recommend within these areas:*

- The specific text/copy for the Hero blocks and the Onboarding checklist (use the UX writing style guide).
- The exact layout mechanism for the Carousel (e.g., Embla Carousel wrapper vs native CSS scroll snap with JS-controlled arrow buttons).
- The layout positioning of the Onboarding module vs the Carousel (e.g., should the checklist collapse gracefully when 100% complete, or disappear entirely?).
- What placeholder imagery/icons to use in the Hero blocks (using existing Lucide icons or basic CSS shapes/shimmers).

---

## 🚫 Deferred Ideas
*Do NOT build or plan these in this phase:*

- In-place file uploads at the dashboard level (violates Decision #1).
- Complex guided tours (e.g., Joyride or Coachmarks) — stick to the simple checklist.
- Dummy/Sample data overriding the user's actual empty state.
