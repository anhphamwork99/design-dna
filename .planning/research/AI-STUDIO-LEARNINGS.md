# Accumulated Learnings

*This file is append-only. New learnings are added as research progresses.*

---

## Learnings from Depth 2 (Breadth 5)

### Query 1: Google AI Studio Overview & Features

1. **Google AI Studio IDE (aistudio.google.com):** A free, browser-based platform for prototyping and building AI-powered applications. Supports "vibe coding" - describe an app in natural language and AI Studio generates the code. Offers Build Mode for iterative prototyping, testing, and debugging directly in the browser.

2. **Model Lineup (March 2026):** Available models include Gemini 1.5 Pro, Gemini 1.5 Flash, Gemini 2.5 Pro, Gemini 2.5 Flash, Gemini 3, and Gemini 3.1 Pro Preview. Each optimized for different speed/cost/quality trade-offs.

3. **Key Platform Features:** System Instructions for persistent behavior control, Structured Output for JSON schema enforcement, Function Calling for external tool integration, Code Execution for running code, Grounding with Google Search for fact-checking, and Stream Realtime for voice/video/screen-sharing interactions.

4. **Deployment:** One-click deployment to Google Cloud Run or Vercel. Also supports code export in Python, JavaScript, and cURL for integration into external applications.

5. **Free Tier:** Basic usage is free with generous limits for experimentation. Pay-as-you-go billing for production-scale API usage.

### Query 2: System Instructions & Structured Output Best Practices

6. **Separate System Instructions from User Prompts:** AI Studio provides a distinct system instruction field that persists across requests. Use it for role definition, tone, constraints, and behavioral boundaries. User prompts should contain only task-specific input. Mixing behavioral rules and task input reduces determinism.

7. **Structured Output (JSON Schema):** Enable in the "Tools" section of the right-hand panel. Define schema using OpenAPI schema object format. Gemini validates responses against schema, preventing "format drift" over time. Use `description` field in schema properties to guide the model.

8. **Structured Output Best Practices:** (a) Use clear, unambiguous field names. (b) Define basic data types (string, integer, object, array, boolean). (c) Set fields as `required` to force model to provide values. (d) Gemini orders JSON properties alphabetically — define examples in same order. (e) Do NOT duplicate response schema in input prompt — it lowers output quality. (f) Schema size contributes to input token limit.

9. **Instruction-First Prompting:** Prompts that begin with explicit instructions yield more reliable results than narrative prompts starting with context. Critical for extraction and transformation tasks.

10. **Prompt Versioning:** AI Studio allows saving and reusing prompts and system instructions. Treating prompts as code improves reliability over time.

### Query 3: Multimodal Vision & Image Analysis

11. **Native Multimodal Architecture:** Gemini models are multimodal from the ground up — process text, images, audio, and video in a single request. No need for separate models per modality.

12. **Vision Capabilities:** Image captioning, visual question answering, image classification, object detection (with bounding boxes), segmentation, OCR (including handwritten text), chart/graph analysis, and data extraction from receipts/labels/sketches to JSON.

13. **Supported Image Formats:** PNG, JPEG, WEBP, HEIC, HEIF. Can pass images inline (base64) or via File API upload.

14. **Media Resolution Control (Gemini 3+):** `media_resolution` parameter enables granular control for improved analysis of fine text or small details.

15. **Image Analysis Tips:** (a) Verify images are correctly rotated. (b) Use clear, non-blurry images. (c) When using a single image with text, place the text prompt AFTER the image part in the contents array.

### Query 4: Image Generation — Nano Banana & Imagen

16. **Nano Banana (Gemini Native Image Gen):** Three tiers available:
   - **Nano Banana 2** (gemini-3.1-flash-image-preview): Best all-around, optimized for speed and high-volume. Go-to model.
   - **Nano Banana Pro** (gemini-3-pro-image-preview): Professional asset production, "Thinking" process for complex instructions, up to 4K resolution, Google Search grounding.
   - **Nano Banana** (gemini-2.5-flash-image): Speed/efficiency optimized, 1024px resolution.

17. **Nano Banana Key Features (Gemini 3+):** High-resolution (512 to 4K), Advanced text rendering, Grounding with Google Search, Thinking mode, Up to 14 reference images, New aspect ratios (1:4, 4:1, 1:8, 8:1).

18. **Image Editing:** Nano Banana supports conversational image editing — upload image with text instructions for modifications. Multi-turn editing supported.

