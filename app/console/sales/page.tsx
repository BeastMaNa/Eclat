import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminDataSource } from "@/lib/admin";
import Link from "next/link";
import { SalesClient } from "./SalesClient";
import { FRAGRANCES as CATALOG } from "@/content/catalog";

interface Props { searchParams: Promise<{ days?: string }> }

export default async function SalesPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") redirect("/login");

  const params = await searchParams;
  const days = Math.min(90, Math.max(7, parseInt(params.days ?? "30", 10) || 30));

  const ds = getAdminDataSource();
  const to = new Date();
  const from = new Date(Date.now() - days * 86_400_000);

  const [sales, venues] = await Promise.all([
    ds.getEstateSales({ dateRange: { from, to } }),
    ds.getVenues(),
  ]);

  const fragrances = [...new Set(sales.map((s) => s.fragrance))].sort();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-serif text-xl font-bold text-ink">Sales</h1>
        <div className="flex gap-1.5">
          {[7, 30, 90].map((d) => (
            <Link key={d} href={`/console/sales?days=${d}`}
              className={`px-3 py-1.5 rounded-full font-sans text-xs font-semibold border transition-colors ${days === d ? "bg-accent/15 border-accent/30 text-ink" : "border-stone/20 text-stone hover:text-ink"}`}>
              {d}d
            </Link>
          ))}
        </div>
      </div>
      <SalesClient sales={sales} venues={venues} fragrances={fragrances} />
    </div>
  );
}
