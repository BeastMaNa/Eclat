"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, TrendingDown } from "lucide-react";
import { ConsoleHeader } from "@/app/console/_components/ConsoleHeader";
import { ProfitChart } from "@/app/console/_components/ProfitChart";
import type { NetProfitSummary, ProfitTimeSeries } from "@/lib/admin/types";
import { THIN_MARGIN_THRESHOLD_PCT } from "@/lib/admin/costs";

const gbp = (v: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(v);

type SortKey = "margin" | "revenue" | "profit" | "venue";

interface Props {
  rows: NetProfitSummary[];
  timeSeries: ProfitTimeSeries[];
}

export function ProfitabilityClient({ rows, timeSeries }: Props) {
  const [sort, setSort] = useState<SortKey>("margin");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [view, setView] = useState<"gross" | "net">("net");

  function toggleSort(key: SortKey) {
    if (sort === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSort(key); setSortDir("desc"); }
  }

  const sorted = [...rows].sort((a, b) => {
    let diff = 0;
    if (sort === "margin") diff = a.marginPct - b.marginPct;
    else if (sort === "revenue") diff = a.grossRevenueGbp - b.grossRevenueGbp;
    else if (sort === "profit") diff = a.netProfitGbp - b.netProfitGbp;
    else diff = a.venueName.localeCompare(b.venueName);
    return sortDir === "desc" ? -diff : diff;
  });

  const totalRevenue = rows.reduce((s, r) => s + r.grossRevenueGbp, 0);
  const totalNetProfit = rows.reduce((s, r) => s + r.netProfitGbp, 0);
  const avgMargin = totalRevenue > 0 ? (totalNetProfit / totalRevenue) * 100 : 0;
  const lossCount = rows.filter((r) => r.marginPct < 0).length;
  const thinCount = rows.filter((r) => r.marginPct >= 0 && r.marginPct < THIN_MARGIN_THRESHOLD_PCT).length;

  const SortBtn = ({ col, label }: { col: SortKey; label: string }) => (
    <button
      onClick={() => toggleSort(col)}
      className={`font-sans text-[10px] uppercase tracking-[0.1em] font-medium flex items-center gap-0.5 transition-colors ${
        sort === col ? "text-ink" : "text-stone hover:text-ink"
      }`}
    >
      {label}
      <span className="text-stone/50">{sort === col ? (sortDir === "desc" ? " ↓" : " ↑") : ""}</span>
    </button>
  );

  return (
    <>
      <ConsoleHeader title="Profitability" />
      <div className="p-4 pb-6 lg:p-6 space-y-5">

      {/* KPI band */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-stone/10 rounded-xl p-4">
          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-1">Gross Revenue</p>
          <p className="font-serif text-2xl font-bold text-ink">{gbp(totalRevenue)}</p>
        </div>
        <div className="bg-white border border-stone/10 rounded-xl p-4">
          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-1">Net Profit</p>
          <p className={`font-serif text-2xl font-bold ${totalNetProfit >= 0 ? "text-ink" : "text-red-600"}`}>
            {gbp(totalNetProfit)}
          </p>
        </div>
        <div className="bg-white border border-stone/10 rounded-xl p-4">
          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-1">Avg Margin</p>
          <p className={`font-serif text-2xl font-bold ${avgMargin < THIN_MARGIN_THRESHOLD_PCT ? "text-amber-600" : "text-ink"}`}>
            {avgMargin.toFixed(1)}%
          </p>
        </div>
        <div className="bg-white border border-stone/10 rounded-xl p-4">
          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-1">Flagged venues</p>
          <p className="font-serif text-2xl font-bold text-ink">{lossCount + thinCount}</p>
          <p className="font-sans text-[10px] text-stone mt-0.5">
            {lossCount > 0 && <span className="text-red-500">{lossCount} loss </span>}
            {thinCount > 0 && <span className="text-amber-500">{thinCount} thin margin</span>}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-stone/10 rounded-xl p-5">
        <p className="font-sans text-xs font-semibold text-ink mb-4">Revenue vs net profit</p>
        <ProfitChart data={timeSeries} />
      </div>

      {/* View toggle */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          {(["gross", "net"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 rounded-full font-sans text-xs font-semibold border transition-colors ${
                view === v
                  ? "bg-accent/15 border-accent/30 text-ink"
                  : "border-stone/20 text-stone hover:text-ink"
              }`}
            >
              {v === "gross" ? "Gross Revenue" : "Net Profit"}
            </button>
          ))}
        </div>
        <p className="font-sans text-[10px] text-stone">
          Costs: wholesale £0.45/sale · servicing £25/machine/mo · commission per agreement
          {" "}
          <Link href="/console/payouts" className="text-accent hover:underline">— see payouts</Link>
        </p>
      </div>

      {/* Table */}
      <div className="bg-white border border-stone/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-stone/10">
                <th className="px-4 py-3"><SortBtn col="venue" label="Venue" /></th>
                <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone">Type</th>
                <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone">Machines</th>
                <th className="px-4 py-3"><SortBtn col="revenue" label="Revenue" /></th>
                <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone">COGS</th>
                <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone">Comm.</th>
                <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone">Servicing</th>
                <th className="px-4 py-3"><SortBtn col="profit" label="Net Profit" /></th>
                <th className="px-4 py-3"><SortBtn col="margin" label="Margin %" /></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => {
                const isLoss = r.marginPct < 0;
                const isThin = !isLoss && r.marginPct < THIN_MARGIN_THRESHOLD_PCT;
                const highlighted = view === "net" ? "font-semibold text-ink" : "text-stone";
                return (
                  <tr key={r.venueId} className="border-b border-stone/5 hover:bg-stone/3 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {isLoss && <TrendingDown size={12} className="text-red-500 shrink-0" />}
                        {isThin && <AlertTriangle size={12} className="text-amber-500 shrink-0" />}
                        <div>
                          <Link href={`/console/venues/${r.venueId}`} className="font-sans text-xs font-semibold text-ink hover:text-accent transition-colors">
                            {r.venueName}
                          </Link>
                          <p className="font-sans text-[10px] text-stone">{r.area}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-stone capitalize whitespace-nowrap">
                      {r.type.replace("-", "‑")}
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-stone tabular-nums">{r.machineCount}</td>
                    <td className={`px-4 py-3 font-sans text-xs tabular-nums ${view === "gross" ? "font-semibold text-ink" : "text-stone"}`}>
                      {gbp(r.grossRevenueGbp)}
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-stone tabular-nums">{gbp(r.cogsGbp)}</td>
                    <td className="px-4 py-3 font-sans text-xs text-stone tabular-nums">{gbp(r.commissionGbp)}</td>
                    <td className="px-4 py-3 font-sans text-xs text-stone tabular-nums">{gbp(r.servicingGbp)}</td>
                    <td className={`px-4 py-3 font-sans text-xs tabular-nums ${highlighted} ${isLoss ? "text-red-600 font-semibold" : ""}`}>
                      {gbp(r.netProfitGbp)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-sans text-xs font-semibold tabular-nums ${
                        isLoss ? "text-red-600" : isThin ? "text-amber-600" : "text-green-700"
                      }`}>
                        {r.marginPct.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-stone/10 flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <TrendingDown size={11} className="text-red-500" />
            <span className="font-sans text-[10px] text-stone">Loss-making — renegotiate or remove</span>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertTriangle size={11} className="text-amber-500" />
            <span className="font-sans text-[10px] text-stone">Thin margin (&lt;{THIN_MARGIN_THRESHOLD_PCT}%)</span>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
