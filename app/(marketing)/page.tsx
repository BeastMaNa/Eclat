import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Benefits } from "@/components/sections/Benefits";
import { VenueTypes } from "@/components/sections/VenueTypes";
// import { StatsBand } from "@/components/sections/StatsBand";
// import { Testimonials } from "@/components/sections/Testimonials";
import { CTASection } from "@/components/sections/CTASection";
import { SEO } from "@/content/site";

export const metadata: Metadata = {
  title: "Éclat — Premium Fragrance Vending Machines for Venues",
  description: SEO.defaultDescription,
  openGraph: {
    title: "Éclat — Premium Fragrance Vending Machines for Venues",
    description: SEO.defaultDescription,
    url: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Benefits />
      <VenueTypes />
      {/* <StatsBand /> */}
      {/* <Testimonials /> */}
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
