"use server";

import { createClient } from "@/lib/supabase/server";
import { parseObservationForm, parseObservationId, parseObservationIdParam } from "@/lib/observations/schema";
import { revalidatePath } from "next/cache";

function sanitizeFilename(name: string): string {
  const base = name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
  return base || "sketch";
}

const MAX_SKETCH_BYTES = 5 * 1024 * 1024;

export type ObservationMutationResult =
  | { ok: true }
  | { ok: false; error: string };

/** @deprecated Use ObservationMutationResult */
export type CreateObservationResult = ObservationMutationResult;

function revalidateObservationPaths() {
  revalidatePath("/protected/dashboard");
  revalidatePath("/protected/log");
}

export async function createObservation(formData: FormData): Promise<ObservationMutationResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "You must be signed in." };
  }

  const parsed = parseObservationForm(formData);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join("; ");
    return { ok: false, error: msg || "Invalid form" };
  }

  const v = parsed.data;
  let sketch_path: string | null = null;

  const sketch = formData.get("sketch");
  if (sketch instanceof File && sketch.size > 0) {
    if (sketch.size > MAX_SKETCH_BYTES) {
      return { ok: false, error: "Sketch file must be 5 MB or smaller." };
    }
    if (!sketch.type.startsWith("image/")) {
      return { ok: false, error: "Sketch must be an image file." };
    }
    const path = `${user.id}/${Date.now()}-${sanitizeFilename(sketch.name)}`;
    const { error: uploadError } = await supabase.storage.from("observation-sketches").upload(path, sketch, {
      contentType: sketch.type,
      upsert: false,
    });
    if (uploadError) {
      return { ok: false, error: uploadError.message };
    }
    sketch_path = path;
  }

  const { error: insertError } = await supabase.from("observations").insert({
    user_id: user.id,
    object_name: v.object_name.trim(),
    object_type: v.object_type.trim(),
    observed_at: v.observed_at,
    location: v.location.trim(),
    telescope: v.telescope.trim(),
    notes: v.notes.trim(),
    sketch_path,
  });

  if (insertError) {
    return { ok: false, error: insertError.message };
  }

  revalidateObservationPaths();
  return { ok: true };
}

export async function updateObservation(formData: FormData): Promise<ObservationMutationResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "You must be signed in." };
  }

  const idParsed = parseObservationId(formData);
  if (!idParsed.success) {
    return { ok: false, error: idParsed.error.issues[0]?.message ?? "Invalid observation id" };
  }
  const observationId = idParsed.data;

  const { data: existing, error: fetchError } = await supabase
    .from("observations")
    .select("sketch_path")
    .eq("id", observationId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError) {
    return { ok: false, error: fetchError.message };
  }
  if (!existing) {
    return { ok: false, error: "Observation not found." };
  }

  const parsed = parseObservationForm(formData);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join("; ");
    return { ok: false, error: msg || "Invalid form" };
  }

  const v = parsed.data;
  let nextSketchPath: string | null | undefined = undefined;
  const sketch = formData.get("sketch");
  if (sketch instanceof File && sketch.size > 0) {
    if (sketch.size > MAX_SKETCH_BYTES) {
      return { ok: false, error: "Sketch file must be 5 MB or smaller." };
    }
    if (!sketch.type.startsWith("image/")) {
      return { ok: false, error: "Sketch must be an image file." };
    }
    const path = `${user.id}/${Date.now()}-${sanitizeFilename(sketch.name)}`;
    const { error: uploadError } = await supabase.storage.from("observation-sketches").upload(path, sketch, {
      contentType: sketch.type,
      upsert: false,
    });
    if (uploadError) {
      return { ok: false, error: uploadError.message };
    }
    nextSketchPath = path;
  }

  const patch: {
    object_name: string;
    object_type: string;
    observed_at: string;
    location: string;
    telescope: string;
    notes: string;
    sketch_path?: string | null;
  } = {
    object_name: v.object_name.trim(),
    object_type: v.object_type.trim(),
    observed_at: v.observed_at,
    location: v.location.trim(),
    telescope: v.telescope.trim(),
    notes: v.notes.trim(),
  };

  if (nextSketchPath !== undefined) {
    patch.sketch_path = nextSketchPath;
  }

  const { error: updateError } = await supabase
    .from("observations")
    .update(patch)
    .eq("id", observationId)
    .eq("user_id", user.id);

  if (updateError) {
    if (nextSketchPath) {
      await supabase.storage.from("observation-sketches").remove([nextSketchPath]);
    }
    return { ok: false, error: updateError.message };
  }

  if (nextSketchPath && existing.sketch_path) {
    await supabase.storage.from("observation-sketches").remove([existing.sketch_path]);
  }

  revalidateObservationPaths();
  revalidatePath(`/protected/log/${observationId}/edit`);
  return { ok: true };
}

export async function deleteObservation(observationId: string): Promise<ObservationMutationResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "You must be signed in." };
  }

  const idParsed = parseObservationIdParam(observationId);
  if (!idParsed.success) {
    return { ok: false, error: idParsed.error.issues[0]?.message ?? "Invalid observation id." };
  }

  const { data: row, error: fetchError } = await supabase
    .from("observations")
    .select("sketch_path")
    .eq("id", observationId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError) {
    return { ok: false, error: fetchError.message };
  }
  if (!row) {
    return { ok: false, error: "Observation not found." };
  }

  const { error: deleteError } = await supabase
    .from("observations")
    .delete()
    .eq("id", observationId)
    .eq("user_id", user.id);

  if (deleteError) {
    return { ok: false, error: deleteError.message };
  }

  if (row.sketch_path) {
    await supabase.storage.from("observation-sketches").remove([row.sketch_path]);
  }

  revalidateObservationPaths();
  return { ok: true };
}
