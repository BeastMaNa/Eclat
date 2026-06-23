"use client";

import { useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { type Fragrance, type FragranceFamily } from "@/content/catalog";
import { type Machine } from "@/content/machines";
import { cn } from "@/lib/utils";
import { FragrancesTab } from "./FragrancesTab";
import { MachinesTab } from "./MachinesTab";

type TabId = "fragrances" | "machines";

const TABS: { id: TabId; label: string; description: string }[] = [
  {
    id: "fragrances",
    label: "Fragrances",
    description:
      "These are the scents your guests will find inside every Éclat machine — curated, authentic, and matched to your venue's ambiance. Selection is agreed when you partner with us.",
  },
  {
    id: "machines",
    label: "Machines",
    description:
      "Three formats to suit any venue — floor-standing, counter-top, or slim-profile. Every model is fully managed: we install, stock, service, and handle cashless payments.",
  },
];

interface ProductsClientProps {
  fragrances: Fragrance[];
  families: { value: FragranceFamily; label: string }[];
  machines: Machine[];
}

export function ProductsClient({
  fragrances,
  families,
  machines,
}: ProductsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const rawTab = searchParams.get("tab");
  const activeTab: TabId = rawTab === "machines" ? "machines" : "fragrances";

  function selectTab(tab: TabId) {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "fragrances") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  }

  function handleKeyDown(e: React.KeyboardEvent, i: number) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = (i + 1) % TABS.length;
      tabRefs.current[next]?.focus();
      selectTab(TABS[next].id);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (i - 1 + TABS.length) % TABS.length;
      tabRefs.current[prev]?.focus();
      selectTab(TABS[prev].id);
    } else if (e.key === "Home") {
      e.preventDefault();
      tabRefs.current[0]?.focus();
      selectTab(TABS[0].id);
    } else if (e.key === "End") {
      e.preventDefault();
      const last = TABS.length - 1;
      tabRefs.current[last]?.focus();
      selectTab(TABS[last].id);
    }
  }

  return (
    <section className="bg-bone pt-24 pb-16 lg:pt-28 lg:pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Page title */}
        <div className="mb-8 text-center">
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-accent mb-4">
            Products
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-ink leading-tight">
            The Collection
          </h1>
          <p className="mt-4 font-sans text-base font-semibold text-stone">
            Fragrances &amp; machines — both fully managed by Éclat.
          </p>
        </div>

        {/* Tab bar — pill style */}
        <div
          role="tablist"
          aria-label="Products"
          className="flex gap-3 mb-6"
        >
          {TABS.map(({ id, label }, i) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                id={`tab-${id}`}
                role="tab"
                aria-selected={active}
                aria-controls={`panel-${id}`}
                tabIndex={active ? 0 : -1}
                ref={(el) => { tabRefs.current[i] = el; }}
                onClick={() => selectTab(id)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={cn(
                  "flex-1 py-4 font-serif text-lg lg:text-xl tracking-wide rounded-full transition-colors duration-[250ms] ease-luxe focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                  active
                    ? "bg-accent text-ink border border-accent"
                    : "bg-transparent text-stone border border-stone/30 hover:text-ink hover:border-ink/40"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Fragrances panel */}
        <div
          id="panel-fragrances"
          role="tabpanel"
          aria-labelledby="tab-fragrances"
          hidden={activeTab !== "fragrances"}
        >
          {activeTab === "fragrances" && (
            <FragrancesTab fragrances={fragrances} families={families} />
          )}
        </div>

        {/* Machines panel */}
        <div
          id="panel-machines"
          role="tabpanel"
          aria-labelledby="tab-machines"
          hidden={activeTab !== "machines"}
        >
          {activeTab === "machines" && (
            <MachinesTab machines={machines} />
          )}
        </div>
      </div>
    </section>
  );
}
