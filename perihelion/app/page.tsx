import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

// ── inline type just for the static preview cards ──────────────────────────
type Observation = {
  object: string;
  type: string;
  date: string;
  location: string;
  telescope: string;
  notes: string;
};

const SAMPLE_OBSERVATIONS: Observation[] = [
  {
    object: "M31 – Andromeda Galaxy",
    type: "Galaxy",
    date: "2025-10-12",
    location: "Whistler, BC",
    telescope: "Celestron 8\" SCT",
    notes: "Dust lane visible. Faint companion M32 resolved.",
  },
  {
    object: "NGC 7293 – Helix Nebula",
    type: "Nebula",
    date: "2025-10-08",
    location: "Manning Park, BC",
    telescope: "10\" Dobsonian",
    notes: "OIII filter dramatically improved contrast.",
  },
  {
    object: "Saturn",
    type: "Planet",
    date: "2025-09-30",
    location: "Garibaldi Lake",
    telescope: "Celestron 8\" SCT",
    notes: "Cassini Division clear at 180×. Titan visible.",
  },
];

const HEATMAP_WEEKS = 26; // ~6 months

// Deterministic fake activity so SSR is stable
function fakeActivity(week: number, day: number): number {
  const seed = (week * 7 + day) % 17;
  if (seed < 5) return 0;
  if (seed < 9) return 1;
  if (seed < 13) return 2;
  if (seed < 15) return 3;
  return 4;
}

