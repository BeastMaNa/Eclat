"use client";

import { useState, useMemo } from "react";
import { Download } from "lucide-react";
import type { AdminSale, Venue } from "@/lib/admin/types";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 2 }).format(v);

interface Props {
  sales: AdminSale[];
  venues: Venue[];
  fragrances: string[];
}

const PAGE_SIZE = 50;

export function SalesClient({ sales, venues, fragrances }: Props) {
  const [venueFilter, setVenueFilter] = useState("");
  const [fragFilter, setFragFilter] = useState("");
  const [payFilter, setPayFilter] = useState("");
  const [sort, setSort] = useState<{ col: string; dir: "asc" | "desc" }>({ col: "timestamp", dir: "desc" });
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    return sales.filter((s) => {
      if (venueFilter && s.venueId !== venueFilter) return false;
      if (fragFilter && s.fragrance !== fragFilter) return false;
      if (payFilter && s.paymentType !== payFilter) return false;
      return true;
    });
  }, [sales, venueFilter, fragFilter, payFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av: number | string, bv: number | string;
      if (sort.col === "timestamp") { av = a.timestamp.getTime(); bv = b.timestamp.getTime(); }
      else if (sort.col === "amount") { av = a.amountGbp; bv = b.amountGbp; }
      else if (sort.col === "venue") { av = a.venueName; bv = b.venueName; }
      else { av = 0; bv = 0; }
      return sort.dir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
  }, [filtered, sort]);

  const paginated = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);

  const totalRev = filtered.reduce((s, x) => s + x.amountGbp, 0);
  const days = sales.length > 0
    ? Math.max(1, Math.round((sales[0].timestamp.getTime() - sales[sales.length - 1].timestamp.getTime()) / 86_400_000))
    : 1;
  const avgPerDay = totalRev / days;
  const busiest = useMemo(() => {
    const byDay = new Map<string, number>();
    filtered.forEach((s) => {
      const k = s.timestamp.toISOString().slice(0, 10);
      byDay.set(k, (byDay.get(k) ?? 0) + s.amountGbp);
    });
    let best = { date: "—", rev: 0 };
    byDay.forEach((rev, date) => { if (rev > best.rev) best = { date, rev }; });
    return best;
  }, [filtered]);

  const topFrag = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((s) => map.set(s.fragrance, (map.get(s.fragrance) ?? 0) + 1));
    let best = { name: "—", count: 0 };
    map.forEach((count, name) => { if (count > best.count) best = { name, count }; });
    return best;
  }, [filtered]);

  function toggleSort(col: string) {
    setSort((prev) => prev.col === col ? { col, dir: prev.dir === "asc" ? "desc" : "asc" } : { col, dir: "desc" });
    setPage(0);
  }

  function exportCsv() {
    const header = ["Date", "Time", "Venue", "Machine", "Fragrance", "Amount (GBP)", "Payment"];
    const rows = sorted.map((s) => [
      s.timestamp.toISOString().slice(0, 10),
      s.timestamp.toTimeString().slice(0, 5),
      s.venueName,
      s.machineId,
      s.fragrance,
      s.amountGbp.toFixed(2),
      s.paymentType,
    ]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eclat-sales-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const SortIcon = ({ col }: { col: string }) => (
    <span className="ml-0.5 opacity-40">{sort.col === col ? (sort.dir === "asc" ? "↑" : "↓") : "↕"}</span>
  );

  return (
    <div className="space-y-4">
      {/* Summary band */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total revenue", value: fmt(totalRev) },
          { label: "Units sold", value: filtered.length.toLocaleString("en-GB") },
          { label: "Avg / day", value: fmt(avgPerDay) },
          { label: "Best day", value: busiest.date },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-stone/10 rounded-xl px-3 py-2.5">
            <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-1">{label}</p>
            <p className="font-serif text-lg font-bold text-ink leading-tight">{value}</p>
          </div>
        ))}
      </div>

      {/* Filters + export */}
      <div className="flex gap-2 flex-wrap items-center">
        <select value={venueFilter} onChange={(e) => { setVenueFilter(e.target.value); setPage(0); }}
          className="border border-stone/20 rounded-lg px-2.5 py-1.5 font-sans text-xs text-ink bg-white focus:outline-none focus:ring-1 focus:ring-accent">
          <option value="">All venues</option>
          {venues.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
        <select value={fragFilter} onChange={(e) => { setFragFilter(e.target.value); setPage(0); }}
          className="border border-stone/20 rounded-lg px-2.5 py-1.5 font-sans text-xs text-ink bg-white focus:outline-none focus:ring-1 focus:ring-accent">
          <option value="">All fragrances</option>
          {fragrances.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <select value={payFilter} onChange={(e) => { setPayFilter(e.target.value); setPage(0); }}
          className="border border-stone/20 rounded-lg px-2.5 py-1.5 font-sans text-xs text-ink bg-white focus:outline-none focus:ring-1 focus:ring-accent">
          <option value="">All payment types</option>
          <option value="card">Card</option>
          <option value="apple_pay">Apple Pay</option>
          <option value="google_pay">Google Pay</option>
        </select>
        <div className="ml-auto flex items-center gap-2">
          <span className="font-sans text-xs text-stone">{filtered.length.toLocaleString()} records</span>
          <button onClick={exportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone/20 font-sans text-xs text-stone hover:text-ink hover:border-stone/40 transition-colors">
            <Download size={12} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-stone/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-stone/10">
                <th className="px-3 py-2.5 text-left">
                  <button onClick={() => toggleSort("timestamp")} className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone hover:text-ink">
                    Date <SortIcon col="timestamp" />
                  </button>
                </th>
                <th className="px-3 py-2.5 text-left">
                  <button onClick={() => toggleSort("venue")} className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone hover:text-ink">
                    Venue <SortIcon col="venue" />
                  </button>
                </th>
                <th className="px-3 py-2.5 text-left font-sans text-[10px] uppercase tracking-[0.1em] text-stone">Machine</th>
                <th className="px-3 py-2.5 text-left font-sans text-[10px] uppercase tracking-[0.1em] text-stone">Fragrance</th>
                <th className="px-3 py-2.5 text-left font-sans text-[10px] uppercase tracking-[0.1em] text-stone">Payment</th>
                <th className="px-3 py-2.5 text-right">
                  <button onClick={() => toggleSort("amount")} className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone hover:text-ink">
                    Amount <SortIcon col="amount" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((s, i) => (
                <tr key={s.id} className={`border-b border-stone/5 ${i % 2 === 0 ? "" : "bg-stone/[0.02]"}`}>
                  <td className="px-3 py-2 text-stone">
                    {s.timestamp.toISOString().slice(0, 10)}{" "}
                    <span className="text-stone/50">{s.timestamp.toTimeString().slice(0, 5)}</span>
                  </td>
                  <td className="px-3 py-2 font-semibold text-ink">{s.venueName}</td>
                  <td className="px-3 py-2 text-stone">{s.machineId}</td>
                  <td className="px-3 py-2 text-ink truncate max-w-[180px]">{s.fragrance}</td>
                  <td className="px-3 py-2 text-stone capitalize">{s.paymentType.replace("_", " ")}</td>
                  <td className="px-3 py-2 text-right font-semibold text-ink">{fmt(s.amountGbp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center font-sans text-sm text-stone py-8">No sales match the current filters.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="font-sans text-xs text-stone">
            Page {page + 1} of {totalPages} · {filtered.length} records
          </p>
          <div className="flex gap-1.5">
            <button disabled={page === 0} onClick={() => setPage(0)}
              className="px-2 py-1 rounded font-sans text-xs border border-stone/20 text-stone hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed">
              ««
            </button>
            <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}
              className="px-2 py-1 rounded font-sans text-xs border border-stone/20 text-stone hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed">
              ‹
            </button>
            <button disabled={page === totalPages - 1} onClick={() => setPage((p) => p + 1)}
              className="px-2 py-1 rounded font-sans text-xs border border-stone/20 text-stone hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed">
              ›
            </button>
            <button disabled={page === totalPages - 1} onClick={() => setPage(totalPages - 1)}
              className="px-2 py-1 rounded font-sans text-xs border border-stone/20 text-stone hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed">
              »»
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
