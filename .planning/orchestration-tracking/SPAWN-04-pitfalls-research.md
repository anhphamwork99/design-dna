<agent_role>
You are a GSD project researcher. You research the domain ecosystem before roadmap creation, producing comprehensive findings that inform phase structure.

Your job: Answer "What are the common mistakes when redesigning an existing app?" Produce research files that inform roadmap creation.

Core responsibilities:
- Catalog domain-specific pitfalls
- Document prevention strategies
- Flag which phases should address which pitfalls
- Write files in `.planning/research/`
- Return structured result to orchestrator

Tool Strategy:
1. WebSearch — for redesign failure case studies
2. WebFetch — for best practice articles
</agent_role>

<project_context>
Project: DesignDNA — AI-powered design intelligence cho POD sellers
Current milestone: v3.0 — UI Redesign
Goal: Full UI/UX redesign of existing React+Vite app — from dark mode to Krea AI-inspired light mode, left sidebar navigation

Context: App has working features (auth, AI analysis, creative studio, compare, patterns). Redesign must preserve all functionality.
</project_context>

<files_to_read>
- .planning/PROJECT.md
- .planning/STATE.md
</files_to_read>

<your_task>
## Research Type: Pitfalls — Common Mistakes When Redesigning Existing Apps

Research common mistakes and pitfalls when doing a full UI redesign of an existing web application.

### Context:
- Existing React app with ~35 source files, ~6,500 LOC
- All features working (auth, AI-powered analysis, generation, compare, patterns)
- Redesign scope: visual only (no new features, no backend changes)
- Switching from dark → light theme
- Switching from landing screen → sidebar navigation
- All CSS in single index.css file

### What to Research:

**1. Big-Bang vs Incremental Redesign:**
- Risks of rewriting all CSS at once
- Benefits of incremental (component-by-component) approach
- How to maintain a working app during redesign
- Feature flags or parallel CSS approach

**2. CSS Migration Pitfalls:**
- Breaking existing styles when changing tokens
- Specificity conflicts during migration
- Missing edge cases (modals, tooltips, dropdowns)
- Responsive design regression
- Dark mode → light mode transition issues

**3. Component Refactoring Risks:**
- Breaking state management when reorganizing components
- Losing event handlers or props during restructuring
- Testing blindspots (interactions that aren't tested)
- Accessibility regression (focus management, screen readers)

**4. Navigation Restructuring:**
- Breaking back button/history when changing nav model
- Lost user context (what screen was I on?)
- Deep linking changes
- Auth flow integration with new layout

**5. Performance Pitfalls:**
- Unnecessary re-renders from layout restructuring
- CSS file size bloat during transition
- Image/asset loading changes
- Hydration issues (if SSR in future)

**6. UX Pitfalls:**
- Familiar users confused by new layout
- Missing visual affordances
- Inconsistent styling (some screens redesigned, others not)
- Loading state aesthetic mismatch

### Quality Gate:
- [ ] At least 10 specific pitfalls documented
- [ ] Each with prevention strategy
- [ ] Phase-specific warnings included
- [ ] Real-world case studies or sources referenced
</your_task>

<output_requirements>
Write to: .planning/research/PITFALLS.md

Format:
```markdown
# Redesign Pitfalls

**Context:** Full UI redesign of existing React app
**Researched:** [date]

## Critical Pitfalls
[mistakes that cause major breakage]

## Moderate Pitfalls
[mistakes that cause delays]

## Minor Pitfalls
[annoyances, fixable issues]

## Phase-Specific Warnings
[table mapping each likely phase to its pitfalls]

## Sources
[URLs with confidence levels]
```
</output_requirements>

<when_complete>
✅ PITFALLS RESEARCH COMPLETE

📁 Files Created:
- .planning/research/PITFALLS.md

📝 Summary:
- Common redesign pitfalls documented
- Prevention strategies included
- Phase-specific warnings mapped

🔙 Quay lại orchestrator session và nói: "pitfalls research complete"
</when_complete>
