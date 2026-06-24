import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getAdminDataSource } from "@/lib/admin";
import Link from "next/link";
import type { VenueStatus } from "@/lib/admin/types";
import { EstateChart } from "../../_components/EstateChart";
import { VenueMachinesClient } from "./VenueMachinesClient";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(v);

const STATUS_STYLES: Record<VenueStatus, string> = {
  "live": "bg-green-50 text-green-700",
  "install-pending": "bg-amber-50 text-amber-700",
  "paused": "bg-stone/10 text-stone",
};

const TYPE_LABEL: Record<string, string> = {
  "cocktail-bar": "Cocktail Bar", "hotel": "Hotel", "nightclub": "Nightclub",
  "bar-restaurant": "Bar & Restaurant", "restaurant": "Restaurant",
  "food-hall": "Food Hall", "arcade-bar": "Arcade Bar",
};

import { parseRange } from "@/lib/admin/date-range";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; to?: string; days?: string }>;
}

export default async function VenueDetailPage({ params, searchParams }: Props) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") redirect("/login");

  const { id } = await params;
  const { from, to } = parseRange(await searchParams);

  const ds = getAdminDataSource();
  const venue = await ds.getVenueById(id);
  if (!venue) notFound();

  const [machines, timeSeries, stock, tickets] = await Promise.all([
    ds.getMachinesByVenue(id, { includeArchived: true }),
    ds.getEstateSalesTimeSeries({ from, to }).then(async (all) => {
      // Get venue-specific series by filtering estate sales
      const sales = await ds.getEstateSales({ dateRange: { from, to }, venueId: id });
      const byDay = new Map<string, { rev: number; units: number }>();
      all.forEach((d) => byDay.set(d.date, { rev: 0, units: 0 }));
      sales.forEach((s) => {
        const k = s.timestamp.toISOString().slice(0, 10);
        const e = byDay.get(k);
        if (e) { e.rev += s.amountGbp; e.units += 1; }
      });
      return Array.from(byDay.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, { rev, units }]) => ({ date, revenueGbp: +rev.toFixed(2), units }));
    }),
    ds.getEstateStock().then((all) => all.filter((s) => s.venueId === id)),
    ds.getMaintenanceTickets({ venueId: id }),
  ]);

  const totalRevenue = timeSeries.reduce((s, d) => s + d.revenueGbp, 0);

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-sans text-xs text-stone">
        <Link href="/console/venues" className="hover:text-accent transition-colors">Venues</Link>
        <span>/</span>
        <span className="text-ink">{venue.name}</span>
      </div>

      {/* Header */}
      <div className="bg-white border border-stone/10 rounded-xl p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-serif text-xl font-bold text-ink">{venue.name}</h1>
              <span className={`px-2 py-0.5 rounded-full font-sans text-[10px] font-semibold ${STATUS_STYLES[venue.status]}`}>
                {venue.status === "install-pending" ? "Pending" : venue.status.charAt(0).toUpperCase() + venue.status.slice(1)}
              </span>
            </div>
            <p className="font-sans text-xs text-stone">{venue.address}</p>
          </div>
          <div className="text-right">
            <p className="font-sans text-[10px] text-stone uppercase tracking-[0.1em]">Period revenue</p>
            <p className="font-serif text-2xl font-bold text-ink">{fmt(totalRevenue)}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-4 border-t border-stone/10">
          <div><p className="text-stone mb-0.5">Area</p><p className="font-semibold text-ink">{venue.area}</p></div>
          <div><p className="text-stone mb-0.5">Type</p><p className="font-semibold text-ink">{TYPE_LABEL[venue.type] ?? venue.type}</p></div>
          <div><p className="text-stone mb-0.5">Partnership</p><p className="font-semibold text-ink capitalize">{venue.partnershipModel.replace("-", " ")}</p></div>
          <div><p className="text-stone mb-0.5">Commission</p><p className="font-semibold text-ink">{venue.commissionPct}%</p></div>
          <div><p className="text-stone mb-0.5">Go-live</p><p className="font-semibold text-ink">{venue.goLiveDate !== "—" ? venue.goLiveDate : "TBC"}</p></div>
          <div><p className="text-stone mb-0.5">Contact</p><p className="font-semibold text-ink">{venue.contactName}</p></div>
          <div className="col-span-2"><p className="text-stone mb-0.5">Email</p>
            <a href={`mailto:${venue.contactEmail}`} className="font-semibold text-accent hover:text-ink transition-colors">{venue.contactEmail}</a>
          </div>
        </div>
      </div>

      {/* Revenue chart */}
      <div className="bg-white border border-stone/10 rounded-xl p-5">
        <div className="mb-4">
          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone">Revenue over time</p>
        </div>
        <EstateChart data={timeSeries} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Machines */}
        <div className="bg-white border border-stone/10 rounded-xl p-5">
          <VenueMachinesClient venueId={id} machines={machines} />
        </div>

        {/* Open maintenance tickets */}
        <div className="bg-white border border-stone/10 rounded-xl p-5">
          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-4">
            Open tickets ({tickets.filter((t) => t.status !== "done").length})
          </p>
          {tickets.filter((t) => t.status !== "done").length === 0 ? (
            <p className="font-sans text-xs text-stone">No open tickets.</p>
          ) : (
            <div className="space-y-2">
              {tickets.filter((t) => t.status !== "done").map((t) => (
                <div key={t.id} className="py-2 border-b border-stone/5 last:border-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-sans text-xs font-semibold text-ink capitalize">{t.type} — {t.machineId}</p>
                    <span className={`px-1.5 py-0.5 rounded font-sans text-[10px] font-semibold ${
                      t.priority === "urgent" ? "bg-red-50 text-red-600" :
                      t.priority === "high" ? "bg-amber-50 text-amber-700" :
                      "bg-stone/10 text-stone"}`}>
                      {t.priority}
                    </span>
                  </div>
                  <p className="font-sans text-[10px] text-stone mt-0.5 line-clamp-1">{t.notes}</p>
                </div>
              ))}
            </div>
          )}
          <Link href="/console/maintenance" className="block mt-3 font-sans text-xs text-accent hover:text-ink transition-colors">
            View all tickets →
          </Link>
        </div>
      </div>

      {/* Stock */}
      <div className="bg-white border border-stone/10 rounded-xl p-5">
        <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-4">Stock</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {machines.map((m) => {
            const mStock = stock.filter((s) => s.machineId === m.id);
            return (
              <div key={m.id} className="border border-stone/10 rounded-lg p-3">
                <p className="font-sans text-xs font-semibold text-ink mb-2">{m.id} · {m.locationLabel}</p>
                <div className="space-y-2">
                  {mStock.map((s) => (
                    <div key={s.slot} className="flex items-center gap-2">
                      <span className="font-sans text-[10px] text-stone w-4 shrink-0">{s.slot}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-[10px] text-ink truncate">{s.fragrance}</p>
                        <div className="h-1 bg-stone/10 rounded-full mt-0.5">
                          <div
                            className={`h-full rounded-full ${s.quantity <= s.lowStockThreshold ? "bg-amber-400" : "bg-accent"}`}
                            style={{ width: `${(s.quantity / s.capacity) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className={`font-sans text-[10px] shrink-0 ${s.quantity <= s.lowStockThreshold ? "text-amber-600 font-semibold" : "text-stone"}`}>
                        {s.quantity}/{s.capacity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
