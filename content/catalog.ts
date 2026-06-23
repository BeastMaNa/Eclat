// Fragrances stocked in the Éclat machine. Genuine designer scents;
// brand names are trademarks of their respective owners. Éclat is an
// independent operator — no affiliation or endorsement implied.
//
// `tier` drives the Premium / Standard grouping on the Products → Fragrances tab.

export type FragranceTier = "standard" | "premium";

export type FragranceFamily =
  | "Aromatic Fougère"
  | "Woody Spicy"
  | "Fresh Spicy"
  | "Amber Spicy"
  | "Woody Aromatic";

export interface Fragrance {
  slug: string;
  name: string;
  house: string;
  concentration: string;
  family: FragranceFamily;
  tier: FragranceTier;
  featured: boolean;
  description: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  image: string;
}

export const FRAGRANCES: Fragrance[] = [
  {
    slug: "dior-sauvage",
    name: "Sauvage",
    house: "Dior",
    concentration: "Eau de Toilette",
    family: "Fresh Spicy",
    tier: "premium",
    featured: true,
    description:
      "A radiant, raw signature — bright Calabrian bergamot lifted over a warm, mineral Ambroxan trail. Effortless and instantly recognisable.",
    notes: {
      top: ["Calabrian bergamot", "Pepper"],
      heart: ["Sichuan pepper", "Lavender", "Pink pepper", "Geranium", "Elemi"],
      base: ["Ambroxan", "Cedar", "Labdanum"],
    },
    image: "/images/fragrances/dior-sauvage.png",
  },
  {
    slug: "prada-luna-rossa-carbon",
    name: "Luna Rossa Carbon",
    house: "Prada",
    concentration: "Eau de Toilette",
    family: "Aromatic Fougère",
    tier: "premium",
    featured: true,
    description:
      "Cool, metallic and clean — a crisp lavender heart wrapped in a modern, almost techy mineral freshness. Sharp and contemporary.",
    notes: {
      top: ["Bergamot", "Pepper"],
      heart: ["Lavender", "Coumarin", "Metallic accord"],
      base: ["Ambrette (musk)", "Patchouli"],
    },
    image: "/images/fragrances/prada-luna-rossa-carbon.png",
  },
  {
    slug: "valentino-born-in-roma-uomo",
    name: "Born in Roma Uomo",
    house: "Valentino",
    concentration: "Eau de Toilette",
    family: "Aromatic Fougère",
    tier: "premium",
    featured: false,
    description:
      "A study in contrast — cool violet leaf and sage set against warm mineral woods. Modern, magnetic and a little nocturnal.",
    notes: {
      top: ["Violet leaves", "Bergamot"],
      heart: ["Sage", "Lavender"],
      base: ["Vetiver", "Mineral woods", "Salt accord"],
    },
    image: "/images/fragrances/valentino-born-in-roma-uomo.png",
  },
  {
    slug: "versace-eros",
    name: "Eros",
    house: "Versace",
    concentration: "Eau de Toilette",
    family: "Aromatic Fougère",
    tier: "premium",
    featured: true,
    description:
      "An icon of the dancefloor — a fresh mint-and-apple opening melting into a sweet, addictive vanilla and tonka base. Bold and crowd-pleasing.",
    notes: {
      top: ["Mint", "Green apple", "Lemon"],
      heart: ["Tonka bean", "Ambroxan", "Geranium"],
      base: ["Vanilla", "Vetiver", "Oakmoss", "Cedar"],
    },
    image: "/images/fragrances/versace-eros.png",
  },
  {
    slug: "jean-paul-gaultier-le-male",
    name: "Le Male",
    house: "Jean Paul Gaultier",
    concentration: "Eau de Toilette",
    family: "Aromatic Fougère",
    tier: "standard",
    featured: false,
    description:
      "A timeless crowd-favourite — fresh mint and lavender over a warm, sweet vanilla and tonka heart. Comforting barbershop warmth.",
    notes: {
      top: ["Mint", "Lavender", "Bergamot", "Cardamom"],
      heart: ["Cinnamon", "Cumin", "Orange blossom"],
      base: ["Vanilla", "Tonka bean", "Sandalwood", "Amber", "Cedar"],
    },
    image: "/images/fragrances/jean-paul-gaultier-le-male.png",
  },
  {
    slug: "montblanc-explorer",
    name: "Explorer",
    house: "Montblanc",
    concentration: "Eau de Parfum",
    family: "Woody Aromatic",
    tier: "standard",
    featured: false,
    description:
      "Fresh, woody and leathery — bright bergamot giving way to a rich Haitian vetiver and a smooth leather-patchouli base. Confident and versatile.",
    notes: {
      top: ["Italian bergamot", "Pink pepper", "Clary sage"],
      heart: ["Haitian vetiver", "Leather accord"],
      base: ["Indonesian patchouli", "Ambroxan", "Akigalawood"],
    },
    image: "/images/fragrances/montblanc-explorer.png",
  },
  {
    slug: "paco-rabanne-1-million",
    name: "1 Million",
    house: "Paco Rabanne",
    concentration: "Eau de Toilette",
    family: "Woody Spicy",
    tier: "standard",
    featured: false,
    description:
      "Unapologetically bold — a sparkling citrus burst over warm cinnamon, spicy rose and a blond-leather base. Sweet, loud and unmistakable.",
    notes: {
      top: ["Blood mandarin", "Grapefruit", "Mint"],
      heart: ["Cinnamon", "Spicy rose", "Blond leather"],
      base: ["Amber", "Leather", "Patchouli", "Woody notes"],
    },
    image: "/images/fragrances/paco-rabanne-1-million.png",
  },
  {
    slug: "armani-stronger-with-you",
    name: "Stronger With You",
    house: "Emporio Armani",
    concentration: "Eau de Toilette",
    family: "Amber Spicy",
    tier: "standard",
    featured: false,
    description:
      "Warm and inviting — spicy cardamom and pink pepper over a moreish heart of melted chestnut, vanilla and amberwood. Easy to love.",
    notes: {
      top: ["Cardamom", "Pink pepper", "Violet", "Sage", "Juniper"],
      heart: ["Cinnamon", "Sage", "Melted chestnut"],
      base: ["Vanilla", "Amberwood", "Toffee"],
    },
    image: "/images/fragrances/armani-stronger-with-you.png",
  },
];

export const FRAGRANCE_FAMILIES: { value: FragranceFamily; label: string }[] = [
  { value: "Aromatic Fougère", label: "Aromatic Fougère" },
  { value: "Fresh Spicy", label: "Fresh Spicy" },
  { value: "Woody Spicy", label: "Woody Spicy" },
  { value: "Amber Spicy", label: "Amber Spicy" },
  { value: "Woody Aromatic", label: "Woody Aromatic" },
];

export const FRAGRANCE_TIERS: { id: FragranceTier; label: string; blurb: string }[] = [
  {
    id: "premium",
    label: "Premium",
    blurb: "Flagship designer scents — the standout selection for premium venues.",
  },
  {
    id: "standard",
    label: "Standard",
    blurb: "Proven crowd-pleasers that move fast on a busy night.",
  },
];
