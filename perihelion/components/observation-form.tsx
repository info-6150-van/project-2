"use client";

import { observationFormSchema, type ObservationFormValues } from "@/lib/observations/schema";
import { createObservation, updateObservation } from "@/app/protected/log/actions";
import { OBSERVATIONS_QUERY_KEY } from "@/lib/hooks/use-observations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

const inputStyle: React.CSSProperties = {
  background: "var(--app-input-bg)",
  border: "1px solid var(--app-input-border)",
  borderRadius: "2px",
  padding: "0.5rem 0.75rem",
  color: "var(--app-input-color)",
  fontSize: "0.95rem",
  fontFamily: "inherit",
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.72rem",
  letterSpacing: "0.16em",
  color: "var(--app-label)",
};

type SimbadJson = { canonicalName: string; objectType: string; ra?: number; dec?: number };
type NasaJson =
  | { applicable: true; designation: string; name?: string; kind?: string; orbitClass?: string; note?: string }
  | { applicable: false; reason: string };

function toDateInputValue(raw: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  return raw.slice(0, 10);
}

export type ObservationFormProps = {
  mode?: "create" | "edit";
  observationId?: string;
  initialValues?: Partial<ObservationFormValues>;
  existingSketchUrl?: string | null;
};

export function ObservationForm({
  mode = "create",
  observationId,
  initialValues,
  existingSketchUrl = null,
}: ObservationFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [simbadHint, setSimbadHint] = useState<SimbadJson | null>(null);
  const [nasaHint, setNasaHint] = useState<NasaJson | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ObservationFormValues>({
    resolver: zodResolver(observationFormSchema),
    defaultValues: {
      object_name: initialValues?.object_name ?? "",
      object_type: initialValues?.object_type ?? "",
      observed_at:
        initialValues?.observed_at != null && initialValues.observed_at !== ""
          ? toDateInputValue(initialValues.observed_at)
          : new Date().toISOString().slice(0, 10),
      location: initialValues?.location ?? "",
      telescope: initialValues?.telescope ?? "",
      notes: initialValues?.notes ?? "",
    },
  });

  const target = watch("object_name");

  const runLookup = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (trimmed.length < 2) {
      setSimbadHint(null);
      setNasaHint(null);
      return;
    }
    setLookupLoading(true);
    setFormError(null);
    try {
      const [sRes, nRes] = await Promise.all([
        fetch(`/api/simbad?q=${encodeURIComponent(trimmed)}`),
        fetch(`/api/nasa-sightings?q=${encodeURIComponent(trimmed)}`),
      ]);
      if (sRes.ok) {
        setSimbadHint((await sRes.json()) as SimbadJson);
      } else {
        setSimbadHint(null);
      }
      if (nRes.ok) {
        setNasaHint((await nRes.json()) as NasaJson);
      } else {
        setNasaHint(null);
      }
    } catch {
      setSimbadHint(null);
      setNasaHint(null);
    } finally {
      setLookupLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => {
      void runLookup(target ?? "");
    }, 450);
    return () => window.clearTimeout(t);
  }, [target, runLookup]);

  const applySimbad = () => {
    if (!simbadHint) return;
    setValue("object_name", simbadHint.canonicalName);
    setValue("object_type", simbadHint.objectType);
  };

  const applyNasa = () => {
    if (!nasaHint || !("applicable" in nasaHint) || !nasaHint.applicable) return;
    if (nasaHint.name) setValue("object_name", nasaHint.name);
    if (nasaHint.kind) setValue("object_type", nasaHint.kind);
  };

  const onSubmit = async (data: ObservationFormValues) => {
    setSubmitting(true);
    setFormError(null);
    const fd = new FormData();
    fd.set("object_name", data.object_name);
    fd.set("object_type", data.object_type ?? "");
    fd.set("observed_at", data.observed_at);
    fd.set("location", data.location ?? "");
    fd.set("telescope", data.telescope ?? "");
    fd.set("notes", data.notes ?? "");
    const file = fileRef.current?.files?.[0];
    if (file && file.size > 0) {
      fd.set("sketch", file);
    }
    let result;
    if (mode === "edit" && observationId) {
      fd.set("observation_id", observationId);
      result = await updateObservation(fd);
    } else {
      result = await createObservation(fd);
    }
    setSubmitting(false);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    queryClient.invalidateQueries({ queryKey: OBSERVATIONS_QUERY_KEY });
    router.push("/protected/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <div className="flex flex-col gap-1" style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>TARGET OBJECT</label>
          <div className="flex items-center gap-2 flex-wrap">
            <input {...register("object_name")} placeholder='e.g. "M31" or "Ceres"' style={inputStyle} />
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
            {lookupLoading && (
              <span style={{ fontSize: "0.75rem", color: "var(--app-label)" }}>Looking up…</span>
            )}
          </div>
          {errors.object_name && (
            <p style={{ fontSize: "0.78rem", color: "var(--destructive)", margin: 0 }}>{errors.object_name.message}</p>
          )}

          {(simbadHint || (nasaHint && "applicable" in nasaHint && nasaHint.applicable)) && (
            <div
              style={{
                marginTop: "0.5rem",
                padding: "0.75rem 1rem",
                border: "1px solid var(--app-card-border)",
                borderRadius: "4px",
                background: "var(--app-card-bg)",
                fontSize: "0.82rem",
                color: "var(--app-body)",
              }}
            >
              {simbadHint && (
                <p style={{ margin: "0 0 0.35rem" }}>
                  <strong style={{ color: "var(--app-heading)" }}>SIMBAD:</strong> {simbadHint.canonicalName} — {simbadHint.objectType}
                </p>
              )}
              {nasaHint && "applicable" in nasaHint && nasaHint.applicable && (
                <p style={{ margin: simbadHint ? "0 0 0.35rem" : 0 }}>
                  <strong style={{ color: "var(--app-heading)" }}>NASA:</strong>{" "}
                  {[nasaHint.designation, nasaHint.name].filter(Boolean).join(" · ")}
                  {nasaHint.orbitClass ? ` — ${nasaHint.orbitClass}` : ""}
                </p>
              )}
              {(simbadHint || (nasaHint && "applicable" in nasaHint && nasaHint.applicable)) && (
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                  {simbadHint && (
                    <button
                      type="button"
                      onClick={applySimbad}
                      style={{
                        padding: "0.35rem 0.75rem",
                        fontSize: "0.75rem",
                        letterSpacing: "0.06em",
                        background: "var(--app-badge-border)",
                        border: "1px solid var(--app-btn-outline-border)",
                        borderRadius: "2px",
                        color: "var(--app-section-title)",
                        cursor: "pointer",
                      }}
                    >
                      Apply SIMBAD name and type
                    </button>
                  )}
                  {nasaHint && "applicable" in nasaHint && nasaHint.applicable && (
                    <button
                      type="button"
                      onClick={applyNasa}
                      style={{
                        padding: "0.35rem 0.75rem",
                        fontSize: "0.75rem",
                        letterSpacing: "0.06em",
                        background: "var(--app-badge-border)",
                        border: "1px solid var(--app-btn-outline-border)",
                        borderRadius: "2px",
                        color: "var(--app-section-title)",
                        cursor: "pointer",
                      }}
                    >
                      Apply NASA name and type
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label style={labelStyle}>OBJECT TYPE</label>
          <input {...register("object_type")} placeholder="e.g. Galaxy" style={inputStyle} />
        </div>

        <div className="flex flex-col gap-1">
          <label style={labelStyle}>DATE</label>
          <input type="date" {...register("observed_at")} style={inputStyle} />
          {errors.observed_at && (
            <p style={{ fontSize: "0.78rem", color: "var(--destructive)", margin: 0 }}>{errors.observed_at.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label style={labelStyle}>LOCATION</label>
          <input {...register("location")} placeholder="Observing site" style={inputStyle} />
        </div>

        <div className="flex flex-col gap-1">
          <label style={labelStyle}>TELESCOPE</label>
          <input {...register("telescope")} placeholder='e.g. "10″ Dobsonian"' style={inputStyle} />
        </div>

        <div className="flex flex-col gap-1" style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>NOTES</label>
          <textarea
            {...register("notes")}
            rows={4}
            placeholder="Seeing conditions, magnification, what you noticed…"
            style={{ ...inputStyle, resize: "vertical", minHeight: "88px" }}
          />
        </div>

        <div className="flex flex-col gap-1" style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>SKETCH (optional)</label>
          {mode === "edit" && existingSketchUrl && (
            <p style={{ margin: "0 0 0.35rem", fontSize: "0.82rem" }}>
              <a
                href={existingSketchUrl}
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--app-link)" }}
              >
                Current sketch
              </a>
              <span style={{ color: "var(--app-label)", marginLeft: "0.5rem" }}>— upload a file below to replace</span>
            </p>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{ fontSize: "0.85rem", color: "var(--app-body)" }} />
        </div>
      </div>

      {formError && <p style={{ fontSize: "0.85rem", color: "var(--destructive)", margin: 0 }}>{formError}</p>}

      <button
        type="submit"
        disabled={submitting}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0.6rem 1.4rem",
          background: "var(--app-btn-primary)",
          border: "1px solid var(--app-btn-primary-border)",
          borderRadius: "2px",
          color: "var(--app-btn-primary-text)",
          opacity: submitting ? 0.6 : 1,
          fontSize: "0.88rem",
          letterSpacing: "0.06em",
          cursor: submitting ? "not-allowed" : "pointer",
          width: "fit-content",
        }}
      >
        {submitting ? "Saving…" : mode === "edit" ? "Save changes" : "Save observation"}
      </button>
    </form>
  );
}