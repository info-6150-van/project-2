import { AppNavbar } from "@/components/app-navbar";
import { AppFooter } from "@/components/app-footer";

export default async function ObserverPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <AppNavbar showThemeSwitcher />

        <div className="flex-1 flex flex-col gap-8 max-w-5xl p-5 w-full">
          <div>
            <p
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.22em",
                color: "var(--app-label)",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              Observer Profile
            </p>
            <h1
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 400,
                color: "var(--app-heading)",
                margin: 0,
                letterSpacing: "0.04em",
              }}
            >
              {handle}
            </h1>
          </div>

          <div
            style={{
              border: "1px solid var(--app-card-border)",
              borderRadius: "4px",
              padding: "2rem",
              background: "var(--app-card-bg)",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: "1.2rem",
                color: "var(--app-heading)",
                fontWeight: 400,
              }}
            >
              Public profile TBD
            </p>
            <p style={{ margin: 0, color: "var(--app-body)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              Observation logs, stats, and sketches for{" "}
              <code style={{ color: "var(--app-code)", fontSize: "0.85rem" }}>
                perihelion.app/observer/{handle}
              </code>{" "}
              will appear here once the profile is published.
            </p>
          </div>
        </div>

        <AppFooter />
      </div>
    </main>
  );
}
