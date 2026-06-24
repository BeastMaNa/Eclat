import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminDataSource } from "@/lib/admin";
import { SalesClient } from "./SalesClient";
import { parseRange } from "@/lib/admin/date-range";
import { FRAGRANCES as CATALOG } from "@/content/catalog";

interface Props { searchParams: Promise<{ from?: string; to?: string; days?: string }> }

export default async function SalesPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") redirect("/login");

  const params = await searchParams;
  const { from, to } = parseRange(params);

  const ds = getAdminDataSource();
  const [sales, venues] = await Promise.all([
    ds.getEstateSales({ dateRange: { from, to } }),
    ds.getVenues(),
  ]);

  const fragrances = [...new Set(sales.map((s) => s.fragrance))].sort();

  return (
    <div className="space-y-4">
      <h1 className="font-serif text-xl font-bold text-ink">Sales</h1>
      <SalesClient sales={sales} venues={venues} fragrances={fragrances} />
    </div>
  );
}
