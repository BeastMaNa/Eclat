"use client";

import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from "recharts";
import type { ProfitTimeSeries } from "@/lib/admin/types";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(v);

export function ProfitChart({ data }: { data: ProfitTimeSeries[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
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
          tickFormatter={(v) => `£${v}`}
          width={48}
        />
        <Tooltip
          contentStyle={{ background: "#14110F", border: "none", borderRadius: 8, padding: "8px 12px" }}
          labelStyle={{ color: "#8B8378", fontSize: 11 }}
          itemStyle={{ fontSize: 11 }}
          formatter={(v) => typeof v === "number" ? fmt(v) : v}
        />
        <Legend
          iconType="plainline"
          iconSize={16}
          wrapperStyle={{ fontSize: 11, color: "#8B8378", paddingTop: 8 }}
        />
        <Line
          type="monotone"
          dataKey="revenueGbp"
          name="Revenue"
          stroke="#C9C0B5"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="netProfitGbp"
          name="Net profit"
          stroke="#C9A684"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3, fill: "#C9A684" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
