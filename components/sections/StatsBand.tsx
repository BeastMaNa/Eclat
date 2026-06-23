import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

const STATS = [
  {
    value: "[PLACEHOLDER: e.g. 60+]",
    label: "Venues served",
    note: "across Greater Manchester and the North West",
  },
  {
    value: "[PLACEHOLDER: e.g. 48h]",
    label: "Installation to launch",
    note: "from first contact to first sale",
  },
  {
    value: "[PLACEHOLDER: e.g. 97%]",
    label: "Partner retention",
    note: "on annual renewal",
  },
  {
    value: "[PLACEHOLDER: e.g. £0]",
    label: "Upfront cost",
    note: "on our Revenue Share model",
  },
];

export function StatsBand() {
  return (
    <section className="bg-bone border-y border-stone/15 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-4">
          {STATS.map((stat, i) => (
            <AnimateOnScroll key={stat.label} delay={i * 60} className="text-center">
              <p className="font-serif text-4xl lg:text-5xl text-ink leading-none">
                {stat.value}
              </p>
              <p className="mt-2 font-sans text-sm font-medium text-ink">
                {stat.label}
              </p>
              <p className="mt-1 font-sans text-xs text-stone leading-snug">{stat.note}</p>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