19. **Imagen 4:** Separate specialized image generation model. Imagen 4 Ultra for best absolute quality (one image at a time). All images include SynthID watermark.

20. **Fundamental Prompting Principle for Image Gen:** "Describe the scene, don't just list keywords." Narrative, descriptive paragraphs produce better images than disconnected keywords.

### Query 5: Temperature, Creativity & Advanced Prompting

21. **Temperature Ranges:** 0.0-0.3 (deterministic), 0.4-0.7 (balanced), 0.7-1.0 (creative). Gemini 3: keep at default 1.0.

22. **Top P (Nucleus Sampling):** Controls diversity alongside temperature.

23. **Advanced Prompt Template (Gemini 3, XML Tags):** `<role>`, `<instructions>`, `<constraints>`, `<output_format>` structure. User: `<context>`, `<task>`, `<final_instruction>`.

24. **Image Generation Best Practices:** Be Hyper-Specific, Provide Context and Intent, Iterate and Refine, Step-by-Step Instructions, Semantic Negative Prompts, Control the Camera.

25. **Photorealistic Prompt Template:** `A photorealistic [shot type] of [subject], [action], set in [environment]. Illuminated by [lighting], creating [mood] atmosphere. Captured with [camera/lens]. [aspect ratio] format.`

---

## Learnings from Depth 1 (Breadth 2)

### Query 6: Chaining Image Analysis → Artwork Generation

26. **Multi-Turn Prompt Chaining Pipeline:** Feasible workflow: (1) Upload image → Gemini analyzes it → extracts insights in structured JSON. (2) Use insights as input for a second prompt → Gemini generates artwork based on analysis. The multi-turn conversational nature allows iterative refinement at each stage.

27. **Prompt Chaining Strategy:** Break complex tasks into sequential prompts where output of one becomes input for next. Maintains context across the chain. Critical for image analysis → insight extraction → creative generation pipelines.

28. **Build Mode for Workflow Apps:** Build Mode generates full-stack apps (React/Angular framework support). Context-aware, multi-file management, and verified execution. Start with natural language prompt, iterate with Annotation Mode (highlight UI → describe changes).

29. **AI Chips:** Platform feature allowing easy addition of specific functionalities like image generation or Google Maps to apps being built.

### Query 7: Function Calling, Grounding & Tools

30. **Function Calling Architecture:** Model determines when to call functions, provides structured JSON with parameters. Your app executes functions and returns results. Supports parallel calling (multiple functions simultaneously) and compositional calling (sequential chaining: get_location() → get_weather(location)).

31. **Function Calling Best Practices:** (a) Extremely clear descriptions — model relies on these for selection. (b) Descriptive names without spaces/periods/dashes. (c) Use `enum` for parameters with limited valid values. (d) Keep active function set to 10-20 max. (e) Temperature 0 for deterministic function calls (but Gemini 3: keep at 1.0 default). (f) Function descriptions count toward input token limit.

32. **Grounding with Google Search:** Automatically generates search queries, processes results, and provides inline citations with `groundingMetadata`. Includes `webSearchQueries`, `searchEntryPoint`, `groundingChunks` (sources), and `groundingSupports` (text-to-source mapping).

33. **Multi-Tool Use:** Can combine native tools (Google Search, Code Execution) with custom function calling in a single request. Enables rich pipelines: search → analyze → generate.

34. **Deployment to Cloud Run:** Server-side logic protects API keys. Generates public URL automatically. Can also export to GitHub → deploy via Vercel/Netlify.

---

## Learnings from Depth 0 (Breadth 1)

### Query 8: Integrated Pipeline — Analysis to Artwork

35. **System Instructions for Creative Pipeline:** Define the AI's role as a creative art director: "You are a creative art director. Analyze images to extract visual themes, color palettes, emotional tones, and compositional elements. Then generate artwork prompts at specified creativity levels."

36. **Creativity Level Control via System Instructions:** Define creativity levels in system instructions:
   - Level 1 (Faithful): Reproduce visual elements closely, same palette, same style
   - Level 2 (Inspired): Keep themes but reinterpret with new composition
   - Level 3 (Abstract): Extract only essential emotional/conceptual elements and create entirely new artistic interpretation

37. **Prompt Chaining for Use Case:** Step 1: Send image + "Analyze this image. Extract: color palette, composition, mood, visual themes, key objects" → structured JSON output. Step 2: "Based on these insights: {JSON}, generate an artwork at creativity level {N}" → Nano Banana generates artwork.
