"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { SalesTimeSeries } from "@/lib/dashboard";

type Series = "revenue" | "units";

const formatDate = (d: string) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" });

const formatGbp = (v: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(v);

export function SalesChart({ data }: { data: SalesTimeSeries[] }) {
  const [shown, setShown] = useState<Set<Series>>(new Set(["revenue"]));

  function toggle(s: Series) {
    setShown((prev) => {
      const next = new Set(prev);
      if (next.has(s) && next.size > 1) {
        next.delete(s);
      } else {
        next.add(s);
      }
      return next;
    });
  }

  const showRevenue = shown.has("revenue");
  const showUnits = shown.has("units");
  const both = showRevenue && showUnits;

  return (
    <div>
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => toggle("revenue")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-xs font-semibold border transition-colors ${
            showRevenue
              ? "bg-accent/15 border-accent/30 text-accent"
              : "border-stone/20 text-stone"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-accent" />
          Revenue
        </button>
        <button
          onClick={() => toggle("units")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-xs font-semibold border transition-colors ${
            showUnits
              ? "bg-ink/[0.08] border-ink/20 text-ink"
              : "border-stone/20 text-stone"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-ink/50" />
          No. of Sales
        </button>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: both ? 36 : 4, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#8B837820" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 11, fill: "#8B8378", fontFamily: "var(--font-sans)" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          {showRevenue && (
            <YAxis
              yAxisId="rev"
              orientation="left"
              tickFormatter={formatGbp}
              tick={{ fontSize: 11, fill: "#C9A684", fontFamily: "var(--font-sans)" }}
              tickLine={false}
              axisLine={false}
              width={54}
            />
          )}
          {showUnits && (
            <YAxis
              yAxisId="units"
              orientation={both ? "right" : "left"}
              tick={{ fontSize: 11, fill: "#8B8378", fontFamily: "var(--font-sans)" }}
              tickLine={false}
              axisLine={false}
              width={both ? 32 : 36}
            />
          )}
          <Tooltip
            contentStyle={{
              background: "#14110F",
              border: "1px solid rgba(244,239,230,0.12)",
              borderRadius: 8,
              fontSize: 12,
              fontFamily: "var(--font-sans)",
              color: "#F4EFE6",
            }}
            labelFormatter={(l: unknown) => formatDate(String(l))}
            formatter={(value: unknown, name: unknown) =>
              name === "revenueGbp"
                ? [formatGbp(Number(value)), "Revenue"]
                : [String(value), "Sales"]
            }
          />
          {showRevenue && (
            <Line
              yAxisId="rev"
              type="monotone"
              dataKey="revenueGbp"
              stroke="#C9A684"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#C9A684", stroke: "#14110F", strokeWidth: 2 }}
            />
          )}
          {showUnits && (
            <Line
              yAxisId="units"
              type="monotone"
              dataKey="units"
              stroke="#4B453E"
              strokeWidth={both ? 1.5 : 2}
              strokeDasharray={both ? "5 3" : undefined}
              dot={false}
              activeDot={{ r: 4, fill: "#4B453E", stroke: "#14110F", strokeWidth: 2 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
