"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, TrendingUp, Package, User, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/sales", label: "Sales", icon: TrendingUp, exact: false },
  { href: "/dashboard/stock", label: "Stock", icon: Package, exact: false },
  { href: "/dashboard/account", label: "Account", icon: User, exact: false },
];

interface DashboardNavProps {
  venueName: string;
  userEmail: string;
}

export function DashboardNav({ venueName, userEmail }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-ink border-r border-bone/10 min-h-screen">
        <div className="px-6 pt-8 pb-6 border-b border-bone/10">
          <Link href="/" className="font-serif text-2xl text-bone tracking-tight hover:text-accent transition-colors">
            Éclat
          </Link>
          <p className="mt-0.5 font-sans text-xs tracking-[0.12em] uppercase text-stone">Partner Dashboard</p>
        </div>

        <div className="px-6 py-5 border-b border-bone/10">
          <p className="font-sans text-xs tracking-wide uppercase text-stone mb-0.5">Venue</p>
          <p className="font-serif text-base text-bone font-bold truncate">{venueName}</p>
          <p className="font-sans text-xs text-stone/60 truncate mt-0.5">{userEmail}</p>
        </div>

        <nav className="flex-1 px-4 py-5 space-y-1" aria-label="Dashboard navigation">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg font-sans text-sm transition-colors duration-[200ms]",
                  active ? "bg-accent/15 text-accent" : "text-bone/50 hover:text-bone hover:bg-bone/5"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 pb-6">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg font-sans text-sm text-bone/40 hover:text-bone hover:bg-bone/5 transition-colors duration-[200ms]"
          >
            <LogOut size={16} aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ──────────────────────────────────── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-ink border-b border-bone/10 px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl text-bone tracking-tight">Éclat</Link>
        <div className="text-right">
          <p className="font-sans text-xs text-bone/80 leading-none">{venueName}</p>
          <p className="font-sans text-[10px] text-stone mt-0.5 leading-none">{userEmail}</p>
        </div>
      </header>

      {/* ── Mobile bottom tab bar ───────────────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-ink border-t border-bone/10 flex"
        aria-label="Dashboard navigation"
      >
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 py-3 font-sans text-[10px] tracking-wide transition-colors duration-[200ms]",
                active ? "text-accent" : "text-bone/40"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={20} aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
