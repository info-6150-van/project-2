import { ObservationForm } from "@/components/observation-form";
import Link from "next/link";

export default function NewObservationPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
      <div>
        <Link
          href="/protected/log"
          style={{ fontSize: "0.78rem", color: "var(--app-link)", textDecoration: "none", letterSpacing: "0.06em" }}
        >
          ← All entries
        </Link>
        <h1
          style={{
            fontFamily: "'EB Garamond', Georgia, serif",
            fontSize: "1.35rem",
            letterSpacing: "0.12em",
            color: "var(--app-section-title)",
            textTransform: "uppercase",
            fontWeight: 400,
            margin: "0.75rem 0 0",
          }}
        >
          Log an observation
        </h1>
        <p style={{ margin: "0.5rem 0 0", color: "var(--app-body)", fontSize: "0.92rem" }}>
          Target lookups use SIMBAD and NASA JPL Small-Body data when available.
        </p>
      </div>

      <div
        style={{
          border: "1px solid var(--app-card-border)",
          borderRadius: "4px",
          padding: "1.75rem",
          background: "var(--app-card-bg)",
          backdropFilter: "blur(8px)",
        }}
      >
        <ObservationForm />
      </div>
    </div>
  );
}