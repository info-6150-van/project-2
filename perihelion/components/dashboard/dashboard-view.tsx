"use client";

import Link from "next/link";
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

const HEATMAP_COLORS = ["bg-white/5", "bg-indigo-900/60", "bg-indigo-600/70", "bg-indigo-400", "bg-indigo-200"];

function DashCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        border: "1px solid rgba(140,180,255,0.12)",
        borderRadius: "4px",
        padding: "1.25rem",
        background: "rgba(10,15,35,0.6)",
      }}
    >
      <p style={{ margin: "0 0 0.5rem", fontSize: "0.72rem", letterSpacing: "0.16em", color: "#6a88bb" }}>
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
  const pieSlices: { name: string; count: number; fill: string }[] =
    typeCounts.length > 0
      ? typeCounts
      : [{ name: "No data", count: 1, fill: "rgba(255,255,255,0.08)" }];

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
              color: "#8ab4ff",
              textTransform: "uppercase",
              fontWeight: 400,
              margin: 0,
            }}
          >
            Dashboard
          </h1>
          <p style={{ margin: "0.35rem 0 0", color: "#9aaccc", fontSize: "0.9rem" }}>
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

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <DashCard title="Object types">
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
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
                    background: "rgba(10,15,35,0.95)",
                    border: "1px solid rgba(140,180,255,0.2)",
                    borderRadius: 4,
                    color: "#dce8ff",
                    fontSize: 12,
                  }}
                  formatter={(value, name) => [value ?? 0, name]}
                />
              </PieChart>
            </ResponsiveContainer>
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
                  <span style={{ fontSize: "0.78rem", color: "#9aaccc" }}>{item.name}</span>
                  <span style={{ fontSize: "0.78rem", color: "#6a88bb", marginLeft: "auto" }}>{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </DashCard>

        <DashCard title="Sessions per month">
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={monthly} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#4a6088", fontSize: 10 }}
                  axisLine={{ stroke: "rgba(140,180,255,0.15)" }}
                  tickLine={false}
                />
                <YAxis hide domain={[0, "auto"]} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10,15,35,0.95)",
                    border: "1px solid rgba(140,180,255,0.2)",
                    borderRadius: 4,
                    color: "#dce8ff",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                  {monthly.map((_, i) => (
                    <Cell
                      key={i}
                      fill={i === peakMonthIdx && monthly[i]!.count > 0 ? "#4a7acc" : "rgba(74,122,204,0.35)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashCard>
      </div>

      <div
        style={{
          border: "1px solid rgba(140,180,255,0.12)",
          borderRadius: "4px",
          padding: "1.25rem",
          background: "rgba(10,15,35,0.6)",
        }}
      >
        <p style={{ fontSize: "0.72rem", letterSpacing: "0.16em", color: "#6a88bb", marginBottom: "0.75rem" }}>
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
                      border: "1px solid rgba(255,255,255,0.04)",
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2" style={{ marginTop: "0.5rem" }}>
          <span style={{ fontSize: "0.65rem", color: "#4a6088" }}>Less</span>
          {HEATMAP_COLORS.map((c, i) => (
            <div key={i} className={c} style={{ width: 9, height: 9, borderRadius: "1px" }} />
          ))}
          <span style={{ fontSize: "0.65rem", color: "#4a6088" }}>More</span>
        </div>
      </div>
    </div>
  );
}
