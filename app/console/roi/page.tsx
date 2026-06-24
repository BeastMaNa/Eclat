import { getAdminDataSource } from "@/lib/admin";
import { RoiClient } from "./RoiClient";

export const dynamic = "force-dynamic";

export default async function RoiPage() {
  const ds = getAdminDataSource();
  const machines = await ds.getMachineRoi();

  return <RoiClient machines={machines} />;
}
