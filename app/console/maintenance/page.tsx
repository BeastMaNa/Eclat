import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminDataSource } from "@/lib/admin";
import { MaintenanceClient } from "./MaintenanceClient";

export default async function MaintenancePage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") redirect("/login");

  const ds = getAdminDataSource();
  const [tickets, venues, machines] = await Promise.all([
    ds.getMaintenanceTickets(),
    ds.getVenues(),
    ds.getAllMachines(),
  ]);

  const venueNames = Object.fromEntries(venues.map((v) => [v.id, v.name]));
  const machineOptions = machines.map((m) => ({
    id: m.id,
    venueId: m.venueId,
    label: venueNames[m.venueId] ?? m.venueId,
  }));

  return (
    <MaintenanceClient
      tickets={tickets}
      venueNames={venueNames}
      machineOptions={machineOptions}
    />
  );
}
