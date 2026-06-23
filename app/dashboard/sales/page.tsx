import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getDataSource } from "@/lib/dashboard";
import { SalesClient } from "./SalesClient";
import { DateRangePicker } from "../_components/DateRangePicker";

interface Props {
  searchParams: Promise<{ days?: string }>;
}

export default async function SalesPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const params = await searchParams;
  const days = Math.min(90, Math.max(7, parseInt(params.days ?? "30", 10) || 30));
  const venueId = session.user.venueId;

  const ds = getDataSource();
  const to = new Date();
  const from = new Date(Date.now() - days * 86_400_000);

  const [sales, fragranceNames] = await Promise.all([
    ds.getSales({ venueId, dateRange: { from, to } }),
    ds.getFragranceNames(venueId),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="font-sans text-xs tracking-[0.15em] uppercase text-stone mb-0.5">
            {session.user.venueName}
          </p>
          <h1 className="font-serif text-2xl font-bold text-ink">Sales</h1>
        </div>
        <Suspense>
          <DateRangePicker activeDays={days} />
        </Suspense>
      </div>
      <SalesClient sales={sales} fragranceOptions={fragranceNames} days={days} />
    </div>
  );
}
