import {
  Banknote,
  Sparkles,
  Settings,
  FlaskConical,
  BarChart3,
} from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

const BENEFITS = [
  {
    icon: Banknote,
    title: "Passive revenue from day one",
    description:
      "Every fragrance sold earns your venue a monthly commission. No stock to manage, no capital at risk — just income.",
    duration: "5.8s",
    delay: "0s",
  },
  {
    icon: Sparkles,
    title: "A detail guests remember",
    description:
      "A fragrance moment at the right time is the kind of touch that gets shared and drives return visits.",
    duration: "7.2s",
    delay: "0.6s",
  },
  {
    icon: Settings,
    title: "Fully managed, zero effort",
    description:
      "We install, restock, service, and handle payments. Our engineers respond to any fault within 48 hours.",
    duration: "6.5s",
    delay: "1.1s",
  },
  {
    icon: FlaskConical,
    title: "Genuine, curated scents",
    description:
      "Authentic licensed fragrances only. We tailor the selection around your venue's identity and crowd.",
    duration: "6.9s",
    delay: "0.3s",
  },
  {
    icon: BarChart3,
    title: "Insight & co-branding",
    description:
      "View live transactions in your partner dashboard. Lease and purchase plans include co-branded panels.",
    duration: "5.4s",
    delay: "0.9s",
  },
];

export function Benefits() {
  return (
    <section className="bg-bone py-24 lg:py-32 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <AnimateOnScroll className="text-center mb-20">
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-accent mb-3">
            Why venues choose Éclat
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-ink leading-tight">
            Revenue, experience, and zero hassle
          </h2>
          <p className="mt-3 font-sans text-sm text-stone max-w-xl mx-auto leading-relaxed">
            Everything your venue gains — nothing it has to do.
          </p>
        </AnimateOnScroll>

        {/* Floating cards — 3 top, 2 centred below */}
        <div className="flex flex-wrap justify-center gap-6">
          {BENEFITS.map((b, i) => (
            <AnimateOnScroll
              key={b.title}
              delay={i * 80}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
            >
              <div
                className="card-float bg-white rounded-3xl p-8 shadow-[0_8px_32px_rgba(20,17,15,0.07)] hover:[animation-play-state:paused] hover:shadow-[0_16px_48px_rgba(20,17,15,0.12)] transition-shadow duration-[350ms] ease-luxe cursor-default h-full"
                style={{
                  "--float-duration": b.duration,
                  "--float-delay": b.delay,
                } as React.CSSProperties}
              >
                <b.icon
                  size={22}
                  className="text-accent mb-5 mx-auto"
                  aria-hidden="true"
                />
                <h3 className="font-serif text-2xl font-bold text-ink mb-3 leading-snug text-center">
                  {b.title}
                </h3>
                <p className="font-sans text-sm text-stone leading-relaxed text-center">
                  {b.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
