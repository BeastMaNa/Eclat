// PLACEHOLDER DATA — All venues, contacts, and addresses are fictional.
// Replace with real data when connecting the live machine API.

import type { AdminDataSource } from "./datasource";
import type {
  Venue,
  AdminMachine,
  AdminSale,
  Inquiry,
  InquiryStatus,
  MaintenanceTicket,
  TicketStatus,
  AdminStockItem,
  EstateKpis,
  VenueRevenueSummary,
  AttentionItems,
  SalesTimeSeries,
  DateRange,
  EstateSalesQuery,
  MaintenanceFilter,
  InquiryFilter,
  PaymentType,
} from "./types";
import { FRAGRANCES as CATALOG } from "@/content/catalog";

const ALL_FRAGRANCES = CATALOG.map((f) => `${f.house} ${f.name}`);
const PAYMENT_TYPES: PaymentType[] = ["card", "apple_pay", "google_pay"];
const OWNER_NAMES = ["Miko R.", "Jordan A.", "Priya S."];

// ─── Venues ───────────────────────────────────────────────────────────────────

const VENUES: Venue[] = [
  {
    id: "venue-001",
    name: "The Alchemist",
    area: "Northern Quarter",
    type: "cocktail-bar",
    address: "1 Piccadilly Gardens, Manchester M1 1RG",
    lat: 53.4806, lng: -2.2343,
    status: "live",
    partnershipModel: "revenue-share",
    goLiveDate: "2024-03-15",
    commissionPct: 20,
    contactName: "James Mitchell",
    contactEmail: "james@alchemist-nq.co.uk",
    machineIds: ["mach-001", "mach-002"],
  },
  {
    id: "venue-002",
    name: "King Street Townhouse",
    area: "City Centre",
    type: "hotel",
    address: "10 Booth Street, Manchester M2 4AW",
    lat: 53.4787, lng: -2.2442,
    status: "live",
    partnershipModel: "revenue-share",
    goLiveDate: "2024-04-01",
    commissionPct: 20,
    contactName: "Sarah Chen",
    contactEmail: "sarah@kst-manchester.co.uk",
    machineIds: ["mach-003"],
  },
  {
    id: "venue-003",
    name: "Warehouse Project",
    area: "Ancoats",
    type: "nightclub",
    address: "Store Street, Manchester M12 6LH",
    lat: 53.4777, lng: -2.2248,
    status: "live",
    partnershipModel: "lease",
    goLiveDate: "2024-06-01",
    commissionPct: 0,
    contactName: "Sacha Lord",
    contactEmail: "operations@whproject.com",
    machineIds: ["mach-004", "mach-005", "mach-006"],
  },
  {
    id: "venue-004",
    name: "Menagerie",
    area: "Spinningfields",
    type: "bar-restaurant",
    address: "14 Bridge Street, Manchester M3 3BZ",
    lat: 53.4784, lng: -2.2492,
    status: "live",
    partnershipModel: "revenue-share",
    goLiveDate: "2024-07-15",
    commissionPct: 20,
    contactName: "Rachel Webb",
    contactEmail: "rachel@menagerie-mcr.co.uk",
    machineIds: ["mach-007", "mach-008"],
  },
  {
    id: "venue-005",
    name: "Schofield's Bar",
    area: "Deansgate",
    type: "cocktail-bar",
    address: "3 The Avenue, Spinningfields, Manchester M3 3AP",
    lat: 53.4782, lng: -2.2447,
    status: "live",
    partnershipModel: "revenue-share",
    goLiveDate: "2024-08-20",
    commissionPct: 20,
    contactName: "Daniel Schofield",
    contactEmail: "dan@schofields-bar.co.uk",
    machineIds: ["mach-009"],
  },
  {
    id: "venue-006",
    name: "Dukes 92",
    area: "Castlefield",
    type: "bar-restaurant",
    address: "18 Castle Street, Castlefield, Manchester M3 4LZ",
    lat: 53.4751, lng: -2.2556,
    status: "live",
    partnershipModel: "revenue-share",
    goLiveDate: "2024-09-10",
    commissionPct: 20,
    contactName: "Tom Adderley",
    contactEmail: "tom@dukes92.co.uk",
    machineIds: ["mach-010"],
  },
  {
    id: "venue-007",
    name: "Gotham Hotel",
    area: "City Centre",
    type: "hotel",
    address: "100 King Street, Manchester M2 4WU",
    lat: 53.4790, lng: -2.2429,
    status: "live",
    partnershipModel: "revenue-share",
    goLiveDate: "2024-10-05",
    commissionPct: 22,
    contactName: "Alex Pearson",
    contactEmail: "apearson@hotelsofcode.com",
    machineIds: ["mach-011", "mach-012"],
  },
  {
    id: "venue-008",
    name: "YES Manchester",
    area: "Northern Quarter",
    type: "nightclub",
    address: "38 Charles Street, Manchester M1 7DB",
    lat: 53.4822, lng: -2.2310,
    status: "live",
    partnershipModel: "lease",
    goLiveDate: "2024-11-01",
    commissionPct: 0,
    contactName: "Lisa Park",
    contactEmail: "lisa@yes-mcr.co.uk",
    machineIds: ["mach-013", "mach-014"],
  },
  {
    id: "venue-009",
    name: "Freight Island",
    area: "Basing Way",
    type: "food-hall",
    address: "Basing Way, Manchester M11 2WJ",
    lat: 53.4758, lng: -2.2162,
    status: "install-pending",
    partnershipModel: "revenue-share",
    goLiveDate: "2026-08-01",
    commissionPct: 18,
    contactName: "Oli Frost",
    contactEmail: "oli@freightisland.co.uk",
    machineIds: ["mach-015"],
  },
  {
    id: "venue-010",
    name: "Elnecot",
    area: "Ancoats",
    type: "restaurant",
    address: "41 Blossom Street, Ancoats, Manchester M4 6AJ",
    lat: 53.4826, lng: -2.2226,
    status: "install-pending",
    partnershipModel: "revenue-share",
    goLiveDate: "2026-07-15",
    commissionPct: 20,
    contactName: "Michael Clay",
    contactEmail: "mc@elnecot.co.uk",
    machineIds: ["mach-016"],
  },
  {
    id: "venue-011",
    name: "Atlas Bar",
    area: "Deansgate",
    type: "cocktail-bar",
    address: "376 Deansgate, Manchester M3 4LY",
    lat: 53.4778, lng: -2.2452,
    status: "paused",
    partnershipModel: "revenue-share",
    goLiveDate: "2024-05-01",
    commissionPct: 20,
    contactName: "Lena Morris",
    contactEmail: "lena@atlasbar.co.uk",
    machineIds: ["mach-017"],
  },
  {
    id: "venue-012",
    name: "Salford Quays Marriott",
    area: "Salford Quays",
    type: "hotel",
    address: "Michigan Avenue, Salford M50 2EQ",
    lat: 53.4697, lng: -2.2986,
    status: "live",
    partnershipModel: "revenue-share",
    goLiveDate: "2025-01-20",
    commissionPct: 20,
    contactName: "Grace Turner",
    contactEmail: "g.turner@marriott-salford.co.uk",
    machineIds: ["mach-018", "mach-019"],
  },
];

