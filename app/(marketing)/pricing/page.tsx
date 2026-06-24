import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { PRICING_TIERS, PRICING_FAQS } from "@/content/pricing";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { CTASection } from "@/components/sections/CTASection";
import { RoiCalculatorPanel } from "./RoiCalculator";

export const metadata: Metadata = {
  title: "Partnership Models",
  description:
    "Partner with Éclat on a Revenue Share basis — zero upfront cost, passive income from day one. We install and manage everything.",
  openGraph: {
    title: "Partnership Models | Éclat",
    description:
      "Zero upfront. We install and manage everything. You earn a monthly commission on every sale.",
    url: "/pricing",
  },
};

const revenueShare = PRICING_TIERS.find((t) => t.id === "revenue-share")!;

export default function PricingPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-bone pt-24 pb-16 lg:pt-28 lg:pb-20 text-center">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-accent mb-4">
            Partnership Model
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-ink leading-tight">
            Zero upfront. Passive revenue.
          </h1>
          <p className="mt-4 font-sans text-base font-semibold text-stone max-w-xl mx-auto leading-relaxed">
            We install and manage everything. You earn a commission on every
            sale — from day one, with no capital outlay.
          </p>
        </div>
      </section>

      {/* Revenue Share card + ROE calculator side by side */}
      <section className="bg-bone pb-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">

            {/* Left: pricing card */}
            <AnimateOnScroll className="flex flex-col">
              <div className="flex-1 rounded-3xl overflow-hidden bg-accent shadow-2xl flex flex-col">
                {/* Banner — "Revenue Share" replaces "Most Popular" */}
                <div className="bg-ink px-6 py-2.5 text-center">
                  <span className="font-sans text-xs tracking-[0.15em] uppercase text-bone">
                    Revenue Share
                  </span>
                </div>

                <div className="px-8 pt-10 pb-12 lg:px-10 lg:pt-12 lg:pb-14 text-center flex flex-col flex-1">
                  <h2 className="font-serif text-3xl font-bold text-ink">
                    {revenueShare.headline}
                  </h2>
                  <p className="mt-4 font-sans text-sm leading-relaxed text-ink/70 max-w-md mx-auto">
                    {revenueShare.description}
                  </p>

                  {/* Upfront cost hero */}
                  <div className="mt-8 py-8 border-t border-b border-ink/10">
                    <p className="font-sans text-xs uppercase tracking-widest text-bone/70 mb-2">
                      Upfront cost
                    </p>
                    <p className="font-serif text-7xl font-bold text-ink leading-none">
                      £0
                    </p>
                    <p className="mt-3 font-sans text-sm text-ink/60">
                      Commission on every transaction — paid monthly to your venue
                    </p>
                  </div>

                  {/* Features — flex-1 so this area grows to fill remaining height */}
                  <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-left flex-1">
                    {revenueShare.features
                      .filter((f) => f.included)
                      .map((f) => (
                        <li key={f.text} className="flex items-start gap-3">
                          <Check
                            size={16}
                            className="text-bone shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span className="font-sans text-sm text-ink/80">
                            {f.text}
                          </span>
                        </li>
                      ))}
                  </ul>

                  {/* CTA pinned to bottom */}
                  <div className="mt-10">
                    <Button asChild variant="primary" size="lg" className="w-full sm:w-auto">
                      <Link href="/contact">
                        Apply for Revenue Share
                        <ArrowRight size={18} />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              <p className="mt-6 font-sans text-sm text-stone leading-relaxed text-center lg:text-left">
                All figures are finalised after a free site survey.
                We&apos;ll walk you through the numbers for your specific
                footfall during your consultation — no obligation.
              </p>
            </AnimateOnScroll>

            {/* Right: ROE calculator */}
            <AnimateOnScroll delay={80} className="flex flex-col">
              <RoiCalculatorPanel />
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Pricing FAQs */}
      <section className="bg-ink py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <AnimateOnScroll>
            <SectionLabel className="text-accent">Common Questions</SectionLabel>
            <h2 className="font-serif text-3xl text-bone mb-12">
              What venues ask about partnership
            </h2>
          </AnimateOnScroll>
          <div className="space-y-8">
            {PRICING_FAQS.map((faq, i) => (
              <AnimateOnScroll key={i} delay={i * 60}>
                <div className="border-b border-bone/10 pb-8">
                  <h3 className="font-serif text-lg text-bone mb-3">
                    {faq.question}
                  </h3>
                  <p className="font-sans text-sm text-bone/50 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
          <AnimateOnScroll className="mt-10">
            <Button asChild variant="ghost" className="text-accent hover:text-accent-deep px-0">
              <Link href="/faq">See all frequently asked questions →</Link>
            </Button>
          </AnimateOnScroll>
        </div>
      </section>

      <CTASection
        eyebrow="Ready to partner?"
        heading="Bring a premium fragrance experience to your venue"
        subheading="Join venues across Manchester and the North West already earning passive revenue with Éclat."
        primaryCta={{ label: "Book a call", href: "/contact" }}
        secondaryCta={{ label: "See the collection", href: "/products" }}
        dark
      />
    </>
  );
}
