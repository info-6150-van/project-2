"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlyCount, TypeCount } from "@/lib/observations/queries";

const HEATMAP_COLORS = ["heatmap-0", "heatmap-1", "heatmap-2", "heatmap-3", "heatmap-4"];

function MonthlyTooltip({ active, payload }: { active?: boolean; payload?: { value: number; payload: MonthlyCount }[] }) {
  if (!active || !payload?.length) return null;
  const { fullLabel } = payload[0]!.payload;
  const count = payload[0]!.value;
  return (
    <div
      style={{
        background: "var(--app-card-bg)",
        border: "1px solid var(--app-card-border)",
        borderRadius: 4,
        padding: "6px 10px",
        fontSize: 12,
      }}
    >
      <p style={{ margin: 0, color: "var(--app-heading)" }}>{fullLabel}</p>
      <p style={{ margin: 0, color: "var(--app-heading)" }}>{count}</p>
    </div>
  );
}

function DashCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        border: "1px solid var(--app-card-border)",
        borderRadius: "4px",
        padding: "1.25rem",
        background: "var(--app-card-bg)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <p style={{ margin: "0 0 0.5rem", fontSize: "0.72rem", letterSpacing: "0.16em", color: "var(--app-label)" }}>
        {title.toUpperCase()}
      </p>
      {children}
    </div>
  );
}

type Props = {
  typeCounts: TypeCount[];
  monthly: MonthlyCount[];
  heatmapLevels: number[];
  heatmapWeeks: number;
  totalObservations: number;
};

export function DashboardView({
  typeCounts,
  monthly,
  heatmapLevels,
  heatmapWeeks,
  totalObservations,
}: Props) {
	
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  const pieSlices: { name: string; count: number; fill: string }[] =
    typeCounts.length > 0
      ? typeCounts
      : [{ name: "No data", count: 1, fill: "rgba(42,76,173,0.12)" }];

  const peakMonthIdx = monthly.reduce(
    (best, m, i, arr) => (m.count > arr[best]!.count ? i : best),
    0,
  );

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: "1.5rem",
              letterSpacing: "0.12em",
              color: "var(--app-section-title)",
              textTransform: "uppercase",
              fontWeight: 400,
              margin: 0,
            }}
          >
            Dashboard
          </h1>
          <p style={{ margin: "0.35rem 0 0", color: "var(--app-body)", fontSize: "0.9rem" }}>
            {totalObservations} observation{totalObservations !== 1 ? "s" : ""} logged
          </p>
        </div>
        <Link
          href="/protected/log/new"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
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

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <DashCard title="Object types">
          <div style={{ width: "100%", height: 220 }}>
            {mounted && <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={pieSlices}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={2}
                >
                  {pieSlices.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--app-card-bg)",
                    border: "1px solid var(--app-card-border)",
                    borderRadius: 4,
                    color: "var(--app-heading)",
                    fontSize: 12,
                  }}
                  formatter={(value, name) => [value ?? 0, name]}
                />
              </PieChart>
            </ResponsiveContainer>}
          </div>
          {typeCounts.length > 0 && (
            <div className="flex flex-col gap-2 mt-2">
              {typeCounts.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      background: item.fill,
                      borderRadius: "50%",
                      display: "inline-block",
                    }}
                  />
                  <span style={{ fontSize: "0.78rem", color: "var(--app-body)" }}>{item.name}</span>
                  <span style={{ fontSize: "0.78rem", color: "var(--app-label)", marginLeft: "auto" }}>{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </DashCard>

        <DashCard title="Sessions per month">
          <div style={{ width: "100%", flex: 1, minHeight: 220 }}>
            {mounted && <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={monthly} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <XAxis
                  dataKey="label"
                  tick={{ fill: "var(--app-dim)", fontSize: 10 }}
                  axisLine={{ stroke: "var(--app-card-border)" }}
                  tickLine={false}
                />
                <YAxis hide domain={[0, "auto"]} />
                <Tooltip content={<MonthlyTooltip />} />
                <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                  {monthly.map((_, i) => (
                    <Cell
                      key={i}
                      fill={i === peakMonthIdx && monthly[i]!.count > 0 ? "#4a7acc" : "rgba(74,122,204,0.35)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>}
          </div>
        </DashCard>
      </div>

      <div
        style={{
          border: "1px solid var(--app-heatmap-border)",
          borderRadius: "4px",
          padding: "1.25rem",
          background: "var(--app-heatmap-bg)",
        }}
      >
        <p style={{ fontSize: "0.72rem", letterSpacing: "0.16em", color: "var(--app-label)", marginBottom: "0.75rem" }}>
          OBSERVATION HEATMAP
        </p>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {Array.from({ length: heatmapWeeks }).map((_, w) => (
            <div key={w} className="flex flex-col gap-1">
              {Array.from({ length: 7 }).map((_, d) => {
                const idx = w * 7 + d;
                const level = heatmapLevels[idx] ?? 0;
                const cls = HEATMAP_COLORS[level] ?? HEATMAP_COLORS[0];
                return (
                  <div
                    key={d}
                    title={`${level === 0 ? "No" : level} activity`}
                    className={cls}
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "1px",
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2" style={{ marginTop: "0.5rem" }}>
          <span style={{ fontSize: "0.65rem", color: "var(--app-dim)" }}>Less</span>
          {HEATMAP_COLORS.map((c, i) => (
            <div key={i} className={c} style={{ width: 9, height: 9, borderRadius: "1px" }} />
          ))}
          <span style={{ fontSize: "0.65rem", color: "var(--app-dim)" }}>More</span>
        </div>
      </div>
    </div>
  );
}
