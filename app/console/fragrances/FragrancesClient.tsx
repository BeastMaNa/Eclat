"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import type { FragranceAnalytic } from "@/lib/admin/types";

const gbp = (v: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(v);

const TYPE_LABELS: Record<string, string> = {
  "cocktail-bar":  "Cocktail bar",
  "hotel":         "Hotel",
  "nightclub":     "Nightclub",
  "bar-restaurant":"Bar / restaurant",
  "restaurant":    "Restaurant",
  "food-hall":     "Food hall",
  "arcade-bar":    "Arcade bar",
};

type SortKey = "units" | "revenue" | "margin";

interface Props {
  analytics: FragranceAnalytic[];
}

export function FragrancesClient({ analytics }: Props) {
  const [tier, setTier] = useState<"all" | "standard" | "premium">("all");
  const [slowOnly, setSlowOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("units");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [expanded, setExpanded] = useState<string | null>(null);

  function toggleSort(key: SortKey) {
    if (sort === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSort(key); setSortDir("desc"); }
  }

  const filtered = analytics
    .filter((a) => tier === "all" || a.tier === tier)
    .filter((a) => !slowOnly || a.isSlowMover)
    .sort((a, b) => {
      let diff = 0;
      if (sort === "units") diff = a.totalUnits - b.totalUnits;
      else if (sort === "revenue") diff = a.totalRevenueGbp - b.totalRevenueGbp;
      else diff = a.marginPct - b.marginPct;
      return sortDir === "desc" ? -diff : diff;
    });

  const totalUnits = analytics.reduce((s, a) => s + a.totalUnits, 0);
  const slowCount = analytics.filter((a) => a.isSlowMover).length;
  const allVenueTypes = Array.from(new Set(analytics.flatMap((a) => Object.keys(a.byVenueType)))).sort();

  const SortBtn = ({ col, label }: { col: SortKey; label: string }) => (
    <button
      onClick={() => toggleSort(col)}
      className={`font-sans text-[10px] uppercase tracking-[0.1em] font-medium flex items-center gap-0.5 transition-colors ${
        sort === col ? "text-ink" : "text-stone hover:text-ink"
      }`}
    >
      {label}
      {sort === col && <span className="text-stone/60">{sortDir === "desc" ? " ↓" : " ↑"}</span>}
    </button>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <h1 className="font-serif text-xl font-bold text-ink">Fragrances</h1>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-stone/10 rounded-xl p-4">
          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-1">Fragrances tracked</p>
          <p className="font-serif text-2xl font-bold text-ink">{analytics.length}</p>
        </div>
        <div className="bg-white border border-stone/10 rounded-xl p-4">
          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-1">Total vends</p>
          <p className="font-serif text-2xl font-bold text-ink">{totalUnits.toLocaleString("en-GB")}</p>
        </div>
        <div className="bg-white border border-stone/10 rounded-xl p-4">
          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-1">Slow movers</p>
          <p className={`font-serif text-2xl font-bold ${slowCount > 0 ? "text-amber-600" : "text-ink"}`}>{slowCount}</p>
          <p className="font-sans text-[10px] text-stone mt-0.5">review / replace</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center flex-wrap gap-3">
        <div className="flex gap-1.5">
          {(["all", "standard", "premium"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className={`px-3 py-1 rounded-full font-sans text-xs font-semibold border transition-colors ${
                tier === t
                  ? "bg-accent/15 border-accent/30 text-ink"
                  : "border-stone/20 text-stone hover:text-ink"
              }`}
            >
              {t === "all" ? "All tiers" : t === "standard" ? "Standard £2" : "Premium £3"}
            </button>
          ))}
        </div>
        <button
          onClick={() => setSlowOnly((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-sans text-xs font-semibold border transition-colors ${
            slowOnly
              ? "bg-amber-50 border-amber-200 text-amber-700"
              : "border-stone/20 text-stone hover:text-ink"
          }`}
        >
          <AlertTriangle size={11} />
          Slow movers only
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-stone/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-stone/10">
                <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Fragrance</th>
                <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Tier</th>
                <th className="px-4 py-3"><SortBtn col="units" label="Units" /></th>
                <th className="px-4 py-3"><SortBtn col="revenue" label="Revenue" /></th>
                <th className="px-4 py-3"><SortBtn col="margin" label="Margin %" /></th>
                <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Gross Margin £</th>
                <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium w-8" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const isExpanded = expanded === a.fragrance;
                return (
                  <>
                    <tr
                      key={a.fragrance}
                      className={`border-b border-stone/5 hover:bg-stone/3 transition-colors cursor-pointer ${a.isSlowMover ? "bg-amber-50/40" : ""}`}
                      onClick={() => setExpanded(isExpanded ? null : a.fragrance)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {a.isSlowMover && <AlertTriangle size={11} className="text-amber-500 shrink-0" aria-label="Slow mover" />}
                          <span className="font-sans text-xs font-semibold text-ink">{a.fragrance}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full font-sans text-[10px] font-semibold ${
                          a.tier === "premium"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-stone/10 text-stone"
                        }`}>
                          {a.tier === "premium" ? "Premium £3" : "Standard £2"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-sans text-xs text-ink font-semibold tabular-nums">{a.totalUnits}</td>
                      <td className="px-4 py-3 font-sans text-xs text-ink tabular-nums">{gbp(a.totalRevenueGbp)}</td>
                      <td className="px-4 py-3">
                        <span className="font-sans text-xs font-semibold tabular-nums text-green-700">
                          {a.marginPct.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 font-sans text-xs text-stone tabular-nums">{gbp(a.grossMarginGbp)}</td>
                      <td className="px-4 py-3 text-stone/40">
                        {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${a.fragrance}-detail`} className="border-b border-stone/5 bg-stone/3">
                        <td colSpan={7} className="px-6 py-4">
                          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-3">Breakdown by venue type</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {allVenueTypes
                              .filter((t) => a.byVenueType[t])
                              .map((t) => {
                                const data = a.byVenueType[t];
                                const pct = a.totalUnits > 0 ? (data.units / a.totalUnits) * 100 : 0;
                                return (
                                  <div key={t} className="bg-white rounded-lg p-3 border border-stone/10">
                                    <p className="font-sans text-[10px] text-stone mb-1">{TYPE_LABELS[t] ?? t}</p>
                                    <p className="font-sans text-xs font-bold text-ink">{data.units} units</p>
                                    <p className="font-sans text-[10px] text-stone">{gbp(data.revenueGbp)}</p>
                                    <div className="mt-1.5 h-1 bg-stone/10 rounded-full">
                                      <div
                                        className="h-full bg-accent rounded-full"
                                        style={{ width: `${pct}%` }}
                                      />
                                    </div>
                                    <p className="font-sans text-[10px] text-stone/50 mt-0.5">{pct.toFixed(0)}% of sales</p>
                                  </div>
                                );
                              })}
                          </div>
                          {a.isSlowMover && (
                            <p className="font-sans text-xs text-amber-600 mt-3 flex items-center gap-1.5">
                              <AlertTriangle size={12} />
                              Slow mover — consider replacing with a higher-performing fragrance in these machines.
                            </p>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="font-sans text-sm text-stone">No fragrances match the current filters.</p>
          </div>
        )}
        <div className="px-4 py-3 border-t border-stone/10">
          <p className="font-sans text-[10px] text-stone">
            Margin = (revenue − wholesale cost) ÷ revenue. Wholesale cost: £0.45/vend.
            Slow mover threshold: {`<`}15 units per 30 days.{" "}
            <Link href="/console/profitability" className="text-accent hover:underline">Full profitability →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
