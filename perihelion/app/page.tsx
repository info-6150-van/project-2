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

const HEATMAP_COLORS = ["bg-white/5", "bg-indigo-900/60", "bg-indigo-600/70", "bg-indigo-400", "bg-indigo-200"];

export default function Home() {
  return (
    <main
      className="min-h-screen flex flex-col items-center"
      style={{
        background: "radial-gradient(ellipse at 60% 0%, #0d1535 0%, #060912 70%)",
        fontFamily: "'EB Garamond', Georgia, serif",
        color: "#e8e4da",
      }}
    >
      {/* ── star-field decoration ─────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(1px 1px at 15% 20%, rgba(255,255,255,.55) 0%, transparent 100%)," +
            "radial-gradient(1px 1px at 42% 65%, rgba(255,255,255,.4) 0%, transparent 100%)," +
            "radial-gradient(1.5px 1.5px at 75% 10%, rgba(255,255,255,.6) 0%, transparent 100%)," +
            "radial-gradient(1px 1px at 88% 45%, rgba(255,255,255,.35) 0%, transparent 100%)," +
            "radial-gradient(1px 1px at 30% 82%, rgba(255,255,255,.45) 0%, transparent 100%)," +
            "radial-gradient(1px 1px at 55% 38%, rgba(255,255,255,.3) 0%, transparent 100%)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 flex-1 w-full flex flex-col gap-20 items-center">
        {/* ── NAV ──────────────────────────────────────────────── */}
        <nav className="w-full flex justify-center border-b border-white/10 h-16 backdrop-blur-sm bg-black/20">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center">
              <Link
                href="/"
                style={{
                  fontFamily: "'EB Garamond', Georgia, serif",
                  letterSpacing: "0.25em",
                  fontSize: "1.05rem",
                  color: "#c8d8f8",
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
              border: "1px solid rgba(140,180,255,0.25)",
              borderRadius: "2px",
              fontSize: "0.7rem",
              letterSpacing: "0.22em",
              color: "#8ab4ff",
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
              color: "#dce8ff",
              margin: 0,
            }}
          >
            Record the cosmos,
            <br />
            <em style={{ color: "#a0c0ff", fontStyle: "italic" }}>one object at a time.</em>
          </h1>
          <p
            style={{
              maxWidth: "520px",
              color: "#9aaccc",
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
              href="/log/new"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.6rem 1.4rem",
                background: "linear-gradient(135deg, #2a4cad 0%, #1a2e6e 100%)",
                border: "1px solid rgba(140,180,255,0.3)",
                borderRadius: "2px",
                color: "#dce8ff",
                textDecoration: "none",
                fontSize: "0.88rem",
                letterSpacing: "0.06em",
              }}
            >
              + New Observation
            </Link>
            <Link
              href="/dashboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.6rem 1.4rem",
                background: "transparent",
                border: "1px solid rgba(140,180,255,0.2)",
                borderRadius: "2px",
                color: "#8ab4ff",
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
              color: "#8ab4ff",
              textTransform: "uppercase",
              marginBottom: "1.25rem",
              fontWeight: 400,
            }}
          >
            Log an Observation
          </h2>
          <div
            style={{
              border: "1px solid rgba(140,180,255,0.15)",
              borderRadius: "4px",
              padding: "1.75rem",
              background: "rgba(10,15,35,0.6)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              {/* Object name with API badge */}
              <div className="flex flex-col gap-1" style={{ gridColumn: "1 / -1" }}>
                <label style={{ fontSize: "0.72rem", letterSpacing: "0.16em", color: "#6a88bb" }}>
                  TARGET OBJECT
                </label>
                <div className="flex items-center gap-2">
                  <input
                    disabled
                    placeholder='e.g. "M31" or "NGC 7293"'
                    style={{
                      flex: 1,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(140,180,255,0.2)",
                      borderRadius: "2px",
                      padding: "0.5rem 0.75rem",
                      color: "#dce8ff",
                      fontSize: "0.95rem",
                      fontFamily: "inherit",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.65rem",
                      letterSpacing: "0.1em",
                      color: "#4a8aff",
                      border: "1px solid rgba(74,138,255,0.3)",
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
                <label style={{ fontSize: "0.72rem", letterSpacing: "0.16em", color: "#6a88bb" }}>DATE</label>
                <input
                  type="date"
                  disabled
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(140,180,255,0.2)",
                    borderRadius: "2px",
                    padding: "0.5rem 0.75rem",
                    color: "#6a88bb",
                    fontSize: "0.9rem",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label style={{ fontSize: "0.72rem", letterSpacing: "0.16em", color: "#6a88bb" }}>LOCATION</label>
                <input
                  disabled
                  placeholder="Observing site"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(140,180,255,0.2)",
                    borderRadius: "2px",
                    padding: "0.5rem 0.75rem",
                    color: "#dce8ff",
                    fontSize: "0.9rem",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label style={{ fontSize: "0.72rem", letterSpacing: "0.16em", color: "#6a88bb" }}>TELESCOPE</label>
                <input
                  disabled
                  placeholder='e.g. "10″ Dobsonian"'
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(140,180,255,0.2)",
                    borderRadius: "2px",
                    padding: "0.5rem 0.75rem",
                    color: "#dce8ff",
                    fontSize: "0.9rem",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div className="flex flex-col gap-1" style={{ gridColumn: "1 / -1" }}>
                <label style={{ fontSize: "0.72rem", letterSpacing: "0.16em", color: "#6a88bb" }}>NOTES</label>
                <textarea
                  disabled
                  rows={3}
                  placeholder="Seeing conditions, magnification, what you noticed…"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(140,180,255,0.2)",
                    borderRadius: "2px",
                    padding: "0.5rem 0.75rem",
                    color: "#dce8ff",
                    fontSize: "0.9rem",
                    fontFamily: "inherit",
                    resize: "none",
                  }}
                />
              </div>

              <div className="flex flex-col gap-1" style={{ gridColumn: "1 / -1" }}>
                <label style={{ fontSize: "0.72rem", letterSpacing: "0.16em", color: "#6a88bb" }}>
                  SKETCH (optional)
                </label>
                <div
                  style={{
                    border: "1px dashed rgba(140,180,255,0.2)",
                    borderRadius: "2px",
                    padding: "1rem",
                    textAlign: "center",
                    color: "#4a6088",
                    fontSize: "0.8rem",
                    letterSpacing: "0.08em",
                  }}
                >
                  Drop image or click to upload
                </div>
              </div>
            </div>

            <p style={{ marginTop: "1rem", fontSize: "0.78rem", color: "#4a6088" }}>
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
              color: "#8ab4ff",
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
                  <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
                  <circle
                    cx="40" cy="40" r="30" fill="none"
                    stroke="#2a4cad" strokeWidth="14"
                    strokeDasharray="56 132" strokeLinecap="butt"
                    transform="rotate(-90 40 40)"
                  />
                  <circle
                    cx="40" cy="40" r="30" fill="none"
                    stroke="#4a7acc" strokeWidth="14"
                    strokeDasharray="33 132" strokeDashoffset="-56" strokeLinecap="butt"
                    transform="rotate(-90 40 40)"
                  />
                  <circle
                    cx="40" cy="40" r="30" fill="none"
                    stroke="#8ab4ff" strokeWidth="14"
                    strokeDasharray="24 132" strokeDashoffset="-89" strokeLinecap="butt"
                    transform="rotate(-90 40 40)"
                  />
                </svg>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Galaxy", color: "#2a4cad", pct: "42%" },
                    { label: "Nebula", color: "#4a7acc", pct: "25%" },
                    { label: "Planet", color: "#8ab4ff", pct: "18%" },
                    { label: "Other", color: "rgba(255,255,255,0.15)", pct: "15%" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <span style={{ width: 8, height: 8, background: item.color, borderRadius: "50%", display: "inline-block" }} />
                      <span style={{ fontSize: "0.78rem", color: "#9aaccc" }}>{item.label}</span>
                      <span style={{ fontSize: "0.78rem", color: "#6a88bb", marginLeft: "auto" }}>{item.pct}</span>
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
                      background: i === 8 ? "#4a7acc" : "rgba(74,122,204,0.35)",
                      borderRadius: "1px 1px 0 0",
                      minHeight: "4px",
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between" style={{ paddingBottom: "0.25rem" }}>
                {["M", "A", "M", "J", "J", "A", "S", "O", "N", "D", "J", "F"].map((m, i) => (
                  <span key={i} style={{ fontSize: "0.6rem", color: "#4a6088", flex: 1, textAlign: "center" }}>{m}</span>
                ))}
              </div>
            </DashCard>
          </div>

          {/* Calendar heatmap */}
          <div
            style={{
              marginTop: "1rem",
              border: "1px solid rgba(140,180,255,0.12)",
              borderRadius: "4px",
              padding: "1.25rem",
              background: "rgba(10,15,35,0.6)",
            }}
          >
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.16em", color: "#6a88bb", marginBottom: "0.75rem" }}>
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
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "1px",
                          border: "1px solid rgba(255,255,255,0.04)",
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2" style={{ marginTop: "0.5rem" }}>
              <span style={{ fontSize: "0.65rem", color: "#4a6088" }}>Less</span>
              {HEATMAP_COLORS.map((c, i) => (
                <div key={i} className={c} style={{ width: 9, height: 9, borderRadius: "1px" }} />
              ))}
              <span style={{ fontSize: "0.65rem", color: "#4a6088" }}>More</span>
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
                color: "#8ab4ff",
                textTransform: "uppercase",
                fontWeight: 400,
                margin: 0,
              }}
            >
              Recent Observations
            </h2>
            <Link
              href="/log"
              style={{ fontSize: "0.78rem", color: "#4a7acc", textDecoration: "none", letterSpacing: "0.06em" }}
            >
              All entries →
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {SAMPLE_OBSERVATIONS.map((obs) => (
              <div
                key={obs.object}
                style={{
                  border: "1px solid rgba(140,180,255,0.12)",
                  borderRadius: "3px",
                  padding: "1rem 1.25rem",
                  background: "rgba(10,15,35,0.5)",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "0.25rem 1rem",
                  alignItems: "start",
                }}
              >
                <div>
                  <p style={{ margin: 0, fontSize: "1rem", color: "#dce8ff" }}>{obs.object}</p>
                  <p style={{ margin: "0.25rem 0 0", fontSize: "0.82rem", color: "#6a88bb" }}>
                    {obs.telescope} · {obs.location}
                  </p>
                  <p style={{ margin: "0.4rem 0 0", fontSize: "0.85rem", color: "#9aaccc", lineHeight: 1.5 }}>
                    {obs.notes}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      letterSpacing: "0.1em",
                      color: "#4a7acc",
                      border: "1px solid rgba(74,122,204,0.25)",
                      padding: "0.15rem 0.5rem",
                      borderRadius: "2px",
                      display: "inline-block",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {obs.type.toUpperCase()}
                  </span>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#4a6088" }}>{obs.date}</p>
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
              border: "1px solid rgba(140,180,255,0.15)",
              borderRadius: "4px",
              padding: "2rem",
              background: "linear-gradient(135deg, rgba(20,35,80,0.7) 0%, rgba(10,15,35,0.7) 100%)",
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
                color: "#dce8ff",
                fontWeight: 400,
              }}
            >
              Share your observer profile
            </p>
            <p style={{ margin: 0, color: "#9aaccc", fontSize: "0.9rem", lineHeight: 1.6, maxWidth: "480px" }}>
              Every account gets a public profile page at{" "}
              <code style={{ color: "#8ab4ff", fontSize: "0.85rem" }}>perihelion.app/observer/you</code>{" "}
              — your full observation log, stats, and sketches, beautifully presented.
            </p>
            <Link
              href="/sign-up"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.6rem 1.4rem",
                background: "linear-gradient(135deg, #2a4cad 0%, #1a2e6e 100%)",
                border: "1px solid rgba(140,180,255,0.3)",
                borderRadius: "2px",
                color: "#dce8ff",
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
        <footer
          className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16"
          style={{ borderColor: "rgba(140,180,255,0.1)", color: "#4a6088" }}
        >
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
              style={{ color: "#6a88bb" }}
            >
              Supabase
            </a>
            {" "}and{" "}
            <a
              href="https://nextjs.org/"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
              style={{ color: "#6a88bb" }}
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
        border: "1px solid rgba(140,180,255,0.12)",
        borderRadius: "4px",
        padding: "1.25rem",
        background: "rgba(10,15,35,0.6)",
      }}
    >
      <p style={{ margin: "0 0 0.5rem", fontSize: "0.72rem", letterSpacing: "0.16em", color: "#6a88bb" }}>
        {title.toUpperCase()}
      </p>
      {children}
    </div>
  );
}