// ─── Machines ─────────────────────────────────────────────────────────────────

const MACHINES: AdminMachine[] = [
  // venue-001 Alchemist
  { id: "mach-001", venueId: "venue-001", locationLabel: "Main Entrance", model: "Tower S1", status: "online", firmware: "3.2.1", lastSeen: ago(2), installDate: "2024-03-15" },
  { id: "mach-002", venueId: "venue-001", locationLabel: "VIP Lounge", model: "Counter C2", status: "online", firmware: "3.2.1", lastSeen: ago(1), installDate: "2024-03-15" },
  // venue-002 King Street Townhouse
  { id: "mach-003", venueId: "venue-002", locationLabel: "Lobby", model: "Slim S3", status: "online", firmware: "3.1.8", lastSeen: ago(3), installDate: "2024-04-01" },
  // venue-003 Warehouse Project
  { id: "mach-004", venueId: "venue-003", locationLabel: "Main Floor", model: "Tower S1", status: "online", firmware: "3.2.1", lastSeen: ago(1), installDate: "2024-06-01" },
  { id: "mach-005", venueId: "venue-003", locationLabel: "Cloakroom", model: "Counter C2", status: "fault", firmware: "3.2.0", lastSeen: ago(36), installDate: "2024-06-01" },
  { id: "mach-006", venueId: "venue-003", locationLabel: "Terrace", model: "Slim S3", status: "online", firmware: "3.2.1", lastSeen: ago(2), installDate: "2024-06-01" },
  // venue-004 Menagerie
  { id: "mach-007", venueId: "venue-004", locationLabel: "Bar Entrance", model: "Tower S1", status: "online", firmware: "3.2.1", lastSeen: ago(1), installDate: "2024-07-15" },
  { id: "mach-008", venueId: "venue-004", locationLabel: "Private Dining", model: "Counter C2", status: "online", firmware: "3.2.1", lastSeen: ago(4), installDate: "2024-07-15" },
  // venue-005 Schofield's
  { id: "mach-009", venueId: "venue-005", locationLabel: "Back Bar", model: "Slim S3", status: "online", firmware: "3.1.8", lastSeen: ago(2), installDate: "2024-08-20" },
  // venue-006 Dukes 92
  { id: "mach-010", venueId: "venue-006", locationLabel: "Canal Terrace", model: "Counter C2", status: "offline", firmware: "3.1.5", lastSeen: ago(72), installDate: "2024-09-10" },
  // venue-007 Gotham Hotel
  { id: "mach-011", venueId: "venue-007", locationLabel: "Cocktail Bar", model: "Tower S1", status: "online", firmware: "3.2.1", lastSeen: ago(1), installDate: "2024-10-05" },
  { id: "mach-012", venueId: "venue-007", locationLabel: "Spa Reception", model: "Slim S3", status: "online", firmware: "3.2.1", lastSeen: ago(3), installDate: "2024-10-05" },
  // venue-008 YES Manchester
  { id: "mach-013", venueId: "venue-008", locationLabel: "Ground Floor", model: "Tower S1", status: "online", firmware: "3.2.1", lastSeen: ago(1), installDate: "2024-11-01" },
  { id: "mach-014", venueId: "venue-008", locationLabel: "Pink Room", model: "Counter C2", status: "online", firmware: "3.2.1", lastSeen: ago(1), installDate: "2024-11-01" },
  // venue-009 Freight Island (pending)
  { id: "mach-015", venueId: "venue-009", locationLabel: "TBD", model: "Tower S1", status: "offline", firmware: "—", lastSeen: ago(999), installDate: "—" },
  // venue-010 Elnecot (pending)
  { id: "mach-016", venueId: "venue-010", locationLabel: "TBD", model: "Counter C2", status: "offline", firmware: "—", lastSeen: ago(999), installDate: "—" },
  // venue-011 Atlas Bar (paused)
  { id: "mach-017", venueId: "venue-011", locationLabel: "Main Bar", model: "Slim S3", status: "offline", firmware: "3.1.5", lastSeen: ago(480), installDate: "2024-05-01" },
  // venue-012 Marriott Salford
  { id: "mach-018", venueId: "venue-012", locationLabel: "Bar & Grill", model: "Tower S1", status: "online", firmware: "3.2.1", lastSeen: ago(2), installDate: "2025-01-20" },
  { id: "mach-019", venueId: "venue-012", locationLabel: "Pool Area", model: "Counter C2", status: "fault", firmware: "3.2.0", lastSeen: ago(18), installDate: "2025-01-20" },
];

