"use client";

import { useState } from "react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from "recharts";
import type { SalesTimeSeries } from "@/lib/admin/types";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(v);

export function EstateChart({ data }: { data: SalesTimeSeries[] }) {
  const [metric, setMetric] = useState<"revenue" | "units">("revenue");

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {(["revenue", "units"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            className={`px-3 py-1 rounded-full font-sans text-xs font-semibold border transition-colors ${
              metric === m
                ? "bg-accent/15 border-accent/30 text-ink"
                : "border-stone/20 text-stone hover:text-ink"
            }`}
          >
            {m === "revenue" ? "Revenue" : "Units"}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8E3DC" />
          <XAxis
            dataKey="date"
            tickFormatter={(v) => v.slice(5)}
            tick={{ fontSize: 10, fill: "#8B8378" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#8B8378" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={metric === "revenue" ? (v) => `£${v}` : undefined}
            width={metric === "revenue" ? 48 : 28}
          />
          <Tooltip
            contentStyle={{ background: "#14110F", border: "none", borderRadius: 8, padding: "8px 12px" }}
            labelStyle={{ color: "#8B8378", fontSize: 11 }}
            itemStyle={{ color: "#F5F0EA", fontSize: 11 }}
            formatter={(v) => typeof v === "number" ? (metric === "revenue" ? fmt(v) : v) : v}
          />
          <Line
            type="monotone"
            dataKey={metric === "revenue" ? "revenueGbp" : "units"}
            stroke="#C9A684"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3, fill: "#C9A684" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
