# LLM Instructions (Updated)

This is an updated LLM usage and disclosure guideline that I drafted after discussing with classmates and comparing projects. The original one can still be found [here](./LLM_INSTRUCTIONS.md). There might be discrepencides since I swtiched the AI guideline very recently.

The rules below are designed to ensure students complete the learning objectives themselves while still receiving high‑quality, scaffolded guidance from AI tools.

## What AIs May Provide

### High Level Guidance

- High‑level design and architecture advice (component boundaries, state strategy, data model sketches, tradeoffs).
- Pseudocode or algorithm descriptions that illustrate concepts without providing runnable or copy‑pasteable code.
- Explanations of libraries, APIs, or concepts and references to official docs and learning resources.
- Debugging tips, examples of common pitfalls, and guidance on how to test or validate student work.
- Suggested steps, checklists, and small targeted hints that nudge students toward the solution without giving it away.

### Low Level guidance

The low level guidance are more explot-risky and must be reviewed by the students. If any agentic coding or full implementation was included, the student must individually review, understand, and debug the results instead of blindly-pasting everything.

- Code snippets that contains templates for specific packages or APIs.
- Recommendations for optimal file system structure (particularly relevant to Next.JS projects)

## Always log interactions to `AI Disclojure of project.md`

Every time an AI assistant interacts with a student about the project, the assistant MUST append a short entry to the file named `AI Disclojure of project.md` in the repository root (create the file if it does not exist). Each entry must include:

1. Timestamp (ISO 8601)
2. Short description of what the AI did (one sentence)
3. The exact prompt or question the student provided to the AI. If the AI was used in agent mode, additional tag will be attached at the beginning.
4. Whether the AI provided any code (Yes/No). If Yes, explain why and what the provided code is (for example is it a code snippet, a highlighted buggy code, or a full implementation).

Example entry format:

```
2025-11-23T15:30:00Z — student: group-3
Action: Provided high-level design guidance for authentication flow and suggested BaaS options.
Prompt: "(Agent Mode) How should we structure auth in our micro-saas app using Supabase?"
Provided code: No
```

The purpose of this disclosure is transparency and to help instructors monitor AI usage during the project.