function ago(hours: number): Date {
  return new Date(Date.now() - hours * 3_600_000);
}

// ─── Inquiries ────────────────────────────────────────────────────────────────

const INQUIRIES_SEED: Inquiry[] = [
  {
    id: "inq-001",
    venueName: "Canvas Manchester",
    contactName: "Rhys Evans",
    contactEmail: "rhys@canvasmcr.co.uk",
    venueType: "cocktail-bar",
    city: "Manchester",
    message: "We're opening a new cocktail bar on Oxford Road in September. 300-seat venue, expecting 600+ covers on weekends. Would love to understand the revenue share model and installation timeline.",
    receivedAt: daysAgo(2),
    status: "new",
    assignedTo: null,
    notes: [],
  },
  {
    id: "inq-002",
    venueName: "Dakota Hotel Manchester",
    contactName: "Claire Booth",
    contactEmail: "cbooth@dakotahotels.co.uk",
    venueType: "hotel",
    city: "Manchester",
    message: "Interested in placing a unit in our lobby and bar area. We have two sites in Manchester city centre. Can you provide a proposal with projected revenue figures?",
    receivedAt: daysAgo(4),
    status: "contacted",
    assignedTo: "Miko R.",
    notes: ["Sent intro email + brochure on 22 Jun. Awaiting reply."],
  },
  {
    id: "inq-003",
    venueName: "Hawksmoor Manchester",
    contactName: "Ben Williams",
    contactEmail: "ben@hawksmoor.com",
    venueType: "restaurant",
    city: "Manchester",
    message: "We run a premium steakhouse with a strong cocktail programme. Looking for fragrance experiences that match our brand. What customisation is available?",
    receivedAt: daysAgo(8),
    status: "qualified",
    assignedTo: "Jordan A.",
    notes: ["Brand fit confirmed on call 18 Jun.", "Proposing Tower S1 for the bar area, Counter C2 for private dining."],
  },
  {
    id: "inq-004",
    venueName: "NQ64",
    contactName: "Sam Porter",
    contactEmail: "sam@nq64.co.uk",
    venueType: "arcade-bar",
    city: "Manchester",
    message: "Retro arcade bar, late license, busy Thu–Sun. We already have some experience retail in the venue and think fragrance vending could be a great add-on. Happy to discuss.",
    receivedAt: daysAgo(12),
    status: "qualified",
    assignedTo: "Priya S.",
    notes: ["Site survey booked for 28 Jun.", "Three machines likely across two floors."],
  },
  {
    id: "inq-005",
    venueName: "Rosylee Tearoom",
    contactName: "Amy Grant",
    contactEmail: "amy@rosylee.co.uk",
    venueType: "cafe",
    city: "Manchester",
    message: "I run a tearoom in the Northern Quarter. Small space but very busy on weekends. Would a Counter unit be suitable?",
    receivedAt: daysAgo(15),
    status: "won",
    assignedTo: "Miko R.",
    notes: ["Contract signed 10 Jun. Install scheduled for 1 Jul.", "Counter C2 confirmed. Commission 20%."],
  },
  {
    id: "inq-006",
    venueName: "Pitcher & Piano Deansgate",
    contactName: "Craig Hall",
    contactEmail: "craig.hall@nicholsonsgroup.co.uk",
    venueType: "pub-bar",
    city: "Manchester",
    message: "Looking to trial fragrance vending across two of our Manchester sites. Can you do a multi-site proposal?",
    receivedAt: daysAgo(20),
    status: "lost",
    assignedTo: "Jordan A.",
    notes: ["Called 5 Jun — venue footfall too low to justify install.", "Will revisit if they open new sites."],
  },
  {
    id: "inq-007",
    venueName: "Evelyn's Bar",
    contactName: "Fatima Hassan",
    contactEmail: "fatima@evelyns-bar.co.uk",
    venueType: "cocktail-bar",
    city: "Leeds",
    message: "Based in Leeds city centre. Not sure if you operate outside Manchester but wanted to reach out — we have a beautiful Victorian bar with 200 covers.",
    receivedAt: daysAgo(1),
    status: "new",
    assignedTo: null,
    notes: [],
  },
  {
    id: "inq-008",
    venueName: "Salford Art Gallery & Café",
    contactName: "David Owens",
    contactEmail: "david.owens@salfordcc.gov.uk",
    venueType: "gallery-cafe",
    city: "Salford",
    message: "We're a publicly funded gallery with a busy café. We'd like to offer something premium for evening events. What's the minimum footfall requirement?",
    receivedAt: daysAgo(3),
    status: "new",
    assignedTo: null,
    notes: [],
  },
];

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 86_400_000);
}

