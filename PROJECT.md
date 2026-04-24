# Perihelion

> Astronomy observation log manager

## Introduction

Perihelion is a sky-watcher's journal service where users log celestial observations (object name, date, location, telescope used, notes, sketch upload). It features a dashboard with charts of observation frequency, favourite object types, and a calendar heatmap. It integrates with the NASA JPL and SIMBAD APIs to auto-fill object metadata when you type a target name (e.g. "M31"). An admin panel provides a platform-wide overview.

The public observer profile route (`/observer/[handle]`) is intentionally left as a placeholder stub. Displaying another user's full observation history without careful RLS scoping and opt-in consent raises data-privacy concerns that are out of scope for this project.

The authentication code is largely derived from the [official Supabase Next.js starter template](https://supabase.com/docs/guides/auth/quickstarts/nextjs).

---

## Implementation Overview

### 1. Component Design

Components are organized by feature under `perihelion/components/`. Each component has explicit TypeScript prop types and keeps its own local state minimal.

Key composite components:

- **`ObservationForm`** (`components/observation-form.tsx`) — a single form component used for both creating and editing observations. It accepts a `mode` prop (`"create" | "edit"`) and optional `initialValues` / `observationId`. Internally it manages debounced parallel API calls to SIMBAD and NASA, rendering lookup hints beneath the object-name field. Validation runs through Zod via `zodResolver`.
- **`DashboardContent`** (`components/dashboard/dashboard-content.tsx`) — a client component that fetches dashboard data via TanStack React Query and renders a monthly frequency bar chart (Recharts), an object-type distribution pie chart (Recharts), and a 26-week activity calendar heatmap (Nivo Calendar).
- **`ObservationLogContent`** (`components/observation-log-content.tsx`) — renders the user's filtered observation list, consuming search and type-filter state from the Zustand UI store.

Smaller reusable primitives (Button, Input, Card, Badge, etc.) live under `components/ui/` following the shadcn/ui convention.

### 2. State Management

The app separates three layers of state deliberately:

| Layer | Tool | What it holds |
|---|---|---|
| UI state | **Zustand** (`lib/store/ui-store.ts`) | Search text and object-type filter for the observation log — state that is global to the page layout but not persisted |
| Server / remote state | **TanStack React Query** | Dashboard stats and observation lists fetched client-side; automatically cached and invalidated on mutation |
| Form state | **React Hook Form** | In-flight observation form field values and validation errors |

This separation means the Zustand store never holds server data, React Query never holds ephemeral UI toggles, and React Hook Form never leaks outside the form tree.

### 3. Authentication & Authorization

Authentication is handled by **Supabase Auth** with email/password. The implementation follows the official Supabase Next.js SSR starter:

- **Sign-up** (`/auth/sign-up`) creates a Supabase account and sends an email-confirmation link.
- **Sign-in** (`/auth/login`) issues a session cookie via `@supabase/ssr`.
- **Password reset** — a two-step flow: `/auth/forgot-password` requests a reset email; `/auth/update-password` accepts the magic-link token and sets a new password.
- Sessions are persisted across reloads via HTTP-only cookies managed by `createServerClient` in `lib/supabase/server.ts`.

**Authorization:**

- All `/protected/*` pages call `supabase.auth.getUser()` server-side and redirect to `/auth/login` if no session is present.
- The `/admin` page additionally checks `profile.role === 'admin'`, redirecting non-admin users away.
- Server Actions (`app/protected/log/actions.ts`) re-verify the session before every mutation.
- Row-Level Security policies on the `observations` table ensure users can only read and write their own rows.

### 4. Routing

The project uses **Next.js App Router** (file-system routing), which provides nested routes, dynamic segments, and not-found handling within the React Server Components model.

Route tree:

```
/                             public homepage
/auth/login                   sign-in
/auth/sign-up                 registration
/auth/forgot-password         password-reset request
/auth/update-password         password-reset completion
/auth/sign-up-success         post-registration confirmation
/auth/error                   auth error display
/auth/confirm                 Supabase email-confirm callback (API route)
/protected/dashboard          analytics dashboard (auth-gated)
/protected/log                observation list (auth-gated)
/protected/log/new            create observation (auth-gated)
/protected/log/[id]/edit      edit observation (auth-gated)
/admin                        admin panel (admin role required)
/observer/[handle]            public profile (stub)
```

Nested routes: `/protected/log/[id]/edit` is nested three levels deep. A shared layout at `app/protected/layout.tsx` wraps all auth-gated pages and provides the navigation header.

Not-found handling: A root `not-found.tsx` page catches unmatched routes.

### 5. Server Communication & Persistence

**BaaS: Supabase**

Supabase provides the PostgreSQL database, authentication, and file storage. The schema has two application tables:

- `observations` — `id`, `user_id`, `object_name`, `object_type`, `observed_at`, `location`, `telescope`, `notes`, `sketch_path`, `created_at`
- `profiles` — `id`, `handle`, `role` (`'user' | 'admin'`), `created_at`

Full CRUD for observations is implemented as **Next.js Server Actions** in `app/protected/log/actions.ts`:

- `createObservation(formData)` — validates with Zod, optionally uploads a sketch to Supabase Storage (`observation-sketches` bucket), and inserts the row.
- `updateObservation(formData)` — validates, optionally replaces the sketch file, and patches the row. On storage upload failure it rolls back cleanly.
- `deleteObservation(id)` — deletes the row and removes the associated storage object.

All mutations call `revalidatePath` to invalidate the Next.js cache for the dashboard and log pages.

**External API integrations** are proxied through Next.js API routes to keep keys server-side and allow cross-origin requests:

- `/api/simbad` — queries the SIMBAD TAP/ADQL service for deep-sky objects, returning canonical name, object type, and equatorial coordinates (RA/Dec).
- `/api/nasa-sightings` — queries NASA JPL's Small-Body Database Browser (SBDB) for solar-system small bodies, falls back to a hardcoded table of major bodies (planets, moons, dwarf planets), then falls back to the JPL Horizons API.

The observation form debounces the object-name field (450 ms) and fires both lookups in parallel via `Promise.all`.

---

## Technical Details

### Data Management

Data flows top-down from Supabase through server-side fetches or React Query client fetches:

- **Dashboard page** — `DashboardContent` (client component) calls a React Query hook that fetches all of the user's observations from Supabase. Aggregation (monthly buckets, type counts, daily counts for the heatmap) is done in the browser. This keeps the SQL queries simple while making the charts reactive.
- **Observation log** — rendered server-side on initial load; filtered client-side using the Zustand search/type-filter state without re-fetching.
- **Admin panel** — a server component that fetches all users and observations in a single server render.

Storage of sketch images uses Supabase Storage with path pattern `{user_id}/{timestamp}-{sanitized_filename}`. The `sketch_path` column stores only the relative path; public URLs are generated on demand via the Supabase Storage SDK.

### API/BaaS Provided

**Supabase** — chosen because it provides auth, a relational database (PostgreSQL with RLS), and file storage in a single managed service with a generous free tier. The `@supabase/ssr` package handles cookie-based session persistence in Next.js server components and API routes without any custom session middleware.

**NASA JPL SBDB / Horizons** — NASA's publicly available small-body and planetary ephemeris APIs, queried without an API key.

**SIMBAD TAP** — the CDS SIMBAD astronomical database, queried via its TAP/ADQL endpoint (no API key required).

### Backend Connections

All Supabase calls use two helper factories:

- `lib/supabase/server.ts` — `createServerClient` from `@supabase/ssr` with cookie read/write bound to Next.js `cookies()`. Used in Server Components, Server Actions, and API routes.
- `lib/supabase/client.ts` — `createBrowserClient` for client components.

The split ensures the server client never ships credentials to the browser and that session cookies are forwarded correctly on every server request.

External API calls (`/api/simbad`, `/api/nasa-sightings`) are Next.js Route Handlers that proxy the third-party requests server-side, avoiding CORS issues and keeping any future API keys out of the client bundle.

---

## Requirements Coverage

| Requirement | Status | Notes |
|---|---|---|
| Component Design | ✅ Met | Composite components (ObservationForm, DashboardContent), reusable primitives, clear prop types |
| State Management | ✅ Met | Zustand (UI), TanStack React Query (server), React Hook Form (forms) — three separated layers |
| Authentication & Authorization | ✅ Met | Email/password sign-up/in, protected routes, role-based admin access, persistent cookie sessions |
| Routing (nested routes, 404) | ✅ Met | Next.js App Router with 3-level nesting, dynamic segments, not-found page |
| Server Communication & Persistence | ✅ Met | Full CRUD via Supabase Server Actions, external API proxies, sketch file storage |
| Documentation (`PROJECT.md`) | ✅ Met | This file |

**Known gap:** The course requirement suggests `@tanstack/react-router` or `react-router` for routing. This project uses Next.js App Router instead, which provides equivalent (and richer) nested routing but within the Next.js framework convention rather than as a standalone library.

---

## AI Use Disclosure

I consulted AI tools — Claude (Claude.ai and Claude Code) and Cursor (Composer 1.5 and Composer 2) — for idea suggestions, tech stack analysis, online resource search, debugging, and code snippet generation. The authentication implementation is largely based on the official Supabase Next.js starter template.

For detailed AI usage disclosures, see [The Disclosure Log](./AI%20Disclojure%20of%20project.md), the [Additional Usage Log](./00_AI_RESPONSE_LOG.md), and the [Debugging Log](./00_DEBUGGING_LOG.md)