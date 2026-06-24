import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminDataSource } from "@/lib/admin";
import { VenuesClient } from "./VenuesClient";
import { parseRange } from "@/lib/admin/date-range";

interface Props { searchParams: Promise<{ from?: string; to?: string; days?: string }> }

export default async function VenuesPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") redirect("/login");

  const params = await searchParams;
  const { from, to } = parseRange(params);
  const ds = getAdminDataSource();

  const [venues, allMachines, topVenues] = await Promise.all([
    ds.getVenues({ includeArchived: true }),
    ds.getAllMachines({ includeArchived: true }),
    ds.getTopVenuesByRevenue({ from, to }, 50),
  ]);

  const revenueMap = Object.fromEntries(topVenues.map((v) => [v.venueId, v.revenueGbp]));
  const machineCountMap: Record<string, number> = {};
  allMachines.filter((m) => !m.archived).forEach((m) => {
    machineCountMap[m.venueId] = (machineCountMap[m.venueId] ?? 0) + 1;
  });

  return (
    <VenuesClient
      venues={venues}
      machineCountMap={machineCountMap}
      revenueMap={revenueMap}
    />
  );
}
