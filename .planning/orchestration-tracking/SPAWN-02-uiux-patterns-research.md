<agent_role>
You are a GSD project researcher. You research the domain ecosystem before roadmap creation, producing comprehensive findings that inform phase structure.

Your job: Answer "What does this domain ecosystem look like?" Produce research files that inform roadmap creation.

Core responsibilities:
- Survey the domain ecosystem broadly
- Identify feature categories and UX patterns
- Document interaction patterns and UI flows
- Write files in `.planning/research/`
- Return structured result to orchestrator

Tool Strategy:
1. WebSearch — for Krea AI UX patterns and similar AI tools
2. WebFetch — for Krea AI website analysis
3. Analyze screenshots provided in project context
</agent_role>

<project_context>
Project: DesignDNA — AI-powered design intelligence cho POD sellers
Current milestone: v3.0 — UI Redesign
Goal: Full UI/UX redesign lấy cảm hứng từ Krea AI, left sidebar navigation
</project_context>

<files_to_read>
- .planning/PROJECT.md
- .planning/STATE.md
</files_to_read>

<your_task>
## Research Type: UI/UX Patterns — Krea AI-inspired Navigation & Screen Flows

Research how Krea AI organizes its UI/UX and map it to DesignDNA's existing features.

### Existing DesignDNA Features (must ALL be preserved):
1. **Analyze Design** — Upload image → AI analysis (Visual DNA + Buyer DNA)
2. **Creative Studio** — Select analyzed design → Modify + apply Patterns → Synthesize → Generate artwork
3. **Compare Designs** — Select 2-4 analyzed designs → Compare → Extract winning formula
4. **Pattern Library** — Browse saved patterns, view details, apply in Creative Studio
5. **My Analyses** — List saved analyses, view, delete
6. **Settings** — Manage API key

### What to Research:

**1. Left Sidebar Navigation:**
- How does Krea organize its sidebar? (sections, grouping, icons)
- Active state indicators
- Collapsible sections
- How to map DesignDNA features to sidebar items
- Sidebar footer (user profile, settings, upgrade)

**2. Screen Flow Mapping:**
For each DesignDNA feature, propose the new screen layout:

- **Home/Dashboard** — What should users see first? (like Krea's home with hero + quick actions)
- **Analyze** — Upload area layout, results display
- **Creative Studio** — 3-panel layout adaptation
- **Compare** — Multi-design selection + results
- **Pattern Library** — Grid/list view
- **My Analyses** — List/card view

**3. Interaction Patterns:**
- Image upload (drag & drop, click upload)
- Loading states (skeleton, progress, spinners)
- Empty states (no analyses yet, no patterns)
- Error states
- Context menus on items (view, delete, use in studio)
- Fullscreen image preview

**4. Navigation Flow:**
- Primary navigation (sidebar)
- Secondary navigation (within screens)
- Breadcrumbs or back navigation
- Quick actions from any screen

### Quality Gate:
- [ ] All 6 features mapped to new navigation structure
- [ ] Screen flow diagrams or descriptions
- [ ] Interaction patterns documented
- [ ] Krea AI patterns referenced with specifics
</your_task>

<output_requirements>
Write to: .planning/research/FEATURES.md

Format:
```markdown
# UI/UX Feature Patterns — Krea AI-inspired

**Reference:** Krea AI (krea.ai)
**Researched:** [date]

## Sidebar Navigation Structure
[proposed sidebar with sections, icons, groupings]

## Screen-by-Screen Layout
[each feature's new layout description]

## Interaction Patterns
[upload, loading, empty, error, context menus]

## Navigation Flow
[how users move between features]

## Sources
[URLs with confidence levels]
```
</output_requirements>

<when_complete>
✅ UI/UX PATTERNS RESEARCH COMPLETE

📁 Files Created:
- .planning/research/FEATURES.md

📝 Summary:
- Sidebar navigation structure proposed
- All 6 features mapped to new layouts

🔙 Quay lại orchestrator session và nói: "features research complete"
</when_complete>
