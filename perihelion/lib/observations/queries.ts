import type { ObservationRow } from "@/lib/types/observation";

export type MonthlyCount = { monthKey: string; label: string; fullLabel: string; count: number };

export type TypeCount = { name: string; count: number; fill: string };

export type DayCount = { day: string; value: number };

const TYPE_COLORS = ["#2a4cad", "#4a7acc", "#8ab4ff", "rgba(42,76,173,0.15)"];

function monthLabel(d: Date): string {
  return ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"][d.getMonth()] ?? "?";
}

function monthFullLabel(d: Date): string {
  return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][d.getMonth()] ?? "?";
}

/** Last 12 calendar months ending this month, oldest first */
export function buildMonthlySeries(rows: ObservationRow[]): MonthlyCount[] {
  const now = new Date();
  const series: MonthlyCount[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    series.push({ monthKey, label: monthLabel(d), fullLabel: monthFullLabel(d), count: 0 });
  }
  const index = new Map(series.map((m, idx) => [m.monthKey, idx]));
  for (const r of rows) {
    const day = r.observed_at.slice(0, 10);
    const mk = day.slice(0, 7);
    const idx = index.get(mk);
    if (idx !== undefined) series[idx].count += 1;
  }
  return series;
}

export function aggregateObjectTypes(rows: ObservationRow[]): TypeCount[] {
  const counts = new Map<string, number>();
  for (const r of rows) {
    const t = (r.object_type || "").trim() || "Other";
    counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  const entries = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  return entries.map(([name, count], i) => ({
    name,
    count,
    fill: TYPE_COLORS[Math.min(i, TYPE_COLORS.length - 1)]!,
  }));
}

/** Daily counts for Nivo time range — last ~26 weeks */
export function buildDayCountsForHeatmap(rows: ObservationRow[], weeks = 26): DayCount[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    const day = r.observed_at.slice(0, 10);
    map.set(day, (map.get(day) ?? 0) + 1);
  }
  const out: DayCount[] = [];
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setDate(start.getDate() - weeks * 7);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const iso = d.toISOString().slice(0, 10);
    out.push({ day: iso, value: map.get(iso) ?? 0 });
  }
  return out;
}

export function maxDayValue(days: DayCount[]): number {
  return days.reduce((m, d) => Math.max(m, d.value), 0);
}

/** Column = week, row = weekday (0–6); levels 0 = none, 1–4 = intensity */
export function buildHeatmapGrid(rows: ObservationRow[], weeks = 26): { levels: number[]; max: number } {
  const map = new Map<string, number>();
  for (const r of rows) {
    const day = r.observed_at.slice(0, 10);
    map.set(day, (map.get(day) ?? 0) + 1);
  }
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setDate(start.getDate() - (weeks * 7 - 1));
  const values: number[] = [];
  for (let i = 0; i < weeks * 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    values.push(map.get(iso) ?? 0);
  }
  const max = values.reduce((m, v) => Math.max(m, v), 0);
  const levels = values.map((v) => {
    if (v <= 0 || max <= 0) return 0;
    const t = v / max;
    return Math.min(4, Math.max(1, Math.ceil(t * 4)));
  });
  return { levels, max };
}
