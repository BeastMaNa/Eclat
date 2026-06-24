import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminDataSource } from "@/lib/admin";
import Link from "next/link";
import { MapWrapper } from "./MapWrapper";
import { EXPANSION_TARGETS } from "@/lib/admin/expansion-targets";

interface Props { searchParams: Promise<{ mode?: string; days?: string; expansion?: string }> }

export default async function MapPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") redirect("/login");

  const params = await searchParams;
  const colourMode = params.mode === "performance" ? "performance" : "status";
  const days = Math.min(90, Math.max(7, parseInt(params.days ?? "30", 10) || 30));
  const showExpansion = params.expansion === "1";

  const ds = getAdminDataSource();
  const to = new Date();
  const from = new Date(Date.now() - days * 86_400_000);

  const [venues, allMachines, topVenues] = await Promise.all([
    ds.getVenues(),
    ds.getAllMachines(),
    ds.getTopVenuesByRevenue({ from, to }, 50),
  ]);

  const revenueMap = Object.fromEntries(topVenues.map((v) => [v.venueId, v.revenueGbp]));

  const venuesWithMachines = venues.map((v) => ({
    ...v,
    machines: allMachines.filter((m) => m.venueId === v.id),
    revenueGbp: revenueMap[v.id] ?? 0,
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-serif text-xl font-bold text-ink">Map</h1>
        <div className="flex gap-2 flex-wrap">
          <div className="flex gap-1.5">
            {["status", "performance"].map((m) => (
              <Link
                key={m}
                href={`/console/map?mode=${m}&days=${days}${showExpansion ? "&expansion=1" : ""}`}
                className={`px-3 py-1.5 rounded-full font-sans text-xs font-semibold border transition-colors ${
                  colourMode === m
                    ? "bg-accent/15 border-accent/30 text-ink"
                    : "border-stone/20 text-stone hover:text-ink"
                }`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </Link>
            ))}
          </div>
          <Link
            href={`/console/map?mode=${colourMode}&days=${days}&expansion=${showExpansion ? "0" : "1"}`}
            className={`px-3 py-1.5 rounded-full font-sans text-xs font-semibold border transition-colors ${
              showExpansion
                ? "bg-green-50 border-green-300 text-green-700"
                : "border-stone/20 text-stone hover:text-ink"
            }`}
          >
            Expansion targets
          </Link>
          <div className="flex gap-1.5">
            {[7, 30, 90].map((d) => (
              <Link
                key={d}
                href={`/console/map?mode=${colourMode}&days=${d}${showExpansion ? "&expansion=1" : ""}`}
                className={`px-3 py-1.5 rounded-full font-sans text-xs font-semibold border transition-colors ${
                  days === d
                    ? "bg-accent/15 border-accent/30 text-ink"
                    : "border-stone/20 text-stone hover:text-ink"
                }`}
              >
                {d}d
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        {(colourMode === "status"
          ? [{ color: "#4ade80", label: "Live" }, { color: "#facc15", label: "Pending" }, { color: "#94a3b8", label: "Paused" }]
          : [{ color: "#4ade80", label: "High (>70%)" }, { color: "#facc15", label: "Mid (35–70%)" }, { color: "#f87171", label: "Low (<35%)" }]
        ).map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
            <span className="font-sans text-xs text-stone">{label}</span>
          </div>
        ))}
        {showExpansion && (
          <>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-green-500" style={{ background: "rgba(74,222,128,0.15)" }} />
              <span className="font-sans text-xs text-stone">High priority target</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-yellow-400" style={{ background: "rgba(250,204,21,0.15)" }} />
              <span className="font-sans text-xs text-stone">Medium priority</span>
            </div>
          </>
        )}
      </div>

      <MapWrapper
        venues={venuesWithMachines}
        colourMode={colourMode}
        expansionTargets={showExpansion ? EXPANSION_TARGETS : []}
      />
    </div>
  );
}
