"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { PayoutRecord } from "@/lib/admin/types";

const gbp = (v: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(v);

// Prevent CSV formula injection: prefix cells that start with formula chars.
function safeCsvCell(v: string | number): string {
  const s = String(v).replace(/"/g, '""');
  // Excel/LibreOffice interpret leading =, +, -, @, tab, CR as formulas
  return /^[=+\-@\t\r]/.test(s) ? `"'${s}"` : `"${s}"`;
}

function csvRow(r: PayoutRecord, s: { status: string; paidDate?: string; paidReference?: string }) {
  return [
    r.venueName, r.area, r.partnershipModel,
    r.grossSalesGbp, r.commissionPct,
    r.partnerShareGbp, r.eclatShareGbp,
    s.status, s.paidDate ?? "", s.paidReference ?? "",
  ].map(safeCsvCell).join(",");
}

function downloadCSV(records: PayoutRecord[], overrides: Map<string, { paidDate: string; paidReference: string }>, rangeLabel: string) {
  const header = "Venue,Area,Model,Gross Sales (£),Commission %,Partner Share (£),Éclat Share (£),Status,Paid Date,Reference";
  const rows = records.map((r) => {
    const ov = overrides.get(r.venueId);
    const s = ov ? { status: "paid", ...ov } : { status: r.status, paidDate: r.paidDate, paidReference: r.paidReference };
    return csvRow(r, s);
  });
  const blob = new Blob([header + "\n" + rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `eclat-payouts-${rangeLabel.replace(/\s+/g, "-").replace(/[^a-z0-9-]/gi, "")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

interface Props {
  records: PayoutRecord[];
  rangeLabel: string;
}

export function PayoutsClient({ records, rangeLabel }: Props) {
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), reference: "" });
  const [optimistic, setOptimistic] = useState<Map<string, { paidDate: string; paidReference: string }>>(new Map());
  const [, startTransition] = useTransition();

  function getStatus(r: PayoutRecord) {
    const ov = optimistic.get(r.venueId);
    if (ov) return { status: "paid" as const, paidDate: ov.paidDate, paidReference: ov.paidReference };
    return { status: r.status, paidDate: r.paidDate, paidReference: r.paidReference };
  }

  function handleMarkPaid(venueId: string) {
    startTransition(async () => {
      setOptimistic((prev) => new Map(prev).set(venueId, { paidDate: form.date, paidReference: form.reference }));
      setMarkingId(null);
      await fetch("/api/console/payouts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venueId, paidDate: form.date, reference: form.reference }),
      });
    });
  }

  // Summary
  const revenueShare = records.filter((r) => r.partnershipModel === "revenue-share");
  const totalOwed = revenueShare
    .filter((r) => getStatus(r).status === "due")
    .reduce((s, r) => s + r.partnerShareGbp, 0);
  const totalPaid = revenueShare
    .filter((r) => getStatus(r).status === "paid")
    .reduce((s, r) => s + r.partnerShareGbp, 0);
  const outstanding = revenueShare.reduce((s, r) => s + r.partnerShareGbp, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-serif text-xl font-bold text-ink">Payouts</h1>
        <button
          onClick={() => downloadCSV(records, optimistic, rangeLabel)}
          className="px-3 py-1.5 rounded-full font-sans text-xs font-semibold border border-stone/20 text-stone hover:text-ink transition-colors"
        >
          Export CSV
        </button>
      </div>

      {/* Summary band */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total owed", value: gbp(totalOwed), sub: "partner share due" },
          { label: "Total paid", value: gbp(totalPaid), sub: "settled this period" },
          { label: "Estate partner pool", value: gbp(outstanding), sub: "gross partner share" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-white border border-stone/10 rounded-xl p-4">
            <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-1">{label}</p>
            <p className="font-serif text-2xl font-bold text-ink">{value}</p>
            <p className="font-sans text-[10px] text-stone mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-stone/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-stone/10">
                {["Venue", "Model", "Gross Sales", "Comm%", "Partner Share", "Éclat Share", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r) => {
                const { status, paidDate, paidReference } = getStatus(r);
                const isMarking = markingId === r.venueId;
                return (
                  <>
                    <tr key={r.venueId} className="border-b border-stone/5 hover:bg-stone/3 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-sans text-xs font-semibold text-ink">{r.venueName}</p>
                        <p className="font-sans text-[10px] text-stone">{r.area}</p>
                      </td>
                      <td className="px-4 py-3 font-sans text-xs text-stone capitalize whitespace-nowrap">
                        {r.partnershipModel.replace("-", " ")}
                      </td>
                      <td className="px-4 py-3 font-sans text-xs text-ink tabular-nums">{gbp(r.grossSalesGbp)}</td>
                      <td className="px-4 py-3 font-sans text-xs text-stone tabular-nums">
                        {r.partnershipModel === "revenue-share" ? `${r.commissionPct}%` : "—"}
                      </td>
                      <td className="px-4 py-3 font-sans text-xs font-semibold text-ink tabular-nums">
                        {r.partnershipModel === "revenue-share" ? gbp(r.partnerShareGbp) : "N/A"}
                      </td>
                      <td className="px-4 py-3 font-sans text-xs text-ink tabular-nums">{gbp(r.eclatShareGbp)}</td>
                      <td className="px-4 py-3">
                        {status === "na" ? (
                          <span className="font-sans text-[10px] text-stone">N/A</span>
                        ) : status === "paid" ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-sans text-[10px] font-semibold">
                              Paid
                            </span>
                            {paidDate && (
                              <p className="font-sans text-[10px] text-stone mt-0.5">{paidDate} · {paidReference}</p>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-sans text-[10px] font-semibold">
                            Due
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <Link
                            href={`/console/payouts/statement?venueId=${r.venueId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-sans text-xs text-accent hover:underline whitespace-nowrap"
                          >
                            Statement ↗
                          </Link>
                          {status === "due" && (
                            <button
                              onClick={() => {
                                setMarkingId(isMarking ? null : r.venueId);
                                setForm({ date: new Date().toISOString().slice(0, 10), reference: "" });
                              }}
                              className="font-sans text-xs text-ink border border-stone/20 rounded-lg px-2 py-1 hover:border-accent/40 hover:text-accent transition-colors whitespace-nowrap"
                            >
                              Mark paid
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isMarking && (
                      <tr key={`${r.venueId}-form`} className="border-b border-stone/10 bg-stone/3">
                        <td colSpan={8} className="px-4 py-3">
                          <div className="flex items-end gap-3 flex-wrap">
                            <div>
                              <label className="font-sans text-[10px] text-stone block mb-1">Date paid</label>
                              <input
                                type="date"
                                value={form.date}
                                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                                className="font-sans text-xs border border-stone/20 rounded-lg px-3 py-1.5 focus:outline-none focus:border-accent/50 bg-white"
                              />
                            </div>
                            <div className="flex-1 min-w-[180px]">
                              <label className="font-sans text-[10px] text-stone block mb-1">Reference / payment ID</label>
                              <input
                                type="text"
                                placeholder="e.g. BACS-20260624"
                                value={form.reference}
                                onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))}
                                className="w-full font-sans text-xs border border-stone/20 rounded-lg px-3 py-1.5 focus:outline-none focus:border-accent/50 bg-white"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleMarkPaid(r.venueId)}
                                disabled={!form.reference}
                                className="px-3 py-1.5 rounded-lg font-sans text-xs font-semibold bg-ink text-bone hover:bg-ink/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setMarkingId(null)}
                                className="px-3 py-1.5 rounded-lg font-sans text-xs text-stone hover:text-ink border border-stone/20 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
