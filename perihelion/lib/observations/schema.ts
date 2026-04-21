import { z } from "zod";

export const observationFormSchema = z.object({
  object_name: z.string().min(1, "Target object is required").max(500),
  object_type: z.string().max(200).optional().default(""),
  observed_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date"),
  location: z.string().max(500).optional().default(""),
  telescope: z.string().max(500).optional().default(""),
  notes: z.string().max(8000).optional().default(""),
});

export type ObservationFormValues = z.infer<typeof observationFormSchema>;

export function parseObservationForm(formData: FormData) {
  const raw = {
    object_name: formData.get("object_name"),
    object_type: formData.get("object_type"),
    observed_at: formData.get("observed_at"),
    location: formData.get("location"),
    telescope: formData.get("telescope"),
    notes: formData.get("notes"),
  };
  return observationFormSchema.safeParse({
    object_name: raw.object_name ?? "",
    object_type: raw.object_type ?? "",
    observed_at: raw.observed_at ?? "",
    location: raw.location ?? "",
    telescope: raw.telescope ?? "",
    notes: raw.notes ?? "",
  });
}

const observationIdSchema = z.string().uuid({ message: "Invalid observation id" });

export function parseObservationId(formData: FormData) {
  const raw = formData.get("observation_id");
  return observationIdSchema.safeParse(typeof raw === "string" ? raw : "");
}

export function parseObservationIdParam(raw: string) {
  return observationIdSchema.safeParse(raw);
}
