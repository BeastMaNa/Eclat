import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminDataSource } from "@/lib/admin";
import { StockTabsClient } from "./StockTabsClient";

interface Props {
  searchParams: Promise<{ view?: string }>;
}

export default async function StockPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") redirect("/login");

  const { view: rawView } = await searchParams;
  const view: "stock" | "restock" = rawView === "restock" ? "restock" : "stock";

  const ds = getAdminDataSource();
  const [allStock, restockItems, venues, machines] = await Promise.all([
    ds.getEstateStock(),
    ds.getRestockItems(),
    ds.getVenues(),
    ds.getAllMachines(),
  ]);

  return (
    <StockTabsClient
      allStock={allStock}
      restockItems={restockItems}
      venues={venues}
      machines={machines}
      view={view}
    />
  );
}
