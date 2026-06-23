import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardNav } from "./_components/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen bg-bone/30">
      <DashboardNav
        venueName={session.user.venueName}
        userEmail={session.user.email}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
