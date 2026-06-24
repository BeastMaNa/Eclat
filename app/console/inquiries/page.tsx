import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminDataSource } from "@/lib/admin";
import { InquiriesClient } from "./InquiriesClient";

export default async function InquiriesPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") redirect("/login");

  const ds = getAdminDataSource();
  const inquiries = await ds.getInquiries();

  return <InquiriesClient initialInquiries={inquiries} />;
}
