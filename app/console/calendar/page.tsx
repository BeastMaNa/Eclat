import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminDataSource } from "@/lib/admin";
import { getCalendarEvents, ALL_CALENDAR_TYPES } from "@/lib/admin/calendar";
import type { CalendarEventType } from "@/lib/admin/calendar";
import { CalendarClient } from "./CalendarClient";

interface SearchParams {
  view?: string;
  date?: string;
  types?: string;
  venue?: string;
  status?: string;
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "owner") {
    redirect("/login");
  }

  const params = await searchParams;
  const ds = getAdminDataSource();

  const [events, venues] = await Promise.all([
    getCalendarEvents(ds),
    ds.getVenues(),
  ]);

  // Parse view param
  const view = (["month", "week", "agenda"] as const).includes(
    params.view as "month" | "week" | "agenda",
  )
    ? (params.view as "month" | "week" | "agenda")
    : "month";

  // Parse date param (YYYY-MM-DD), default to today
  const todayStr = new Date().toISOString().slice(0, 10);
  const dateStr =
    params.date && /^\d{4}-\d{2}-\d{2}$/.test(params.date)
      ? params.date
      : todayStr;

  // Parse types param (comma-separated); default: all on
  const initialTypes: CalendarEventType[] = params.types
    ? (params.types
        .split(",")
        .filter((t) =>
          ALL_CALENDAR_TYPES.includes(t as CalendarEventType),
        ) as CalendarEventType[])
    : ALL_CALENDAR_TYPES;

  return (
    <div className="space-y-5 pb-10">
      <div>
        <h1 className="font-serif text-xl font-bold text-ink">Calendar</h1>
        <p className="font-sans text-xs text-stone mt-0.5">
          Unified estate timeline — maintenance, inquiries, payouts, contracts &amp; installs
        </p>
      </div>
      <CalendarClient
        events={events}
        venues={venues.map((v) => ({ id: v.id, name: v.name }))}
        initialView={view}
        initialDate={dateStr}
        initialTypes={initialTypes}
        initialVenue={params.venue ?? ""}
        initialStatus={params.status ?? ""}
      />
    </div>
  );
}
