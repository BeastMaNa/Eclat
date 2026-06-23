import type { Metadata } from "next";
import { PROCESS_STEPS, PROCESS_HEADER } from "@/content/howItWorks";
import { BRAND_NAME } from "@/content/site";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "How It Works",
  description: `From first enquiry to first sale — here's exactly how ${BRAND_NAME} installs and manages a fragrance vending machine in your Manchester venue.`,
};

export default function HowItWorksPage() {
  return (
    <>
      <div className="bg-bone min-h-screen">
        {/* Page title */}
        <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-24 pb-16 lg:pt-28 lg:pb-20 text-center">
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-accent mb-4">
            {PROCESS_HEADER.eyebrow}
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-ink leading-tight">
            {PROCESS_HEADER.title}
          </h1>
          <p className="mt-4 font-sans text-base font-semibold text-stone max-w-xl mx-auto leading-relaxed">
            {PROCESS_HEADER.subtitle}
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-3xl mx-auto px-6 lg:px-8 pb-24">
          <div className="relative">
            {/* Vertical rule */}
            <div className="absolute left-[2.25rem] top-0 bottom-0 w-px bg-stone/15 hidden sm:block" />

            <div className="space-y-0">
              {PROCESS_STEPS.map((step, i) => (
                <AnimateOnScroll key={step.number} delay={i * 60}>
                  <div className="relative flex gap-8 sm:gap-12 pb-12 last:pb-0">
                    {/* Step number bubble */}
                    <div className="shrink-0 relative z-10">
                      <div className="w-[4.5rem] h-[4.5rem] rounded-full bg-bone border border-stone/20 flex items-center justify-center">
                        <span className="font-serif text-2xl text-accent font-bold">
                          {step.number}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="pt-3 pb-2">
                      <h2 className="font-serif text-2xl lg:text-3xl font-bold text-ink leading-snug">
                        {step.title}
                      </h2>
                      {step.duration && (
                        <p className="mt-1.5 font-sans text-xs tracking-[0.12em] uppercase text-accent">
                          {step.duration}
                        </p>
                      )}
                      <p className="mt-3 font-sans text-sm text-stone leading-relaxed max-w-xl">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </div>
      </div>

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
