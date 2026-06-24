import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminDataSource } from "@/lib/admin";
import { FragrancesClient } from "./FragrancesClient";
import { parseRange } from "@/lib/admin/date-range";

interface Props {
  searchParams: Promise<{ from?: string; to?: string; days?: string }>;
}

export default async function FragrancesPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") redirect("/login");

  const { from, to } = parseRange(await searchParams);

  const ds = getAdminDataSource();
  const analytics = await ds.getFragranceAnalytics({ from, to });

  return <FragrancesClient analytics={analytics} />;
}
