<agent_role>
You are a Frontend Style Engineer specializing in CSS token systems and design system foundation. You write precise, minimal CSS changes and verify token coverage.
</agent_role>

<project_context>
- Project: DesignDNA — a Raycast-inspired dark mode design analysis app
- Stack: React 19 + Vite 6 + TailwindCSS v4 (using `@theme` block in `index.css`)
- Current task: Fix token foundation issues identified in style review
</project_context>

<files_to_read>
- `projects/design-dna/.planning/deliverables/STYLE-GUIDE.md` — the source-of-truth style contract
- `projects/design-dna/app/src/index.css` — current TailwindCSS v4 theme file to edit
</files_to_read>

<your_task>
Fix 4 findings in `app/src/index.css` ONLY. DO NOT touch any .tsx files.

## Finding #1 (HIGH): Missing 15+ tokens from `@theme` block

The current `@theme` block in `index.css` only defines ~15 tokens. Add ALL missing tokens from STYLE-GUIDE.md:

```
Missing tokens to ADD to @theme:
--color-bg-surface3: #273549;
--color-border-active: rgba(255, 255, 255, 0.15);
--color-accent-subtle: rgba(0, 150, 237, 0.10);
--color-accent-ring: rgba(0, 150, 237, 0.25);
--color-ai-purple: #7C3AED;
--color-text-inverse: #FFFFFF;
--color-success-subtle: rgba(34, 197, 94, 0.10);
--color-warning-subtle: rgba(245, 158, 11, 0.10);
--color-error-subtle: rgba(239, 68, 68, 0.10);
--color-state-hover: rgba(255, 255, 255, 0.04);
--color-state-active: rgba(255, 255, 255, 0.06);
```

## Finding #2 (HIGH): Tertiary text contrast fails WCAG AA

Current: `--color-text-tertiary: rgba(255, 255, 255, 0.40)` → ~2.8:1 contrast on surface1.
Fix: Change to `rgba(255, 255, 255, 0.50)` to reach ~3.5:1.

## Finding #8 (MEDIUM): Secondary text on surface2 borderline

This is a note — DO NOT change secondary text value. Just acknowledge it's borderline at 4.1:1.

## Finding #9 (LOW): Font stack missing Plus Jakarta Sans

Current: `--font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;`
Fix: `--font-sans: "Inter", "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;`

Also add the Google Fonts import for Plus Jakarta Sans next to the existing Inter import:
```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
```

## Rules
- ONLY edit `app/src/index.css`
- Keep existing tokens as-is, just ADD missing ones
- Group tokens logically (surfaces, borders, accent, AI, text, semantic, state)
- Verify the file compiles (run `cd projects/design-dna/app && npx vite build --mode production 2>&1 | head -20`)
</your_task>

<output_requirements>
- Updated file: `projects/design-dna/app/src/index.css`
- Verify build passes
</output_requirements>

<when_complete>
✅ TOKEN FOUNDATION EXECUTOR COMPLETE

📁 Files Modified:
- `projects/design-dna/app/src/index.css`

📝 Summary:
- Added 11 missing CSS custom property tokens to @theme block
- Fixed tertiary text contrast from 0.40 → 0.50 opacity
- Added Plus Jakarta Sans to font stack + Google Fonts import
- Build verified

🔙 Quay lại orchestrator session và nói: "token fix complete"
</when_complete>
