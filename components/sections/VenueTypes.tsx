import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

// Primary venues lead. secondary flag drives the "and beyond" visual treatment.
// Reorder by changing the array — no other code needs changing.
const VENUES = [
  {
    name: "Nightclubs",
    description:
      "Cloakrooms, pre-club prep rooms — the moment guests want to feel their best. Deansgate and the Northern Quarter know it.",
    image: "/images/venue-nightclub.jpg",
    alt: "Packed nightclub dance floor with warm neon lighting",
    primary: true,
  },
  {
    name: "Bars & Cocktail Bars",
    description:
      "Before the first round and between the last two — premium scent drives extra spend and repeat visits.",
    image: "/images/venue-bar.jpg",
    alt: "Bartender crafting cocktails at a copper-lit bar",
    primary: true,
  },
  // Hidden until real photography is ready — add back with primary: false
  // { name: "Hotels", image: "/images/venue-hotel.svg", ... },
  // { name: "Gyms & Spas", image: "/images/venue-gym.svg", ... },
  // { name: "Restaurants", image: "/images/venue-restaurant.svg", ... },
  // { name: "Event Spaces", image: "/images/venue-events.svg", ... },
];

export function VenueTypes() {
  const primary = VENUES.filter((v) => v.primary);
  const secondary = VENUES.filter((v) => !v.primary);

  return (
    <section className="bg-ink py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <AnimateOnScroll className="text-center">
          <SectionLabel className="text-accent">Where Éclat belongs</SectionLabel>
          <h2 className="font-serif text-4xl lg:text-5xl text-bone leading-tight">
            Built for the night — and beyond
          </h2>
          <p className="mt-5 font-sans text-base text-bone/45 max-w-lg mx-auto leading-relaxed">
            We started with Manchester&apos;s clubs and bars. Wherever guests
            want to feel their best, Éclat earns your venue passive revenue
            without adding to your team&apos;s workload.
          </p>
        </AnimateOnScroll>

        {/* Primary venues — larger cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {primary.map((venue, i) => (
            <AnimateOnScroll key={venue.name} delay={i * 80}>
              <div className="relative overflow-hidden rounded-2xl aspect-[16/9] sm:aspect-[4/3] group">
                <Image
                  src={venue.image}
                  alt={venue.alt}
                  fill
                  priority={i === 0}
                  className="object-cover transition-transform duration-[700ms] ease-luxe group-hover:scale-105"
                  sizes="(min-width: 640px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <h3 className="font-serif text-2xl text-bone">{venue.name}</h3>
                  <p className="mt-2 font-sans text-sm text-bone/60 leading-snug">
                    {venue.description}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Secondary venues hidden until photography is ready — see VENUES array comments */}
      </div>
    </section>
  );
}
