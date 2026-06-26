"use client";

import { useState } from "react";
import { CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import type { MachineRoi } from "@/lib/admin/types";
import { ConsoleHeader } from "@/app/console/_components/ConsoleHeader";

const gbp = (v: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(v);

const pct = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;

type SortKey = "roi" | "net" | "months" | "payback";

interface Props {
  machines: MachineRoi[];
}

export function RoiClient({ machines }: Props) {
  const [sort, setSort] = useState<SortKey>("net");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [filter, setFilter] = useState<"all" | "paid-back" | "overdue" | "on-track">("all");

  function toggleSort(key: SortKey) {
    if (sort === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSort(key); setSortDir("desc"); }
  }

  const sorted = [...machines]
    .filter((m) => {
      if (filter === "paid-back") return m.isPaidBack;
      if (filter === "overdue") return m.isOverdue;
      if (filter === "on-track") return !m.isPaidBack && !m.isOverdue;
      return true;
    })
    .sort((a, b) => {
      let diff = 0;
      if (sort === "roi") diff = a.roiPct - b.roiPct;
      else if (sort === "net") diff = a.netProfitToDate - b.netProfitToDate;
      else if (sort === "months") diff = a.monthsInstalled - b.monthsInstalled;
      else diff = (a.projectedPaybackMonth ?? "9999") < (b.projectedPaybackMonth ?? "9999") ? -1 : 1;
      return sortDir === "desc" ? -diff : diff;
    });

  const totalCapital = machines.reduce((s, m) => s + m.totalCapitalCost, 0);
  const totalNet = machines.reduce((s, m) => s + m.netProfitToDate, 0);
  const paidBackCount = machines.filter((m) => m.isPaidBack).length;
  const overdueCount = machines.filter((m) => m.isOverdue).length;

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
    <>
      <ConsoleHeader title="Machine ROI" subtitle="Capital cost payback tracking per deployed machine" />
      <div className="p-4 pb-6 lg:p-6 space-y-5">

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-stone/10 rounded-xl p-4">
          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-1">Total capital</p>
          <p className="font-serif text-2xl font-bold text-ink">{gbp(totalCapital)}</p>
          <p className="font-sans text-[10px] text-stone mt-0.5">{machines.length} machines</p>
        </div>
        <div className="bg-white border border-stone/10 rounded-xl p-4">
          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-1">Net profit to date</p>
          <p className={`font-serif text-2xl font-bold ${totalNet >= 0 ? "text-green-700" : "text-red-600"}`}>
            {gbp(totalNet)}
          </p>
          <p className="font-sans text-[10px] text-stone mt-0.5">
            Overall ROI: {totalCapital > 0 ? pct((totalNet / totalCapital) * 100) : "—"}
          </p>
        </div>
        <div className="bg-white border border-stone/10 rounded-xl p-4">
          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-1">Paid back</p>
          <p className="font-serif text-2xl font-bold text-green-700">{paidBackCount}</p>
          <p className="font-sans text-[10px] text-stone mt-0.5">of {machines.length}</p>
        </div>
        <div className={`rounded-xl p-4 border ${overdueCount > 0 ? "bg-amber-50 border-amber-200" : "bg-white border-stone/10"}`}>
          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-1">Overdue payback</p>
          <p className={`font-serif text-2xl font-bold ${overdueCount > 0 ? "text-amber-600" : "text-ink"}`}>{overdueCount}</p>
          <p className="font-sans text-[10px] text-stone mt-0.5">&gt;18 months, not paid back</p>
        </div>
      </div>

      {/* Overdue alert */}
      {overdueCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2">
          <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-sans text-xs font-semibold text-amber-700">Machines past expected payback period</p>
            <p className="font-sans text-xs text-amber-600 mt-0.5">
              {machines.filter((m) => m.isOverdue).map((m) => `${m.venueName} — ${m.locationLabel} (${m.monthsInstalled.toFixed(0)} mo)`).join(" · ")}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-1.5">
        {(["all", "paid-back", "overdue", "on-track"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full font-sans text-xs font-semibold border transition-colors ${
              filter === f ? "bg-accent/15 border-accent/30 text-ink" : "border-stone/20 text-stone hover:text-ink"
            }`}
          >
            {f === "all" ? "All" : f === "paid-back" ? "Paid back" : f === "overdue" ? "Overdue" : "On track"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-stone/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-stone/10">
                <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Venue</th>
                <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Model</th>
                <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Capital</th>
                <th className="px-4 py-3"><SortBtn col="net" label="Net Profit" /></th>
                <th className="px-4 py-3"><SortBtn col="roi" label="ROI %" /></th>
                <th className="px-4 py-3"><SortBtn col="months" label="Months" /></th>
                <th className="px-4 py-3"><SortBtn col="payback" label="Payback" /></th>
                <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((m) => (
                <tr
                  key={m.machineId}
                  className={`border-b border-stone/5 hover:bg-stone/3 transition-colors ${m.isOverdue ? "bg-amber-50/40" : ""}`}
                >
                  <td className="px-4 py-3">
                    <p className="font-sans text-xs font-semibold text-ink">{m.venueName}</p>
                    <p className="font-sans text-[10px] text-stone">{m.locationLabel}</p>
                  </td>
                  <td className="px-4 py-3 font-sans text-xs text-stone">{m.model}</td>
                  <td className="px-4 py-3 font-sans text-xs tabular-nums text-ink">{gbp(m.totalCapitalCost)}</td>
                  <td className="px-4 py-3">
                    <span className={`font-sans text-xs font-semibold tabular-nums ${m.netProfitToDate >= 0 ? "text-green-700" : "text-red-600"}`}>
                      {gbp(m.netProfitToDate)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-sans text-xs font-semibold tabular-nums ${m.roiPct >= 0 ? "text-green-700" : "text-red-600"}`}>
                      {pct(m.roiPct)}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-sans text-xs tabular-nums text-stone">{m.monthsInstalled.toFixed(0)}</td>
                  <td className="px-4 py-3 font-sans text-xs tabular-nums text-stone">
                    {m.isPaidBack ? (
                      <span className="text-green-700 font-semibold">Paid back</span>
                    ) : m.projectedPaybackMonth ? (
                      m.projectedPaybackMonth
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {m.isPaidBack && <CheckCircle2 size={14} className="text-green-600" />}
                    {m.isOverdue && <AlertTriangle size={14} className="text-amber-500" />}
                    {!m.isPaidBack && !m.isOverdue && <Clock size={14} className="text-stone/40" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="font-sans text-[10px] text-stone">
        Net profit = revenue − COGS − commission − estimated servicing. Capital = purchase + install cost.
        Target payback: 18 months.{" "}
        <span className="italic">[PLACEHOLDER — Update machine purchase/install costs in lib/admin/costs.ts]</span>
      </p>
      </div>
    </>
  );
}
