import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminDataSource } from "@/lib/admin";
import { InquiriesClient } from "./InquiriesClient";

export default async function InquiriesPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") redirect("/login");

  const ds = getAdminDataSource();
  const inquiries = await ds.getInquiries();

  return (
    <div className="space-y-4">
      <h1 className="font-serif text-xl font-bold text-ink">Inquiries</h1>
      <InquiriesClient initialInquiries={inquiries} />
    </div>
  );
}
