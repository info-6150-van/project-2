# Debugging Log

A running record of bugs encountered, investigated, and resolved during development.

---

## Template

### [YYYY-MM-DDTHH:MM:SSZ] — Bug: [Short Title]

- **Status:** `Open` | `In Progress` | `Resolved`
- **Symptom:** What was observed (error message, unexpected behavior, visual glitch, etc.)
- **Context:** Where/when it occurs (component, route, user action, build step, etc.)
- **Suspected Cause:** Initial hypothesis before investigation.
- **Investigation Steps:**
  1. Step taken
  2. Step taken
- **Root Cause:** What was actually wrong (fill in once found).
- **Fix Applied:** What change resolved it, and where.
- **Notes:** Anything worth remembering (e.g. related gotchas, docs consulted, AI assistance used).

---

## Entries

### 2026-04-07T18:45:00Z — Bug: Example Entry

- **Status:** `Resolved`
- **Symptom:** Component re-renders infinitely on page load.
- **Context:** `HomePage.tsx` — triggered on initial mount.
- **Suspected Cause:** A state update inside `useEffect` with no dependency array.
- **Investigation Steps:**
  1. Added console logs to confirm the re-render loop.
  2. Inspected the `useEffect` call — found a `setState` with no dependency array, causing it to fire on every render.
- **Root Cause:** Missing dependency array `[]` in `useEffect`.
- **Fix Applied:** Added `[]` as the second argument to `useEffect` in `HomePage.tsx`.
- **Notes:** Common React pitfall. Consulted React docs on effect cleanup.

---