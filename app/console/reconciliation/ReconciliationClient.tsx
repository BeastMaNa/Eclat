"use client";

import Link from "next/link";
import { CheckCircle2, AlertTriangle, MinusCircle } from "lucide-react";
import type { ReconciliationSummary } from "@/lib/admin/types";

const gbp = (v: number, signed = false) => {
  const s = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2 }).format(Math.abs(v));
  if (signed && v > 0) return `+${s}`;
  if (signed && v < 0) return `−${s}`;
  return s;
};

interface Props {
  summary: ReconciliationSummary;
  days: number;
}

export function ReconciliationClient({ summary, days }: Props) {
  const discrepancyPct = summary.lines.length > 0
    ? (summary.discrepancyDays / summary.lines.filter((l) => l.status !== "zero").length) * 100
    : 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-xl font-bold text-ink">Reconciliation</h1>
          <p className="font-sans text-xs text-stone mt-0.5">
            Machine revenue vs payment processor settlement.{" "}
            <span className="italic text-stone/60">[PLACEHOLDER — Connect real processor data: Stripe/SumUp/Adyen]</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {[7, 30, 90].map((d) => (
            <Link
              key={d}
              href={`/console/reconciliation?days=${d}`}
              className={`px-3 py-1 rounded-full font-sans text-xs font-semibold border transition-colors ${
                days === d ? "bg-accent/15 border-accent/30 text-ink" : "border-stone/20 text-stone hover:text-ink"
              }`}
            >
              {d}d
            </Link>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-stone/10 rounded-xl p-4">
          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-1">Machine revenue</p>
          <p className="font-serif text-2xl font-bold text-ink">{gbp(summary.totalMachineRevenue)}</p>
        </div>
        <div className="bg-white border border-stone/10 rounded-xl p-4">
          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-1">Processor gross</p>
          <p className="font-serif text-2xl font-bold text-ink">{gbp(summary.totalProcessorGross)}</p>
        </div>
        <div className="bg-white border border-stone/10 rounded-xl p-4">
          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-1">Processor net</p>
          <p className="font-serif text-2xl font-bold text-ink">{gbp(summary.totalProcessorNet)}</p>
          <p className="font-sans text-[10px] text-stone mt-0.5">after fees {gbp(summary.totalProcessorFees)} + refunds {gbp(summary.totalProcessorRefunds)}</p>
        </div>
        <div className={`border rounded-xl p-4 ${Math.abs(summary.totalDiff) > 2 ? "bg-amber-50 border-amber-200" : "bg-white border-stone/10"}`}>
          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-1">Net discrepancy</p>
          <p className={`font-serif text-2xl font-bold ${Math.abs(summary.totalDiff) > 2 ? "text-amber-600" : "text-ink"}`}>
            {gbp(summary.totalDiff, true)}
          </p>
          <p className="font-sans text-[10px] text-stone mt-0.5">
            {summary.matchedDays}d matched · {summary.discrepancyDays}d discrepancy
            {discrepancyPct > 0 && ` (${discrepancyPct.toFixed(0)}%)`}
          </p>
        </div>
      </div>

      {/* Daily breakdown table */}
      <div className="bg-white border border-stone/10 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-stone/10 flex items-center justify-between">
          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-semibold">Daily reconciliation</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-sans text-[10px] text-stone">
              <CheckCircle2 size={10} className="text-green-600" /> Matched
            </span>
            <span className="flex items-center gap-1 font-sans text-[10px] text-stone">
              <AlertTriangle size={10} className="text-amber-500" /> Discrepancy
            </span>
            <span className="flex items-center gap-1 font-sans text-[10px] text-stone">
              <MinusCircle size={10} className="text-stone/40" /> Zero sales
            </span>
          </div>
        </div>
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-stone/5">
              <tr className="border-b border-stone/10">
                <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Date</th>
                <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Machine Rev</th>
                <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Processor Gross</th>
                <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Fees</th>
                <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Refunds</th>
                <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Processor Net</th>
                <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Diff</th>
                <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {summary.lines.map((line) => (
                <tr
                  key={line.date}
                  className={`border-b border-stone/5 transition-colors ${
                    line.status === "discrepancy" ? "bg-amber-50/60" : "hover:bg-stone/3"
                  }`}
                >
                  <td className="px-4 py-2.5 font-sans text-xs text-ink tabular-nums">{line.date}</td>
                  <td className="px-4 py-2.5 font-sans text-xs tabular-nums text-ink">{gbp(line.machineRevenue)}</td>
                  <td className="px-4 py-2.5 font-sans text-xs tabular-nums text-ink">{gbp(line.processorGross)}</td>
                  <td className="px-4 py-2.5 font-sans text-xs tabular-nums text-stone">{gbp(line.processorFees)}</td>
                  <td className="px-4 py-2.5 font-sans text-xs tabular-nums text-stone">{gbp(line.processorRefunds)}</td>
                  <td className="px-4 py-2.5 font-sans text-xs tabular-nums text-ink font-semibold">{gbp(line.processorNet)}</td>
                  <td className={`px-4 py-2.5 font-sans text-xs tabular-nums font-semibold ${
                    line.status === "discrepancy" ? "text-amber-600" : "text-stone/50"
                  }`}>
                    {gbp(line.diff, true)}
                  </td>
                  <td className="px-4 py-2.5">
                    {line.status === "matched" && <CheckCircle2 size={13} className="text-green-600" />}
                    {line.status === "discrepancy" && <AlertTriangle size={13} className="text-amber-500" />}
                    {line.status === "zero" && <MinusCircle size={13} className="text-stone/30" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
