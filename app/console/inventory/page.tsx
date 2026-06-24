import { getAdminDataSource } from "@/lib/admin";
import { InventoryClient } from "./InventoryClient";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const ds = getAdminDataSource();
  const [inventory, purchaseOrders] = await Promise.all([
    ds.getInventory(),
    ds.getPurchaseOrders(),
  ]);

  return <InventoryClient inventory={inventory} purchaseOrders={purchaseOrders} />;
}
