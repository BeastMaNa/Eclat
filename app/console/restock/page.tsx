import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminDataSource } from "@/lib/admin";
import { RestockClient } from "./RestockClient";

export default async function RestockPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") redirect("/login");

  const ds = getAdminDataSource();
  const items = await ds.getRestockItems();

  return <RestockClient items={items} />;
}
