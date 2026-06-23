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
        {/* pt-14 on mobile = clear the fixed top bar; pb-20 = clear bottom tab bar */}
        <main className="flex-1 p-4 pt-[calc(3.5rem+1rem)] pb-24 lg:pt-8 lg:pb-8 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
