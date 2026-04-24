"use client";

import { useObservations } from "@/lib/hooks/use-observations";
import { useUIStore } from "@/lib/store/ui-store";
import { ObservationDeleteButton } from "@/components/observation-delete-button";
import Link from "next/link";
import { useMemo } from "react";

const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export function ObservationLogContent() {
  const { data, isLoading, error } = useObservations();
  const { logFilters, setLogSearch, setLogTypeFilter, resetLogFilters } = useUIStore();

  const allTypes = useMemo(() => {
    if (!data) return [];
    const seen = new Set<string>();
    for (const obs of data) {
      const t = (obs.object_type || "").trim() || "Unknown";
      seen.add(t);
    }
    return [...seen].sort();
  }, [data]);

  const rows = useMemo(() => {
    if (!data) return [];
    return data.filter((obs) => {
      const matchesSearch =
        !logFilters.search ||
        obs.object_name.toLowerCase().includes(logFilters.search.toLowerCase()) ||
        (obs.notes ?? "").toLowerCase().includes(logFilters.search.toLowerCase());
      const matchesType =
        !logFilters.typeFilter ||
        (obs.object_type || "Unknown").toLowerCase() === logFilters.typeFilter.toLowerCase();
      return matchesSearch && matchesType;
    });
  }, [data, logFilters]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: "1.35rem",
              letterSpacing: "0.12em",
              color: "var(--app-section-title)",
              textTransform: "uppercase",
              fontWeight: 400,
              margin: 0,
            }}
          >
            Observation log
          </h1>
          <p style={{ margin: "0.35rem 0 0", color: "var(--app-body)", fontSize: "0.9rem" }}>
            {isLoading ? "Loading…" : `${rows.length} ${rows.length !== (data?.length ?? 0) ? `of ${data?.length ?? 0} ` : ""}entries`}
          </p>
        </div>
        <Link
          href="/protected/log/new"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "0.6rem 1.4rem",
            background: "var(--app-btn-primary)",
            border: "1px solid var(--app-btn-primary-border)",
            borderRadius: "2px",
            color: "var(--app-btn-primary-text)",
            textDecoration: "none",
            fontSize: "0.88rem",
            letterSpacing: "0.06em",
            width: "fit-content",
          }}
        >
          + New observation
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="search"
          placeholder="Search objects or notes…"
          value={logFilters.search}
          onChange={(e) => setLogSearch(e.target.value)}
          style={{
            background: "var(--app-input-bg)",
            border: "1px solid var(--app-input-border)",
            borderRadius: "2px",
            color: "var(--app-input-color)",
            padding: "0.45rem 0.75rem",
            fontSize: "0.85rem",
            outline: "none",
            minWidth: "200px",
          }}
        />
        <select
          value={logFilters.typeFilter}
          onChange={(e) => setLogTypeFilter(e.target.value)}
          style={{
            background: "var(--app-input-bg)",
            border: "1px solid var(--app-input-border)",
            borderRadius: "2px",
            color: logFilters.typeFilter ? "var(--app-input-color)" : "var(--app-label)",
            padding: "0.45rem 0.75rem",
            fontSize: "0.85rem",
            outline: "none",
          }}
        >
          <option value="">All types</option>
          {allTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {(logFilters.search || logFilters.typeFilter) && (
          <button
            onClick={resetLogFilters}
            style={{
              background: "none",
              border: "1px solid var(--app-input-border)",
              borderRadius: "2px",
              color: "var(--app-label)",
              padding: "0.45rem 0.75rem",
              fontSize: "0.82rem",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {isLoading && (
          <p style={{ color: "var(--app-label)", fontSize: "0.92rem" }}>Loading…</p>
        )}
        {error && (
          <p style={{ color: "var(--destructive)", fontSize: "0.92rem" }}>
            Could not load observations. Run the Supabase migration if the table is missing.
          </p>
        )}
        {!isLoading && !error && rows.length === 0 && (
          <p style={{ color: "var(--app-label)", fontSize: "0.92rem" }}>
            {logFilters.search || logFilters.typeFilter ? (
              "No observations match your filters."
            ) : (
              <>
                No observations yet.{" "}
                <Link href="/protected/log/new" style={{ color: "var(--app-link)" }}>
                  Log your first
                </Link>
                .
              </>
            )}
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
                border: "1px solid var(--app-card-border)",
                borderRadius: "3px",
                padding: "1rem 1.25rem",
                background: "var(--app-card-bg)",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "0.25rem 1rem",
                alignItems: "start",
              }}
            >
              <div>
                <p style={{ margin: 0, fontSize: "1rem", color: "var(--app-heading)" }}>{obs.object_name}</p>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.82rem", color: "var(--app-label)" }}>
                  {obs.telescope || "—"} · {obs.location || "—"}
                </p>
                <p style={{ margin: "0.4rem 0 0", fontSize: "0.85rem", color: "var(--app-body)", lineHeight: 1.5 }}>
                  {obs.notes || "—"}
                </p>
                {sketchUrl && (
                  <a
                    href={sketchUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: "0.78rem", color: "var(--app-link)", marginTop: "0.35rem", display: "inline-block" }}
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
                    color: "var(--app-tag)",
                    border: "1px solid var(--app-tag-border)",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "2px",
                    display: "inline-block",
                  }}
                >
                  {(obs.object_type || "UNKNOWN").toUpperCase()}
                </span>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--app-dim)" }}>{obs.observed_at}</p>
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <Link
                    href={`/protected/log/${obs.id}/edit`}
                    style={{
                      fontSize: "0.75rem",
                      letterSpacing: "0.06em",
                      color: "var(--app-section-title)",
                      textDecoration: "none",
                      border: "1px solid var(--app-btn-outline-border)",
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