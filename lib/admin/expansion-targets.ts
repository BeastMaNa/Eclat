// ─── Expansion target areas ───────────────────────────────────────────────────
//
// Planning aid for the Map page. Edit freely — no live data is required.
// lat/lng = centre of target area; radiusM = approximate coverage radius in metres.
//
// [PLACEHOLDER] — Replace with your actual target neighbourhoods.

export interface ExpansionTarget {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radiusM: number;
  description: string;
  priority: "high" | "medium" | "low";
}

export const EXPANSION_TARGETS: ExpansionTarget[] = [
  {
    id: "exp-001",
    name: "Didsbury Village",
    lat: 53.4123,
    lng: -2.2309,
    radiusM: 400,
    description: "High-footfall restaurant & bar strip. ~8 candidate venues. No current presence.",
    priority: "high",
  },
  {
    id: "exp-002",
    name: "Altrincham Market",
    lat: 53.3878,
    lng: -2.3527,
    radiusM: 350,
    description: "Affluent market town with growing premium F&B scene. Several boutique bars.",
    priority: "high",
  },
  {
    id: "exp-003",
    name: "MediaCityUK",
    lat: 53.4726,
    lng: -2.2972,
    radiusM: 500,
    description: "BBC/ITV campus bars and restaurants. Regular corporate events.",
    priority: "medium",
  },
  {
    id: "exp-004",
    name: "Chorlton",
    lat: 53.4414,
    lng: -2.2734,
    radiusM: 450,
    description: "Trendy independent bars, younger demographic, Fri–Sat peak.",
    priority: "medium",
  },
  {
    id: "exp-005",
    name: "Ancoats South",
    lat: 53.4800,
    lng: -2.2180,
    radiusM: 300,
    description: "Rapid development. Several new venues opening H2 2026.",
    priority: "low",
  },
];
