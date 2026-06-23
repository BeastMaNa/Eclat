import { Suspense } from "react";
import type { Metadata } from "next";
import { FRAGRANCES, FRAGRANCE_FAMILIES } from "@/content/catalog";
import { MACHINES } from "@/content/machines";
import { BRAND_NAME } from "@/content/site";
import { ProductsClient } from "./ProductsClient";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Products",
  description: `Explore ${BRAND_NAME}'s curated fragrance range and premium vending machine hardware — available to venues across Manchester and the North West.`,
  openGraph: {
    title: `Products | ${BRAND_NAME}`,
    description: `Fragrances and hardware for venues. Discover the scents inside every ${BRAND_NAME} machine and the three installation formats available to your venue.`,
  },
};

export default function ProductsPage() {
  return (
    <>
      <Suspense fallback={null}>
        <ProductsClient
          fragrances={FRAGRANCES}
          families={FRAGRANCE_FAMILIES}
          machines={MACHINES}
        />
      </Suspense>
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
