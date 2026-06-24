import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ConsoleNav } from "./_components/ConsoleNav";
import { DateRangePicker } from "./_components/DateRangePicker";

export default async function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "owner") redirect("/dashboard");

  return (
    <div className="flex min-h-screen bg-[#F5F3EF]">
      <ConsoleNav ownerName={session.user.name ?? "Owner"} />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky date-range bar */}
        <div className="sticky top-12 lg:top-0 z-40 bg-[#F5F3EF]/95 backdrop-blur-sm border-b border-stone/10 px-4 lg:px-6 h-10 flex items-center justify-end">
          <Suspense fallback={<div className="h-7 w-36 rounded-lg bg-stone/10 animate-pulse" aria-hidden="true" />}>
            <DateRangePicker />
          </Suspense>
        </div>
        <main className="flex-1 p-4 pb-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
