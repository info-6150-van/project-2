import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div>
            <div style={{
              display: "inline-block",
              padding: "0.2rem 0.75rem",
              border: "1px solid var(--app-badge-border)",
              borderRadius: "2px",
              fontSize: "0.7rem",
              letterSpacing: "0.22em",
              color: "var(--app-badge)",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}>
              Sky-Watcher&apos;s Journal
            </div>
            <h1 style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: "2rem",
              fontWeight: 400,
              color: "var(--app-heading)",
              margin: "0 0 0.35rem",
              lineHeight: 1.15,
            }}>
              Thank you for signing up
            </h1>
            <p style={{ margin: 0, color: "var(--app-body)", fontSize: "0.92rem" }}>
              Check your email to confirm.
            </p>
          </div>

          <div style={{
            border: "1px solid var(--app-card-border)",
            borderRadius: "4px",
            padding: "1.75rem",
            background: "var(--app-card-bg)",
            backdropFilter: "blur(8px)",
          }}>
            <p style={{ margin: 0, color: "var(--app-body)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              You&apos;ve successfully signed up. Please check your email to confirm your account before signing in.
            </p>
          </div>

          <p style={{ textAlign: "center", fontSize: "0.82rem", color: "var(--app-dim)" }}>
            Already confirmed?{" "}
            <Link href="/auth/login" style={{
              color: "var(--app-link)",
              textDecoration: "none",
              letterSpacing: "0.04em",
            }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}