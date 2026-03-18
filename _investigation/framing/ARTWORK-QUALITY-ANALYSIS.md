# Root Cause Analysis — Artwork Text Decoration Quality

## Problem Statement

Generated artwork có text decoration kém chất lượng so với original design:
1. **Text decoration basic** — font generic/standard, không custom/stylized như original
2. **Decor & colors lộn xộn** — ép đủ palette colors + quá nhiều decorative elements
3. **Text chồng vào illustration** — không tách riêng text vs illus zones
4. **Bố cục mất cân đối** — design nhỏ trong tổng thể, nhiều whitespace thừa

## Evidence (Visual Comparison)

| Aspect | Original | Generated |
|--------|----------|-----------|
| **Primary text** | Bold, black, hand-drawn/brush font có texture, distressed effect | Blue 3D-effect, paw print decorations → trông như WordArt |
| **Secondary text** | Same bold black hand-drawn style, simple nhưng impactful | Mixed colors (blue, green), stars, banner → lộn xộn |
| **Text placement** | Text NGOÀI illustration, clear separation, text ở top & bottom | "A BOND" trên pink banner CHỒNG vào illustration |
| **Color approach** | Mostly monochromatic (black text + sunset color pop) | Forced multi-color: blue, green, pink, stars → eye fatigue |
| **Composition** | Tight, illustration fills space, balanced proportion | Design nhỏ hơn, nhiều whitespace xung quanh |
| **Decorative elements** | Minimal, chỉ font style tạo character | Quá nhiều: paw prints, stars, banner, outlines |

## Root Cause Analysis (Logic Tree)

```
Text decoration quality kém
├── RC1. Prompt PASS 2 quá aggressive — "decorated typography"
│   ├── Prompt yêu cầu: "decorative elements INTEGRATED into letters"
│   ├── Prompt yêu cầu: "textured fills, banner/badge backgrounds"
│   ├── Prompt yêu cầu: "Mix font sizes, weights, decorative treatments"
│   ├── → Model interpret thành: nhồi càng nhiều decoration càng tốt
│   └── → MISMATCH: original dùng font ĐƠN GIẢN nhưng CHARACTER MẠNH
│
├── RC2. Prompt ép dùng full color palette cho text
│   ├── Line 139: "USE these for the text decoration" + full palette
│   ├── → Model ép dùng TẤT CẢ colors trong text
│   ├── → Original chỉ dùng 1-2 colors (mostly black)
│   └── → Result: rainbow text thay vì cohesive
│
├── RC3. Không có TEXT STYLE REFERENCE từ original
│   ├── Original image truyền vào nhưng KHÔNG có instruction nói:
│   │   "match the typography STYLE/WEIGHT/CHARACTER of the original"
│   ├── → Model tự sáng tạo text style hoàn toàn MỚI
│   └── → Mất connection với DNA typography gốc
│
├── RC4. Prompt thiếu composition constraints
│   ├── PASS 1 nói "leave space for text" → illustration co lại
│   ├── PASS 2 nói "integrate into composition" → text lấn vào illus
│   ├── Không có explicit rule: "text STAYS OUTSIDE illustration area"
│   └── → Model không biết boundary, kết quả lộn xộn
│
└── RC5. "Decoration" framing sai
    ├── Prompt dùng từ "DECORATED, ARTISTIC typography"
    ├── → Model hiểu: phải ADD decoration elements (stars, banners, icons)
    ├── Reality: professional POD text = clean custom font, ít decoration
    └── → Nên reframe: "styled typography" thay vì "decorated typography"
```

## Prioritization (Impact × Ease)

| # | Root Cause | Impact | Fix Ease | Priority |
|---|-----------|--------|----------|----------|
| **RC1** | Prompt quá aggressive decoration | 🔥🔥🔥 | ✅ Easy (rewrite prompt) | **#1** |
| **RC2** | Ép full palette cho text | 🔥🔥🔥 | ✅ Easy (change instruction) | **#1** |
| **RC5** | "Decorated" framing sai | 🔥🔥 | ✅ Easy (change wording) | **#2** |
| **RC3** | Thiếu style reference | 🔥🔥 | ⚠️ Medium (add style matching) | **#3** |
| **RC4** | Thiếu composition constraints | 🔥🔥 | ⚠️ Medium (restructure) | **#3** |

## Recommended Prompt Fixes

### Fix 1: Rewrite text decoration instructions (RC1 + RC5)
- Bỏ "DECORATED, ARTISTIC" → thay bằng "STYLED, PROFESSIONAL"
- Bỏ list decoration techniques dài → thay bằng ít rules rõ ràng
- Emphasis: "The text should look like a PROFESSIONAL CUSTOM FONT — not over-decorated"

### Fix 2: Color constraint (RC2)
- Bỏ "USE these for the text decoration" + full palette
- Thay: "Use 1-2 dominant colors from the palette. Black/dark text is preferred for readability. Do NOT force all palette colors into the text."

### Fix 3: Add original style reference instruction (RC3)
- Thêm: "Study the typography in the SECOND image (original design). Match the WEIGHT, CHARACTER, and ENERGY of that typography. If the original uses bold black hand-drawn text, your text should have similar boldness and character."

### Fix 4: Composition boundary rules (RC4)  
- PASS 1: Bỏ "leave space for text" → thay bằng explicit zones: "illustration fills the CENTER area"
- PASS 2: Thêm: "Text must be placed in CLEAR AREAS (above/below illustration). Do NOT overlay text on top of illustration elements."
- Thêm: "The final composition should fill the canvas — minimize empty whitespace."
