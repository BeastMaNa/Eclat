import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminDataSource } from "@/lib/admin";
import Link from "next/link";

export default async function StockPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") redirect("/login");

  const ds = getAdminDataSource();
  const [allStock, venues, machines] = await Promise.all([
    ds.getEstateStock(),
    ds.getVenues(),
    ds.getAllMachines(),
  ]);

  const lowItems = allStock.filter((s) => s.quantity <= s.lowStockThreshold);
  const emptyItems = allStock.filter((s) => s.quantity === 0);

  // Group by venue
  const byVenue = new Map<string, typeof allStock>();
  allStock.forEach((s) => {
    if (!byVenue.has(s.venueId)) byVenue.set(s.venueId, []);
    byVenue.get(s.venueId)!.push(s);
  });

  // Which venues need a restock visit soonest (most low/empty slots)
  const restockPriority = venues
    .map((v) => {
      const vStock = byVenue.get(v.id) ?? [];
      const lowCount = vStock.filter((s) => s.quantity <= s.lowStockThreshold).length;
      const emptyCount = vStock.filter((s) => s.quantity === 0).length;
      return { venue: v, lowCount, emptyCount, score: emptyCount * 2 + lowCount };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-serif text-xl font-bold text-ink">Stock</h1>
        <div className="flex gap-3">
          <div className="bg-white border border-amber-200 rounded-xl px-3 py-2">
            <p className="font-sans text-[10px] text-stone">Low stock</p>
            <p className="font-serif text-lg font-bold text-amber-600">{lowItems.length}</p>
          </div>
          <div className="bg-white border border-red-200 rounded-xl px-3 py-2">
            <p className="font-sans text-[10px] text-stone">Empty</p>
            <p className="font-serif text-lg font-bold text-red-500">{emptyItems.length}</p>
          </div>
        </div>
      </div>

      {/* Restock priority */}
      {restockPriority.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-amber-700 mb-3">Restock priority</p>
          <div className="space-y-1.5">
            {restockPriority.slice(0, 5).map(({ venue, lowCount, emptyCount }) => (
              <div key={venue.id} className="flex items-center justify-between gap-3">
                <Link href={`/console/venues/${venue.id}`} className="font-sans text-xs font-semibold text-ink hover:text-accent transition-colors">
                  {venue.name}
                </Link>
                <div className="flex gap-2 font-sans text-xs text-stone">
                  {emptyCount > 0 && <span className="text-red-600 font-semibold">{emptyCount} empty</span>}
                  {lowCount > 0 && <span className="text-amber-600">{lowCount} low</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Per-venue stock cards */}
      <div className="space-y-4">
        {venues
          .filter((v) => byVenue.has(v.id))
          .map((venue) => {
            const vStock = byVenue.get(venue.id)!;
            const vMachines = machines.filter((m) => m.venueId === venue.id && vStock.some((s) => s.machineId === m.id));

            return (
              <div key={venue.id} className="bg-white border border-stone/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <Link href={`/console/venues/${venue.id}`} className="font-sans text-sm font-semibold text-ink hover:text-accent transition-colors">
                    {venue.name}
                  </Link>
                  <span className="font-sans text-xs text-stone">{venue.area}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {vMachines.map((machine) => {
                    const mStock = vStock.filter((s) => s.machineId === machine.id);
                    return (
                      <div key={machine.id} className="border border-stone/10 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-sans text-xs font-semibold text-ink">{machine.id}</p>
                          <p className="font-sans text-[10px] text-stone">{machine.locationLabel}</p>
                        </div>
                        <div className="space-y-1.5">
                          {mStock.map((s) => {
                            const pct = Math.max(0, Math.min(100, (s.quantity / s.capacity) * 100));
                            const isEmpty = s.quantity === 0;
                            const isLow = !isEmpty && s.quantity <= s.lowStockThreshold;
                            return (
                              <div key={s.slot} className="flex items-center gap-2">
                                <span className="font-sans text-[10px] text-stone/60 w-3 shrink-0 text-right">{s.slot}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="font-sans text-[10px] text-ink truncate mb-0.5">{s.fragrance}</p>
                                  <div className="h-1 bg-stone/10 rounded-full">
                                    <div
                                      className={`h-full rounded-full transition-all ${
                                        isEmpty ? "bg-red-400" : isLow ? "bg-amber-400" : "bg-accent"
                                      }`}
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </div>
                                <span className={`font-sans text-[10px] shrink-0 tabular-nums ${
                                  isEmpty ? "text-red-600 font-bold" : isLow ? "text-amber-600 font-semibold" : "text-stone"
                                }`}>
                                  {s.quantity}/{s.capacity}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
