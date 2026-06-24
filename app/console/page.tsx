import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminDataSource } from "@/lib/admin";
import { AlertTriangle, WifiOff, Package, Clock, MessageSquare, TrendingUp, TrendingDown, Minus, Users, Plus, Building2, Wrench } from "lucide-react";
import Link from "next/link";
import { EstateChart } from "./_components/EstateChart";
import type { Venue } from "@/lib/admin/types";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(v);

const VENUE_TYPE_LABEL: Record<string, string> = {
  "cocktail-bar": "Bar", "hotel": "Hotel", "nightclub": "Club",
  "bar-restaurant": "Bar & Restaurant", "restaurant": "Restaurant",
  "food-hall": "Food Hall", "arcade-bar": "Arcade Bar",
};

interface Props { searchParams: Promise<{ days?: string }> }

export default async function ConsolePage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") redirect("/login");

  const params = await searchParams;
  const days = Math.min(90, Math.max(7, parseInt(params.days ?? "30", 10) || 30));
  const ds = getAdminDataSource();
  const to = new Date();
  const from = new Date(Date.now() - days * 86_400_000);

  const prevFrom = new Date(from.getTime() - days * 86_400_000);
  const prevTo = new Date(from.getTime() - 1);

  const [kpis, timeSeries, topVenues, topFragrances, attention, league, anomalies, contracts] = await Promise.all([
    ds.getEstateKpis({ from, to }),
    ds.getEstateSalesTimeSeries({ from, to }),
    ds.getTopVenuesByRevenue({ from, to }, 8),
    ds.getTopFragrancesEstate({ from, to }, 6),
    ds.getAttentionItems(),
    ds.getLeagueTable({ from, to }, { from: prevFrom, to: prevTo }),
    ds.getSaleAnomalies({ from, to }),
    ds.getPartnerContracts(),
  ]);

  const expiringContracts = contracts.filter((c) => c.status === "expiring-soon" || c.status === "lapsed");
  const criticalAnomalies = anomalies.filter((a) => a.severity === "critical");
  const warningAnomalies = anomalies.filter((a) => a.severity === "warning");

  const attentionCount =
    attention.offlineMachines.length +
    attention.faultMachines.length +
    attention.lowStockAlerts.length +
    attention.overdueTickets.length +
    attention.newInquiries.length +
    criticalAnomalies.length +
    expiringContracts.length;

  const venues = await ds.getVenues();
  const venueMap = Object.fromEntries(venues.map((v: Venue) => [v.id, v]));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-xl font-bold text-ink">Overview</h1>
          <p className="font-sans text-xs text-stone mt-0.5">Manchester estate · {days}d</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex gap-1.5">
            {[7, 30, 90].map((d) => (
              <Link
                key={d}
                href={`/console?days=${d}`}
                className={`px-3 py-1.5 rounded-full font-sans text-xs font-semibold border transition-colors ${
                  days === d
                    ? "bg-accent/15 border-accent/30 text-ink"
                    : "border-stone/20 text-stone hover:text-ink hover:border-stone/40"
                }`}
              >
                {d}d
              </Link>
            ))}
          </div>
          {/* Quick-add shortcuts */}
          <div className="flex gap-1.5 border-l border-stone/15 pl-2">
            <Link href="/console/venues?add=1" title="Add venue"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone/5 hover:bg-stone/10 font-sans text-[10px] font-semibold text-stone hover:text-ink transition-colors">
              <Plus size={11} /><Building2 size={11} />
            </Link>
            <Link href="/console/maintenance?add=1" title="New ticket"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone/5 hover:bg-stone/10 font-sans text-[10px] font-semibold text-stone hover:text-ink transition-colors">
              <Plus size={11} /><Wrench size={11} />
            </Link>
            <Link href="/console/inquiries?add=1" title="New inquiry"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone/5 hover:bg-stone/10 font-sans text-[10px] font-semibold text-stone hover:text-ink transition-colors">
              <Plus size={11} /><MessageSquare size={11} />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Revenue", value: fmt(kpis.totalRevenueGbp), sub: `${days}d` },
          { label: "Units sold", value: kpis.unitsSold.toLocaleString("en-GB"), sub: `${days}d` },
          { label: "Active machines", value: kpis.activeMachines.toString(), sub: "online" },
          { label: "Faults", value: kpis.machinesWithFaults.toString(), sub: "machines", warn: kpis.machinesWithFaults > 0 },
          { label: "Open tickets", value: kpis.openMaintenanceTickets.toString(), sub: "maintenance", warn: kpis.openMaintenanceTickets > 0 },
          { label: "New inquiries", value: kpis.newInquiries.toString(), sub: "awaiting", accent: kpis.newInquiries > 0 },
        ].map(({ label, value, sub, warn, accent }) => (
          <div key={label} className={`bg-white border rounded-xl px-4 py-3 ${warn ? "border-amber-200" : accent ? "border-accent/30" : "border-stone/10"}`}>
            <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-1">{label}</p>
            <p className={`font-serif text-xl font-bold leading-none ${warn ? "text-amber-600" : accent ? "text-accent" : "text-ink"}`}>{value}</p>
            <p className="font-sans text-[10px] text-stone/60 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Chart + top tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-stone/10 rounded-xl p-4">
          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-4">Estate revenue</p>
          <EstateChart data={timeSeries} />
        </div>

        <div className="space-y-4">
          {/* Top venues */}
          <div className="bg-white border border-stone/10 rounded-xl p-4">
            <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-3">Top venues</p>
            <ol className="space-y-2">
              {topVenues.slice(0, 5).map((v, i) => (
                <li key={v.venueId} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-serif text-[10px] text-stone/50 w-3 shrink-0">{i + 1}</span>
                    <Link href={`/console/venues/${v.venueId}`} className="font-sans text-xs text-ink truncate hover:text-accent transition-colors">
                      {v.venueName}
                    </Link>
                  </div>
                  <span className="font-sans text-xs font-semibold text-ink shrink-0">{fmt(v.revenueGbp)}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Top fragrances */}
          <div className="bg-white border border-stone/10 rounded-xl p-4">
            <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-3">Top fragrances</p>
            <ol className="space-y-2">
              {topFragrances.map((f, i) => (
                <li key={f.fragrance} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-serif text-[10px] text-stone/50 w-3 shrink-0">{i + 1}</span>
                    <span className="font-sans text-xs text-ink truncate">{f.fragrance}</span>
                  </div>
                  <span className="font-sans text-xs text-stone shrink-0">{f.units} units</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* League table */}
      {league.length > 0 && (
        <div className="bg-white border border-stone/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-semibold">Venue league table</p>
            <Link href="/console/venues" className="font-sans text-[10px] text-accent hover:underline">Full view →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-stone/10">
                  <th className="pb-2 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium w-8">#</th>
                  <th className="pb-2 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium w-6">±</th>
                  <th className="pb-2 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Venue</th>
                  <th className="pb-2 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium text-right">Revenue</th>
                  <th className="pb-2 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium text-right">Net profit</th>
                  <th className="pb-2 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium text-right hidden sm:table-cell">Margin</th>
                </tr>
              </thead>
              <tbody>
                {league.slice(0, 8).map((row) => (
                  <tr key={row.venueId} className="border-b border-stone/5 hover:bg-stone/3 transition-colors">
                    <td className="py-2 font-serif text-[10px] text-stone/50">{row.rank}</td>
                    <td className="py-2">
                      {row.movement > 0 && <TrendingUp size={11} className="text-green-600" />}
                      {row.movement < 0 && <TrendingDown size={11} className="text-red-500" />}
                      {row.movement === 0 && <Minus size={11} className="text-stone/30" />}
                    </td>
                    <td className="py-2">
                      <Link href={`/console/venues/${row.venueId}`} className="font-sans text-xs text-ink hover:text-accent transition-colors">
                        {row.venueName}
                      </Link>
                      <span className="ml-1.5 font-sans text-[10px] text-stone">{row.area}</span>
                    </td>
                    <td className="py-2 font-sans text-xs tabular-nums text-ink text-right">{fmt(row.revenueGbp)}</td>
                    <td className="py-2 font-sans text-xs tabular-nums font-semibold text-right">
                      <span className={row.netProfitGbp >= 0 ? "text-green-700" : "text-red-600"}>{fmt(row.netProfitGbp)}</span>
                    </td>
                    <td className="py-2 font-sans text-xs tabular-nums text-stone text-right hidden sm:table-cell">{row.marginPct.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Attention panel */}
      {attentionCount > 0 && (
        <div className="bg-white border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={14} className="text-amber-600 shrink-0" aria-hidden="true" />
            <h2 className="font-sans text-[10px] uppercase tracking-[0.1em] text-amber-700 font-semibold">
              Attention needed ({attentionCount})
            </h2>
          </div>
          <div className="space-y-2">
            {/* Critical anomalies */}
            {criticalAnomalies.map((a) => (
              <Link key={`${a.machineId}-${a.date}`} href="/console/maintenance" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors group">
                <AlertTriangle size={12} className="text-red-500 shrink-0" />
                <span className="font-sans text-xs text-ink flex-1">
                  <span className="font-semibold">{a.venueName}</span> — {a.note}
                </span>
                <span className="font-sans text-[10px] text-stone group-hover:text-accent">View →</span>
              </Link>
            ))}
            {/* Expiring contracts */}
            {expiringContracts.map((c) => (
              <Link key={c.venueId} href="/console/partners" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors group">
                <Users size={12} className="text-amber-600 shrink-0" />
                <span className="font-sans text-xs text-ink flex-1">
                  Contract {c.status === "lapsed" ? "lapsed" : "expiring soon"} — <span className="font-semibold">{c.venueName}</span>
                  {c.status !== "lapsed" && ` (ends ${c.endDate})`}
                </span>
                <span className="font-sans text-[10px] text-stone group-hover:text-accent">View →</span>
              </Link>
            ))}
            {attention.faultMachines.map((m) => (
              <Link key={m.id} href={`/console/maintenance`} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors group">
                <WifiOff size={12} className="text-red-500 shrink-0" />
                <span className="font-sans text-xs text-ink flex-1">
                  <span className="font-semibold">{m.id}</span> at <span>{venueMap[m.venueId]?.name}</span> — fault
                </span>
                <span className="font-sans text-[10px] text-stone group-hover:text-accent">View →</span>
              </Link>
            ))}
            {attention.offlineMachines.map((m) => (
              <Link key={m.id} href={`/console/maintenance`} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-stone/5 hover:bg-stone/10 transition-colors group">
                <WifiOff size={12} className="text-stone shrink-0" />
                <span className="font-sans text-xs text-ink flex-1">
                  <span className="font-semibold">{m.id}</span> at <span>{venueMap[m.venueId]?.name}</span> — offline
                </span>
                <span className="font-sans text-[10px] text-stone group-hover:text-accent">View →</span>
              </Link>
            ))}
            {attention.overdueTickets.map((t) => (
              <Link key={t.id} href="/console/maintenance" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors group">
                <Clock size={12} className="text-amber-600 shrink-0" />
                <span className="font-sans text-xs text-ink flex-1">
                  Ticket <span className="font-semibold">{t.id}</span> at <span>{venueMap[t.venueId]?.name}</span> overdue
                </span>
                <span className="font-sans text-[10px] text-stone group-hover:text-accent">View →</span>
              </Link>
            ))}
            {attention.lowStockAlerts.slice(0, 3).map((s) => (
              <Link key={`${s.machineId}-${s.slot}`} href="/console/stock" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-stone/5 hover:bg-stone/10 transition-colors group">
                <Package size={12} className="text-stone shrink-0" />
                <span className="font-sans text-xs text-ink flex-1">
                  <span className="font-semibold">{s.fragrance}</span> low at {s.venueName} ({s.quantity}/{s.capacity})
                </span>
                <span className="font-sans text-[10px] text-stone group-hover:text-accent">View →</span>
              </Link>
            ))}
            {attention.lowStockAlerts.length > 3 && (
              <Link href="/console/stock" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-stone/5 hover:bg-stone/10 transition-colors group">
                <Package size={12} className="text-stone shrink-0" />
                <span className="font-sans text-xs text-stone flex-1">+{attention.lowStockAlerts.length - 3} more low-stock alerts</span>
                <span className="font-sans text-[10px] text-stone group-hover:text-accent">View →</span>
              </Link>
            )}
            {attention.newInquiries.map((i) => (
              <Link key={i.id} href="/console/inquiries" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors group">
                <MessageSquare size={12} className="text-accent shrink-0" />
                <span className="font-sans text-xs text-ink flex-1">
                  New inquiry from <span className="font-semibold">{i.venueName}</span>
                </span>
                <span className="font-sans text-[10px] text-stone group-hover:text-accent">View →</span>
              </Link>
            ))}
            {/* Warning anomalies (lower priority, collapsed) */}
            {warningAnomalies.length > 0 && (
              <Link href="/console/maintenance" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-stone/5 hover:bg-stone/10 transition-colors group">
                <AlertTriangle size={12} className="text-amber-500 shrink-0" />
                <span className="font-sans text-xs text-stone flex-1">
                  {warningAnomalies.length} sale anomaly warning{warningAnomalies.length !== 1 ? "s" : ""} detected
                </span>
                <span className="font-sans text-[10px] text-stone group-hover:text-accent">View →</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
