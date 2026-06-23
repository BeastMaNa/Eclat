import { SectionLabel } from "@/components/ui/SectionLabel";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

const TESTIMONIALS = [
  {
    quote:
      "We were sceptical about adding another vendor — but the install took less than two hours on a quiet Monday and we've had zero involvement since. The commission lands in our account and the machine just runs.",
    author: "General Manager",
    venue: "[PLACEHOLDER: Nightclub name], Northern Quarter, Manchester",
  },
  {
    quote:
      "Our crowd dress up for a night out — fragrance is part of that. The machine does something the bar can't: it turns the cloakroom into a moment. We've had people photograph it and post it. That's not nothing.",
    author: "Director",
    venue: "[PLACEHOLDER: Bar / venue name], Deansgate, Manchester",
  },
  {
    quote:
      "It's money from a corner of the room that was previously doing nothing. And it looks right — it doesn't feel like a vending machine in the normal sense at all.",
    author: "Owner",
    venue: "[PLACEHOLDER: Bar / restaurant name], Spinningfields, Manchester",
  },
];

const LOGO_STRIP = [
  { name: "[PLACEHOLDER: Venue 1]" },
  { name: "[PLACEHOLDER: Venue 2]" },
  { name: "[PLACEHOLDER: Venue 3]" },
  { name: "[PLACEHOLDER: Venue 4]" },
  { name: "[PLACEHOLDER: Venue 5]" },
];

export function Testimonials() {
  return (
    <section className="bg-bone py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <AnimateOnScroll>
          <SectionLabel>What Partners Say</SectionLabel>
          <h2 className="font-serif text-4xl lg:text-5xl text-ink max-w-lg leading-tight">
            Trusted by Manchester&apos;s best venues
          </h2>
        </AnimateOnScroll>

        {/* Editorial pull-quote layout — no card boxes */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-12">
          {TESTIMONIALS.map((t, i) => (
            <AnimateOnScroll key={i} delay={i * 80}>
              <blockquote className="flex flex-col h-full">
                {/* Hairline rule instead of card border */}
                <div className="w-8 h-px bg-accent mb-8" />
                <p className="font-serif text-lg text-ink/80 leading-relaxed flex-1 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="mt-8">
                  <p className="font-sans text-sm font-medium text-ink">{t.author}</p>
                  <p className="font-sans text-xs text-stone mt-0.5">{t.venue}</p>
                </footer>
              </blockquote>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Logo strip */}
        <AnimateOnScroll className="mt-24">
          <div className="border-t border-stone/15 pt-12">
            <p className="font-sans text-xs tracking-[0.15em] uppercase text-stone text-center mb-8">
              Partners include
            </p>
            <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-16 opacity-35">
              {LOGO_STRIP.map((l) => (
                <div
                  key={l.name}
                  className="h-7 w-28 bg-stone/20 rounded-sm flex items-center justify-center"
                >
                  <span className="font-sans text-xs text-stone">{l.name}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
