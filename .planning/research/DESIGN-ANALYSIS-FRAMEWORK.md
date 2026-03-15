# Reverse-Engineering Graphic Design for Print On Demand

> **Mục tiêu:** Xây dựng methodology có hệ thống để phân tích, reverse-engineer, và tái tạo graphic designs — đặc biệt cho ngành Print On Demand (POD). Bao gồm cả Visual Analysis, Strategic Analysis, và AI-Assisted Prompt Templates.

---

## Mục Lục

1. [Tổng Quan & Triết Lý](#1-tổng-quan--triết-lý)
2. [Framework Phân Tích Thiết Kế — 6 Layers](#2-framework-phân-tích-thiết-kế--6-layers)
3. [Layer 1: Composition & Layout](#3-layer-1-composition--layout)
4. [Layer 2: Color Analysis](#4-layer-2-color-analysis)
5. [Layer 3: Typography Analysis](#5-layer-3-typography-analysis)
6. [Layer 4: Graphic Elements & Style](#6-layer-4-graphic-elements--style)
7. [Layer 5: Strategic & Market Analysis](#7-layer-5-strategic--market-analysis)
8. [Layer 6: POD-Specific Technical Analysis](#8-layer-6-pod-specific-technical-analysis)
9. [POD Design Trends 2025-2026](#9-pod-design-trends-2025-2026)
10. [Systematic Reverse-Engineering Process](#10-systematic-reverse-engineering-process)
11. [AI-Assisted Analysis Prompts (Gemini)](#11-ai-assisted-analysis-prompts-gemini)
12. [AI-Assisted Recreation Prompts](#12-ai-assisted-recreation-prompts)
13. [Creative Adaptation Framework](#13-creative-adaptation-framework)
14. [Checklist & Worksheets](#14-checklist--worksheets)
15. [Tools & Resources](#15-tools--resources)

---

## 1. Tổng Quan & Triết Lý

### Reverse-Engineering Design là gì?

Reverse-engineering design là quá trình **phân tích ngược** một thiết kế hoàn thiện để hiểu:
- **WHY** — Tại sao thiết kế này hoạt động hiệu quả?
- **HOW** — Thiết kế được xây dựng như thế nào?
- **WHAT** — Có thể học được gì để áp dụng vào thiết kế mới?

### Mô hình Analysis → Synthesis (Noble & Bestley)

Dựa trên framework học thuật từ "Visual Research" (Noble & Bestley):

```
Analysis (Phân tích)              Synthesis (Tổng hợp)
─────────────────────            ─────────────────────
• Deconstruct                    • Reconstruct
• Identify patterns              • Apply learnings
• Understand context             • Create new solutions
• Map relationships              • Innovate with intent
```

### Matt Cooke's 4-Stage Methodology

Áp dụng cho reverse-engineering design:

| Stage | Tên | Mô tả |
|-------|------|--------|
| 1 | **Definition** | Xác định mục tiêu phân tích: Học gì? Tái tạo gì? |
| 2 | **Divergence** | Thu thập, phân tích rộng: so sánh, tìm patterns |
| 3 | **Transformation** | Thử nghiệm, prototype, test với audience |
| 4 | **Convergence** | Tổng hợp, tạo solution cuối cùng |

---

## 2. Framework Phân Tích Thiết Kế — 6 Layers

Mỗi thiết kế POD có thể được phân tích qua **6 layers** từ macro đến micro:

```
┌─────────────────────────────────────────────────────┐
│  Layer 6: POD-Specific Technical                    │
│  ┌─────────────────────────────────────────────┐    │
│  │  Layer 5: Strategic & Market                │    │
│  │  ┌─────────────────────────────────────┐    │    │
│  │  │  Layer 4: Graphic Elements & Style  │    │    │
│  │  │  ┌─────────────────────────────┐    │    │    │
│  │  │  │  Layer 3: Typography        │    │    │    │
│  │  │  │  ┌─────────────────────┐    │    │    │    │
│  │  │  │  │  Layer 2: Color     │    │    │    │    │
│  │  │  │  │  ┌─────────────┐    │    │    │    │    │
│  │  │  │  │  │ Layer 1:    │    │    │    │    │    │
│  │  │  │  │  │ Composition │    │    │    │    │    │
│  │  │  │  │  └─────────────┘    │    │    │    │    │
│  │  │  │  └─────────────────────┘    │    │    │    │
│  │  │  └─────────────────────────────┘    │    │    │
│  │  └─────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

---

## 3. Layer 1: Composition & Layout

### 3.1 Grid System Identification

| Grid Type | Đặc điểm | Khi nào dùng |
|-----------|-----------|---------------|
| **Rule of Thirds** | Chia 3×3, đặt focal points tại giao điểm | Đa số designs |
| **Golden Ratio (φ)** | Tỷ lệ ~1.618:1, Fibonacci spiral | Designs cao cấp, elegant |
| **Center-aligned** | Đối xứng qua trục giữa | Designs đơn giản, emblems |
| **Modular Grid** | Chia thành modules đều nhau | Designs nhiều elements |

### 3.2 Checklist Composition

```
□ Overall shape of design (circle, rectangle, triangle, organic?)
□ Symmetry type: Symmetrical / Asymmetrical / Radial
□ Focal point position: Center / Rule-of-thirds / Golden ratio
□ Visual flow direction: Top→Bottom / Left→Right / Circular / Z-pattern
□ Negative space usage: Minimal / Balanced / Generous
□ Design boundary: Contained / Bleeds / Floats
□ Element density: Sparse / Moderate / Dense
□ Depth/Layering: Flat / Layered / 3D illusion
```

### 3.3 Visual Hierarchy Analysis

Xác định thứ tự ưu tiên thị giác:

| Yếu tố | Phương pháp | Ví dụ |
|---------|-------------|-------|
| **Size** | Element lớn = quan trọng | Headline vs body text |
| **Color/Contrast** | Màu nổi bật = chú ý | Red accent trên nền dark |
| **Position** | Trên/trái = đọc trước | Logo ở trên cùng |
| **Whitespace** | Không gian quanh = isolate | Logo có padding rộng |
| **Weight** | Bold/thick = stronger | Bold headline |
| **Texture/Detail** | Nhiều detail = attention | Illustration focal point |

### 3.4 Design Placement (POD-Specific)

| Vị trí | Kích thước tiêu chuẩn | Đặc điểm |
|--------|----------------------|-----------|
| **Center Chest** | ~10×12" | Visibility cao, bold statements |
| **Left Chest** | ~3.5×3.5" | Subtle, professional branding |
| **Full Front** | ~11×13" (adults) | Maximum impact |
| **Upper Back** | ~10×5" | Team names, secondary design |
| **Full Back** | ~11×15" | Large-scale artwork |
| **Sleeve** | ~3×3" | Subtle branding accent |

> **Rule of Thumb:** Design nên chiếm ~70% chiều rộng áo. Khoảng cách từ cổ áo: 3-4 inches cho center chest.

---

## 4. Layer 2: Color Analysis

### 4.1 Color Extraction Process

```
Step 1: Screenshot / isolate design
Step 2: Extract dominant colors (tool: Adobe Color / Coolors)
Step 3: Record each color in 3 formats:
        → HEX (#FF5733)
        → RGB (255, 87, 51)
        → HSL (11°, 100%, 60%)
Step 4: Count total colors used
Step 5: Identify color ratio (60-30-10 rule)
```

### 4.2 Color Harmony Identification

| Harmony Type | Mô tả | Cảm xúc | POD Use Case |
|-------------|--------|---------|--------------|
| **Complementary** | Đối diện trên color wheel | Vibrant, energetic | Statement tees, sporty |
| **Analogous** | Cạnh nhau trên wheel | Harmonious, natural | Nature themes, wellness |
| **Triadic** | 3 cách đều nhau | Balanced, vibrant | Fun, playful designs |
| **Monochromatic** | Shades/tints 1 color | Sophisticated, cohesive | Premium, minimal |
| **Split-complementary** | 1 base + 2 adjacent to complement | Contrast nhưng soft hơn | Retro, balanced |

### 4.3 Color Psychology trong POD

| Color | Emotion/Association | POD Application |
|-------|-------------------|-----------------|
| **Red** | Energy, passion, urgency | Sports, motivation, cause |
| **Blue** | Trust, calm, professionalism | Corporate, ocean, travel |
| **Green** | Nature, health, growth | Eco-friendly, wellness |
| **Yellow** | Optimism, happiness, warmth | Summer, kids, cheerful |
| **Black** | Elegance, power, mystery | Streetwear, premium |
| **White** | Clean, minimal, pure | Minimalist, medical |
| **Earth tones** | Natural, organic, grounded | Sustainability, outdoor |

### 4.4 HSL Analysis Framework

HSL (Hue, Saturation, Lightness) là model trực quan nhất cho phân tích:

```
Hue (0-360°):
  0° = Red → 60° = Yellow → 120° = Green → 180° = Cyan 
  → 240° = Blue → 300° = Magenta → 360° = Red

Saturation (0-100%):
  0% = Gray (desaturated) → 100% = Pure vivid color
  POD tip: 60-80% saturation thường tốt nhất cho print

Lightness (0-100%):
  0% = Black → 50% = Pure color → 100% = White
  POD tip: Tránh >90% (quá sáng) hoặc <10% (quá tối)
```

---

## 5. Layer 3: Typography Analysis

### 5.1 Font Classification

| Category | Đặc điểm | Mood | POD Examples |
|----------|-----------|------|-------------|
| **Serif** | Có chân (serifs) | Traditional, trustworthy | Vintage, literary |
| **Sans-serif** | Không chân | Modern, clean | Minimalist, tech |
| **Script** | Handwriting style | Elegant, personal | Wedding, feminine |
| **Display** | Decorative, bold | Eye-catching, unique | Headlines, logos |
| **Monospace** | Equal-width chars | Technical, retro | Tech humor, coding |
| **Hand-drawn** | Rough, organic | Authentic, casual | Y2K, sketch-style |

### 5.2 Typography Hierarchy Checklist

```
□ Primary text (headline): 
  - Font name/classification?
  - Size relative to design?
  - Weight (bold/regular/light)?
  - Case (UPPERCASE/lowercase/Title Case)?
  - Color?

□ Secondary text (sub-headline):
  - Same font or different?
  - Size ratio vs primary? (typically 60-70% of primary)
  - Visual distinction method?

□ Tertiary text (body/tagline):
  - Font choice?
  - Readability at distance?

□ Font pairing:
  - How many fonts used? (ideal: 1-2, max: 3)
  - Contrast between fonts? (serif + sans-serif, display + text)
  - Do fonts share similar x-height?
```

### 5.3 Spacing Analysis

| Metric | Mô tả | Cách đo | Standard |
|--------|--------|---------|----------|
| **Kerning** | Space giữa 2 ký tự cụ thể | So pairs cụ thể (AV, WA, To) | Optical even spacing |
| **Tracking** | Space đều giữa tất cả ký tự | Xem tổng thể line | Loose cho uppercase, tight cho display |
| **Leading** | Khoảng cách giữa baselines | Đo baseline-to-baseline | ≥120% font size |

### 5.4 Typography-on-Product Considerations

- **Legibility at distance:** Text phải đọc được từ 3-5 feet
- **Contrast with garment:** Light text trên dark garment hoặc ngược lại
- **Scale across sizes:** Design trên S/M sẽ khác trên 2XL/3XL
- **Print method match:** DTG cho complex type, embroidery cho simple/thick type

---

## 6. Layer 4: Graphic Elements & Style

### 6.1 Illustration Style Taxonomy

| Style | Đặc điểm | Trending for POD? |
|-------|-----------|-------------------|
| **Line art** | Clean lines, no fills | ✅ Timeless, versatile |
| **Flat/minimalist** | Solid colors, no gradients | ✅ Modern, print-friendly |
| **Vintage/retro** | Aged textures, muted colors | ✅ Nostalgia trend |
| **Hand-drawn** | Organic, imperfect strokes | ✅ Authenticity trend |
| **Cartoon/anime** | Exaggerated proportions | ✅ Gen Z appeal |
| **Photorealistic** | Detailed rendering | ⚠️ Hard to print well |
| **Abstract/geometric** | Shapes & patterns | ✅ Universal appeal |
| **Mixed-media** | Combo photo + illustration | ✅ 2025-2026 trend |
| **Watercolor** | Soft, flowing pigments | ✅ Art/craft market |
| **3D/isometric** | Dimensional appearance | ✅ Tech/gaming |

### 6.2 Element Decomposition Checklist

```
□ Primary element(s): What is the main visual?
  - Type: Illustration / Photo / Pattern / Symbol / Text-only?
  - Subject: Person / Animal / Object / Abstract / Scene?
  - Style: See taxonomy above

□ Secondary element(s): What supports the main visual?
  - Decorative frames / borders
  - Background shapes / textures
  - Accent graphics (stars, arrows, splatters)

□ Relationship: How do elements interact?
  - Layered / Side-by-side / Integrated / Isolated

□ Level of detail:
  - Simple (1-2 colors, clear shapes)
  - Medium (3-5 colors, some texture)
  - Complex (6+ colors, fine details, gradients)

□ Production notes:
  - Suitable for DTG? AOP? Embroidery?
  - Transparent background needed?
  - Color separation possible?
```

### 6.3 Visual Texture & Effect Analysis

| Effect | Technique | Impact | POD Compatibility |
|--------|-----------|--------|------------------|
| **Distressed/grunge** | Worn textures overlay | Vintage, authentic | DTG: ✅ Screen: ⚠️ |
| **Halftone dots** | Simulated print texture | Retro, comic | DTG: ✅ Screen: ✅ |
| **Gradient** | Smooth color transition | Modern, depth | DTG: ✅ Screen: ❌ |
| **Drop shadow** | Depth behind elements | Pop-out effect | DTG: ✅ |
| **Outline/stroke** | Border around elements | Clean, graphic | All methods: ✅ |
| **Metallic/foil** | Shine simulation | Premium, luxury | Special print only |

---

## 7. Layer 5: Strategic & Market Analysis

### 7.1 Design Intent Framework

```
□ Target audience:
  - Demographics: Age / Gender / Location?
  - Psychographics: Interests / Values / Lifestyle?
  - Community: What group does this speak to?

□ Message/Communication:
  - What does this design say?
  - Explicit message (text) vs Implicit message (visual)
  - Emotional trigger: Humor / Nostalgia / Pride / Identity / Cause

□ Market positioning:
  - Premium / Mid-range / Budget?
  - Niche-specific or mass-market?
  - Seasonal or evergreen?

□ Purchase motivation:
  - Self-expression ("This is who I am")
  - Gift ("Perfect for someone I know")
  - Belonging ("I'm part of this group")
  - Statement ("I believe in this")
  - Aesthetic ("This looks cool")
```

### 7.2 Trend Psychology Analysis

| Trend Type | Tâm lý | Ví dụ POD | Vòng đời |
|------------|--------|-----------|----------|
| **Nostalgia** | Comfort của quá khứ | Y2K, retro gaming, 90s | Dài (cycles) |
| **Identity** | Tự thể hiện bản thân | LGBTQ+, zodiac, career | Evergreen |
| **Cause** | Giá trị đạo đức | Eco, social justice | Medium-long |
| **Humor** | Giải trí, connection | Memes, puns, inside jokes | Ngắn-medium |
| **Pop culture** | Relevance xã hội | Movies, TV, music | Ngắn |
| **Aesthetic** | Thẩm mỹ thuần túy | Art prints, abstract | Dài |

### 7.3 Competitive Analysis Template

```
For each competing design found:
┌──────────────────────────────────────┐
│ Design URL/Source:                    │
│ Platform: Etsy / Amazon / Redbubble  │
│ Price point:                         │
│ Reviews/Sales indicators:            │
│ ────────────────────────────────────  │
│ Visual strengths:                    │
│ Visual weaknesses:                   │
│ Differentiation opportunity:         │
│ Elements worth adopting:             │
│ Elements to avoid:                   │
└──────────────────────────────────────┘
```

---

## 8. Layer 6: POD-Specific Technical Analysis

### 8.1 Print Method Compatibility Matrix

| Element | DTG | Screen Print | AOP | Embroidery | DTF |
|---------|-----|-------------|-----|-----------|-----|
| Fine detail | ✅ | ⚠️ | ✅ | ❌ | ✅ |
| Gradients | ✅ | ❌ | ✅ | ❌ | ✅ |
| Many colors (6+) | ✅ | ❌ expensive | ✅ | ❌ | ✅ |
| Photo-realistic | ✅ | ❌ | ✅ | ❌ | ✅ |
| Simple icons | ✅ | ✅ | ✅ | ✅ | ✅ |
| Text-only | ✅ | ✅ | ✅ | ✅ best | ✅ |
| Full-coverage | ❌ | ❌ | ✅ best | ❌ | ❌ |

### 8.2 File Specification Checklist

```
□ Resolution: 300 DPI minimum (for DTG)
□ Color mode: sRGB (digital print) or CMYK (offset)
□ File format: PNG (transparent bg) or AI/PSD (editable)
□ Dimensions: Match print area (e.g., 4500×5400 px for 15×18" at 300 DPI)
□ Transparent background: Required for most POD platforms
□ Color count: Note total unique colors used
□ Bleed area: If design extends to edges
```

### 8.3 Product-Specific Design Adaptations

| Product | Design Area | Key Considerations |
|---------|------------|-------------------|
| **T-shirt** | Chest, back, sleeves | Scale across sizes S-3XL, seam alignment |
| **Mug** | 11oz: ~9.5×3.5" wrap area | Design wraps, check handle placement |
| **Canvas** | Full surface | High-res needed, edge wrapping |
| **Poster** | Full surface | Bleed required, color accuracy |
| **Tote bag** | ~12×12" center area | Consider handle placement |
| **Phone case** | Varies by model | Camera cutout, edge mapping |

---

## 9. POD Design Trends 2025-2026

### 9.1 Top 7 T-Shirt Design Trends

| Rank | Trend | Description | Best For |
|------|-------|-------------|----------|
| 1 | **Art + Text Combos** | Illustrations with clever text | All niches, highest performer |
| 2 | **Art-Only** | Pure visual/aesthetic expression | Art lovers, anime, pop culture |
| 3 | **Statement & Cause** | Identity, beliefs, symbols | LGBTQ+, sports, political |
| 4 | **Animal-Inspired** | Pets, wildlife, geometric animals | Pet lovers, nature enthusiasts |
| 5 | **Y2K & 90s Nostalgia** | Chunky fonts, bold, retro icons | Gen Z, millennials |
| 6 | **Sustainability** | Eco messages, earth tones, nature | Conscious consumers |
| 7 | **Hand-Drawn/Sketch** | Raw, expressive, doodle-style | Authentic appeal, creative niche |

### 9.2 Market Forces

- **Personalization demand:** 82% consumers want tailored products
- **Eco-conscious buying:** 80% willing to spend more on sustainable
- **Limited drops:** 62% more likely to purchase limited-edition
- **Social commerce:** 70% shoppers buy directly via social media
- **Mobile-first:** 59% online retail via smartphones (2025)

### 9.3 AI Tools đang được POD sellers sử dụng

| Tool | Use Case | Strength |
|------|---------|----------|
| **Midjourney** | Unique visual styles from text | Artistic quality |
| **Adobe Firefly** | Commercially safe AI images | Legal clarity |
| **Canva + Magic Studio** | Mockup automation, smart resize | Ease of use |
| **Kittl** | POD-specific templates, direct export | Purpose-built |
| **Gemini (Google AI Studio)** | Image analysis + generation | Multimodal analysis |

---

## 10. Systematic Reverse-Engineering Process

### Step-by-Step Protocol

```
PHASE 1: CAPTURE & PREPARE
━━━━━━━━━━━━━━━━━━━━━━━━━
1. Save design image (highest resolution possible)
2. Note source: Platform, seller, price, reviews/sales
3. Note product: Type, color, print method if visible
4. Screenshot design in context (on product mockup)

PHASE 2: VISUAL DECONSTRUCTION (6 Layers)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. Layer 1 — Composition:
   → Grid type, symmetry, focal point, visual flow, density

6. Layer 2 — Color:
   → Extract palette (HEX/RGB/HSL), identify harmony, count colors
   → Apply 60-30-10 analysis

7. Layer 3 — Typography:
   → Identify fonts, hierarchy levels, spacing, weight
   → Note: case, pairing, legibility

8. Layer 4 — Graphics:
   → Illustration style, subject matter, complexity level
   → Effects, textures, layering

PHASE 3: STRATEGIC ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━
9. Layer 5 — Strategy:
   → Target audience, message, emotional trigger
   → Market positioning, trend alignment

10. Layer 6 — Technical:
    → Print method suitability, file specs
    → Product adaptation requirements

PHASE 4: SYNTHESIS & CREATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━
11. Document findings in analysis worksheet
12. Identify "transferable elements" — what to keep/adapt
13. Identify "differentiation opportunities" — what to change
14. Create design brief for new design based on analysis
15. Execute new design, test, iterate
```

---

## 11. AI-Assisted Analysis Prompts (Gemini)

### 11.1 Prompt Template: Complete Design Analysis

```
PROMPT [PASTE vào Google AI Studio cùng hình ảnh]:
───────────────────────────────────────────────────

Bạn là chuyên gia phân tích thiết kế đồ họa với kinh nghiệm sâu 
trong ngành Print On Demand.

Hãy phân tích hình ảnh thiết kế sau theo framework 6 layers:

**LAYER 1 — COMPOSITION & LAYOUT:**
- Grid type (Rule of Thirds / Center / Golden Ratio / Freeform?)
- Symmetry type (Symmetrical / Asymmetrical / Radial)
- Focal point position
- Visual flow direction
- Negative space usage (Sparse / Balanced / Dense)
- Overall shape of design composition

**LAYER 2 — COLOR:**
- List all dominant colors with HEX codes
- Color harmony type (Complementary / Analogous / Triadic / Monochromatic / Other)
- 60-30-10 breakdown (which color is dominant, secondary, accent?)
- Mood/emotion each color evokes
- Contrast level (High / Medium / Low)

**LAYER 3 — TYPOGRAPHY:**
- Identify all fonts used (or closest match)
- Font classification for each (Serif / Sans-serif / Script / Display / Hand-drawn)
- Typography hierarchy (how many levels? Size ratios?)
- Case usage (UPPERCASE / lowercase / Mixed?)
- Letter spacing: tight, normal, or loose?
- Font pairing analysis (do they complement each other?)

**LAYER 4 — GRAPHIC ELEMENTS:**
- Illustration style (Flat / Line art / Realistic / Vintage / Hand-drawn / etc.)
- Main subject/element
- Supporting/secondary elements
- Visual effects (distressed, halftone, gradient, shadow, outline, etc.)
- Level of detail (Simple / Medium / Complex)
- Estimated color count for production

**LAYER 5 — STRATEGIC ANALYSIS:**
- Target audience (demographics, interests)
- Core message or emotion
- Purchase motivation (Self-expression / Gift / Belonging / Statement / Aesthetic)
- Trend alignment (Nostalgia / Identity / Cause / Humor / Pop culture / Aesthetic)
- Market positioning (Premium / Mid-range / Budget)
- Estimated niche

**LAYER 6 — POD TECHNICAL:**
- Best print method (DTG / Screen / AOP / Embroidery / DTF)
- Recommended product types beyond current
- File preparation notes
- Scaling considerations across sizes

Format kết quả dưới dạng structured table/sections cho dễ đọc.
```

### 11.2 Prompt Template: Quick Color Analysis

```
PROMPT:
───────
Phân tích color palette từ hình ảnh này:

1. Liệt kê TẤT CẢ colors nhìn thấy được với HEX, RGB, và HSL
2. Xác định color harmony type
3. Phân tích 60-30-10 ratio
4. Đề xuất 3 color palette variations giữ cùng mood nhưng khác biệt đủ
   để tạo designs mới không trùng lặp
5. Cho biết color này phù hợp print trên garment màu gì nhất
   (đề xuất 3 garment colors tốt nhất)
```

### 11.3 Prompt Template: Typography Identification

```
PROMPT:
───────
Nhìn vào typography trong hình ảnh này:

1. Identify font name hoặc closest match cho MỖI text element
2. Phân tích typography hierarchy (heading, subheading, body, tagline)
3. Đo lường visual weight relationship giữa các text elements
4. Nhận xét về kerning, tracking, leading
5. Đề xuất 3 font combinations thay thế giữ cùng mood nhưng khác biệt,
   chỉ dùng Google Fonts (free)
```

### 11.4 Prompt Template: Composition Grid Analysis

```
PROMPT:
───────
Phân tích composition và layout của hình ảnh thiết kế này:

1. Overlay grid analysis:
   - Có tuân theo Rule of Thirds không?
   - Có sử dụng Golden Ratio không?
   - Grid structure là gì?

2. Visual hierarchy map:
   - Đánh số thứ tự theo eye-tracking flow (element nào nhìn trước?)
   - Focal point chính nằm ở đâu?
   - Secondary focal points?

3. Whitespace analysis:
   - Phần trống có cân bằng không?
   - Có breathing room không?
   - Design có bị quá chật/quá thưa?

4. Balance assessment:
   - Visual weight phân bổ thế nào (trái/phải, trên/dưới)?
   - Symmetrical hay asymmetrical balance?

5. Mô tả layout bằng wireframe text-based (ASCII art đơn giản)
```

---

## 12. AI-Assisted Recreation Prompts

### 12.1 Prompt Template: Recreate Similar Design (Gemini + Imagen)

```
PROMPT (sau khi đã phân tích):
──────────────────────────────

Dựa trên analysis sau, tạo một thiết kế MỚI, ORIGINAL lấy cảm hứng 
từ style đã phân tích. KHÔNG copy, mà tạo thiết kế riêng.

**Style cần giữ:**
- Illustration style: [từ Layer 4 analysis]
- Color palette: [từ Layer 2 - dùng palette mới đã đề xuất]
- Typography mood: [từ Layer 3 - dùng font alternatives]
- Composition approach: [từ Layer 1]

**Thay đổi:**
- Subject matter: [THAY ĐỔI chủ đề]
- Text content: [THAY ĐỔI nội dung text]
- Target audience: [CÓ THỂ THAY ĐỔI]

**Technical specs:**
- Dimensions: 4500 x 5400 px
- Background: Transparent
- Color mode: sRGB
- Design for: [product type]

Prompt image generation:
"[Subject] in [style from analysis], using [color palette description], 
[composition instructions], [typography style], on transparent background, 
high resolution, print-ready, vector-style/illustration-style"
```

### 12.2 Creativity Levels

| Level | Tên | Mô tả | Thay đổi gì |
|-------|------|--------|-------------|
| 1 | **Close Adaptation** | Cùng style, khác subject | Chỉ đổi chủ đề |
| 2 | **Style Transfer** | Cùng aesthetic, khác everything | Giữ style, đổi tất cả |
| 3 | **Element Remix** | Mix elements từ nhiều designs | Combine best parts |
| 4 | **Inspired Original** | Chỉ giữ mood/vibe, tạo mới hoàn toàn | Giữ essence, đổi execution |
| 5 | **Radical Innovation** | Lật ngược expectations | Challenge conventions |

### 12.3 Batch Analysis → Batch Creation Pipeline

```
INPUT: 5-10 designs cùng niche/style

STEP 1: Analyze all → Extract common patterns
  → Common color ranges
  → Common typography styles
  → Common composition approaches
  → Common subjects/themes

STEP 2: Identify "winning formula"
  → What do top sellers have in common?
  → What differentiates #1 from #10?

STEP 3: Generate "design brief" from patterns
  → Formula: [Common style] + [Underserved subject] + [Differentiated color]

STEP 4: AI-generate variations
  → Use Creativity Levels 2-4
  → Aim for 3-5 unique designs per brief
  → Test each on mockups

STEP 5: Validate
  → Does it feel distinct enough? (not copied)
  → Does it fit the niche? (audience match)
  → Is it technically printable? (resolution, colors)
```

---

## 13. Creative Adaptation Framework

### 13.1 The "SHIFT" Method

Mỗi chữ đại diện cho một dimension bạn có thể thay đổi để tạo design mới từ inspiration:

| Letter | Dimension | Ví dụ |
|--------|-----------|-------|
| **S** – Subject | Đổi chủ đề/đối tượng | Cat → Dog, Mountain → Ocean |
| **H** – Harmony | Đổi color palette | Warm earth → Cool ocean tones |
| **I** – Identity | Đổi target audience | Millennials → Boomers |
| **F** – Form | Đổi illustration style | Flat → Hand-drawn |
| **T** – Text | Đổi message/typography | Motivational → Humorous |

> **Rule:** Thay đổi ít nhất **3/5 dimensions** để tạo design đủ original.

### 13.2 Legal & Ethical Guidelines

```
✅ CÓ THỂ:
  - Học techniques và principles từ designs khác
  - Lấy cảm hứng từ style general (e.g., "retro style")
  - Sử dụng same color theory principles
  - Apply same composition techniques
  - Kết hợp elements từ NHIỀU designs khác nhau

❌ KHÔNG ĐƯỢC:
  - Copy trực tiếp illustrations, logos, hoặc artwork
  - Sử dụng copyrighted characters (Mickey, Naruto, etc.)
  - Tracing hoặc chỉ thay đổi nhỏ rồi claim original
  - Sử dụng licensed artwork không có permission
  - Copy exact text/slogans đã trademark
```

---

## 14. Checklist & Worksheets

### 14.1 Quick Analysis Worksheet

```
╔══════════════════════════════════════════════════════════╗
║              DESIGN ANALYSIS WORKSHEET                  ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║ Design Source: ________________________________________  ║
║ Platform: _____________ Price: _______ Sales: _______   ║
║ Product Type: _____________ Color: __________________   ║
║ Date Analyzed: ______________                            ║
║                                                          ║
╠══════════════════════════════════════════════════════════╣
║ LAYER 1 — COMPOSITION                                   ║
║ Grid: □ Thirds □ Center □ Golden □ Free                 ║
║ Symmetry: □ Sym □ Asym □ Radial                         ║
║ Focal Point: ________________________________________   ║
║ Visual Flow: □ T→B □ L→R □ Circular □ Z                 ║
║ Density: □ Sparse □ Moderate □ Dense                    ║
║                                                          ║
╠══════════════════════════════════════════════════════════╣
║ LAYER 2 — COLOR                                         ║
║ Color 1 (Dominant 60%): #______ HSL(___,___,___) ___    ║
║ Color 2 (Secondary 30%): #______ HSL(___,___,___) ___   ║
║ Color 3 (Accent 10%): #______ HSL(___,___,___) ___      ║
║ Extra colors: ________________________________________  ║
║ Harmony: □ Comp □ Analog □ Triad □ Mono □ Split □ Other ║
║ Contrast: □ High □ Medium □ Low                         ║
║                                                          ║
╠══════════════════════════════════════════════════════════╣
║ LAYER 3 — TYPOGRAPHY                                    ║
║ Font 1: ________________ Type: □ Serif □ Sans □ Script  ║
║           □ Display □ Hand-drawn □ Mono                 ║
║ Font 2: ________________ Type: ________________________ ║
║ Hierarchy Levels: □ 1 □ 2 □ 3 □ 4+                     ║
║ Case: □ UPPER □ lower □ Title □ Mixed                   ║
║ Spacing: □ Tight □ Normal □ Loose                       ║
║                                                          ║
╠══════════════════════════════════════════════════════════╣
║ LAYER 4 — GRAPHICS                                      ║
║ Style: □ Line □ Flat □ Vintage □ Hand-drawn □ Cartoon   ║
║        □ Realistic □ Abstract □ Mixed-media □ Water     ║
║ Subject: ____________________________________________   ║
║ Detail: □ Simple □ Medium □ Complex                     ║
║ Effects: □ Distressed □ Halftone □ Gradient □ Shadow    ║
║          □ Outline □ None □ Other: ________________     ║
║                                                          ║
╠══════════════════════════════════════════════════════════╣
║ LAYER 5 — STRATEGY                                      ║
║ Target: ____________________________________________    ║
║ Message: ___________________________________________    ║
║ Emotion: □ Humor □ Nostalgia □ Pride □ Identity         ║
║          □ Cause □ Aesthetic □ Other: _____________     ║
║ Trend: □ Y2K □ Eco □ Animals □ Statement □ Art          ║
║ Position: □ Premium □ Mid □ Budget                      ║
║                                                          ║
╠══════════════════════════════════════════════════════════╣
║ LAYER 6 — POD TECHNICAL                                 ║
║ Print Method: □ DTG □ Screen □ AOP □ Embroidery □ DTF   ║
║ Products: ___________________________________________   ║
║ Scalability: □ Good □ OK □ Poor across sizes            ║
║                                                          ║
╠══════════════════════════════════════════════════════════╣
║ SYNTHESIS                                                ║
║ Top 3 strengths: _____________________________________  ║
║ Top 3 weaknesses: ____________________________________  ║
║ Transferable elements: _______________________________  ║
║ Differentiation opportunities: _______________________  ║
║ SHIFT plan: S___ H___ I___ F___ T___                    ║
╚══════════════════════════════════════════════════════════╝
```

### 14.2 Batch Compare Matrix

```
| Dimension      | Design A | Design B | Design C | Pattern |
|----------------|----------|----------|----------|---------|
| Grid type      |          |          |          |         |
| Dominant color  |          |          |          |         |
| Harmony type   |          |          |          |         |
| Font style     |          |          |          |         |
| Illustration   |          |          |          |         |
| Message type   |          |          |          |         |
| Target audience|          |          |          |         |
| Print method   |          |          |          |         |
| Price point    |          |          |          |         |
| → WINNER?      |          |          |          |         |
```

---

## 15. Tools & Resources

### 15.1 Color Analysis Tools

| Tool | Function | URL |
|------|---------|-----|
| **Adobe Color** | Extract palette from image, explore harmonies | color.adobe.com |
| **Coolors** | Quick palette generation & extraction | coolors.co |
| **Colormind** | AI-powered color palette generator | colormind.io |
| **Khroma** | AI learns your color preferences | khroma.co |
| **Happy Hues** | Curated color palettes with context | happyhues.co |

### 15.2 Font Identification Tools

| Tool | Function |
|------|---------|
| **WhatTheFont** | Upload image → identify font |
| **Font Squirrel Identifier** | Match fonts from images |
| **Google Fonts** | Free fonts for commercial use |
| **Fontjoy** | AI font pairing suggestions |

### 15.3 Design Analysis Tools

| Tool | Function |
|------|---------|
| **Google AI Studio (Gemini)** | Multimodal image analysis with prompts |
| **Figma** | Layout overlay, grid verification |
| **Canva** | Quick mockup testing |
| **Remove.bg** | Isolate design from background |

### 15.4 POD Trend Research Tools

| Tool | Function |
|------|---------|
| **Printify Trends** | Real-time POD product trends |
| **Google Trends** | Search volume by region/time |
| **Etsy Search** | What buyers are searching for |
| **Merch Informer** | Amazon Merch analytics |
| **eRank** | Etsy keyword research |

---

## Kết Luận

Framework này cung cấp một **quy trình có hệ thống** để:

1. **Phân tích** bất kỳ graphic design nào qua 6 layers (từ composition đến POD technical)
2. **Hiểu sâu** tại sao một design hoạt động — cả về mặt visual và strategic
3. **Sử dụng AI** (Gemini) để tự động hóa quá trình phân tích
4. **Tái tạo** designs mới lấy cảm hứng — với multiple creativity levels
5. **Đảm bảo originality** qua SHIFT method (thay đổi ≥3/5 dimensions)
6. **Tuân thủ pháp lý** — học principles, không copy artwork

> **Nguyên tắc vàng:** Reverse-engineering không phải là copy. Nó là **học từ thành công của người khác** để tạo ra thành công riêng của mình.
