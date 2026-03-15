# Research Report: Xây Dựng App trên Google AI Studio IDE

> **Date:** 2026-03-15
> **Parameters:** breadth=5, depth=2
> **Total Sources:** 25+
> **Queries Executed:** 8

---

## Executive Summary

Google AI Studio (aistudio.google.com) là nền tảng browser-based miễn phí của Google cho phép prototyping và xây dựng ứng dụng AI-powered. Với hệ sinh thái Gemini models (từ 1.5 đến 3.1), platform này cung cấp đầy đủ công cụ cho mọi giai đoạn: từ prompt engineering, multimodal vision analysis, image generation (Nano Banana), đến deployment lên Cloud Run hoặc Vercel.

Đối với use case phân tích hình ảnh → rút insights → tạo artwork ở nhiều mức sáng tạo, Google AI Studio hoàn toàn đáp ứng nhờ: (1) Gemini multimodal vision xử lý image analysis và extract structured insights, (2) Nano Banana/Imagen cho image generation với prompt templates chuyên biệt, (3) Multi-turn prompt chaining cho phép nối các bước analysis → generation trong cùng session, và (4) Temperature/Top P cho kiểm soát mức độ sáng tạo.

Report này tổng hợp toàn bộ practices, conventions, prompting tips, model selection strategies, và workflow patterns từ official Google documentation và community best practices.

---

## Table of Contents

