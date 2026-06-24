import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminDataSource } from "@/lib/admin";
import { ProfitabilityClient } from "./ProfitabilityClient";
import { parseRange } from "@/lib/admin/date-range";

interface Props {
  searchParams: Promise<{ from?: string; to?: string; days?: string }>;
}

export default async function ProfitabilityPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") redirect("/login");

  const { from, to } = parseRange(await searchParams);

  const ds = getAdminDataSource();
  const [rows, timeSeries] = await Promise.all([
    ds.getNetProfitability({ from, to }),
    ds.getEstateProfitTimeSeries({ from, to }),
  ]);

  return <ProfitabilityClient rows={rows} timeSeries={timeSeries} />;
}