// ─── Maintenance tickets ──────────────────────────────────────────────────────

const MAINTENANCE_SEED: MaintenanceTicket[] = [
  {
    id: "tick-001",
    machineId: "mach-005",
    venueId: "venue-003",
    type: "fault",
    priority: "high",
    status: "open",
    openedAt: daysAgo(2),
    scheduledFor: null,
    completedAt: null,
    notes: "Payment module not responding. Reported by venue staff. Machine restarted remotely — fault persists.",
    assignee: "Jordan A.",
  },
  {
    id: "tick-002",
    machineId: "mach-010",
    venueId: "venue-006",
    type: "fault",
    priority: "urgent",
    status: "scheduled",
    openedAt: daysAgo(4),
    scheduledFor: new Date(Date.now() + 86_400_000),
    completedAt: null,
    notes: "Machine offline for 3+ days. Connectivity issue suspected (venue changed their WiFi). Engineer visit booked.",
    assignee: "Priya S.",
  },
  {
    id: "tick-003",
    machineId: "mach-019",
    venueId: "venue-012",
    type: "fault",
    priority: "high",
    status: "open",
    openedAt: daysAgo(1),
    scheduledFor: null,
    completedAt: null,
    notes: "Slot 3 dispense arm stuck. Remote diagnostics inconclusive.",
    assignee: "Jordan A.",
  },
  {
    id: "tick-004",
    machineId: "mach-002",
    venueId: "venue-001",
    type: "restock",
    priority: "medium",
    status: "scheduled",
    openedAt: daysAgo(1),
    scheduledFor: new Date(Date.now() + 2 * 86_400_000),
    completedAt: null,
    notes: "Slots 2 and 4 below threshold. Scheduled for combined restock visit.",
    assignee: "Miko R.",
  },
  {
    id: "tick-005",
    machineId: "mach-007",
    venueId: "venue-004",
    type: "restock",
    priority: "medium",
    status: "open",
    openedAt: daysAgo(0),
    scheduledFor: null,
    completedAt: null,
    notes: "Slot 1 empty (Maison Margiela Replica). Venue requested same-week visit.",
    assignee: "",
  },
  {
    id: "tick-006",
    machineId: "mach-015",
    venueId: "venue-009",
    type: "install",
    priority: "medium",
    status: "scheduled",
    openedAt: daysAgo(30),
    scheduledFor: new Date("2026-08-01"),
    completedAt: null,
    notes: "Freight Island install. Venue fit-out ongoing. Machine to be shipped week of 28 Jul.",
    assignee: "Priya S.",
  },
  {
    id: "tick-007",
    machineId: "mach-016",
    venueId: "venue-010",
    type: "install",
    priority: "low",
    status: "scheduled",
    openedAt: daysAgo(25),
    scheduledFor: new Date("2026-07-15"),
    completedAt: null,
    notes: "Elnecot install. Confirmed Counter C2, alcove position near bar.",
    assignee: "Miko R.",
  },
  {
    id: "tick-008",
    machineId: "mach-003",
    venueId: "venue-002",
    type: "service",
    priority: "low",
    status: "done",
    openedAt: daysAgo(20),
    scheduledFor: daysAgo(12),
    completedAt: daysAgo(12),
    notes: "6-month service. Firmware updated to 3.1.8. All OK.",
    assignee: "Jordan A.",
  },
  {
    id: "tick-009",
    machineId: "mach-011",
    venueId: "venue-007",
    type: "service",
    priority: "low",
    status: "done",
    openedAt: daysAgo(18),
    scheduledFor: daysAgo(10),
    completedAt: daysAgo(10),
    notes: "Routine service + fragrance refresh. Gotham team very happy.",
    assignee: "Miko R.",
  },
  {
    id: "tick-010",
    machineId: "mach-013",
    venueId: "venue-008",
    type: "restock",
    priority: "low",
    status: "done",
    openedAt: daysAgo(8),
    scheduledFor: daysAgo(5),
    completedAt: daysAgo(5),
    notes: "Full restock. Added two new premium fragrances per venue request.",
    assignee: "Priya S.",
  },
];

