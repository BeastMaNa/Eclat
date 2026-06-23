export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingTier {
  id: string;
  name: string;
  headline: string;
  description: string;
  upfrontCost: string;
  revenueModel: string;
  badge?: string;
  features: PricingFeature[];
  cta: string;
  highlighted: boolean;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "lease",
    name: "Venue Lease",
    headline: "Higher share, low monthly cost.",
    description:
      "Pay a modest monthly lease fee and keep a larger share of every transaction. Ideal for high-footfall venues that want to maximise their earnings over time.",
    upfrontCost: "From [PLACEHOLDER: lease price] / month",
    revenueModel: "[PLACEHOLDER: higher commission %] per transaction",
    highlighted: false,
    features: [
      { text: "Free hardware installation", included: true },
      { text: "Free stocking & restocking", included: true },
      { text: "Cashless payment processing (all cards, Apple Pay, Google Pay)", included: true },
      { text: "Monthly commission payments", included: true },
      { text: "All maintenance & servicing", included: true },
      { text: "24/7 remote monitoring", included: true },
      { text: "Usage & revenue dashboard access", included: true },
      { text: "Fragrance curation for your venue type", included: true },
      { text: "Optional co-branding panel", included: true },
      { text: "Custom fragrance selection", included: false },
    ],
    cta: "Enquire About Leasing",
  },
  {
    id: "revenue-share",
    name: "Revenue Share",
    headline: "Zero upfront. Pure revenue.",
    description:
      "We install and manage everything at no cost to you. In return, the venue receives a commission on every transaction — money earned from day one, with no capital outlay.",
    upfrontCost: "£0",
    revenueModel: "[PLACEHOLDER: commission %] per transaction",
    badge: "Most Popular",
    highlighted: true,
    features: [
      { text: "Free hardware installation", included: true },
      { text: "Free stocking & restocking", included: true },
      { text: "Cashless payment processing (all cards, Apple Pay, Google Pay)", included: true },
      { text: "Monthly commission payments", included: true },
      { text: "All maintenance & servicing", included: true },
      { text: "24/7 remote monitoring", included: true },
      { text: "Usage & revenue dashboard access", included: true },
      { text: "Fragrance curation for your venue type", included: true },
      { text: "Optional co-branding panel", included: false },
      { text: "Custom fragrance selection", included: false },
    ],
    cta: "Apply for Revenue Share",
  },
  {
    id: "purchase",
    name: "Outright Purchase",
    headline: "Own it outright.",
    description:
      "Buy the machine outright and keep 100% of every transaction. We handle installation, set-up, and ongoing servicing under a separate maintenance agreement.",
    upfrontCost: "From [PLACEHOLDER: purchase price]",
    revenueModel: "100% of transactions — yours",
    highlighted: false,
    features: [
      { text: "Full hardware ownership", included: true },
      { text: "Professional installation included", included: true },
      { text: "Initial stock included", included: true },
      { text: "Cashless payment processing (all cards, Apple Pay, Google Pay)", included: true },
      { text: "100% of transaction revenue", included: true },
      { text: "Annual maintenance agreement available", included: true },
      { text: "Usage & revenue dashboard access", included: true },
      { text: "Fragrance curation for your venue type", included: true },
      { text: "Optional co-branding panel", included: true },
      { text: "Custom fragrance selection", included: true },
    ],
    cta: "Get a Purchase Quote",
  },
];

export const PRICING_FAQS = [
  {
    question: "How long does installation take?",
    answer:
      "Our team typically completes installation in under two hours. The machine requires only a standard mains power socket and a small floor or counter footprint — no plumbing or structural work needed.",
  },
  {
    question: "How often are machines restocked?",
    answer:
      "We monitor stock levels remotely and restock proactively, typically every two to four weeks depending on usage. You never need to manage inventory yourself.",
  },
  {
    question: "What happens if the machine needs a repair?",
    answer:
      "Our engineers respond to faults within 48 hours on all plans. Revenue Share and Lease plans include full servicing at no additional charge.",
  },
  {
    question: "Can I see sales data?",
    answer:
      "Yes. All plans include access to our venue partner dashboard, where you can view live transaction counts and your cumulative earnings.",
  },
];
