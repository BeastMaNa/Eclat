import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminDataSource } from "@/lib/admin";
import Link from "next/link";
import type { VenueStatus, PartnershipModel } from "@/lib/admin/types";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(v);

const STATUS_STYLES: Record<VenueStatus, string> = {
  "live": "bg-green-50 text-green-700",
  "install-pending": "bg-amber-50 text-amber-700",
  "paused": "bg-stone/10 text-stone",
};

const MODEL_LABEL: Record<PartnershipModel, string> = {
  "revenue-share": "Rev Share",
  "lease": "Lease",
  "purchase": "Purchase",
};

const TYPE_LABEL: Record<string, string> = {
  "cocktail-bar": "Cocktail Bar", "hotel": "Hotel", "nightclub": "Nightclub",
  "bar-restaurant": "Bar & Restaurant", "restaurant": "Restaurant",
  "food-hall": "Food Hall", "arcade-bar": "Arcade Bar",
};

interface Props { searchParams: Promise<{ status?: string; type?: string; days?: string }> }

export default async function VenuesPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") redirect("/login");

  const params = await searchParams;
  const days = Math.min(90, Math.max(7, parseInt(params.days ?? "30", 10) || 30));
  const ds = getAdminDataSource();
  const to = new Date();
  const from = new Date(Date.now() - days * 86_400_000);

  const [venues, allMachines, topVenues] = await Promise.all([
    ds.getVenues(),
    ds.getAllMachines(),
    ds.getTopVenuesByRevenue({ from, to }, 50),
  ]);

  const revenueMap = Object.fromEntries(topVenues.map((v) => [v.venueId, v.revenueGbp]));
  const machineCountMap: Record<string, number> = {};
  allMachines.forEach((m) => { machineCountMap[m.venueId] = (machineCountMap[m.venueId] ?? 0) + 1; });

  // Filters
  const statusFilter = params.status as VenueStatus | undefined;
  const typeFilter = params.type;

  const filtered = venues.filter((v) => {
    if (statusFilter && v.status !== statusFilter) return false;
    if (typeFilter && v.type !== typeFilter) return false;
    return true;
  });

  const uniqueTypes = [...new Set(venues.map((v) => v.type))].sort();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-serif text-xl font-bold text-ink">Venues</h1>
        <div className="flex gap-1.5">
          {[7, 30, 90].map((d) => (
            <Link key={d} href={`/console/venues?days=${d}`}
              className={`px-3 py-1.5 rounded-full font-sans text-xs font-semibold border transition-colors ${days === d ? "bg-accent/15 border-accent/30 text-ink" : "border-stone/20 text-stone hover:text-ink"}`}>
              {d}d
            </Link>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <Link href={`/console/venues?days=${days}`}
          className={`px-3 py-1.5 rounded-full font-sans text-xs border transition-colors ${!statusFilter && !typeFilter ? "bg-ink text-bone border-ink" : "border-stone/20 text-stone hover:text-ink"}`}>
          All
        </Link>
        {(["live", "install-pending", "paused"] as VenueStatus[]).map((s) => (
          <Link key={s} href={`/console/venues?status=${s}&days=${days}`}
            className={`px-3 py-1.5 rounded-full font-sans text-xs border transition-colors ${statusFilter === s ? "bg-ink text-bone border-ink" : "border-stone/20 text-stone hover:text-ink"}`}>
            {s === "install-pending" ? "Pending" : s.charAt(0).toUpperCase() + s.slice(1)}
          </Link>
        ))}
        {uniqueTypes.map((t) => (
          <Link key={t} href={`/console/venues?type=${t}&days=${days}`}
            className={`px-3 py-1.5 rounded-full font-sans text-xs border transition-colors ${typeFilter === t ? "bg-ink text-bone border-ink" : "border-stone/20 text-stone hover:text-ink"}`}>
            {TYPE_LABEL[t] ?? t}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-stone/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-stone/10">
                {["Venue", "Area", "Type", "Machines", "Status", "Model", "Revenue"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((v, i) => (
                <tr key={v.id} className={`border-b border-stone/5 hover:bg-stone/3 transition-colors ${i % 2 === 0 ? "" : "bg-stone/[0.02]"}`}>
                  <td className="px-3 py-2.5">
                    <Link href={`/console/venues/${v.id}`} className="font-sans text-xs font-semibold text-ink hover:text-accent transition-colors">
                      {v.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-stone">{v.area}</td>
                  <td className="px-3 py-2.5 text-stone">{TYPE_LABEL[v.type] ?? v.type}</td>
                  <td className="px-3 py-2.5 text-stone">{machineCountMap[v.id] ?? 0}</td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded-full font-sans text-[10px] font-semibold ${STATUS_STYLES[v.status]}`}>
                      {v.status === "install-pending" ? "Pending" : v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-stone">{MODEL_LABEL[v.partnershipModel]}</td>
                  <td className="px-3 py-2.5 font-semibold text-ink">{fmt(revenueMap[v.id] ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center font-sans text-sm text-stone py-8">No venues match the current filters.</p>
        )}
      </div>
    </div>
  );
}