1. [Tổng Quan Platform](#1-tổng-quan-platform)
2. [Model Selection Guide](#2-model-selection-guide)
3. [System Instructions & Prompting Conventions](#3-system-instructions--prompting-conventions)
4. [Structured Output](#4-structured-output)
5. [Multimodal Vision — Phân Tích Hình Ảnh](#5-multimodal-vision--phân-tích-hình-ảnh)
6. [Image Generation — Tạo Artwork](#6-image-generation--tạo-artwork)
7. [Function Calling & Grounding](#7-function-calling--grounding)
8. [Build Mode & Deployment](#8-build-mode--deployment)
9. [Pipeline: Image Analysis → Insights → Artwork Generation](#9-pipeline-image-analysis--insights--artwork-generation)
10. [Key Insights](#10-key-insights)
11. [Conclusions](#11-conclusions)
12. [Future Research Directions](#12-future-research-directions)
13. [Sources](#13-sources)

---

## 1. Tổng Quan Platform

### 1.1 Giới Thiệu

Google AI Studio ([aistudio.google.com](https://aistudio.google.com)) là IDE browser-based cho phép:

- **Experiment với prompts:** Test và iterate prompts trực tiếp trên web UI
- **Vibe Coding:** Mô tả ý tưởng app bằng natural language → AI Studio sinh code
- **Build Mode:** Iterative prototyping, testing, debugging trong browser
- **Code Export:** Xuất code Python, JavaScript, cURL cho integration
- **One-click Deploy:** Triển khai lên Google Cloud Run hoặc Vercel

### 1.2 Core Features

| Feature | Mô tả | Vị trí UI |
|---------|--------|-----------|
| **System Instructions** | Persistent behavior control qua mọi request | Panel bên trái |
| **Structured Output** | Enforce JSON schema cho response | Tools panel (phải) |
| **Function Calling** | Kết nối external tools/APIs | Tools panel |
| **Code Execution** | Chạy code trực tiếp | Tools panel |
| **Grounding** | Fact-check qua Google Search | Tools panel |
| **Stream Realtime** | Voice/video/screen-sharing | UI mode selector |

### 1.3 Pricing

- **Free tier:** Generous limits cho experimentation
- **Pay-as-you-go:** Billing theo API usage cho production
- **Batch API:** Higher rate limits, 24h turnaround, giá thấp hơn

[Source: ai.google.dev/gemini-api/docs/ai-studio-quickstart]

---

## 2. Model Selection Guide

### 2.1 Text/Analysis Models

| Model | Best For | Đặc Điểm |
|-------|----------|-----------|
| **Gemini 3.1 Pro Preview** | Complex reasoning, production | Latest, most capable |
| **Gemini 2.5 Pro** | Deep thinking, long context | Mạnh reasoning |
| **Gemini 2.5 Flash** | Speed + cost efficiency | Nhanh, rẻ |
| **Gemini 1.5 Pro** | Large context window | 1M+ token context |

### 2.2 Image Generation Models

| Model | ID | Best For | Max Resolution |
|-------|----|----------|----------------|
| **Nano Banana 2** | `gemini-3.1-flash-image-preview` | **Go-to model.** Best performance/cost ratio | 4K |
| **Nano Banana Pro** | `gemini-3-pro-image-preview` | Professional assets, complex instructions | 4K |
| **Nano Banana** | `gemini-2.5-flash-image` | High-volume, low-latency | 1024px |
| **Imagen 4** | Via Gemini API | Best absolute quality | High |
| **Imagen 4 Ultra** | Via Gemini API | Maximum fidelity (1 image/time) | Very High |

### 2.3 Lựa Chọn Model cho Use Case

Cho pipeline **phân tích ảnh → sinh artwork:**

1. **Analysis step:** `gemini-2.5-pro` hoặc `gemini-2.5-flash` (multimodal vision, structured output)
2. **Generation step:** `gemini-3.1-flash-image-preview` (Nano Banana 2) cho tốc độ, hoặc `gemini-3-pro-image-preview` (Nano Banana Pro) cho chất lượng professional

[Source: ai.google.dev/gemini-api/docs/image-generation#model-selection]

---

## 3. System Instructions & Prompting Conventions

### 3.1 Phân Tách System Instructions và User Prompts

**Nguyên tắc quan trọng nhất:** KHÔNG trộn behavioral rules với task input.

```
✅ ĐÚNG:
System Instructions: "Bạn là chuyên gia phân tích nghệ thuật..."
User Prompt: "Phân tích bức ảnh này."

❌ SAI:
User Prompt: "Bạn là chuyên gia phân tích nghệ thuật. Phân tích bức ảnh này."
```

System Instructions **persist** qua mọi requests trong session — dùng cho:
- **Role definition:** "You are a creative art director..."
- **Tone/Style:** "Respond in Vietnamese, formal tone"
- **Constraints:** "Always return JSON. Never generate NSFW content."
- **Output format:** "Structure response as Executive Summary + Details"

### 3.2 Instruction-First Prompting

Prompts bắt đầu bằng **explicit instructions** → kết quả reliable hơn prompts bắt đầu bằng context.

```
✅ "Extract the color palette, composition, and mood from this image. Return as JSON."
❌ "This is a beautiful sunset photograph taken in Bali. Can you tell me about colors?"
```

### 3.3 Advanced Template cho Gemini 3 (XML Tags)

```xml
<!-- SYSTEM INSTRUCTIONS -->
<role>
You are Gemini 3, a specialized assistant for [Domain].
You are precise, analytical, and persistent.
</role>

<instructions>
1. **Plan**: Analyze the task and create a step-by-step plan.
2. **Execute**: Carry out the plan.
3. **Validate**: Review your output against the user's task.
4. **Format**: Present the final answer in the requested structure.
</instructions>

<constraints>
- Verbosity: [Low/Medium/High]
- Tone: [Formal/Casual/Technical]
</constraints>

<output_format>
1. **Executive Summary**: [Short overview]
2. **Detailed Response**: [The main content]
</output_format>
```

```xml
<!-- USER PROMPT -->
<context>
[Relevant documents, code snippets, or background info]
</context>

<task>
[Specific user request]
</task>

<final_instruction>
Remember to think step-by-step before answering.
</final_instruction>
```

### 3.4 Few-Shot Prompting

Cung cấp 1-3 examples input/output → model học pattern mong muốn:

```
Ví dụ 1:
Input: [hình ảnh sunset]
Output: {"palette": ["#FF6B35", "#F7C59F"], "mood": "peaceful", "composition": "rule_of_thirds"}

Ví dụ 2:
Input: [hình ảnh cityscape]
Output: {"palette": ["#2C3E50", "#3498DB"], "mood": "dynamic", "composition": "leading_lines"}

Bây giờ phân tích hình ảnh này:
Input: [hình ảnh mới]
```

### 3.5 Prompt Versioning

AI Studio cho phép **save & reuse** prompts → treat prompts as code:
- Lưu version khi prompt hoạt động tốt
- So sánh output giữa các versions
- Rollback nếu version mới kém hơn

[Source: ai.google.dev/gemini-api/docs/prompting-strategies]

---

## 4. Structured Output

### 4.1 Bật Structured Output

Trong AI Studio UI: **Tools panel (phải)** → Enable **Structured Output** → Define JSON schema.

### 4.2 Schema Design Best Practices

| Practice | Mô tả |
|----------|--------|
| **Clear field names** | `color_palette` thay vì `cp` |
| **Strong typing** | `"type": "integer"` thay vì `"type": "string"` |
| **Use `description`** | Mỗi property cần description cho model |
| **Required fields** | Set `required` cho mandatory fields |
| **Use `enum`** | Khi có danh sách giá trị cố định |
| **Alphabetical order** | Gemini sắp xếp JSON alphabetically — match examples |
| **No duplication** | KHÔNG lặp schema trong prompt — giảm quality |

### 4.3 Ví Dụ Schema cho Image Analysis

```json
{
  "type": "object",
  "properties": {
    "color_palette": {
      "type": "array",
      "description": "List of dominant hex color codes",
      "items": { "type": "string" }
    },
    "mood": {
      "type": "string",
      "description": "Overall emotional tone of the image",
      "enum": ["peaceful", "dynamic", "mysterious", "joyful", "melancholic", "intense"]
    },
    "composition": {
      "type": "string",
      "description": "Primary composition technique used"
    },
    "visual_themes": {
      "type": "array",
      "description": "Key visual themes identified",
      "items": { "type": "string" }
    },
    "key_objects": {
      "type": "array",
      "description": "Main objects detected in the image",
      "items": { "type": "string" }
    },
    "artistic_style": {
      "type": "string",
      "description": "Detected artistic style if applicable"
    }
  },
  "required": ["color_palette", "mood", "composition", "visual_themes"]
}
```

### 4.4 Structured Output vs Function Calling

| Aspect | Structured Output | Function Calling |
|--------|-------------------|------------------|
| **Purpose** | Shape model responses | Connect to external tools |
| **Output** | Always JSON | Structured function call |
| **Execution** | Direct response | Requires app-side execution |
| **Use when** | Data extraction, classification | API calls, real actions |

[Source: ai.google.dev/gemini-api/docs/structured-output]

---

## 5. Multimodal Vision — Phân Tích Hình Ảnh

### 5.1 Capabilities

Gemini có thể thực hiện trên images:

- **Image captioning** — mô tả chi tiết nội dung
- **Visual Q&A** — trả lời câu hỏi về ảnh
- **Object detection** — phát hiện objects với bounding boxes
- **Segmentation** — phân vùng đối tượng
- **OCR** — trích xuất text (cả handwritten)
- **Chart/graph analysis** — phân tích biểu đồ
- **Style analysis** — nhận diện artistic style
- **Mood/emotion extraction** — phân tích cảm xúc ảnh
- **Color palette extraction** — trích xuất bảng màu
- **Data extraction → JSON** — từ receipts, labels, sketches

### 5.2 Supported Formats

PNG, JPEG, WEBP, HEIC, HEIF

### 5.3 Cách Truyền Image

1. **Inline (base64):** Tốt cho ảnh nhỏ, quick prototyping
2. **File API upload:** Tốt cho ảnh lớn, production workflows

### 5.4 Tips & Best Practices

```
✅ Verify images are correctly rotated
✅ Use clear, non-blurry images
✅ Place text prompt AFTER the image in contents array
✅ Use media_resolution parameter (Gemini 3+) cho fine detail analysis
✅ Use multiple images for comparison/batch analysis
```

### 5.5 Prompt Mẫu cho Image Analysis

```
Analyze this image in detail. Extract and return:

1. **Color Palette**: The 5 dominant colors as hex codes
2. **Composition**: The primary composition technique (rule of thirds, symmetry, leading lines, etc.)
3. **Mood/Atmosphere**: The overall emotional tone
4. **Visual Themes**: Key themes and motifs present
5. **Key Objects**: Main objects/subjects in the image
6. **Lighting**: Type and quality of lighting
7. **Artistic Style**: If applicable, the art style or movement
8. **Texture Quality**: Dominant textures (smooth, rough, organic, geometric)

Return as structured JSON.
```

[Source: ai.google.dev/gemini-api/docs/image-understanding]

---

## 6. Image Generation — Tạo Artwork

### 6.1 Nguyên Tắc Cốt Lõi

> **"Describe the scene, don't just list keywords."**
>
> Model hiểu ngôn ngữ tự nhiên sâu — một đoạn mô tả narrative sẽ tạo ra hình ảnh tốt hơn nhiều so với keyword list.

### 6.2 Prompt Templates theo Phong Cách

#### Photorealistic

```
A photorealistic [shot type] of [subject], [action or expression],
set in [environment]. The scene is illuminated by [lighting description],
creating a [mood] atmosphere. Captured with a [camera/lens details],
emphasizing [key textures and details]. [aspect ratio] format.
```

#### Stylized Illustration / Sticker

```
A [style: watercolor/vector/pixel art/ink wash] illustration of [subject]
in [setting]. The style is [adjective: whimsical/minimalist/bold].
Color palette: [specific colors]. Background: [solid color/gradient/none].
No text.
```

#### Product Mockup / Commercial

```
A professional product shot of [product] on [surface/background].
Studio lighting with [soft diffused/dramatic]. [Camera angle: 45°/flat lay/eye level].
High-end commercial photography style. Clean, modern composition.
```

#### Style Transfer

```
Transform this image into [target style: oil painting/anime/watercolor/pencil sketch]
while preserving the original composition and subject. Emphasize [specific elements].
```

#### High-Fidelity Detail Preservation

```
Put this logo on [context: a high-end ad for a perfume bottle].
The logo is perfectly integrated into the [surface].
```

### 6.3 Best Practices for Image Generation

| Practice | Chi tiết |
|----------|----------|
| **Be Hyper-Specific** | "ornate elven plate armor, etched with silver leaf patterns" thay vì "fantasy armor" |
| **Provide Context & Intent** | "Create a logo for a high-end, minimalist skincare brand" thay vì "Create a logo" |
| **Iterate & Refine** | "Great, but make the lighting warmer" — dùng conversational nature |
| **Step-by-Step** | Break complex scenes thành steps: "First background... Then foreground... Finally..." |
| **Semantic Negative Prompts** | "an empty, deserted street" thay vì "no cars" |
| **Control Camera** | Dùng thuật ngữ: `wide-angle shot`, `macro shot`, `low-angle perspective` |

### 6.4 Text trong Image

```
Tip: Generate text content TRƯỚC, rồi ask cho image chứa text đó.

✅ Step 1: "Write a short headline for a skincare ad"
   Step 2: "Create an image with that headline: '[headline text]'"

❌ "Create an image with some text about skincare"
```

### 6.5 Limitations

- Best performance với: EN, vi-VN, ja-JP, ko-KR, zh-CN, và 10+ languages khác
- Không hỗ trợ audio/video inputs cho image gen
- Model không luôn follow exact number of images requested
- Gemini 2.5 Flash Image: tốt nhất với ≤3 input images
- Gemini 3 Pro: up to 5 high-fidelity + 14 total reference images
- All generated images có SynthID watermark

[Source: ai.google.dev/gemini-api/docs/image-generation]

---

## 7. Function Calling & Grounding

### 7.1 Function Calling

Cho phép model gọi external functions khi cần data/actions:

```
3 Use Cases:
1. Augment Knowledge — query databases, APIs
2. Extend Capabilities — calculator, chart generation
3. Take Actions — send email, schedule, control devices
```

**Workflow:**
1. Define function declarations (name, params, description)
2. Send prompt + declarations → model decides if function needed
3. Model returns structured JSON call → YOUR APP executes function
4. Return result → model generates final response

**Advanced Patterns:**
- **Parallel calling:** Multiple functions simultaneously
- **Compositional calling:** Sequential chaining (get_location() → get_weather(location))
- **Multi-tool:** Combine Google Search + Code Execution + custom functions

### 7.2 Grounding with Google Search

Kết nối model với real-time web data:

- Tự động generate search queries
- Process results và tạo inline citations
- Response bao gồm `groundingMetadata`: search queries, sources, text-to-source mapping

**Dùng cho:** Fact-checking, current data, trend analysis

### 7.3 Best Practices

```
Function Calling:
- Descriptions cực kỳ clear — model dựa vào đây
- Descriptive names (no spaces/periods/dashes)
- Use enum cho limited values
- Giữ ≤10-20 active functions
- Temperature 0 cho deterministic calls
  (nhưng Gemini 3: giữ default 1.0)
- Descriptions count toward token limit

Grounding:
- Enable khi cần real-time/factual data
- Always display search suggestions (Terms of Service)
- Can combine with URL context tool
```

[Source: ai.google.dev/gemini-api/docs/function-calling, ai.google.dev/gemini-api/docs/grounding]

---

## 8. Build Mode & Deployment

### 8.1 Build Mode

Build Mode = "Vibe Coding" — mô tả app bằng ngôn ngữ tự nhiên:

- Hỗ trợ React, Angular frameworks
- Context-aware, multi-file management
- **Annotation Mode:** Highlight phần UI → describe changes
- **AI Chips:** Add functionality nhanh (image gen, Maps)
- **"I'm Feeling Lucky":** Auto-generate app inspiration
- **App Gallery:** Remix existing projects

### 8.2 Deployment Options

| Option | Best For | API Key Protection |
|--------|----------|--------------------|
| **Cloud Run** | Production, scalable | ✅ Server-side |
| **Vercel** | Frontend apps | Via environment vars |
| **GitHub Export** | Version control, CI/CD | Manual setup |

### 8.3 Workflow

```
1. Start → AI Studio → New Project
2. Choose model (Gemini 2.5 Pro/Flash recommended for apps)
3. Write system instructions
4. Build prompts → test → iterate
5. Enable tools (Structured Output, Function Calling, Grounding)
6. Build Mode for full app → Annotation Mode for refinements
7. Deploy to Cloud Run / Vercel
```

---

## 9. Pipeline: Image Analysis → Insights → Artwork Generation

### 9.1 Architecture

```
┌─────────────────────────────────────────────────────┐
│ INPUT: User uploads image                             │
└──────────────┬──────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────┐
│ STEP 1: Image Analysis                                │
│ Model: gemini-2.5-flash (vision)                      │
│ Output: Structured JSON insights                      │
│ {color_palette, mood, composition, themes, objects}   │
└──────────────┬──────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────┐
│ STEP 2: User selects Creativity Level                 │
│ Level 1: Faithful | Level 2: Inspired | Level 3: Abstract │
└──────────────┬──────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────┐
│ STEP 3: Artwork Generation                            │
│ Model: gemini-3.1-flash-image-preview (Nano Banana 2) │
│ Input: Insights JSON + Creativity Level → Art Prompt  │
│ Output: Generated artwork image                       │
└─────────────────────────────────────────────────────┘
```

### 9.2 System Instructions

```
You are a creative art director and visual analyst.

Your workflow has two modes:

MODE 1 - ANALYZE:
When given an image, extract detailed visual information:
- Color palette (5 dominant hex codes with names)
- Composition technique (rule of thirds, symmetry, golden ratio, etc.)
- Mood/atmosphere (emotional tone)
- Visual themes and motifs
- Key objects/subjects
- Lighting quality and direction
- Artistic style (if applicable)
- Texture characteristics
Return as structured JSON.

MODE 2 - CREATE:
When given analysis insights and a creativity level, generate artwork.

Creativity Levels:
- Level 1 (Faithful): Reproduce visual elements closely. Same color palette,
  style, and composition. The artwork should look like a refined version of
  the original.
- Level 2 (Inspired): Keep the themes and mood but reinterpret with new
  composition, different medium, or shifted perspective. Creative but recognizable.
- Level 3 (Abstract): Extract only essential emotional and conceptual elements.
  Create an entirely new artistic interpretation that captures the FEELING
  of the original, not the appearance.

Always describe scenes narratively, not as keyword lists.
```

### 9.3 Step-by-Step Prompts

#### Step 1: Image Analysis

```
[Upload image]

Analyze this image using MODE 1.
Focus on extracting visual DNA — the core elements
that define this image's identity.
```

→ Output: Structured JSON

#### Step 2: Generate Artwork — Level 1 (Faithful)

```
Based on these visual insights:
{paste JSON from step 1}

Generate artwork at CREATIVITY LEVEL 1 (Faithful).
Create a refined, polished version that stays true to:
- The exact color palette: {colors}
- The original composition: {composition}
- The mood: {mood}
Medium: Digital painting, photorealistic quality.
Aspect ratio: 16:9.
```

#### Step 2b: Generate Artwork — Level 2 (Inspired)

```
Based on these visual insights:
{paste JSON from step 1}

Generate artwork at CREATIVITY LEVEL 2 (Inspired).
Keep the themes of {themes} and mood of {mood},
but reinterpret as a [watercolor/oil painting/digital collage].
Shift the perspective to [bird's eye/close-up/wide panoramic].
Use the color palette as inspiration but allow artistic variation.
Aspect ratio: 1:1.
```

#### Step 2c: Generate Artwork — Level 3 (Abstract)

```
Based on these visual insights:
{paste JSON from step 1}

Generate artwork at CREATIVITY LEVEL 3 (Abstract).
The original image evokes {mood} through {themes}.
Create an abstract interpretation that captures this FEELING:
- Use {artistic_style} as a starting point
- Dominant emotion: {mood}
- Abstract forms inspired by: {key_objects}
- Color scheme: complementary to {color_palette}
Medium: Mixed media digital art, gallery quality.
Aspect ratio: 3:4.
```

### 9.4 Temperature Settings cho Mỗi Level

| Creativity Level | Temperature | Top P | Rationale |
|------------------|-------------|-------|-----------|
| Level 1 (Faithful) | 0.3 | 0.8 | Deterministic, predictable |
| Level 2 (Inspired) | 0.7 | 0.9 | Balanced creativity |
| Level 3 (Abstract) | 1.0 | 0.95 | Maximum diversity |

> **⚠️ Gemini 3 Note:** Google recommends keeping temperature at default 1.0 cho Gemini 3 models. Thay vì dùng temperature, control creativity qua **prompt language** — specific vs vague descriptions.

### 9.5 Alternative: Control Creativity via Prompt Language

Nếu dùng Gemini 3 (temperature locked at 1.0), thay đổi **prompt specificity**:

| Level | Prompt Strategy |
|-------|----------------|
| Level 1 | Extremely specific: exact colors, exact composition, exact style |
| Level 2 | Moderately specific: mood + themes, but flexible execution |
| Level 3 | Intentionally vague/abstract: "capture the feeling of..." |

---

## 10. Key Insights

1. **"Describe, Don't List":** Nguyên tắc #1 khi prompting trong AI Studio — narrative descriptions > keyword lists. Áp dụng cho cả text và image generation.

2. **System Instructions là Backbone:** Tách biệt system instructions (persistent behavior) và user prompts (task-specific). Đây là yếu tố quyết định consistency và quality.

3. **Structured Output = Game Changer:** JSON schema enforcement eliminates "format drift" — critical khi output cần feed vào pipeline downstream (image analysis → artwork generation).

4. **Nano Banana 2 là Default Choice:** `gemini-3.1-flash-image-preview` là best balance giữa quality, speed, và cost cho image generation. Dùng Nano Banana Pro cho professional assets.

5. **Creativity Control = Prompt Specificity:** Với Gemini 3 (temperature mặc định 1.0), control creativity qua mức độ cụ thể của prompt thay vì temperature. Specific = faithful, vague/abstract = creative.

6. **Multi-Turn Chaining:** AI Studio's conversational nature cho phép xây dựng complex pipelines trong cùng session — analysis → insights → generation → refinement.

7. **Grounding + Image Gen = Accurate Content:** Nano Banana Pro/2 có thể dùng Google Search để verify facts trước khi generate images — critical cho content generation tool.

8. **Thinking Mode (Nano Banana Pro):** Model tự generate "thought images" để refine composition trước khi output final — like an AI art director reviewing drafts internally.

---

## 11. Conclusions

### Recommendations cho Use Case

1. **Start với Nano Banana 2** (`gemini-3.1-flash-image-preview`) cho image generation — best all-around model.

2. **Dùng `gemini-2.5-flash` cho image analysis** — fast enough cho real-time pipeline, strong vision capabilities.

3. **Define 3 creativity levels trong system instructions** — Level 1/2/3 approach cho phép user control rõ ràng.

4. **Enforce structured output cho analysis step** — JSON schema đảm bảo insights có format nhất quán để feed vào generation prompt.

5. **Build with multi-turn chaining** — dùng conversational nature của AI Studio để iterate, không cần separate sessions.

6. **Treat prompts as code** — version, test, iterate. AI Studio's save feature hỗ trợ điều này.

### Limitations

- Image generation không luôn theo exact instructions (cần iterate)
- Temperature control bị hạn chế trên Gemini 3 (recommend 1.0)
- SynthID watermark trên tất cả generated images
- Complex multi-step pipelines có thể gặp context management challenges
- Function calling descriptions count toward token limit

---

## 12. Future Research Directions

1. **Agent Development Kit (ADK):** Google's framework cho building agentic workflows — có thể enhance pipeline thành fully autonomous agent.

2. **Veo Video Generation:** Extend pipeline sang video artwork generation.

3. **Fine-tuning với Custom Data:** Train model trên specific art styles/brands.

4. **Batch Processing:** Dùng Batch API cho high-volume artwork generation (higher rate limits, 24h turnaround).

5. **MCP Integration:** Model Context Protocol support cho connecting external creative tools.

---

## 13. Sources

### Official Google Documentation
1. [AI Studio Quickstart](https://ai.google.dev/gemini-api/docs/ai-studio-quickstart)
2. [Prompt Design Strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies)
3. [Structured Output](https://ai.google.dev/gemini-api/docs/structured-output)
4. [Image Understanding](https://ai.google.dev/gemini-api/docs/image-understanding)
5. [Image Generation (Nano Banana)](https://ai.google.dev/gemini-api/docs/image-generation)
6. [Function Calling](https://ai.google.dev/gemini-api/docs/function-calling)
7. [Grounding with Google Search](https://ai.google.dev/gemini-api/docs/grounding)
8. [Gemini Models](https://ai.google.dev/gemini-api/docs/models)
9. [Imagen](https://ai.google.dev/gemini-api/docs/imagen)
10. [Safety Settings](https://ai.google.dev/gemini-api/docs/safety-settings)

### Community & Third-Party
11. [DataStudios - Prompting Best Practices](https://datastudios.org)
12. [Codecademy - AI Studio Guide](https://codecademy.com)
13. [LearnPrompting - AI Studio](https://learnprompting.org)
14. [Medium - Various AI Studio Tutorials](https://medium.com)
15. [OreateAI - Nano Banana Guide](https://oreateai.com)

### Google Blog
16. [Google Blog - Gemini Capabilities](https://blog.google)
17. [Google DeepMind - Imagen Research](https://deepmind.google)
18. [Google Research](https://research.google)

---

*Generated by Deep Research Skill*
*Project: playground/deep-research-google-ai-studio-app-20260315-1334/*
*2026-03-15*
