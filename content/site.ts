// ─── Brand ────────────────────────────────────────────────────────────────────
// To rename the brand, change BRAND_NAME here.
// The accented É is intentional; it renders as the HTML entity &Eacute; in
// metadata and as a literal Unicode character everywhere else.
export const BRAND_NAME = "Éclat";
export const BRAND_TAGLINE = "Fragrance for Venues";
export const BRAND_DESCRIPTION =
  "Éclat installs premium cashless fragrance vending machines in Manchester's top nightclubs, bars, and venues — giving operators a new passive revenue stream and guests a luxury touch they'll remember.";

// ─── Location ─────────────────────────────────────────────────────────────────
// Change these to expand or shift territory; they're referenced throughout copy.
export const LOCATION = {
  city: "Manchester",
  region: "the North West",
  regionFull: "Greater Manchester and the North West",
  expansionNote: "We're based in Manchester and currently serve Greater Manchester and the North West. National expansion is underway — get in touch to register interest if you're outside our current area.",
  areasHighlighted: ["Northern Quarter", "Deansgate", "Spinningfields", "Ancoats", "Castlefield"],
};

// ─── Contact ─────────────────────────────────────────────────────────────────
export const CONTACT = {
  email: "[PLACEHOLDER: contact email, e.g. hello@eclat.co.uk]",
  phone: "[PLACEHOLDER: UK phone number, e.g. +44 161 XXX XXXX]",
  address: "[PLACEHOLDER: registered address, Manchester]",
  areasServed: LOCATION.expansionNote,
};

// ─── Navigation ──────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Products", href: "/products" },
  { label: "Partnership", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

// ─── Footer ───────────────────────────────────────────────────────────────────
export const FOOTER_NAV = {
  company: [
    { label: "How It Works", href: "/how-it-works" },
    { label: "Products", href: "/products" },
    { label: "Partnership Models", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
  ],
  legal: [
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Legal / Imprint", href: "/legal" },
  ],
};

// ─── Social ───────────────────────────────────────────────────────────────────
export const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "[PLACEHOLDER: Instagram URL]",
    handle: "@eclat.fragrance",
  },
  {
    label: "LinkedIn",
    href: "[PLACEHOLDER: LinkedIn URL]",
    handle: "Éclat Fragrance",
  },
];

// ─── SEO defaults ─────────────────────────────────────────────────────────────
export const SEO = {
  titleTemplate: `%s | ${BRAND_NAME} — Fragrance Vending for Venues`,
  defaultTitle: `${BRAND_NAME} — Premium Fragrance Vending for Nightclubs & Bars`,
  defaultDescription: BRAND_DESCRIPTION,
  ogImage: "/images/og-default.svg",
  twitterHandle: "@eclat_fragrance",
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "https://eclat.co.uk",
};
