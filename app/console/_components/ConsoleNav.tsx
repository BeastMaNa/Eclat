"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Map, Building2, TrendingUp,
  MessageSquare, Wrench, Package, LogOut, Menu, X,
  Banknote, BarChart2, Droplets,
  Users, Archive, CreditCard, PieChart, FileText, ClipboardList,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useState } from "react";

type NavItem = { href: string; label: string; icon: React.ElementType; exact: boolean };

const NAV_SECTIONS: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Estate",
    items: [
      { href: "/console",               label: "Overview",      icon: LayoutDashboard, exact: true },
      { href: "/console/map",           label: "Map",           icon: Map,             exact: false },
      { href: "/console/venues",        label: "Venues",        icon: Building2,       exact: false },
      { href: "/console/sales",         label: "Sales",         icon: TrendingUp,      exact: false },
    ],
  },
  {
    heading: "Revenue",
    items: [
      { href: "/console/payouts",       label: "Payouts",       icon: Banknote,        exact: false },
      { href: "/console/profitability", label: "Profitability", icon: BarChart2,       exact: false },
      { href: "/console/roi",           label: "Machine ROI",   icon: PieChart,        exact: false },
      { href: "/console/reconciliation",label: "Reconciliation",icon: CreditCard,      exact: false },
    ],
  },
  {
    heading: "Inventory",
    items: [
      { href: "/console/stock",         label: "Stock",         icon: Package,         exact: false },
      { href: "/console/fragrances",    label: "Fragrances",    icon: Droplets,        exact: false },
      { href: "/console/inventory",     label: "Central Inv.",  icon: Archive,         exact: false },
    ],
  },
  {
    heading: "Partnerships",
    items: [
      { href: "/console/partners",      label: "Partners",      icon: Users,           exact: false },
      { href: "/console/inquiries",     label: "Inquiries",     icon: MessageSquare,   exact: false },
      { href: "/console/documents",     label: "Documents",     icon: FileText,        exact: false },
    ],
  },
  {
    heading: "Operations",
    items: [
      { href: "/console/maintenance",   label: "Maintenance",   icon: Wrench,          exact: false },
      { href: "/console/audit",         label: "Audit Log",     icon: ClipboardList,   exact: false },
    ],
  },
];

const ALL_NAV = NAV_SECTIONS.flatMap((s) => s.items);

interface ConsoleNavProps {
  ownerName: string;
}

export function ConsoleNav({ ownerName }: ConsoleNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function NavLinks({ onClick }: { onClick?: () => void }) {
    return (
      <>
        {NAV_SECTIONS.map(({ heading, items }) => (
          <div key={heading} className="mb-4">
            <p className="px-3 mb-1 font-sans text-[9px] uppercase tracking-[0.16em] text-bone/25 font-semibold">
              {heading}
            </p>
            {items.map(({ href, label, icon: Icon, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClick}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg font-sans text-xs font-medium transition-colors duration-150",
                    active
                      ? "bg-accent/15 text-accent"
                      : "text-bone/50 hover:text-bone hover:bg-bone/5"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon size={14} aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
          </div>
        ))}
      </>
    );
  }

  return (
    // print:hidden — the statement page prints without any chrome
    <div className="print:hidden contents">
      {/* ── Desktop sidebar ───────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-52 shrink-0 bg-ink border-r border-bone/10 min-h-screen">
        <div className="px-4 pt-6 pb-4 border-b border-bone/10">
          <Link href="/console" className="font-serif text-xl text-bone tracking-tight hover:text-accent transition-colors">
            Éclat
          </Link>
          <p className="mt-0.5 font-sans text-[10px] tracking-[0.14em] uppercase text-stone">
            Operations Console
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto" aria-label="Console navigation">
          <NavLinks />
        </nav>

        <div className="px-3 pb-5 border-t border-bone/10 pt-4">
          <p className="font-sans text-xs text-stone px-3 mb-2 truncate">{ownerName}</p>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2.5 px-3 py-2 w-full rounded-lg font-sans text-xs text-bone/40 hover:text-bone hover:bg-bone/5 transition-colors"
          >
            <LogOut size={14} aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ────────────────────────────────────────────── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-ink border-b border-bone/10 px-4 h-12 flex items-center justify-between">
        <Link href="/console" className="font-serif text-lg text-bone tracking-tight">
          Éclat
        </Link>
        <div className="flex items-center gap-3">
          <p className="font-sans text-xs text-stone hidden sm:block">{ownerName}</p>
          <button
            onClick={() => setMobileOpen(true)}
            className="text-bone/60 hover:text-bone p-1"
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* ── Mobile drawer ─────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] flex">
          <div
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-56 bg-ink border-r border-bone/10 flex flex-col">
            <div className="flex items-center justify-between px-4 h-12 border-b border-bone/10">
              <span className="font-serif text-lg text-bone">Éclat</span>
              <button onClick={() => setMobileOpen(false)} className="text-bone/60 hover:text-bone p-1">
                <X size={16} />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 overflow-y-auto" aria-label="Console navigation">
              <NavLinks onClick={() => setMobileOpen(false)} />
            </nav>
            <div className="px-3 pb-5 border-t border-bone/10 pt-4">
              <p className="font-sans text-xs text-stone px-3 mb-2 truncate">{ownerName}</p>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2.5 px-3 py-2 w-full rounded-lg font-sans text-xs text-bone/40 hover:text-bone hover:bg-bone/5"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
