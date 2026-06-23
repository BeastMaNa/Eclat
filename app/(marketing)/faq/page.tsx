import type { Metadata } from "next";
import Link from "next/link";
import { FAQ_CATEGORIES } from "@/content/faq";
import { Button } from "@/components/ui/Button";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Everything venue operators need to know about partnering with Éclat — installation, stocking, maintenance, revenue share, and more.",
  openGraph: {
    title: "FAQ | Éclat",
    description: "Everything venue operators need to know about partnering with Éclat.",
    url: "/faq",
  },
};

export default function FaqPage() {
  return (
    <>
      {/* Header — unchanged */}
      <section className="bg-bone pt-24 pb-16 lg:pt-28 lg:pb-20 text-center">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-accent mb-4">
            FAQ
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-ink leading-tight">
            Questions from venue operators
          </h1>
          <p className="mt-4 font-sans text-base font-semibold text-stone max-w-xl mx-auto leading-relaxed">
            Can&apos;t find what you&apos;re looking for?{" "}
            <Link href="/contact" className="underline underline-offset-2 text-accent hover:text-accent-deep transition-colors">
              Get in touch directly
            </Link>{" "}
            — we&apos;re happy to talk through your specific situation.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-bone border-t border-stone/10 pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12 lg:gap-20 items-start pt-16">

            {/* Sticky sidebar nav */}
            <nav className="hidden lg:block sticky top-28" aria-label="FAQ categories">
              <p className="font-sans text-xs tracking-[0.15em] uppercase text-stone/60 mb-5">
                Categories
              </p>
              <ul className="space-y-1">
                {FAQ_CATEGORIES.map((cat) => (
                  <li key={cat.id}>
                    <a
                      href={`#${cat.id}`}
                      className="group flex items-center gap-2.5 py-1.5 font-sans text-sm text-stone hover:text-ink transition-colors duration-[200ms]"
                    >
                      <span className="block w-4 h-px bg-stone/30 group-hover:bg-accent group-hover:w-6 transition-all duration-[200ms]" />
                      {cat.label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-10 pt-8 border-t border-stone/15">
                <p className="font-sans text-xs text-stone/60 leading-relaxed mb-4">
                  Still have questions?
                </p>
                <Button asChild variant="ghost" className="px-0 text-accent hover:text-accent-deep text-sm">
                  <Link href="/contact">Book a call →</Link>
                </Button>
              </div>
            </nav>

            {/* Accordion sections */}
            <div className="space-y-14">
              {FAQ_CATEGORIES.map((category, ci) => (
                <AnimateOnScroll key={category.id} delay={ci * 40}>
                  <div id={category.id} className="scroll-mt-28">
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="font-serif text-2xl text-ink">
                        {category.label}
                      </h2>
                      <span className="font-sans text-xs text-stone/40 tabular-nums">
                        {String(category.items.length).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="bg-white rounded-2xl border border-stone/15 overflow-hidden">
                      <Accordion type="single" collapsible className="w-full">
                        {category.items.map((item, i) => (
                          <AccordionItem
                            key={i}
                            value={`${category.id}-${i}`}
                            className="border-stone/10 px-6 lg:px-8"
                          >
                            <AccordionTrigger className="text-left">
                              {item.question}
                            </AccordionTrigger>
                            <AccordionContent>
                              {item.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Ready to partner?"
        heading="Bring a premium fragrance experience to your venue"
        subheading="Join venues across Manchester and the North West already earning passive revenue with Éclat."
        primaryCta={{ label: "Book a call", href: "/contact" }}
        secondaryCta={{ label: "See partnership models", href: "/pricing" }}
        dark
      />
    </>
  );
}
