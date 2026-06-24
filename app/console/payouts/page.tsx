import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminDataSource } from "@/lib/admin";
import { PayoutsClient } from "./PayoutsClient";
import { parseRange, getRangeLabel } from "@/lib/admin/date-range";

interface Props {
  searchParams: Promise<{ from?: string; to?: string; days?: string }>;
}

export default async function PayoutsPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") redirect("/login");

  const params = await searchParams;
  const { from, to } = parseRange(params);
  const rangeLabel = getRangeLabel(from, to);

  const ds = getAdminDataSource();
  const records = await ds.getPayoutRecords({ from, to });

  return <PayoutsClient records={records} rangeLabel={rangeLabel} />;
}
