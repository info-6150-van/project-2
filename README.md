# Perihelion

> A sky-watcher's journal — astronomy observation log manager

Perihelion is a full-stack micro-SaaS built with **Next.js 15 (App Router)**, **Supabase**, and **TypeScript** for the INFO 6150 Project 2 assignment. Users log celestial observations, view analytics dashboards, and look up object metadata from NASA and SIMBAD in real time.

---

## Features

- **Observation log** — Create, edit, and delete entries recording object name, type, date, location, telescope, notes, and an optional sketch upload.
- **Real-time object lookup** — As you type a target name (e.g. "M31", "Ceres"), the form queries the NASA JPL and SIMBAD APIs in parallel and offers to pre-fill the object name and type.
- **Analytics dashboard** — Monthly frequency bar chart, object-type distribution pie chart, and a 26-week activity calendar heatmap (Nivo + Recharts).
- **Authentication** — Email/password sign-up and sign-in, password reset flow, and persistent sessions backed by Supabase Auth.
- **Role-based access** — An admin panel (`/admin`) restricted to accounts with the `admin` role shows all users and all observations.
- **Dark/light theme** — Toggleable via `next-themes` with custom CSS variable tokens.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, React Server Components) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 + custom CSS variables |
| BaaS | Supabase (PostgreSQL, Auth, Storage) |
| Forms | React Hook Form + Zod |
| UI state | Zustand |
| Server state | TanStack React Query |
| Charts | Recharts, Nivo Calendar |
| External APIs | NASA JPL SBDB / Horizons, SIMBAD TAP |

---

## Prerequisites

- Node.js 20+
- A Supabase project (free tier works)

## Quick Start

```bash
# 1. Clone the repo
git clone <repo-url>
cd project-2/perihelion

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. Apply database migrations
# Run the SQL files in perihelion/supabase/migrations/ via the Supabase dashboard or CLI

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Available scripts:

| Script | Description |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | ESLint |

---

## Project Structure (abbreviated)

```
perihelion/
├── app/
│   ├── page.tsx                  # Public homepage
│   ├── auth/                     # Login, sign-up, password-reset pages
│   ├── protected/
│   │   ├── dashboard/            # Analytics dashboard (auth-gated)
│   │   └── log/                  # Observation list, new, [id]/edit
│   ├── admin/                    # Admin panel (role-gated)
│   ├── observer/[handle]/        # Public profile (stub — see PROJECT.md)
│   └── api/
│       ├── simbad/               # SIMBAD TAP proxy
│       └── nasa-sightings/       # NASA JPL proxy
├── components/                   # React components
├── lib/
│   ├── supabase/                 # Supabase client helpers (server + browser)
│   ├── observations/             # Zod schema + query helpers
│   └── store/ui-store.ts         # Zustand UI store
└── supabase/migrations/          # SQL migration files
```

---

## Known Limitations

- The public observer profile page (`/observer/[handle]`) is intentionally left as a stub. Displaying another user's history raises data-privacy and RLS design concerns that are out of scope for this project.
- The authentication code is largely derived from the [official Supabase Next.js starter template](https://supabase.com/docs/guides/auth/quickstarts/nextjs).

---

## AI Use Disclosure

AI tools (Claude Code, Cursor) were used for debugging, code generation, and technical research. See [AI Disclosure Log](./AI%20Disclojure%20of%20project.md) and [AI Response Log](./00_AI_RESPONSE_LOG.md) for details.