export interface MachineSpecs {
  dimensions: string;       // H × W × D
  footprint: string;        // W × D only, for floor-space conversations
  weight: string;
  fragranceSlots: number;
  paymentMethods: string[];
  power: string;
  finishes: string[];
}

export interface Machine {
  id: string;
  model: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  featured: boolean;
  specs: MachineSpecs;
  features: string[];
}

export const MACHINES: Machine[] = [
  {
    id: "tower-s1",
    model: "Tower S1",
    name: "Éclat Tower S1",
    tagline: "The flagship — built for high footfall.",
    description:
      "Our standard installation. The Tower S1 is a full-height freestanding unit designed for cloakrooms, lobby areas, and anywhere guests linger before or after a great night out. The backlit display panel and slim silhouette sit comfortably in premium interiors without demanding attention.",
    image: "/images/machine-tower-s1.svg",
    featured: true,
    specs: {
      dimensions: "[PLACEHOLDER: e.g. 185 × 62 × 38 cm]",
      footprint: "[PLACEHOLDER: e.g. 62 × 38 cm]",
      weight: "[PLACEHOLDER: e.g. 74 kg]",
      fragranceSlots: 12,
      paymentMethods: ["Contactless card", "Apple Pay", "Google Pay"],
      power: "Standard 13A mains socket",
      finishes: ["Matte Noir", "Brushed Champagne", "[PLACEHOLDER: additional finishes]"],
    },
    features: [
      "Backlit fragrance display — visible at distance",
      "Built-in SIM: no venue Wi-Fi required",
      "Remote stock monitoring — we know before you do",
      "Anti-tamper housing and locked refill bay",
      "Optional co-branded header panel",
      "Typical installation time: under 2 hours",
    ],
  },
  {
    id: "counter",
    model: "Counter",
    name: "Éclat Counter",
    tagline: "Compact. Counter-top ready.",
    description:
      "The Counter sits directly on a bar top, cloakroom shelf, or bathroom vanity unit. It offers a smaller fragrance selection in a footprint that fits almost anywhere — ideal for venues where floor space is at a premium or where the machine works better at eye level.",
    image: "/images/machine-counter.svg",
    featured: false,
    specs: {
      dimensions: "[PLACEHOLDER: e.g. 58 × 46 × 34 cm]",
      footprint: "[PLACEHOLDER: e.g. 46 × 34 cm]",
      weight: "[PLACEHOLDER: e.g. 22 kg]",
      fragranceSlots: 6,
      paymentMethods: ["Contactless card", "Apple Pay", "Google Pay"],
      power: "Standard 13A mains socket",
      finishes: ["Matte Noir", "Brushed Champagne"],
    },
    features: [
      "Counter or shelf placement — no floor space needed",
      "Same cashless payment stack as the Tower S1",
      "Built-in SIM connectivity",
      "Curated 6-scent selection, refreshed seasonally",
      "Optional co-branded wrap",
      "Typical installation time: under 1 hour",
    ],
  },
  {
    id: "slim",
    model: "Slim",
    name: "Éclat Slim",
    tagline: "Narrow footprint, full experience.",
    description:
      "The Slim is designed for tight corridors, narrow cloakrooms, and venues where every centimetre of wall space matters. Its shallow depth keeps it flush to the wall while delivering the full Tower S1 fragrance range and cashless payment experience.",
    image: "/images/machine-slim.svg",
    featured: false,
    specs: {
      dimensions: "[PLACEHOLDER: e.g. 180 × 42 × 28 cm]",
      footprint: "[PLACEHOLDER: e.g. 42 × 28 cm]",
      weight: "[PLACEHOLDER: e.g. 58 kg]",
      fragranceSlots: 10,
      paymentMethods: ["Contactless card", "Apple Pay", "Google Pay"],
      power: "Standard 13A mains socket",
      finishes: ["Matte Noir", "[PLACEHOLDER: additional finishes]"],
    },
    features: [
      "Ultra-shallow depth — fits narrow corridors and alcoves",
      "Full 10-scent selection",
      "Built-in SIM connectivity",
      "Flush-to-wall installation hardware included",
      "Remote monitoring and proactive restocking",
      "Typical installation time: under 2 hours",
    ],
  },
];
