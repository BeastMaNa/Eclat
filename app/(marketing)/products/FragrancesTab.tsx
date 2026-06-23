"use client";

import { useState } from "react";
import Image from "next/image";
import { type Fragrance, type FragranceFamily, FRAGRANCE_TIERS } from "@/content/catalog";
import { cn } from "@/lib/utils";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

interface FragrancesTabProps {
  fragrances: Fragrance[];
  families: { value: FragranceFamily; label: string }[];
}

export function FragrancesTab({ fragrances, families }: FragrancesTabProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeFamily, setActiveFamily] = useState<FragranceFamily | "all">("all");

  const filtered =
    activeFamily === "all"
      ? fragrances
      : fragrances.filter((f) => f.family === activeFamily);

  return (
    <div>
      {/* Key points */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
        <div className="flex items-start gap-3 bg-bone/70 rounded-xl px-5 py-4 max-w-xs">
          <span className="font-serif text-2xl text-accent leading-none mt-0.5">5</span>
          <p className="font-sans text-xs text-stone leading-relaxed">
            Each machine holds up to <strong className="text-ink font-medium">5 fragrances</strong>, kept fully stocked by us.
          </p>
        </div>
        <div className="flex items-start gap-3 bg-bone/70 rounded-xl px-5 py-4 max-w-xs">
          <span className="font-serif text-2xl text-accent leading-none mt-0.5">✦</span>
          <p className="font-sans text-xs text-stone leading-relaxed">
            The selection is <strong className="text-ink font-medium">tailored to your venue</strong> — agreed together when you partner with us.
          </p>
        </div>
      </div>

      {/* Family filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <button
          onClick={() => setActiveFamily("all")}
          className={cn(
            "font-sans text-xs tracking-wide px-4 py-1.5 rounded-full border transition-colors duration-[250ms] ease-luxe focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            activeFamily === "all"
              ? "border-ink bg-ink text-bone"
              : "border-stone/30 text-stone hover:border-ink/50 hover:text-ink"
          )}
        >
          All
        </button>
        {families.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFamily(f.value)}
            className={cn(
              "font-sans text-xs tracking-wide px-4 py-1.5 rounded-full border transition-colors duration-[250ms] ease-luxe focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              activeFamily === f.value
                ? "border-ink bg-ink text-bone"
                : "border-stone/30 text-stone hover:border-ink/50 hover:text-ink"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Tier sections */}
      {FRAGRANCE_TIERS.map((tier) => {

        const tierFragrances = filtered.filter((f) => f.tier === tier.id);
        if (tierFragrances.length === 0) return null;

        return (
          <section key={tier.id} className="mb-16 last:mb-0">
            {/* Tier header */}
            <div className="mb-8 pb-4 border-b border-stone/15 text-center">
              <h2 className="font-sans text-xs tracking-[0.2em] uppercase font-semibold text-ink">{tier.label}</h2>
              <p className="font-sans text-xs text-stone mt-1">{tier.blurb}</p>
            </div>

            {/* Fragrance grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {tierFragrances.map((fragrance, i) => (
                <AnimateOnScroll key={fragrance.slug} delay={i * 40}>
                  <article
                    className={cn(
                      "bg-bone/50 rounded-2xl overflow-hidden group cursor-pointer",
                      "border border-transparent hover:border-accent-deep/25",
                      "transition-all duration-[250ms] ease-luxe",
                      expanded === fragrance.slug && "border-accent/50"
                    )}
                    onClick={() =>
                      setExpanded(expanded === fragrance.slug ? null : fragrance.slug)
                    }
                  >
                    {/* Bottle image — square, centred */}
                    <div className="relative aspect-square bg-white flex items-center justify-center p-6 overflow-hidden">
                      <div className="relative w-full h-full">
                        <Image
                          src={fragrance.image}
                          alt={`${fragrance.name} by ${fragrance.house} bottle`}
                          fill
                          className="object-contain transition-transform duration-[600ms] ease-luxe group-hover:scale-105"
                          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                        />
                      </div>
                      {/* Tier badge */}
                      <span
                        className={cn(
                          "absolute top-3 right-3 font-sans text-[10px] tracking-wide px-2 py-0.5 rounded-full",
                          tier.id === "premium"
                            ? "bg-accent text-ink"
                            : "bg-stone/20 text-stone"
                        )}
                      >
                        {tier.label}
                      </span>
                    </div>

                    {/* Card body */}
                    <div className="p-4">
                      <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-stone/70 mb-0.5">
                        {fragrance.house}
                      </p>
                      <h3 className="font-serif text-base text-ink leading-snug">
                        {fragrance.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-sans text-[10px] text-stone">
                          {fragrance.concentration}
                        </span>
                        <span className="text-stone/30">·</span>
                        <span className="font-sans text-[10px] text-stone/70">
                          {fragrance.family}
                        </span>
                      </div>

                      {/* Expanded notes */}
                      {expanded === fragrance.slug && (
                        <div
                          id={`notes-${fragrance.slug}`}
                          className="mt-4 space-y-3 border-t border-stone/10 pt-4"
                        >
                          <p className="font-sans text-xs text-stone leading-relaxed">
                            {fragrance.description}
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            {(["top", "heart", "base"] as const).map((layer) => (
                              <div key={layer}>
                                <p className="font-sans text-[10px] tracking-wide uppercase text-stone/50 mb-1">
                                  {layer}
                                </p>
                                {fragrance.notes[layer].map((n) => (
                                  <p key={n} className="font-sans text-[10px] text-ink leading-snug">
                                    {n}
                                  </p>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <button
                        className="mt-3 font-sans text-[11px] text-accent underline underline-offset-2 hover:text-accent-deep transition-colors duration-[250ms] ease-luxe focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpanded(expanded === fragrance.slug ? null : fragrance.slug);
                        }}
                        aria-expanded={expanded === fragrance.slug}
                        aria-controls={`notes-${fragrance.slug}`}
                      >
                        {expanded === fragrance.slug ? "Show less" : "See notes"}
                      </button>
                    </div>
                  </article>
                </AnimateOnScroll>
              ))}
            </div>
          </section>
        );
      })}

      <p className="font-sans text-sm text-stone max-w-2xl mx-auto mt-16 leading-relaxed text-center">
        These are the scents your guests will find inside every Éclat machine — curated, authentic, and matched to your venue&apos;s ambiance. Selection is agreed when you partner with us.
      </p>
    </div>
  );
}
