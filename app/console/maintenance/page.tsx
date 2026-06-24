import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminDataSource } from "@/lib/admin";
import { MaintenanceClient } from "./MaintenanceClient";

export default async function MaintenancePage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") redirect("/login");

  const ds = getAdminDataSource();
  const [tickets, venues] = await Promise.all([
    ds.getMaintenanceTickets(),
    ds.getVenues(),
  ]);

  const venueNames = Object.fromEntries(venues.map((v) => [v.id, v.name]));

  const open = tickets.filter((t) => t.status === "open").length;
  const scheduled = tickets.filter((t) => t.status === "scheduled").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-xl font-bold text-ink">Maintenance</h1>
          <p className="font-sans text-xs text-stone mt-0.5">
            {open} open · {scheduled} scheduled
          </p>
        </div>
      </div>
      <MaintenanceClient tickets={tickets} venueNames={venueNames} />
    </div>
  );
}
