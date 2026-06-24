import { getAdminDataSource } from "@/lib/admin";
import { ReconciliationClient } from "./ReconciliationClient";

export const dynamic = "force-dynamic";

export default async function ReconciliationPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const { days: daysStr } = await searchParams;
  const days = Number(daysStr) || 30;
  const to = new Date();
  const from = new Date(Date.now() - days * 86_400_000);

  const ds = getAdminDataSource();
  const summary = await ds.getReconciliation({ from, to });

  return <ReconciliationClient summary={summary} days={days} />;
}
