import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminDataSource } from "@/lib/admin";
import { ProfitabilityClient } from "./ProfitabilityClient";

interface Props {
  searchParams: Promise<{ days?: string }>;
}

export default async function ProfitabilityPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") redirect("/login");

  const { days: daysParam } = await searchParams;
  const days = daysParam === "7" ? 7 : daysParam === "90" ? 90 : 30;

  const to = new Date();
  const from = new Date(Date.now() - days * 86_400_000);

  const ds = getAdminDataSource();
  const [rows, timeSeries] = await Promise.all([
    ds.getNetProfitability({ from, to }),
    ds.getEstateProfitTimeSeries({ from, to }),
  ]);

  return <ProfitabilityClient rows={rows} timeSeries={timeSeries} days={days} />;
}
