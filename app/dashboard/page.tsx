import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { getDataSource } from "@/lib/dashboard";
import { KpiCard } from "./_components/KpiCard";
import { SalesChart } from "./_components/SalesChart";
import { DateRangePicker } from "./_components/DateRangePicker";
import { Suspense } from "react";

const formatGbp = (v: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(v);

interface Props {
  searchParams: Promise<{ days?: string }>;
}

async function OverviewContent({ venueId, days }: { venueId: string; days: number }) {
  const ds = getDataSource();
  const to = new Date();
  const from = new Date(Date.now() - days * 86_400_000);
  const dateRange = { from, to };
  const query = { venueId, dateRange };

  const [kpis, timeSeries, topFragrances, allStock] = await Promise.all([
    ds.getKpis(query),
    ds.getSalesTimeSeries(query),
    ds.getTopFragrances(query, 5),
    ds.getStock(venueId),
  ]);

  const totalSlots = allStock.length;
  const emptySlots = allStock.filter((s) => s.quantity === 0).length;
  const lowSlots = allStock.filter((s) => s.quantity > 0 && s.quantity <= s.lowStockThreshold).length;
  const adequateSlots = totalSlots - emptySlots - lowSlots;
  const lowStock = allStock.filter((s) => s.quantity <= s.lowStockThreshold);

  return (
    <>
      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Revenue" value={formatGbp(kpis.totalRevenueGbp)} sub={`last ${days} days`} />
        <KpiCard label="Units sold" value={kpis.unitsSold.toLocaleString()} sub={`last ${days} days`} />
        <KpiCard label="Avg / day" value={formatGbp(kpis.avgRevenuePerDay)} sub="revenue" />
        <KpiCard label="Units / day" value={kpis.avgUnitsPerDay.toFixed(1)} sub="avg daily" />
      </div>

      {/* Earnings highlight */}
      {(() => {
        const commissionPct = 20; // matches VENUE_META — replace with DB value in production
        const earningsGbp = kpis.totalRevenueGbp * (commissionPct / 100);
        return (
          <div className="bg-accent/10 border border-accent/25 rounded-xl px-5 py-4 mb-6 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-sans text-xs tracking-[0.12em] uppercase text-accent/70 mb-0.5">Your earnings</p>
              <p className="font-serif text-3xl font-bold text-ink leading-none">
                {new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(earningsGbp)}
              </p>
              <p className="font-sans text-xs text-stone mt-1.5">
                {commissionPct}% commission on{" "}
                {new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(kpis.totalRevenueGbp)}{" "}
                machine revenue · last {days} days
              </p>
            </div>
            <div className="text-right">
              <p className="font-sans text-xs text-stone mb-0.5">Next payout</p>
              <p className="font-sans text-sm font-semibold text-ink">15 Jul 2026</p>
            </div>
          </div>
        );
      })()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales chart */}
        <div className="lg:col-span-2 bg-white/60 border border-stone/10 rounded-xl p-5">
          <h2 className="font-sans text-xs tracking-[0.12em] uppercase text-stone mb-5">
            Revenue over time
          </h2>
          <SalesChart data={timeSeries} />
        </div>

        {/* Top fragrances */}
        <div className="bg-white/60 border border-stone/10 rounded-xl p-5">
          <h2 className="font-sans text-xs tracking-[0.12em] uppercase text-stone mb-4">
            Top fragrances
          </h2>
          <ol className="space-y-3">
            {topFragrances.map((f, i) => (
              <li key={f.fragrance} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-serif text-xs text-accent/60 w-4 shrink-0">
                    {i + 1}
                  </span>
                  <span className="font-sans text-sm text-ink truncate">{f.fragrance}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-sans text-sm font-semibold text-ink">
                    {f.units}
                  </span>
                  <span className="font-sans text-xs text-stone ml-1">units</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Stock health */}
      <div className="bg-white/60 border border-stone/10 rounded-xl p-5 mb-6">
        <h2 className="font-sans text-xs tracking-[0.12em] uppercase text-stone mb-4">Stock health</h2>
        <div className="flex gap-2 mb-3 h-2 rounded-full overflow-hidden">
          <div className="bg-accent rounded-full transition-all" style={{ width: `${(adequateSlots / totalSlots) * 100}%` }} />
          <div className="bg-amber-400 rounded-full transition-all" style={{ width: `${(lowSlots / totalSlots) * 100}%` }} />
          <div className="bg-red-400 rounded-full transition-all" style={{ width: `${(emptySlots / totalSlots) * 100}%` }} />
        </div>
        <div className="flex gap-6 flex-wrap">
          {[
            { color: "bg-accent", label: "Adequate", count: adequateSlots },
            { color: "bg-amber-400", label: "Low", count: lowSlots },
            { color: "bg-red-400", label: "Empty", count: emptySlots },
          ].map(({ color, label, count }) => (
            <div key={label} className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full shrink-0 ${color}`} aria-hidden="true" />
              <span className="font-sans text-xs text-stone">{label}</span>
              <span className="font-sans text-sm font-semibold text-ink">{count}</span>
              <span className="font-sans text-xs text-stone/50">/ {totalSlots}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Low-stock alerts */}
      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={15} className="text-amber-600 shrink-0" aria-hidden="true" />
            <h2 className="font-sans text-xs tracking-[0.12em] uppercase text-amber-700">
              Low stock alerts ({lowStock.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStock.map((item) => (
              <div
                key={`${item.machineId}-${item.slot}`}
                className="flex items-center justify-between bg-white/80 rounded-lg px-4 py-2.5"
              >
                <div>
                  <p className="font-sans text-sm text-ink font-medium">{item.fragrance}</p>
                  <p className="font-sans text-xs text-stone">
                    Machine {item.machineId} · Slot {item.slot}
                  </p>
                </div>
                <span className="font-serif text-lg font-bold text-amber-600">
                  {item.quantity}/{item.capacity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default async function DashboardPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const params = await searchParams;
  const days = Math.min(90, Math.max(7, parseInt(params.days ?? "30", 10) || 30));
  const venueId = session.user.venueId;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="font-sans text-xs tracking-[0.15em] uppercase text-stone mb-0.5">
            {session.user.venueName}
          </p>
          <h1 className="font-serif text-2xl font-bold text-ink">Overview</h1>
        </div>
        <Suspense>
          <DateRangePicker activeDays={days} />
        </Suspense>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/60 border border-stone/10 rounded-xl p-5 h-24 animate-pulse" />
            ))}
          </div>
        }
      >
        <OverviewContent venueId={venueId} days={days} />
      </Suspense>
    </div>
  );
}
