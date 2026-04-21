import { ObservationDeleteButton } from "@/components/observation-delete-button";
import { createClient } from "@/lib/supabase/server";
import type { ObservationRow } from "@/lib/types/observation";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";

export default async function ObservationLogPage() {
  noStore();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  const { data, error } = await supabase
    .from("observations")
    .select("*")
    .eq("user_id", user.id)
    .order("observed_at", { ascending: false });

  if (error) {
    return (
      <p style={{ color: "#f87171" }}>
        Could not load observations. Run the Supabase migration if the table is missing.
      </p>
    );
  }

  const rows = (data ?? []) as ObservationRow[];
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: "1.35rem",
              letterSpacing: "0.12em",
              color: "#8ab4ff",
              textTransform: "uppercase",
              fontWeight: 400,
              margin: 0,
            }}
          >
            Observation log
          </h1>
          <p style={{ margin: "0.35rem 0 0", color: "#9aaccc", fontSize: "0.9rem" }}>{rows.length} entries</p>
        </div>
        <Link
          href="/protected/log/new"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "0.6rem 1.4rem",
            background: "linear-gradient(135deg, #2a4cad 0%, #1a2e6e 100%)",
            border: "1px solid rgba(140,180,255,0.3)",
            borderRadius: "2px",
            color: "#dce8ff",
            textDecoration: "none",
            fontSize: "0.88rem",
            letterSpacing: "0.06em",
            width: "fit-content",
          }}
        >
          + New observation
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {rows.length === 0 && (
          <p style={{ color: "#6a88bb", fontSize: "0.92rem" }}>
            No observations yet.{" "}
            <Link href="/protected/log/new" style={{ color: "#4a7acc" }}>
              Log your first
            </Link>
            .
          </p>
        )}
        {rows.map((obs) => {
          const sketchUrl =
            obs.sketch_path && base
              ? `${base}/storage/v1/object/public/observation-sketches/${obs.sketch_path}`
              : null;
          return (
            <div
              key={obs.id}
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
                <p style={{ margin: 0, fontSize: "1rem", color: "#dce8ff" }}>{obs.object_name}</p>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.82rem", color: "#6a88bb" }}>
                  {obs.telescope || "—"} · {obs.location || "—"}
                </p>
                <p style={{ margin: "0.4rem 0 0", fontSize: "0.85rem", color: "#9aaccc", lineHeight: 1.5 }}>
                  {obs.notes || "—"}
                </p>
                {sketchUrl && (
                  <a
                    href={sketchUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: "0.78rem", color: "#4a7acc", marginTop: "0.35rem", display: "inline-block" }}
                  >
                    View sketch
                  </a>
                )}
              </div>
              <div
                style={{
                  textAlign: "right",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "0.5rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                    color: "#4a7acc",
                    border: "1px solid rgba(74,122,204,0.25)",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "2px",
                    display: "inline-block",
                  }}
                >
                  {(obs.object_type || "UNKNOWN").toUpperCase()}
                </span>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#4a6088" }}>{obs.observed_at}</p>
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <Link
                    href={`/protected/log/${obs.id}/edit`}
                    style={{
                      fontSize: "0.75rem",
                      letterSpacing: "0.06em",
                      color: "#8ab4ff",
                      textDecoration: "none",
                      border: "1px solid rgba(140,180,255,0.25)",
                      padding: "0.35rem 0.75rem",
                      borderRadius: "2px",
                    }}
                  >
                    Edit
                  </Link>
                  <ObservationDeleteButton observationId={obs.id} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
