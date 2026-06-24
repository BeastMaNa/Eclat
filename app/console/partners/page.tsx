import { getAdminDataSource } from "@/lib/admin";
import { PartnersClient } from "./PartnersClient";

export const dynamic = "force-dynamic";

export default async function PartnersPage() {
  const ds = getAdminDataSource();
  const contracts = await ds.getPartnerContracts();

  return <PartnersClient contracts={contracts} />;
}
