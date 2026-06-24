import { getAdminDataSource } from "@/lib/admin";
import { ReconciliationClient } from "./ReconciliationClient";
import { parseRange } from "@/lib/admin/date-range";

export const dynamic = "force-dynamic";

export default async function ReconciliationPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; days?: string }>;
}) {
  const { from, to } = parseRange(await searchParams);

  const ds = getAdminDataSource();
  const summary = await ds.getReconciliation({ from, to });

  return <ReconciliationClient summary={summary} />;
}
