"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CheckSquare, Square, Package, Truck, AlertTriangle } from "lucide-react";
import { RestockMapWrapper } from "./RestockMapWrapper";
import type { RestockItem } from "@/lib/admin/types";
import type { RouteStop } from "./RestockMapClient";

// ── Nearest-neighbour route from Manchester centre ────────────────────────────
const ORIGIN = { lat: 53.479, lng: -2.245 };

function nearestNeighbourRoute(venues: Array<{ id: string; lat: number; lng: number }>): string[] {
  const remaining = [...venues];
  const route: string[] = [];
  let cur = ORIGIN;
  while (remaining.length > 0) {
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const d = Math.hypot(remaining[i].lat - cur.lat, remaining[i].lng - cur.lng);
      if (d < bestDist) { bestDist = d; best = i; }
    }
    route.push(remaining[best].id);
    cur = remaining[best];
    remaining.splice(best, 1);
  }
  return route;
}

interface Props {
  items: RestockItem[];
}

export function RestockClient({ items }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [restockedIds, setRestockedIds] = useState<Set<string>>(new Set());
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [showRoute, setShowRoute] = useState(false);

  // Group by venue, excluding already restocked
  const byVenue = useMemo(() => {
    const map = new Map<string, { venueName: string; area: string; lat: number; lng: number; items: RestockItem[] }>();
    for (const item of items) {
      if (restockedIds.has(item.venueId)) continue;
      const e = map.get(item.venueId) ?? { venueName: item.venueName, area: item.area, lat: item.lat, lng: item.lng, items: [] };
      e.items.push(item);
      map.set(item.venueId, e);
    }
    return map;
  }, [items, restockedIds]);

  const venueIds = Array.from(byVenue.keys());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(venueIds));

  // Keep selected in sync when restockedIds changes
  const activeSelected = useMemo(
    () => new Set(Array.from(selectedIds).filter((id) => byVenue.has(id))),
    [selectedIds, byVenue]
  );

  // Compute route
  const routeVenues = useMemo(() => {
    const selected = Array.from(activeSelected).map((id) => {
      const v = byVenue.get(id)!;
      return { id, lat: v.lat, lng: v.lng };
    });
    return nearestNeighbourRoute(selected);
  }, [activeSelected, byVenue]);

  // Van manifest: total by fragrance across selected venues
  const manifest = useMemo(() => {
    const map = new Map<string, { totalToLoad: number; machineCount: number }>();
    for (const [venueId, venue] of byVenue) {
      if (!activeSelected.has(venueId)) continue;
      const machinesSeen = new Set<string>();
      for (const item of venue.items) {
        const e = map.get(item.fragrance) ?? { totalToLoad: 0, machineCount: 0 };
        e.totalToLoad += item.toLoad;
        if (!machinesSeen.has(item.machineId)) { e.machineCount += 1; machinesSeen.add(item.machineId); }
        map.set(item.fragrance, e);
      }
    }
    return Array.from(map.entries())
      .map(([fragrance, v]) => ({ fragrance, ...v }))
      .sort((a, b) => b.totalToLoad - a.totalToLoad);
  }, [byVenue, activeSelected]);

  const totalBottles = manifest.reduce((s, m) => s + m.totalToLoad, 0);

  // Route stops for map
  const routeStops: RouteStop[] = routeVenues.map((id, idx) => {
    const v = byVenue.get(id)!;
    const bottles = v.items.filter(() => activeSelected.has(id)).reduce((s, i) => s + i.toLoad, 0);
    return { venueId: id, venueName: v.venueName, area: v.area, lat: v.lat, lng: v.lng, totalBottles: bottles, step: idx + 1 };
  });

  function toggleVenue(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function markRestocked(venueId: string) {
    setPendingId(venueId);
    startTransition(async () => {
      await fetch("/api/console/restock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venueId }),
      });
      setRestockedIds((prev) => new Set(prev).add(venueId));
      setPendingId(null);
      router.refresh();
    });
  }

  if (byVenue.size === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Package size={32} className="text-stone/30" />
        <p className="font-sans text-sm text-stone">All machines are well stocked.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-xl font-bold text-ink">Restock Planner</h1>
          <p className="font-sans text-xs text-stone mt-0.5">
            {byVenue.size} venue{byVenue.size !== 1 ? "s" : ""} need restocking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedIds(new Set(venueIds))}
            className="font-sans text-xs text-stone hover:text-ink transition-colors"
          >
            Select all
          </button>
          <span className="text-stone/30">·</span>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="font-sans text-xs text-stone hover:text-ink transition-colors"
          >
            Deselect all
          </button>
          <button
            onClick={() => setShowRoute((v) => !v)}
            disabled={activeSelected.size === 0}
            className="flex items-center gap-1.5 ml-2 px-4 py-2 rounded-lg font-sans text-xs font-semibold bg-ink text-bone hover:bg-ink/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Truck size={13} />
            {showRoute ? "Hide route" : "Plan run"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Venue checklist */}
        <div className="space-y-3">
          {Array.from(byVenue.entries()).map(([id, venue]) => {
            const isSelected = activeSelected.has(id);
            const totalLoad = venue.items.reduce((s, i) => s + i.toLoad, 0);
            const emptyCount = venue.items.filter((i) => i.currentQty === 0).length;
            const byMachine = new Map<string, RestockItem[]>();
            for (const item of venue.items) {
              const e = byMachine.get(item.machineId) ?? [];
              e.push(item);
              byMachine.set(item.machineId, e);
            }
            return (
              <div key={id} className={`bg-white border rounded-xl p-4 transition-colors ${isSelected ? "border-accent/30" : "border-stone/10 opacity-60"}`}>
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleVenue(id)}
                    className="mt-0.5 text-accent shrink-0"
                    aria-label={isSelected ? "Deselect" : "Select"}
                  >
                    {isSelected ? <CheckSquare size={16} /> : <Square size={16} className="text-stone/40" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div>
                        <p className="font-sans text-xs font-semibold text-ink">{venue.venueName}</p>
                        <p className="font-sans text-[10px] text-stone">{venue.area}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-sans text-xs font-bold text-ink">{totalLoad} bottles</p>
                        {emptyCount > 0 && (
                          <p className="font-sans text-[10px] text-red-500 flex items-center gap-0.5 justify-end">
                            <AlertTriangle size={9} /> {emptyCount} empty
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Per-machine breakdown */}
                    <div className="space-y-1.5">
                      {Array.from(byMachine.entries()).map(([machineId, machItems]) => (
                        <div key={machineId}>
                          <p className="font-sans text-[10px] font-semibold text-stone/70 mb-1">{machineId}</p>
                          <div className="space-y-0.5">
                            {machItems.map((item) => (
                              <div key={`${machineId}-${item.slot}`} className="flex items-center justify-between gap-2">
                                <span className="font-sans text-[10px] text-ink truncate">
                                  Slot {item.slot} · {item.fragrance}
                                </span>
                                <span className={`font-sans text-[10px] shrink-0 font-semibold ${item.currentQty === 0 ? "text-red-500" : "text-amber-600"}`}>
                                  +{item.toLoad}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Mark restocked */}
                    <button
                      onClick={() => markRestocked(id)}
                      disabled={pendingId === id}
                      className="mt-3 text-[10px] font-sans font-semibold text-accent hover:underline disabled:opacity-50"
                    >
                      {pendingId === id ? "Marking…" : "✓ Mark restocked"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Route + manifest panel */}
        {showRoute && (
          <div className="space-y-4">
            {/* Ordered route list */}
            <div className="bg-white border border-stone/10 rounded-xl p-4">
              <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-3">
                Visit order — nearest-neighbour from city centre
              </p>
              <ol className="space-y-2">
                {routeVenues.map((id, idx) => {
                  const v = byVenue.get(id)!;
                  const bottles = v.items.reduce((s, i) => s + i.toLoad, 0);
                  return (
                    <li key={id} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-ink text-bone font-sans text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-xs font-semibold text-ink truncate">{v.venueName}</p>
                        <p className="font-sans text-[10px] text-stone">{v.area}</p>
                      </div>
                      <span className="font-sans text-xs text-stone shrink-0">{bottles} btls</span>
                    </li>
                  );
                })}
              </ol>
              <p className="font-sans text-[10px] text-stone mt-3 pt-3 border-t border-stone/10">
                Total: <strong className="text-ink">{totalBottles} bottles</strong> across {activeSelected.size} venue{activeSelected.size !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Van manifest */}
            <div className="bg-white border border-stone/10 rounded-xl p-4">
              <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-3">Van manifest</p>
              <div className="space-y-1.5">
                {manifest.map((m) => (
                  <div key={m.fragrance} className="flex items-center justify-between gap-3">
                    <p className="font-sans text-xs text-ink truncate">{m.fragrance}</p>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-sans text-[10px] text-stone">{m.machineCount} machine{m.machineCount !== 1 ? "s" : ""}</span>
                      <span className="font-sans text-xs font-bold text-ink tabular-nums w-10 text-right">{m.totalToLoad}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <RestockMapWrapper stops={routeStops} />
          </div>
        )}
      </div>
    </div>
  );
}
