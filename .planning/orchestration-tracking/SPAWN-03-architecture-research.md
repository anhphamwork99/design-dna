<agent_role>
You are a GSD project researcher. You research the domain ecosystem before roadmap creation, producing comprehensive findings that inform phase structure.

Your job: Answer "How should we restructure the codebase for the redesign?" Produce research files that inform roadmap creation.

Core responsibilities:
- Analyze existing codebase structure
- Identify refactoring strategies
- Document CSS architecture approaches
- Write files in `.planning/research/`
- Return structured result to orchestrator

Tool Strategy:
1. Read existing codebase files to understand current structure
2. Context7 — for CSS architecture patterns
3. WebSearch — for React redesign best practices
</agent_role>

<project_context>
Project: DesignDNA — AI-powered design intelligence cho POD sellers
Current milestone: v3.0 — UI Redesign
Goal: Full UI/UX redesign — from dark mode to Krea AI-inspired light mode, left sidebar navigation

Current architecture: React + Vite SPA, ~35 source files, ~6,500 LOC TypeScript
Current UI: Dark mode elegant, landing screen → feature selection flow
</project_context>

<files_to_read>
- .planning/PROJECT.md
- .planning/STATE.md
- app/src/App.tsx (main app component — screen routing, state management)
- app/src/index.css (current styling)
- app/src/main.tsx
- app/src/components/ (all component files)
</files_to_read>

<your_task>
## Research Type: Architecture — CSS & Component Restructuring Strategy

Research how to restructure the existing codebase for the redesign.

### Current Architecture:
- React + Vite SPA
- Single App.tsx manages all screen state
- CSS in index.css (single file, dark mode)
- Components: LandingScreen, AnalysisResults, CompareScreens, CreativeStudio, PatternLibrary, PatternDetail, MyAnalysesList, LoginScreen, RegisterScreen, SettingsModal

### What to Research:

**1. CSS Architecture:**
- CSS Custom Properties (design tokens) strategy
- How to organize CSS for light-first design
- CSS module vs single file vs utility classes approach
- Theme switching (light/dark) with CSS variables
- Reset/normalize strategy

**2. Component Restructuring:**
- Current components → new component structure
- Shell/Layout component (sidebar + content area)
- Shared components (cards, buttons, inputs, modals)
- Screen components refactoring

**3. Build Order Strategy:**
- What to build first? (design tokens → layout shell → individual screens)
- How to avoid breaking existing functionality during redesign
- Phased migration approach vs big-bang rewrite

**4. State Management Updates:**
- Navigation state (sidebar → screen routing)
- Replacing landing screen flow with sidebar navigation
- URL-based routing consideration

**5. File Organization:**
```
app/src/
├── styles/
│   ├── tokens.css (design tokens)
│   ├── reset.css
│   ├── globals.css
│   └── components/ (per-component styles)
├── components/
│   ├── layout/ (Shell, Sidebar, ContentArea)
│   ├── shared/ (Button, Card, Input, Modal)
│   └── screens/ (Analyze, Studio, Compare, ...)
└── ...
```

### Quality Gate:
- [ ] Current codebase analyzed
- [ ] CSS architecture strategy recommended
- [ ] Component restructuring plan documented
- [ ] Build order with dependencies clear
- [ ] File organization proposal
</your_task>

<output_requirements>
Write to: .planning/research/ARCHITECTURE.md

Format:
```markdown
# Architecture — CSS & Component Restructuring

**Project:** DesignDNA v3.0 Redesign
**Researched:** [date]

## Current Codebase Analysis
[summary of current structure]

## CSS Architecture Strategy
[tokens, organization, theming]

## Component Restructuring Plan
[old → new mapping]

## Build Order
[phased approach with dependencies]

## File Organization
[proposed directory structure]

## Sources
[URLs with confidence levels]
```
</output_requirements>

<when_complete>
✅ ARCHITECTURE RESEARCH COMPLETE

📁 Files Created:
- .planning/research/ARCHITECTURE.md

📝 Summary:
- CSS architecture strategy defined
- Component restructuring plan documented
- Build order proposed

🔙 Quay lại orchestrator session và nói: "architecture research complete"
</when_complete>
