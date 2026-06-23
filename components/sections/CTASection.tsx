import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

interface CTASectionProps {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  dark?: boolean;
}

export function CTASection({
  eyebrow = "Get Started",
  heading,
  subheading,
  primaryCta = { label: "Bring Éclat to your venue", href: "/contact" },
  secondaryCta,
  dark = false,
}: CTASectionProps) {
  return (
    <section
      className={`py-24 lg:py-32 border-t border-b ${dark ? "bg-ink border-bone/10" : "bg-bone border-stone/15"}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <AnimateOnScroll>
          {eyebrow && (
            <p
              className={`font-sans text-xs tracking-[0.18em] uppercase mb-4 ${dark ? "text-accent" : "text-accent"}`}
            >
              {eyebrow}
            </p>
          )}
          <h2
            className={`font-serif text-4xl lg:text-5xl leading-tight max-w-2xl mx-auto ${dark ? "text-bone" : "text-ink"}`}
          >
            {heading}
          </h2>
          {subheading && (
            <p
              className={`mt-6 font-sans text-lg max-w-xl mx-auto leading-relaxed ${dark ? "text-bone/50" : "text-stone"}`}
            >
              {subheading}
            </p>
          )}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="accent" size="lg">
              <Link href={primaryCta.href}>
                {primaryCta.label}
                <ArrowRight size={18} />
              </Link>
            </Button>
            {secondaryCta && (
              <Button
                asChild
                variant={dark ? "outline" : "outline"}
                size="lg"
                className={dark ? "border-bone/30 text-bone hover:bg-bone hover:text-ink" : ""}
              >
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            )}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
