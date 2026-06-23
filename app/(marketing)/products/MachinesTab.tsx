import Link from "next/link";
import Image from "next/image";
import { Check, ArrowRight } from "lucide-react";
import { type Machine } from "@/content/machines";
import { Button } from "@/components/ui/Button";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { cn } from "@/lib/utils";

interface MachinesTabProps {
  machines: Machine[];
}

const SPEC_LABELS: Array<{ key: keyof Machine["specs"]; label: string }> = [
  { key: "dimensions", label: "Dimensions (H×W×D)" },
  { key: "footprint", label: "Floor footprint" },
  { key: "weight", label: "Weight" },
  { key: "fragranceSlots", label: "Fragrance slots" },
  { key: "power", label: "Power" },
];

export function MachinesTab({ machines }: MachinesTabProps) {
  return (
    <div>
      <div className="space-y-16 lg:space-y-20">
        {machines.map((machine, i) => (
          <AnimateOnScroll key={machine.id} delay={i * 60}>
            <article
              className={cn(
                "grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start",
                // Alternate image side on desktop for visual rhythm
                i % 2 === 1 && "lg:[&>*:first-child]:order-last"
              )}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-ink/5 group">
                <Image
                  src={machine.image}
                  alt={`${machine.name} — ${machine.tagline}`}
                  fill
                  className="object-cover transition-transform duration-[700ms] ease-luxe group-hover:scale-[1.03]"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
                {machine.featured && (
                  <span className="absolute top-4 left-4 font-sans text-xs tracking-[0.12em] uppercase bg-accent text-ink px-3 py-1.5">
                    Flagship
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col justify-start">
                <p className="font-sans text-xs tracking-[0.15em] uppercase text-accent mb-3">
                  {machine.model}
                </p>
                <h2 className="font-serif text-3xl lg:text-4xl text-ink leading-tight">
                  {machine.name}
                </h2>
                <p className="mt-2 font-sans text-base text-stone italic">
                  {machine.tagline}
                </p>

                <div className="mt-5 w-8 h-px bg-accent" />

                <p className="mt-5 font-sans text-sm text-stone leading-relaxed">
                  {machine.description}
                </p>

                {/* Spec table */}
                <div className="mt-8">
                  <p className="font-sans text-xs tracking-[0.15em] uppercase text-stone/60 mb-3">
                    Specifications
                  </p>
                  <dl className="space-y-2">
                    {SPEC_LABELS.map(({ key, label }) => {
                      const val = machine.specs[key];
                      const display =
                        key === "fragranceSlots"
                          ? `${val} scents`
                          : Array.isArray(val)
                          ? (val as string[]).join(", ")
                          : String(val);
                      return (
                        <div
                          key={key}
                          className="flex gap-4 border-b border-stone/10 pb-2"
                        >
                          <dt className="font-sans text-xs text-stone/60 w-40 shrink-0">
                            {label}
                          </dt>
                          <dd className="font-sans text-xs text-ink">{display}</dd>
                        </div>
                      );
                    })}
                    {/* Payment methods */}
                    <div className="flex gap-4 border-b border-stone/10 pb-2">
                      <dt className="font-sans text-xs text-stone/60 w-40 shrink-0">
                        Payment
                      </dt>
                      <dd className="font-sans text-xs text-ink">
                        {machine.specs.paymentMethods.join(", ")}
                      </dd>
                    </div>
                    {/* Finishes */}
                    <div className="flex gap-4 pb-2">
                      <dt className="font-sans text-xs text-stone/60 w-40 shrink-0">
                        Finishes
                      </dt>
                      <dd className="font-sans text-xs text-ink">
                        {machine.specs.finishes.join(", ")}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Feature bullets */}
                <ul className="mt-6 space-y-2">
                  {machine.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <Check
                        size={14}
                        className="text-accent shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="font-sans text-sm text-stone leading-snug">
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-8">
                  <Button asChild variant="accent">
                    <Link
                      href={`/contact?model=${encodeURIComponent(machine.name)}`}
                    >
                      Enquire about the {machine.model}
                      <ArrowRight size={16} />
                    </Link>
                  </Button>
                  <p className="mt-3 font-sans text-xs text-stone/60">
                    No prices, no commitment — just a conversation about your venue.
                  </p>
                </div>
              </div>
            </article>
          </AnimateOnScroll>
        ))}
      </div>
    </div>
  );
}
