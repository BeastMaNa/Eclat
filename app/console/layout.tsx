import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ConsoleNav } from "./_components/ConsoleNav";

export default async function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "owner") redirect("/dashboard");

  return (
    <div className="flex min-h-screen bg-[#F5F3EF]">
      <ConsoleNav ownerName={session.user.name ?? "Owner"} />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 pt-[calc(3rem+1rem)] pb-6 lg:pt-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