const HEATMAP_COLORS = ["heatmap-0", "heatmap-1", "heatmap-2", "heatmap-3", "heatmap-4"];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        {/* ── NAV ──────────────────────────────────────────────── */}
        <nav className="w-full flex justify-center border-b h-16 backdrop-blur-sm app-nav">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center">
              <Link
                href="/"
                style={{
                  fontFamily: "'EB Garamond', Georgia, serif",
                  letterSpacing: "0.25em",
                  fontSize: "1.05rem",
                  color: "var(--app-logo)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                ✦ PERIHELION
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              {!hasEnvVars ? (
                <EnvVarWarning />
              ) : (
                <Suspense>
                  <AuthButton />
                </Suspense>
              )}
            </div>
          </div>
        </nav>

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="w-full max-w-5xl px-5 flex flex-col gap-4">
          <div
            style={{
              display: "inline-block",
              padding: "0.2rem 0.75rem",
              border: "1px solid var(--app-badge-border)",
              borderRadius: "2px",
              fontSize: "0.7rem",
              letterSpacing: "0.22em",
              color: "var(--app-badge)",
              textTransform: "uppercase",
              width: "fit-content",
              marginBottom: "0.5rem",
            }}
          >
            Sky-Watcher's Journal
          </div>
          <h1
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
              lineHeight: 1.1,
              fontWeight: 400,
              color: "var(--app-heading)",
              margin: 0,
            }}
          >
            Record the cosmos,
            <br />
            <em style={{ color: "var(--app-heading-em)", fontStyle: "italic" }}>one object at a time.</em>
          </h1>
          <p
            style={{
              maxWidth: "520px",
              color: "var(--app-body)",
              lineHeight: 1.7,
              fontSize: "1.05rem",
              margin: "0.5rem 0 1.5rem",
            }}
          >
            Log your celestial observations, auto-fill target metadata from NASA & SIMBAD,
            visualise your session history, and share your public observer profile.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/protected/log/new"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.6rem 1.4rem",
                background: "var(--app-btn-primary)",
                border: "1px solid var(--app-btn-primary-border)",
                borderRadius: "2px",
                color: "var(--app-btn-primary-text)",
                textDecoration: "none",
                fontSize: "0.88rem",
                letterSpacing: "0.06em",
              }}
            >
              + New Observation
            </Link>
            <Link
              href="/protected/dashboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.6rem 1.4rem",
                background: "transparent",
                border: "1px solid var(--app-btn-outline-border)",
                borderRadius: "2px",
                color: "var(--app-btn-outline-text)",
                textDecoration: "none",
                fontSize: "0.88rem",
                letterSpacing: "0.06em",
              }}
            >
              View Dashboard →
            </Link>
          </div>
        </section>

        {/* ── LOG FORM PREVIEW ──────────────────────────────────── */}
        <section className="w-full max-w-5xl px-5">
          <h2
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: "1.25rem",
              letterSpacing: "0.12em",
              color: "var(--app-section-title)",
              textTransform: "uppercase",
              marginBottom: "1.25rem",
              fontWeight: 400,
            }}
          >
            Log an Observation
          </h2>
          <div
            style={{
              border: "1px solid var(--app-card-border)",
              borderRadius: "4px",
              padding: "1.75rem",
              background: "var(--app-card-bg)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              {/* Object name with API badge */}
              <div className="flex flex-col gap-1" style={{ gridColumn: "1 / -1" }}>
                <label style={{ fontSize: "0.72rem", letterSpacing: "0.16em", color: "var(--app-label)" }}>
                  TARGET OBJECT
                </label>
                <div className="flex items-center gap-2">
                  <input
                    disabled
                    placeholder='e.g. "M31" or "NGC 7293"'
                    style={{
                      flex: 1,
                      background: "var(--app-input-bg)",
                      border: "1px solid var(--app-input-border)",
                      borderRadius: "2px",
                      padding: "0.5rem 0.75rem",
                      color: "var(--app-input-color)",
                      fontSize: "0.95rem",
                      fontFamily: "inherit",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.65rem",
                      letterSpacing: "0.1em",
                      color: "var(--app-api-tag)",
                      border: "1px solid var(--app-api-tag-border)",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "2px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    NASA · SIMBAD
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label style={{ fontSize: "0.72rem", letterSpacing: "0.16em", color: "var(--app-label)" }}>DATE</label>
                <input
                  type="date"
                  disabled
                  style={{
                    background: "var(--app-input-bg)",
                    border: "1px solid var(--app-input-border)",
                    borderRadius: "2px",
                    padding: "0.5rem 0.75rem",
                    color: "var(--app-label)",
                    fontSize: "0.9rem",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label style={{ fontSize: "0.72rem", letterSpacing: "0.16em", color: "var(--app-label)" }}>LOCATION</label>
                <input
                  disabled
                  placeholder="Observing site"
                  style={{
                    background: "var(--app-input-bg)",
                    border: "1px solid var(--app-input-border)",
                    borderRadius: "2px",
                    padding: "0.5rem 0.75rem",
                    color: "var(--app-input-color)",
                    fontSize: "0.9rem",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label style={{ fontSize: "0.72rem", letterSpacing: "0.16em", color: "var(--app-label)" }}>TELESCOPE</label>
                <input
                  disabled
                  placeholder='e.g. "10″ Dobsonian"'
                  style={{
                    background: "var(--app-input-bg)",
                    border: "1px solid var(--app-input-border)",
                    borderRadius: "2px",
                    padding: "0.5rem 0.75rem",
                    color: "var(--app-input-color)",
                    fontSize: "0.9rem",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div className="flex flex-col gap-1" style={{ gridColumn: "1 / -1" }}>
                <label style={{ fontSize: "0.72rem", letterSpacing: "0.16em", color: "var(--app-label)" }}>NOTES</label>
                <textarea
                  disabled
                  rows={3}
                  placeholder="Seeing conditions, magnification, what you noticed…"
                  style={{
                    background: "var(--app-input-bg)",
                    border: "1px solid var(--app-input-border)",
                    borderRadius: "2px",
                    padding: "0.5rem 0.75rem",
                    color: "var(--app-input-color)",
                    fontSize: "0.9rem",
                    fontFamily: "inherit",
                    resize: "none",
                  }}
                />
              </div>

              <div className="flex flex-col gap-1" style={{ gridColumn: "1 / -1" }}>
                <label style={{ fontSize: "0.72rem", letterSpacing: "0.16em", color: "var(--app-label)" }}>
                  SKETCH (optional)
                </label>
                <div
                  style={{
                    border: "1px dashed var(--app-sketch-border)",
                    borderRadius: "2px",
                    padding: "1rem",
                    textAlign: "center",
                    color: "var(--app-sketch-text)",
                    fontSize: "0.8rem",
                    letterSpacing: "0.08em",
                  }}
                >
                  Drop image or click to upload
                </div>
              </div>
            </div>

            <p style={{ marginTop: "1rem", fontSize: "0.78rem", color: "var(--app-dim)" }}>
              Sign in to save observations and access your full dashboard.
            </p>
          </div>
        </section>

        {/* ── DASHBOARD PREVIEW ────────────────────────────────── */}
        <section className="w-full max-w-5xl px-5">
          <h2
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: "1.25rem",
              letterSpacing: "0.12em",
              color: "var(--app-section-title)",
              textTransform: "uppercase",
              marginBottom: "1.25rem",
              fontWeight: 400,
            }}
          >
            Dashboard Preview
          </h2>

          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {/* Object-type donut placeholder */}
            <DashCard title="Object Types">
              <div className="flex items-center justify-center gap-6" style={{ padding: "1rem 0" }}>
                <svg viewBox="0 0 80 80" width="80" height="80">
                  <circle cx="40" cy="40" r="30" fill="none" stroke="var(--app-chart-track)" strokeWidth="14" />
                  <circle
                    cx="40" cy="40" r="30" fill="none"
                    stroke="var(--app-chart-1)" strokeWidth="14"
                    strokeDasharray="56 132" strokeLinecap="butt"
                    transform="rotate(-90 40 40)"
                  />
                  <circle
                    cx="40" cy="40" r="30" fill="none"
                    stroke="var(--app-chart-2)" strokeWidth="14"
                    strokeDasharray="33 132" strokeDashoffset="-56" strokeLinecap="butt"
                    transform="rotate(-90 40 40)"
                  />
                  <circle
                    cx="40" cy="40" r="30" fill="none"
                    stroke="var(--app-chart-3)" strokeWidth="14"
                    strokeDasharray="24 132" strokeDashoffset="-89" strokeLinecap="butt"
                    transform="rotate(-90 40 40)"
                  />
                </svg>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Galaxy", colorVar: "var(--app-chart-1)", pct: "42%" },
                    { label: "Nebula", colorVar: "var(--app-chart-2)", pct: "25%" },
                    { label: "Planet", colorVar: "var(--app-chart-3)", pct: "18%" },
                    { label: "Other", colorVar: "var(--app-chart-4)", pct: "15%" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <span style={{ width: 8, height: 8, background: item.colorVar, borderRadius: "50%", display: "inline-block" }} />
                      <span style={{ fontSize: "0.78rem", color: "var(--app-body)" }}>{item.label}</span>
                      <span style={{ fontSize: "0.78rem", color: "var(--app-label)", marginLeft: "auto" }}>{item.pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            </DashCard>

            {/* Frequency bar chart placeholder */}
            <DashCard title="Sessions per Month">
              <div className="flex items-end gap-2" style={{ padding: "1rem 0", height: "90px" }}>
                {[2, 5, 3, 7, 4, 8, 6, 9, 5, 3, 7, 4].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${(h / 9) * 100}%`,
                      background: i === 8 ? "var(--app-bar-active)" : "var(--app-bar-inactive)",
                      borderRadius: "1px 1px 0 0",
                      minHeight: "4px",
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between" style={{ paddingBottom: "0.25rem" }}>
                {["M", "A", "M", "J", "J", "A", "S", "O", "N", "D", "J", "F"].map((m, i) => (
                  <span key={i} style={{ fontSize: "0.6rem", color: "var(--app-dim)", flex: 1, textAlign: "center" }}>{m}</span>
                ))}
              </div>
            </DashCard>
          </div>

          {/* Calendar heatmap */}
          <div
            style={{
              marginTop: "1rem",
              border: "1px solid var(--app-heatmap-border)",
              borderRadius: "4px",
              padding: "1.25rem",
              background: "var(--app-heatmap-bg)",
            }}
          >
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.16em", color: "var(--app-label)", marginBottom: "0.75rem" }}>
              OBSERVATION HEATMAP
            </p>
            <div className="flex gap-1">
              {Array.from({ length: HEATMAP_WEEKS }).map((_, w) => (
                <div key={w} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }).map((_, d) => {
                    const level = fakeActivity(w, d);
                    return (
                      <div
                        key={d}
                        title={`${level} observation${level !== 1 ? "s" : ""}`}
                        className={HEATMAP_COLORS[level]}
                        style={{ width: "10px", height: "10px", borderRadius: "1px" }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2" style={{ marginTop: "0.5rem" }}>
              <span style={{ fontSize: "0.65rem", color: "var(--app-dim)" }}>Less</span>
              {HEATMAP_COLORS.map((c, i) => (
                <div key={i} className={c} style={{ width: 9, height: 9, borderRadius: "1px" }} />
              ))}
              <span style={{ fontSize: "0.65rem", color: "var(--app-dim)" }}>More</span>
            </div>
          </div>
        </section>

        {/* ── RECENT OBSERVATIONS ──────────────────────────────── */}
        <section className="w-full max-w-5xl px-5">
          <div className="flex justify-between items-baseline" style={{ marginBottom: "1.25rem" }}>
            <h2
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: "1.25rem",
                letterSpacing: "0.12em",
                color: "var(--app-section-title)",
                textTransform: "uppercase",
                fontWeight: 400,
                margin: 0,
              }}
            >
              Recent Observations
            </h2>
            <Link
              href="/protected/log"
              style={{ fontSize: "0.78rem", color: "var(--app-link)", textDecoration: "none", letterSpacing: "0.06em" }}
            >
              All entries →
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {SAMPLE_OBSERVATIONS.map((obs) => (
              <div
                key={obs.object}
                style={{
                  border: "1px solid var(--app-card-border)",
                  borderRadius: "3px",
                  padding: "1rem 1.25rem",
                  background: "var(--app-card-bg)",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "0.25rem 1rem",
                  alignItems: "start",
                }}
              >
                <div>
                  <p style={{ margin: 0, fontSize: "1rem", color: "var(--app-heading)" }}>{obs.object}</p>
                  <p style={{ margin: "0.25rem 0 0", fontSize: "0.82rem", color: "var(--app-label)" }}>
                    {obs.telescope} · {obs.location}
                  </p>
                  <p style={{ margin: "0.4rem 0 0", fontSize: "0.85rem", color: "var(--app-body)", lineHeight: 1.5 }}>
                    {obs.notes}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      letterSpacing: "0.1em",
                      color: "var(--app-tag)",
                      border: "1px solid var(--app-tag-border)",
                      padding: "0.15rem 0.5rem",
                      borderRadius: "2px",
                      display: "inline-block",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {obs.type.toUpperCase()}
                  </span>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--app-dim)" }}>{obs.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PUBLIC PROFILE CTA ────────────────────────────────── */}
        <section
          className="w-full max-w-5xl px-5"
          style={{ marginBottom: "2rem" }}
        >
          <div
            style={{
              border: "1px solid var(--app-card-border)",
              borderRadius: "4px",
              padding: "2rem",
              background: "var(--app-cta-bg)",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: "1.4rem",
                color: "var(--app-heading)",
                fontWeight: 400,
              }}
            >
              Share your observer profile
            </p>
            <p style={{ margin: 0, color: "var(--app-body)", fontSize: "0.9rem", lineHeight: 1.6, maxWidth: "480px" }}>
              Every account gets a public profile page at{" "}
              <code style={{ color: "var(--app-code)", fontSize: "0.85rem" }}>perihelion.app/observer/you</code>{" "}
              — your full observation log, stats, and sketches, beautifully presented.
            </p>
            <Link
              href="/auth/sign-up"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.6rem 1.4rem",
                background: "var(--app-btn-primary)",
                border: "1px solid var(--app-btn-primary-border)",
                borderRadius: "2px",
                color: "var(--app-btn-primary-text)",
                textDecoration: "none",
                fontSize: "0.88rem",
                letterSpacing: "0.06em",
                width: "fit-content",
                marginTop: "0.5rem",
              }}
            >
              Create your profile →
            </Link>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────── */}
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16 app-footer">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
              style={{ color: "var(--app-footer-link)" }}
            >
              Supabase
            </a>
            {" "}and{" "}
            <a
              href="https://nextjs.org/"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
              style={{ color: "var(--app-footer-link)" }}
            >
              Next.JS
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}

// ── Small helper component ───────────────────────────────────────────────────
function DashCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        border: "1px solid var(--app-card-border)",
        borderRadius: "4px",
        padding: "1.25rem",
        background: "var(--app-card-bg)",
      }}
    >
      <p style={{ margin: "0 0 0.5rem", fontSize: "0.72rem", letterSpacing: "0.16em", color: "var(--app-label)" }}>
        {title.toUpperCase()}
      </p>
      {children}
    </div>
  );
}
