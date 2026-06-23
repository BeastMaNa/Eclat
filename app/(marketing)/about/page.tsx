import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Gem, Zap, Shield, MapPin } from "lucide-react";
import { ABOUT_HEADER, ABOUT_STORY, ABOUT_VALUES, ABOUT_STATS } from "@/content/about";
import { LOCATION } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { CTASection } from "@/components/sections/CTASection";

const VALUES_META = [
  { icon: Gem,    duration: "6.2s", delay: "0s"   },
  { icon: Zap,    duration: "7.0s", delay: "0.7s" },
  { icon: Shield, duration: "5.8s", delay: "1.2s" },
  { icon: MapPin, duration: "6.6s", delay: "0.4s" },
];

export const metadata: Metadata = {
  title: "About",
  description:
    "Éclat installs and manages premium fragrance vending machines in Manchester's top venues — giving operators passive revenue and guests a moment they'll remember.",
  openGraph: {
    title: "About | Éclat",
    description: "Who we are and why we built Éclat.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-bone pt-24 pb-8 lg:pt-28 lg:pb-10 text-center">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-accent mb-4">
            {ABOUT_HEADER.eyebrow}
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-ink leading-tight">
            {ABOUT_HEADER.title}
          </h1>
          <p className="mt-4 font-sans text-base font-semibold text-stone max-w-xl mx-auto leading-relaxed">
            {ABOUT_HEADER.subtitle}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="bg-bone pt-10 pb-20 lg:pt-12 lg:pb-28">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <AnimateOnScroll className="text-center mb-12">
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-accent mb-3">
              Our story
            </p>
            <h2 className="font-serif text-3xl font-bold text-ink">
              {ABOUT_STORY.heading}
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <div className="space-y-5">
              {ABOUT_STORY.paragraphs.map((p, i) => (
                <p key={i} className="font-sans text-base text-stone leading-relaxed">
                  {p}
                </p>
              ))}
              <p className="font-sans text-xs text-stone/60 leading-relaxed pt-2">
                Based in {LOCATION.city} · Serving {LOCATION.regionFull}
              </p>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Values — continuous with story */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 lg:pt-28">
          <AnimateOnScroll className="text-center mb-12">
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-accent mb-3">
              How we work
            </p>
            <h2 className="font-serif text-3xl font-bold text-ink">
              What we stand for
            </h2>
          </AnimateOnScroll>

          <div className="flex flex-wrap justify-center gap-6">
            {ABOUT_VALUES.map((v, i) => {
              const meta = VALUES_META[i];
              const Icon = meta.icon;
              return (
                <AnimateOnScroll
                  key={v.title}
                  delay={i * 80}
                  className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
                >
                  <div
                    className="card-float bg-white rounded-3xl p-8 shadow-[0_8px_32px_rgba(20,17,15,0.07)] hover:[animation-play-state:paused] hover:shadow-[0_16px_48px_rgba(20,17,15,0.12)] transition-shadow duration-[350ms] ease-luxe cursor-default h-full"
                    style={{
                      "--float-duration": meta.duration,
                      "--float-delay": meta.delay,
                    } as React.CSSProperties}
                  >
                    <Icon size={22} className="text-accent mb-5 mx-auto" aria-hidden="true" />
                    <h3 className="font-serif text-xl font-bold text-ink mb-3 leading-snug text-center">
                      {v.title}
                    </h3>
                    <p className="font-sans text-sm text-stone leading-relaxed text-center">
                      {v.body}
                    </p>
                  </div>
                </AnimateOnScroll>
              );
            })}
          </div>

          {/* Our promise */}
          <AnimateOnScroll className="mt-20 max-w-2xl mx-auto text-center">
            <div className="w-8 h-px bg-accent mx-auto mb-8" />
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-accent mb-5">
              Our promise to you
            </p>
            <p className="font-serif text-xl lg:text-2xl text-ink leading-relaxed">
              &ldquo;We started this because we genuinely believe premium fragrance belongs in the places people love. Every venue we work with gets our full attention — not a template. We&rsquo;ll be honest with you about whether Éclat is the right fit, and we&rsquo;ll stand behind everything we say.&rdquo;
            </p>
            <div className="mt-8 flex justify-center gap-8">
              {["Miko", "Yousef", "Alessio"].map((name) => (
                <div key={name} className="text-center">
                  <p className="font-serif text-lg text-ink italic">{name}</p>
                  <p className="font-sans text-xs text-stone/60 tracking-wide uppercase mt-0.5">Co-founder</p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>

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
