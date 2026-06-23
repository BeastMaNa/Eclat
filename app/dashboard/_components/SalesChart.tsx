"use client";

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

interface SalesChartProps {
  data: SalesTimeSeries[];
}

const formatDate = (d: string) => {
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

const formatGbp = (v: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(v);

export function SalesChart({ data }: SalesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#8B837820" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fontSize: 11, fill: "#8B8378", fontFamily: "var(--font-sans)" }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={formatGbp}
          tick={{ fontSize: 11, fill: "#8B8378", fontFamily: "var(--font-sans)" }}
          tickLine={false}
          axisLine={false}
          width={52}
        />
        <Tooltip
          contentStyle={{
            background: "#14110F",
            border: "1px solid rgba(244,239,230,0.12)",
            borderRadius: 8,
            fontSize: 12,
            fontFamily: "var(--font-sans)",
            color: "#F4EFE6",
          }}
          labelFormatter={(label: unknown) => formatDate(String(label))}
          formatter={(value: unknown) => [formatGbp(Number(value)), "Revenue"]}
        />
        <Line
          type="monotone"
          dataKey="revenueGbp"
          stroke="#C9A684"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: "#C9A684", stroke: "#14110F", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
