export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategory {
  id: string;
  label: string;
  items: FaqItem[];
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "partnership",
    label: "Partnership & Eligibility",
    items: [
      {
        question: "What types of venue are a good fit for Éclat?",
        answer:
          "Éclat machines perform best in high-footfall venues where guests or customers are likely to want to freshen up — nightclubs, bars, hotels, restaurants, gyms, spas, salons, event spaces, shopping centres, and office buildings are all excellent fits. If you're unsure whether your venue qualifies, get in touch and we'll advise honestly.",
      },
      {
        question: "Is there a minimum footfall requirement?",
        answer:
          "As a guide, Revenue Share partnerships work well from around 300+ unique visitors per week. Leasing arrangements are suitable from lower footfall. Get in touch with your venue details and we'll assess fit together.",
      },
      {
        question: "Can multi-site operators partner with Éclat?",
        answer:
          "Absolutely. We actively work with hospitality groups, venue operators, and franchise chains. Volume arrangements and group pricing are available — please use the contact form to start a conversation.",
      },
      {
        question: "How long is the partnership agreement?",
        answer:
          "Typical Revenue Share agreements run for [PLACEHOLDER: e.g. 12 months] with a rolling renewal. Lease agreements are available on [PLACEHOLDER: e.g. 12 or 24-month] terms. Full terms are detailed in the partnership agreement provided before signing.",
      },
    ],
  },
  {
    id: "machine",
    label: "The Machine",
    items: [
      {
        question: "What does the machine look like?",
        answer:
          "The Éclat unit is a sleek, backlit upright cabinet finished in a premium matte surround. It is designed to complement, not disrupt, high-end interiors — whether beside a bar, in a hotel lobby, or near changing room facilities. Optional co-branded panels are available on Lease and Purchase plans.",
      },
      {
        question: "How much space does it require?",
        answer:
          "The standard unit occupies a floor footprint of approximately [PLACEHOLDER: dimensions, e.g. 60 cm × 40 cm] and stands [PLACEHOLDER: e.g. 185 cm] tall. A counter-top version with a smaller capacity is available for venues with limited floor space.",
      },
      {
        question: "What power does it need?",
        answer:
          "The machine requires a standard UK 13A mains socket. There is no specialist wiring, plumbing, or structural work required.",
      },
      {
        question: "Does it need Wi-Fi?",
        answer:
          "The machine uses a built-in SIM card for payment processing and remote monitoring, so it does not depend on the venue's Wi-Fi. An optional Wi-Fi connection can improve data sync speeds but is not required.",
      },
      {
        question: "What payment methods does it accept?",
        answer:
          "The machine accepts all major debit and credit cards, Apple Pay, Google Pay, and contactless payments. There is no cash handling — this is intentional to keep the machine clean, tamper-resistant, and low-maintenance.",
      },
    ],
  },
  {
    id: "fragrances",
    label: "Fragrances & Stocking",
    items: [
      {
        question: "Are the fragrances genuine licensed scents?",
        answer:
          "Yes. All fragrances available through Éclat are authentic, licensed products from reputable fragrance houses. We do not stock counterfeit or inferior substitutes. The selection is curated to sit at a premium price point appropriate to the vending context.",
      },
      {
        question: "Can the venue choose which fragrances are stocked?",
        answer:
          "On all plans, we curate a selection tailored to your venue type and typical guest profile. Lease and Purchase partners can additionally request specific adjustments to the mix. Fully custom curation is available on Purchase plans.",
      },
      {
        question: "How are machines restocked?",
        answer:
          "We monitor stock levels remotely via the machine's connectivity and arrange restocking proactively — typically every two to four weeks, or earlier for high-volume venues. Your team does not need to handle product logistics.",
      },
      {
        question: "What are the typical price points per use?",
        answer:
          "Fragrance samples are dispensed in single-use quantities and typically retail at [PLACEHOLDER: e.g. £3–£8] per spray, depending on the scent selected. Pricing is set by Éclat and reviewed periodically.",
      },
    ],
  },
  {
    id: "operations",
    label: "Operations & Maintenance",
    items: [
      {
        question: "Who handles maintenance and repairs?",
        answer:
          "Éclat handles all maintenance and repairs. Our technical team monitors machines remotely and responds to any fault within 48 hours. Revenue Share and Lease partners receive this service at no additional cost; Purchase partners can take out an annual servicing agreement.",
      },
      {
        question: "What does the venue need to do day-to-day?",
        answer:
          "Very little. You host the machine; we handle stocking, servicing, payment processing, and reporting. The only asks are that the machine stays plugged in and accessible, and that staff include a quick wipe-down of the unit as part of their regular cleaning rounds — the same as any other surface in the venue.",
      },
      {
        question: "How do I access my revenue data?",
        answer:
          "All partners receive access to the Éclat venue dashboard, where you can view transaction history, revenue earned, and upcoming restock schedules. Commission payments are made monthly.",
      },
      {
        question: "What happens if I want to end the partnership?",
        answer:
          "We ask for [PLACEHOLDER: e.g. 60 days'] written notice to end a Revenue Share agreement. Lease agreements are subject to the remaining term. We will collect the machine and restore the space at no charge.",
      },
    ],
  },
  {
    id: "gdpr",
    label: "Data & Privacy",
    items: [
      {
        question: "What data does the machine collect?",
        answer:
          "The machine collects transactional data (fragrance selected, time of purchase, payment method type) and no personal data beyond what is required to process a card payment. Payment data is handled by our PCI-DSS compliant payment processor and is not stored on the machine.",
      },
      {
        question: "Is Éclat GDPR compliant?",
        answer:
          "Yes. We operate under UK GDPR and treat all data — including venue partner data — with care. Please refer to our Privacy Policy for full details.",
      },
    ],
  },
];
