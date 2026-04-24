import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-lg flex flex-col gap-6">
        <div>
          <p
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: "0.95rem",
              letterSpacing: "0.2em",
              color: "#6a88bb",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            404
          </p>
          <h1
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: "1.75rem",
              letterSpacing: "0.08em",
              color: "#8ab4ff",
              fontWeight: 400,
              margin: "0.75rem 0 0",
            }}
          >
            Page not found
          </h1>
          <p style={{ margin: "0.75rem 0 0", color: "#9aaccc", fontSize: "0.95rem", lineHeight: 1.6 }}>
            The page you’re looking for doesn’t exist or was moved.
          </p>
        </div>

        <div
          style={{
            border: "1px solid rgba(140,180,255,0.15)",
            borderRadius: "4px",
            padding: "1.5rem",
            background: "rgba(10,15,35,0.6)",
            backdropFilter: "blur(8px)",
          }}
        >
          <p style={{ margin: "0 0 1rem", fontSize: "0.78rem", letterSpacing: "0.12em", color: "#6a88bb" }}>
            GO SOMEWHERE USEFUL
          </p>
          <ul className="flex flex-col gap-2" style={{ margin: 0, padding: 0, listStyle: "none" }}>
            <li>
              <Link
                href="/"
                style={{
                  color: "#4a7acc",
                  fontSize: "0.92rem",
                  textDecoration: "none",
                  letterSpacing: "0.04em",
                }}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/auth/login"
                style={{
                  color: "#4a7acc",
                  fontSize: "0.92rem",
                  textDecoration: "none",
                  letterSpacing: "0.04em",
                }}
              >
                Sign in
              </Link>
            </li>
            <li>
              <Link
                href="/protected/dashboard"
                style={{
                  color: "#4a7acc",
                  fontSize: "0.92rem",
                  textDecoration: "none",
                  letterSpacing: "0.04em",
                }}
              >
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
