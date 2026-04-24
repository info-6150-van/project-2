import { ObservationForm } from "@/components/observation-form";
import { createClient } from "@/lib/supabase/server";
import type { ObservationRow } from "@/lib/types/observation";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditObservationPage({ params }: Props) {
  const { id } = await params;
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
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return (
      <p style={{ color: "var(--destructive)" }}>
        Could not load observation. Run the Supabase migration if the table is missing.
      </p>
    );
  }

  if (!data) {
    notFound();
  }

  const obs = data as ObservationRow;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const existingSketchUrl =
    obs.sketch_path && base
      ? `${base}/storage/v1/object/public/observation-sketches/${obs.sketch_path}`
      : null;

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
          Edit observation
        </h1>
        <p style={{ margin: "0.5rem 0 0", color: "var(--app-body)", fontSize: "0.92rem" }}>
          Update fields below. Target lookups still use SIMBAD and NASA when you change the target name.
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
        <ObservationForm
          mode="edit"
          observationId={obs.id}
          existingSketchUrl={existingSketchUrl}
          initialValues={{
            object_name: obs.object_name,
            object_type: obs.object_type,
            observed_at: obs.observed_at,
            location: obs.location,
            telescope: obs.telescope,
            notes: obs.notes,
          }}
        />
      </div>
    </div>
  );
}
