import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminDataSource } from "@/lib/admin";
import { VenuesClient } from "./VenuesClient";

interface Props { searchParams: Promise<{ days?: string }> }

export default async function VenuesPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") redirect("/login");

  const params = await searchParams;
  const days = Math.min(90, Math.max(7, parseInt(params.days ?? "30", 10) || 30));
  const ds = getAdminDataSource();
  const to = new Date();
  const from = new Date(Date.now() - days * 86_400_000);

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
      days={days}
    />
  );
}
