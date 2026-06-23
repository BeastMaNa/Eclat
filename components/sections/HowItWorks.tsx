import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Button } from "@/components/ui/Button";

const STEPS = [
  {
    number: "01",
    title: "We install",
    description:
      "Our team places a sleek Éclat unit in your venue — typically within two hours, requiring only a standard mains socket.",
  },
  {
    number: "02",
    title: "Your guests enjoy",
    description:
      "Guests discover premium fragrances via a beautifully simple cashless interface — card, Apple Pay, Google Pay.",
  },
  {
    number: "03",
    title: "We restock & service",
    description:
      "We monitor stock remotely and restock proactively. Maintenance and refills are entirely our responsibility.",
  },
  {
    number: "04",
    title: "You earn",
    description:
      "A commission from every transaction lands in your account monthly. Revenue from day one, zero ongoing effort.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-ink py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <AnimateOnScroll className="text-center mb-16">
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-accent mb-3">
            The Process
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-bone leading-tight">
            From installation to income in under a day
          </h2>
          <p className="mt-3 font-sans text-sm font-semibold text-bone/50 max-w-xl mx-auto leading-relaxed">
            We handle everything — you just collect a monthly commission.
          </p>
        </AnimateOnScroll>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {STEPS.map((step, i) => (
            <AnimateOnScroll key={step.number} delay={i * 80}>
              <div className="relative text-center">
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-[calc(100%_+_16px)] right-[-16px] h-px bg-bone/10" />
                )}
                <span className="font-serif text-4xl text-accent/40 leading-none">
                  {step.number}
                </span>
                <h3 className="mt-4 font-serif text-xl font-bold text-bone">
                  {step.title}
                </h3>
                <p className="mt-2 font-sans text-sm text-bone/45 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Links */}
        <AnimateOnScroll className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild variant="accent" size="lg">
            <Link href="/how-it-works">
              See the full process
              <ArrowRight size={16} />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-bone/20 text-bone hover:bg-bone hover:text-ink"
          >
            <Link href="/pricing">View partnership models</Link>
          </Button>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
