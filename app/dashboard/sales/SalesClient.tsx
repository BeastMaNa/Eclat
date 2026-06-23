"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown, Download } from "lucide-react";
import type { Sale } from "@/lib/dashboard";

const formatGbp = (v: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(v);

const formatTs = (d: Date) =>
  new Date(d).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

type SortKey = "timestamp" | "fragrance" | "amountGbp" | "paymentType";
type SortDir = "asc" | "desc";

interface SalesClientProps {
  sales: Sale[];
  fragranceOptions: string[];
  days: number;
}

export function SalesClient({ sales, fragranceOptions, days }: SalesClientProps) {
  const [fragrance, setFragrance] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("timestamp");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filtered = useMemo(() => {
    let rows = fragrance ? sales.filter((s) => s.fragrance === fragrance) : sales;
    rows = [...rows].sort((a, b) => {
      let av: string | number = a[sortKey] instanceof Date ? (a[sortKey] as Date).getTime() : (a[sortKey] as string | number);
      let bv: string | number = b[sortKey] instanceof Date ? (b[sortKey] as Date).getTime() : (b[sortKey] as string | number);
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return rows;
  }, [sales, fragrance, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function exportCsv() {
    const header = "Timestamp,Fragrance,Machine,Amount (GBP),Payment\n";
    const rows = filtered
      .map(
        (s) =>
          `"${formatTs(s.timestamp)}","${s.fragrance}","${s.machineId}",${s.amountGbp},"${s.paymentType}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eclat-sales-${days}d.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const SortBtn = ({ col }: { col: SortKey }) => (
    <button
      onClick={() => toggleSort(col)}
      className="ml-1 opacity-40 hover:opacity-100 transition-opacity"
      aria-label={`Sort by ${col}`}
    >
      <ArrowUpDown size={12} />
    </button>
  );

  const thClass = "text-left font-sans text-xs tracking-[0.1em] uppercase text-stone py-3 px-4";
  const tdClass = "py-3 px-4 font-sans text-sm text-ink/80";

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <div className="flex items-center gap-3">
          <label htmlFor="frag-filter" className="font-sans text-xs uppercase tracking-wide text-stone">
            Fragrance
          </label>
          <select
            id="frag-filter"
            value={fragrance}
            onChange={(e) => setFragrance(e.target.value)}
            className="bg-white border border-stone/20 rounded-full px-3 py-1.5 font-sans text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">All fragrances</option>
            {fragranceOptions.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <span className="font-sans text-xs text-stone">
            {filtered.length} records
          </span>
        </div>
        <button
          onClick={exportCsv}
          className="flex items-center gap-2 bg-ink text-bone rounded-full px-4 py-2 font-sans text-xs font-semibold hover:bg-ink/80 transition-colors"
        >
          <Download size={13} />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/70 border border-stone/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Sales records">
            <thead className="border-b border-stone/10">
              <tr>
                <th className={thClass}>
                  Date / Time <SortBtn col="timestamp" />
                </th>
                <th className={thClass}>
                  Fragrance <SortBtn col="fragrance" />
                </th>
                <th className={thClass}>Machine</th>
                <th className={`${thClass} text-right`}>
                  Amount <SortBtn col="amountGbp" />
                </th>
                <th className={thClass}>
                  Payment <SortBtn col="paymentType" />
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sale) => (
                <tr
                  key={sale.id}
                  className="border-b border-stone/5 last:border-0 hover:bg-bone/40 transition-colors"
                >
                  <td className={tdClass}>{formatTs(sale.timestamp)}</td>
                  <td className={tdClass}>{sale.fragrance}</td>
                  <td className={`${tdClass} text-stone`}>{sale.machineId}</td>
                  <td className={`${tdClass} text-right font-semibold`}>
                    {formatGbp(sale.amountGbp)}
                  </td>
                  <td className={tdClass}>
                    <span className="capitalize text-stone">
                      {sale.paymentType.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center font-sans text-sm text-stone">
                    No records for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
