# Debugging Log

A running record of major bugs encountered, investigated, and resolved during development.

Note 1: As debug log is not a strict requirement, the entries here are more sparse compared to the AI usage disclosure entries. It is likely a bug was mentioned in the AI usage log but not here, and for those cases the background is usually that the bug was minor or fixed easily, thus not demanding a well documented debug log.

Note 2: I used online tools for converting local time to ISO 8601 time code. I later noticed that different tools have inconsistent results, and often when i log a AI usage a few days afterward the actual interactions, the time code is often off (since I can recall the exact hours at most). Treat the time code as rough time stamps.

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

### 2026-04-21T20:12:21Z — Bug: Broken SIMBAD/NASA API

- **Status:** `Persumably Resolved`
- **Symptom:** The auto-filling feature using SIMBAD/NASA API only works on certain astronomical objects and silently fails on others.
- **Context:** `route.tsx`, two to be exact, one for the NASA API and one for the SIMBAD API.
- **Suspected Cause:** Uncertain at the time of discovery.
- **Investigation Steps:**
  1. Tested with different object names (M31, M 31, Ceres, 1 Ceres, Saturn, Mars, Andromeda). With mixed results. The SIMBAD API sometimes works while the NASA API never seemed to kick in.
  2. Inspected the console logs. On all failed fetches the SIMBAD API returns a 404 warning, nothing from the NASA API.
  3. Debugged the APIs individually with Claude, no success.
  4. Consulted Claude Code which ruled out the API being malfunctioning, more like the API's current functionality does not cover the use case.
  5. Checked the documentation for the SIMBAD and NASA API.
- **Root Cause:** The SIMBAD database does not contain solar system objects, while the original NASA API only works for a finite range of named asteroids and comets.
- **Fix Applied:** Added more UI indicators to whether the API successfully fetched an object or not, added an additional NASA API + hard-coded lookup tables as fallback options.

### 2026-04-23T23:01:55Z — Bug: Broken SIMBAD/NASA API

- **Status:** `Active`
- **Symptom:** Upon loading the dashboard, 4 browser warnings appear in the console.
- **Context:** `dashboard-view.tsx`, triggered on every load, including page reload, redirect, or refresh.
- **Suspected Cause:** Uncertain at the time of discovery.
- **Investigation Steps:**
  1. Checked relevant React and UI documentations.
  2. Consulted Claude Code, which suggested the issue might be with undefined chart sizes, fix was not effective.
  3. Consulted Claude Code again, which suggested the issue might be with NextJS SSR loading, fix was not effective.
  4. Double checked the documentation and console logs, the 4 warnings were likely generated 2 per chart, hinting React Strict Mode behavior.
- **Root Cause:** Unknown.
- **Fix Applied:** None.

---