// ─── Sales generation ─────────────────────────────────────────────────────────

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

const VENUE_TYPE_CONFIG: Record<string, { weekdayBase: number; weekendMult: number; premiumFrac: number; closedDays?: number[] }> = {
  "nightclub":      { weekdayBase: 2,  weekendMult: 25, premiumFrac: 0.3,  closedDays: [0, 1, 2] },
  "hotel":          { weekdayBase: 12, weekendMult: 1.4, premiumFrac: 0.6 },
  "cocktail-bar":   { weekdayBase: 6,  weekendMult: 3,   premiumFrac: 0.4 },
  "bar-restaurant": { weekdayBase: 5,  weekendMult: 2.5, premiumFrac: 0.4 },
  "restaurant":     { weekdayBase: 4,  weekendMult: 2,   premiumFrac: 0.5 },
  "food-hall":      { weekdayBase: 8,  weekendMult: 2,   premiumFrac: 0.3 },
  "arcade-bar":     { weekdayBase: 4,  weekendMult: 4,   premiumFrac: 0.3 },
};

function getTypeConfig(type: string) {
  return VENUE_TYPE_CONFIG[type] ?? { weekdayBase: 5, weekendMult: 2, premiumFrac: 0.4 };
}

function generateVenueSales(venue: Venue, daysBack = 90): AdminSale[] {
  if (venue.status !== "live") return [];
  const machines = MACHINES.filter((m) => venue.machineIds.includes(m.id) && m.status !== "offline");
  if (machines.length === 0) return [];

  const rng = seededRandom(venue.id.charCodeAt(venue.id.length - 1) * 31337 + 42);
  const cfg = getTypeConfig(venue.type);
  const sales: AdminSale[] = [];
  const now = Date.now();
  let idCounter = 1;

  for (let day = daysBack; day >= 0; day--) {
    const dayTs = now - day * 86_400_000;
    const d = new Date(dayTs);
    const dow = d.getDay(); // 0=Sun, 6=Sat

    if (cfg.closedDays?.includes(dow)) continue;

    const isWeekend = dow === 0 || dow === 5 || dow === 6;
    const mult = isWeekend ? cfg.weekendMult : 1;
    const vendsPerMachine = Math.max(0, Math.round((cfg.weekdayBase * mult) * (0.7 + rng() * 0.6)));

    for (const machine of machines) {
      const fragsForMachine = ALL_FRAGRANCES.slice(
        (parseInt(machine.id.replace("mach-", ""), 10) - 1) % (ALL_FRAGRANCES.length - 4),
        ((parseInt(machine.id.replace("mach-", ""), 10) - 1) % (ALL_FRAGRANCES.length - 4)) + 5,
      );
      const frags = fragsForMachine.length ? fragsForMachine : ALL_FRAGRANCES.slice(0, 5);

      for (let i = 0; i < vendsPerMachine; i++) {
        const offsetMs = Math.floor(rng() * 64_800_000) + 21_600_000; // 6am–6am next
        const isPremium = rng() < cfg.premiumFrac;
        sales.push({
          id: `sale-${venue.id}-${idCounter++}`,
          timestamp: new Date(dayTs + offsetMs),
          fragrance: pick(frags, rng),
          machineId: machine.id,
          venueId: venue.id,
          venueName: venue.name,
          amountGbp: isPremium ? 3 : 2,
          paymentType: pick(PAYMENT_TYPES, rng),
        });
      }
    }
  }

  return sales.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

// ─── Stock generation ─────────────────────────────────────────────────────────

function generateStock(venue: Venue): AdminStockItem[] {
  const machines = MACHINES.filter((m) => venue.machineIds.includes(m.id));
  const rng = seededRandom(venue.id.charCodeAt(venue.id.length - 1) * 99991 + 7);
  const items: AdminStockItem[] = [];

  for (const machine of machines) {
    const idx = parseInt(machine.id.replace("mach-", ""), 10) - 1;
    const frags = ALL_FRAGRANCES.slice(idx % (ALL_FRAGRANCES.length - 4), (idx % (ALL_FRAGRANCES.length - 4)) + 5);
    const fragList = frags.length >= 5 ? frags : ALL_FRAGRANCES.slice(0, 5);

    for (let slot = 1; slot <= 5; slot++) {
      const capacity = 20;
      const quantity = Math.floor(rng() * capacity);
      items.push({
        machineId: machine.id,
        venueId: venue.id,
        venueName: venue.name,
        slot,
        fragrance: fragList[slot - 1],
        quantity,
        capacity,
        lowStockThreshold: 4,
      });
    }
  }

  return items;
}

// ─── MockAdminDataSource ──────────────────────────────────────────────────────

export class MockAdminDataSource implements AdminDataSource {
  private salesCache = new Map<string, AdminSale[]>();
  // Mutable in-memory state for write operations
  private inquiries: Inquiry[] = INQUIRIES_SEED.map((i) => ({ ...i, notes: [...i.notes] }));
  private tickets: MaintenanceTicket[] = MAINTENANCE_SEED.map((t) => ({ ...t }));

  private getVenueSales(venueId: string): AdminSale[] {
    if (!this.salesCache.has(venueId)) {
      const venue = VENUES.find((v) => v.id === venueId);
      this.salesCache.set(venueId, venue ? generateVenueSales(venue) : []);
    }
    return this.salesCache.get(venueId)!;
  }

  private getAllSales(): AdminSale[] {
    for (const v of VENUES) this.getVenueSales(v.id); // prime cache
    return Array.from(this.salesCache.values()).flat();
  }

  async getVenues(): Promise<Venue[]> {
    return [...VENUES];
  }

  async getVenueById(id: string): Promise<Venue | null> {
    return VENUES.find((v) => v.id === id) ?? null;
  }

  async getAllMachines(): Promise<AdminMachine[]> {
    return [...MACHINES];
  }

  async getMachinesByVenue(venueId: string): Promise<AdminMachine[]> {
    return MACHINES.filter((m) => m.venueId === venueId);
  }

  async getEstateKpis(dateRange: DateRange): Promise<EstateKpis> {
    const sales = this.getAllSales().filter(
      (s) => s.timestamp >= dateRange.from && s.timestamp <= dateRange.to
    );
    const activeMachines = MACHINES.filter((m) => {
      const v = VENUES.find((v) => v.id === m.venueId);
      return v?.status === "live" && m.status === "online";
    }).length;
    return {
      totalRevenueGbp: +sales.reduce((s, x) => s + x.amountGbp, 0).toFixed(2),
      unitsSold: sales.length,
      activeMachines,
      machinesWithFaults: MACHINES.filter((m) => m.status === "fault").length,
      openMaintenanceTickets: this.tickets.filter((t) => t.status === "open").length,
      newInquiries: this.inquiries.filter((i) => i.status === "new").length,
    };
  }

  async getEstateSalesTimeSeries(dateRange: DateRange): Promise<SalesTimeSeries[]> {
    const sales = this.getAllSales().filter(
      (s) => s.timestamp >= dateRange.from && s.timestamp <= dateRange.to
    );
    const byDay = new Map<string, { rev: number; units: number }>();
    const cur = new Date(dateRange.from);
    cur.setHours(0, 0, 0, 0);
    const end = new Date(dateRange.to);
    end.setHours(23, 59, 59, 999);
    while (cur <= end) {
      byDay.set(cur.toISOString().slice(0, 10), { rev: 0, units: 0 });
      cur.setDate(cur.getDate() + 1);
    }
    for (const s of sales) {
      const key = s.timestamp.toISOString().slice(0, 10);
      const e = byDay.get(key);
      if (e) { e.rev += s.amountGbp; e.units += 1; }
    }
    return Array.from(byDay.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, { rev, units }]) => ({ date, revenueGbp: +rev.toFixed(2), units }));
  }

  async getTopVenuesByRevenue(dateRange: DateRange, limit = 5): Promise<VenueRevenueSummary[]> {
    const map = new Map<string, { rev: number; units: number }>();
    const sales = this.getAllSales().filter(
      (s) => s.timestamp >= dateRange.from && s.timestamp <= dateRange.to
    );
    for (const s of sales) {
      const e = map.get(s.venueId) ?? { rev: 0, units: 0 };
      e.rev += s.amountGbp;
      e.units += 1;
      map.set(s.venueId, e);
    }
    return VENUES
      .map((v) => ({ venueId: v.id, venueName: v.name, area: v.area, type: v.type, revenueGbp: +(map.get(v.id)?.rev ?? 0).toFixed(2), unitsSold: map.get(v.id)?.units ?? 0 }))
      .sort((a, b) => b.revenueGbp - a.revenueGbp)
      .slice(0, limit);
  }

  async getTopFragrancesEstate(dateRange: DateRange, limit = 5) {
    const sales = this.getAllSales().filter(
      (s) => s.timestamp >= dateRange.from && s.timestamp <= dateRange.to
    );
    const map = new Map<string, { units: number; rev: number }>();
    for (const s of sales) {
      const e = map.get(s.fragrance) ?? { units: 0, rev: 0 };
      e.units += 1; e.rev += s.amountGbp;
      map.set(s.fragrance, e);
    }
    return Array.from(map.entries())
      .map(([fragrance, { units, rev }]) => ({ fragrance, units, revenueGbp: +rev.toFixed(2) }))
      .sort((a, b) => b.units - a.units)
      .slice(0, limit);
  }

  async getAttentionItems(): Promise<AttentionItems> {
    const allStock = await this.getEstateStock();
    const overdueHours = 48;
    return {
      offlineMachines: MACHINES.filter((m) => m.status === "offline" && VENUES.find((v) => v.id === m.venueId)?.status === "live"),
      faultMachines: MACHINES.filter((m) => m.status === "fault"),
      lowStockAlerts: allStock.filter((s) => s.quantity <= s.lowStockThreshold),
      overdueTickets: this.tickets.filter(
        (t) => t.status === "open" && Date.now() - t.openedAt.getTime() > overdueHours * 3_600_000
      ),
      newInquiries: this.inquiries.filter((i) => i.status === "new"),
    };
  }

  async getEstateSales(query: EstateSalesQuery): Promise<AdminSale[]> {
    return this.getAllSales().filter((s) => {
      if (s.timestamp < query.dateRange.from || s.timestamp > query.dateRange.to) return false;
      if (query.venueId && s.venueId !== query.venueId) return false;
      if (query.machineId && s.machineId !== query.machineId) return false;
      if (query.fragrance && s.fragrance !== query.fragrance) return false;
      if (query.paymentType && s.paymentType !== query.paymentType) return false;
      return true;
    });
  }

  async getInquiries(filter?: InquiryFilter): Promise<Inquiry[]> {
    return this.inquiries.filter((i) => {
      if (filter?.status && i.status !== filter.status) return false;
      if (filter?.assignedTo && i.assignedTo !== filter.assignedTo) return false;
      return true;
    });
  }

  // REAL API LATER: PATCH /inquiries/:id { status, note }
  async updateInquiryStatus(id: string, status: InquiryStatus, note?: string): Promise<void> {
    const inq = this.inquiries.find((i) => i.id === id);
    if (inq) {
      inq.status = status;
      if (note) inq.notes.push(note);
    }
  }

  async getMaintenanceTickets(filter?: MaintenanceFilter): Promise<MaintenanceTicket[]> {
    return this.tickets.filter((t) => {
      if (filter?.status && t.status !== filter.status) return false;
      if (filter?.priority && t.priority !== filter.priority) return false;
      if (filter?.type && t.type !== filter.type) return false;
      if (filter?.venueId && t.venueId !== filter.venueId) return false;
      if (filter?.assignee && t.assignee !== filter.assignee) return false;
      return true;
    });
  }

  // REAL API LATER: PATCH /maintenance/:id { status }
  async updateTicketStatus(id: string, status: TicketStatus): Promise<void> {
    const t = this.tickets.find((t) => t.id === id);
    if (t) {
      t.status = status;
      if (status === "done") t.completedAt = new Date();
    }
  }

  async getEstateStock(): Promise<AdminStockItem[]> {
    return VENUES.flatMap((v) => generateStock(v));
  }
}
