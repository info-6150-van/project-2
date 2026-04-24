"use client";

import { useObservations } from "@/lib/hooks/use-observations";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import {
  aggregateObjectTypes,
  buildHeatmapGrid,
  buildMonthlySeries,
} from "@/lib/observations/queries";

const HEATMAP_WEEKS = 26;

export function DashboardContent() {
  const { data, isLoading, error } = useObservations();

  if (isLoading) {
    return (
      <p style={{ color: "var(--app-label)", fontSize: "0.9rem" }}>Loading observations…</p>
    );
  }

  if (error) {
    return (
      <p style={{ color: "var(--destructive)", fontSize: "0.9rem" }}>
        Could not load observations. Apply the database migration in Supabase if you have not yet.
      </p>
    );
  }

  const rows = data ?? [];
  const monthly = buildMonthlySeries(rows);
  const typeCounts = aggregateObjectTypes(rows);
  const { levels: heatmapLevels } = buildHeatmapGrid(rows, HEATMAP_WEEKS);

  return (
    <DashboardView
      typeCounts={typeCounts}
      monthly={monthly}
      heatmapLevels={heatmapLevels}
      heatmapWeeks={HEATMAP_WEEKS}
      totalObservations={rows.length}
    />
  );
}