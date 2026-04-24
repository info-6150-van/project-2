# AI Response Log

A curated record of AI-generated **text responses** that were deemed worth preserving for reference during development.

## Purpose

This log stores conceptual explanations, guidance, and reasoning provided by AI assistants that helped inform decisions in this project. It is **not** a code repository — see the guideline note below.

## ⚠️ Guideline Reminder

> **Direct code generation is forbidden under project guidelines.**
> 
> This means:
> - AI must not be used to generate implementation code, components, functions, or configuration files on the student's behalf.
> - Responses containing code (e.g. an AI accidentally producing a full component while explaining a concept) must **not** be logged here and should be discarded.
> - Only text-based responses — explanations, comparisons, conceptual walkthroughs, recommendations, and mental models — are eligible for logging.
> - When in doubt about whether a response crosses the line into code generation, err on the side of exclusion and note the concern in the AI Disclosure log instead.

---

## Template

### [YYYY-MM-DDTHH:MM:SSZ] — [Short Descriptive Title]

- **Topic:** The concept, question, or decision the response addressed.
- **Why logged:** Why this response was worth preserving (e.g. clarified a misconception, gave a useful mental model, helped decide between two approaches).
- **Summary of response:**

  [Paraphrase or lightly edited excerpt of the AI's text response. No code blocks. Keep it concise but faithful to the original explanation.]

---

## Entries

### 2026-04-07T18:45:00Z — Example: When to Use useEffect vs. Event Handlers

- **Topic:** Deciding between `useEffect` and event handlers for triggering side effects in React.
- **Why logged:** Cleared up a persistent misconception about when `useEffect` is the right tool.
- **Summary of response:**

  `useEffect` is for synchronizing a component with an external system — things that need to happen *because the component rendered*, not because the user did something. If a side effect is directly triggered by a user action (a button click, a form submit), it belongs in the event handler, not in an effect. Putting it in `useEffect` and using state as a middleman adds unnecessary complexity and can cause subtle timing bugs. A useful heuristic: if you can trace the cause to "the user did X," use an event handler; if the cause is "the component is now in state Y," use an effect.

---