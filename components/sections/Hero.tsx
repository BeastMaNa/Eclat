import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-ink overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <video
          src="/hero-bg.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover opacity-40 motion-reduce:hidden"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 lg:px-8 py-36 lg:py-44 text-center">
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-accent mb-6 animate-fade-in">
            Manchester · Fragrance for Venues
          </p>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-bone leading-[1.05] tracking-tight animate-fade-up">
            The night out starts before the first drink
          </h1>

          <p
            className="mt-8 font-sans text-lg text-bone/60 leading-relaxed max-w-xl mx-auto animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            Éclat places premium cashless fragrance machines in Manchester&apos;s
            top clubs, bars, and hospitality venues. Your guests get a luxury
            touch they remember. You earn passive revenue from day one —
            we handle everything else.
          </p>

          <div
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4 animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            <Button asChild variant="accent" size="lg">
              <Link href="/contact">
                Bring Éclat to your venue
                <ArrowRight size={18} />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-bone/30 text-bone hover:bg-bone hover:text-ink"
              style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
            >
              <Link href="/pricing">See partnership models</Link>
            </Button>
          </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in"
        style={{ animationDelay: "900ms" }}
      >
        <span className="font-sans text-xs tracking-widest uppercase text-bone/25">
          Scroll
        </span>
        <div className="h-12 w-px bg-gradient-to-b from-bone/25 to-transparent" />
      </div>
    </section>
  );
}
