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
  PayoutRecord,
  NetProfitSummary,
  ProfitTimeSeries,
  RestockItem,
  FragranceAnalytic,
  PartnerContract,
  ContractStatus,
  PartnerNote,
  InventoryItem,
  PurchaseOrder,
  PurchaseOrderStatus,
  ReconciliationSummary,
  ReconciliationLine,
  MachineRoi,
  ConsoleDocument,
  DocumentType,
  AuditEntry,
  SaleAnomaly,
  LeagueTableRow,
  VenueInput,
  MachineInput,
  TicketInput,
  InquiryInput,
  StockItemInput,
} from "./types";
import {
  WHOLESALE_COST_PER_SALE_GBP,
  SERVICING_COST_PER_MACHINE_MONTH_GBP,
  SLOW_MOVER_THRESHOLD_UNITS_PER_30D,
  MACHINE_PURCHASE_COST_GBP,
  MACHINE_INSTALL_COST_GBP,
  EXPECTED_PAYBACK_MONTHS,
  CONTRACT_EXPIRY_WARNING_DAYS,
  DEFAULT_REORDER_THRESHOLD,
  DEFAULT_REORDER_QTY,
  DEFAULT_SUPPLIER,
  PROCESSOR_FEE_RATE,
  RECONCILIATION_DISCREPANCY_THRESHOLD_GBP,
  ANOMALY_LOW_FRACTION,
  ANOMALY_MIN_BASELINE,
} from "./costs";
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

// ─── Partner contracts seed ───────────────────────────────────────────────────

function contractEndDate(startDate: string, model: string): string {
  const d = new Date(startDate);
  d.setFullYear(d.getFullYear() + (model === "revenue-share" ? 2 : 1));
  return d.toISOString().slice(0, 10);
}

function contractStatus(endDate: string, startDate: string): ContractStatus {
  const now = Date.now();
  const end = new Date(endDate).getTime();
  const start = new Date(startDate).getTime();
  if (start > now) return "pending";
  if (end < now) return "lapsed";
  if (end - now < CONTRACT_EXPIRY_WARNING_DAYS * 86_400_000) return "expiring-soon";
  return "active";
}

const CONTRACT_KEY_TERMS: Record<string, string> = {
  "revenue-share": "20% partner commission. 30-day payment terms. Éclat owns and maintains the machine. Either party may terminate with 30 days written notice.",
  "lease":         "Fixed monthly lease fee. Venue is responsible for basic care. Éclat provides one annual service visit. 12-month minimum term.",
  "purchase":      "Outright machine purchase. Éclat provides 12-month warranty and optional extended service contract. No ongoing revenue share.",
};

// ─── Inventory seed ───────────────────────────────────────────────────────────

function buildInventorySeed(fragrances: string[]): InventoryItem[] {
  return fragrances.slice(0, 12).map((f, i) => {
    const rng = seededRandom(i * 77777 + 13);
    const currentStock = Math.floor(rng() * 60);
    const needsReorder = currentStock <= DEFAULT_REORDER_THRESHOLD;
    const isPremium = i % 3 === 0;
    return {
      fragrance: f,
      tier: isPremium ? "premium" : "standard",
      currentStock,
      reorderThreshold: DEFAULT_REORDER_THRESHOLD,
      reorderQty: DEFAULT_REORDER_QTY,
      supplierName: DEFAULT_SUPPLIER,
      costPerUnit: WHOLESALE_COST_PER_SALE_GBP,
      needsReorder,
    };
  });
}

// ─── Documents seed ───────────────────────────────────────────────────────────

const DOCUMENTS_SEED: ConsoleDocument[] = [
  { id: "doc-001", name: "The Alchemist — Revenue Share Agreement 2024", type: "contract", venueId: "venue-001", url: "#placeholder", uploadedAt: "2024-03-10T10:00:00Z", uploadedBy: "Miko R.", notes: "Signed copy. Original filed with legal." },
  { id: "doc-002", name: "Tower S1 — Warranty Certificate (mach-001)", type: "warranty", machineId: "mach-001", venueId: "venue-001", url: "#placeholder", uploadedAt: "2024-03-15T14:30:00Z", uploadedBy: "Miko R." },
  { id: "doc-003", name: "King Street Townhouse — Revenue Share Agreement 2024", type: "contract", venueId: "venue-002", url: "#placeholder", uploadedAt: "2024-04-01T09:00:00Z", uploadedBy: "Jordan A." },
  { id: "doc-004", name: "Warehouse Project — Lease Agreement 2024", type: "contract", venueId: "venue-003", url: "#placeholder", uploadedAt: "2024-06-01T11:00:00Z", uploadedBy: "Priya S." },
  { id: "doc-005", name: "Éclat Public Liability Insurance 2025–2026", type: "insurance", url: "#placeholder", uploadedAt: "2025-01-05T09:00:00Z", uploadedBy: "Miko R.", notes: "Renews Jan 2027." },
  { id: "doc-006", name: "Éclat Wholesale Ltd — Supplier Agreement", type: "supplier", url: "#placeholder", uploadedAt: "2024-02-20T10:00:00Z", uploadedBy: "Miko R.", notes: "30-day payment terms. Min order 24 units." },
  { id: "doc-007", name: "Gotham Hotel — Revenue Share Agreement 2024", type: "contract", venueId: "venue-007", url: "#placeholder", uploadedAt: "2024-10-05T09:30:00Z", uploadedBy: "Jordan A." },
  { id: "doc-008", name: "Marriott Salford — Revenue Share Agreement 2025", type: "contract", venueId: "venue-012", url: "#placeholder", uploadedAt: "2025-01-18T11:00:00Z", uploadedBy: "Priya S." },
];

// ─── Anomaly seed ─────────────────────────────────────────────────────────────
// A handful of seeded anomalies representing real scenarios.
// getSaleAnomalies merges these with any algorithmically detected ones.

function buildAnomalySeed(): SaleAnomaly[] {
  const now = Date.now();
  return [
    {
      machineId: "mach-009",
      venueId: "venue-005",
      venueName: "Schofield's Bar",
      locationLabel: "Back Bar",
      date: new Date(now - 3 * 86_400_000).toISOString().slice(0, 10),
      expectedUnits: 18,
      actualUnits: 0,
      severity: "critical",
      note: "Zero sales on Friday night — machine may be empty or experiencing a fault.",
    },
    {
      machineId: "mach-008",
      venueId: "venue-004",
      venueName: "Menagerie",
      locationLabel: "Private Dining",
      date: new Date(now - 2 * 86_400_000).toISOString().slice(0, 10),
      expectedUnits: 12,
      actualUnits: 2,
      severity: "warning",
      note: "Sales significantly below Sunday baseline — possible slow footfall or display issue.",
    },
    {
      machineId: "mach-011",
      venueId: "venue-007",
      venueName: "Gotham Hotel",
      locationLabel: "Cocktail Bar",
      date: new Date(now - 1 * 86_400_000).toISOString().slice(0, 10),
      expectedUnits: 10,
      actualUnits: 1,
      severity: "warning",
      note: "Near-zero sales on a Sunday — venue may have had a private event limiting bar access.",
    },
  ];
}

// ─── MockAdminDataSource ──────────────────────────────────────────────────────

export class MockAdminDataSource implements AdminDataSource {
  private salesCache = new Map<string, AdminSale[]>();
  // Mutable in-memory state for write operations
  private inquiries: Inquiry[] = INQUIRIES_SEED.map((i) => ({ ...i, notes: [...i.notes] }));
  private tickets: MaintenanceTicket[] = MAINTENANCE_SEED.map((t) => ({ ...t }));
  private payoutStates = new Map<string, { paidDate: string; paidReference: string }>();
  private restockedVenueIds = new Set<string>();
  // Phase 2 mutable state
  private partnerNotes = new Map<string, PartnerNote[]>();
  private purchaseOrders: PurchaseOrder[] = [];
  private poCounter = 1;
  private documents: ConsoleDocument[] = DOCUMENTS_SEED.map((d) => ({ ...d }));
  private auditLog: AuditEntry[] = [];
  private auditCounter = 1;
  private inventoryItems: InventoryItem[] = []; // lazy-initialised

  private getVenueSales(venueId: string): AdminSale[] {
    if (!this.salesCache.has(venueId)) {
      const venue = VENUES.find((v) => v.id === venueId);
      this.salesCache.set(venueId, venue ? generateVenueSales(venue) : []);
    }
    return this.salesCache.get(venueId)!;
  }

  // Mutable venue + machine state (seeded from constants; supports CRUD)
  private venues: Venue[] = VENUES.map((v) => ({ ...v }));
  private machines: AdminMachine[] = MACHINES.map((m) => ({ ...m }));
  private venueCounter = VENUES.length + 1;
  private machineCounter = MACHINES.length + 1;
  private stockItems: AdminStockItem[] = []; // lazy-seeded from MACHINES
  private stockSeeded = false;

  private activeVenues() { return this.venues.filter((v) => !v.archived); }
  private activeMachines() { return this.machines.filter((m) => !m.archived); }

  private getAllSales(): AdminSale[] {
    for (const v of this.venues) this.getVenueSales(v.id); // prime cache
    return Array.from(this.salesCache.values()).flat();
  }

  private getStockSeeded(): AdminStockItem[] {
    if (!this.stockSeeded) {
      this.stockSeeded = true;
      // Seed from machine data
      const ALL_FRAGS = ALL_FRAGRANCES.slice(0, 6);
      for (const m of MACHINES) {
        for (let slot = 1; slot <= ALL_FRAGS.length; slot++) {
          const rng = seededRandom(m.id.charCodeAt(m.id.length - 1) * slot * 99991);
          this.stockItems.push({
            machineId: m.id,
            venueId: m.venueId,
            venueName: VENUES.find((v) => v.id === m.venueId)?.name ?? m.venueId,
            slot,
            fragrance: ALL_FRAGS[slot - 1],
            quantity: this.restockedVenueIds.has(m.venueId) ? 24 : Math.floor(rng() * 24),
            capacity: 24,
            lowStockThreshold: 6,
          });
        }
      }
    }
    return this.stockItems;
  }

  async getVenues(opts?: { includeArchived?: boolean }): Promise<Venue[]> {
    return opts?.includeArchived ? [...this.venues] : this.activeVenues().map((v) => ({ ...v }));
  }

  async getVenueById(id: string): Promise<Venue | null> {
    return this.venues.find((v) => v.id === id) ?? null;
  }

  // REAL API LATER: POST /venues
  async createVenue(input: VenueInput): Promise<Venue> {
    const id = `venue-${String(this.venueCounter++).padStart(3, "0")}`;
    const venue: Venue = { ...input, id, machineIds: [] };
    this.venues.push(venue);
    await this.appendAuditEntry("owner", "created_venue", "venue", id, input.name, `Created venue ${input.name} (${input.type})`);
    return { ...venue };
  }

  // REAL API LATER: PATCH /venues/:id
  async updateVenue(id: string, input: Partial<VenueInput>): Promise<Venue> {
    const idx = this.venues.findIndex((v) => v.id === id);
    if (idx === -1) throw new Error(`Venue ${id} not found`);
    this.venues[idx] = { ...this.venues[idx], ...input };
    await this.appendAuditEntry("owner", "updated_venue", "venue", id, this.venues[idx].name, `Updated venue fields: ${Object.keys(input).join(", ")}`);
    return { ...this.venues[idx] };
  }

  // REAL API LATER: PATCH /venues/:id/archive — cascades to machines
  async archiveVenue(id: string): Promise<void> {
    const venue = this.venues.find((v) => v.id === id);
    if (!venue) return;
    venue.archived = true;
    // Cascade: archive all machines for this venue
    this.machines.forEach((m) => { if (m.venueId === id) m.archived = true; });
    await this.appendAuditEntry("owner", "archived_venue", "venue", id, venue.name, "Venue archived (machines cascaded)");
  }

  // REAL API LATER: PATCH /venues/:id/restore
  async restoreVenue(id: string): Promise<void> {
    const venue = this.venues.find((v) => v.id === id);
    if (!venue) return;
    venue.archived = false;
    // NOTE: machines are NOT auto-restored — restore individually if needed
    await this.appendAuditEntry("owner", "restored_venue", "venue", id, venue.name, "Venue restored (machines remain individually archived)");
  }

  async getAllMachines(opts?: { includeArchived?: boolean }): Promise<AdminMachine[]> {
    return opts?.includeArchived ? [...this.machines] : this.activeMachines().map((m) => ({ ...m }));
  }

  async getMachinesByVenue(venueId: string, opts?: { includeArchived?: boolean }): Promise<AdminMachine[]> {
    return this.machines.filter((m) => m.venueId === venueId && (opts?.includeArchived || !m.archived));
  }

  // REAL API LATER: POST /machines
  async createMachine(input: MachineInput): Promise<AdminMachine> {
    const venue = this.venues.find((v) => v.id === input.venueId);
    if (!venue) throw new Error(`Venue ${input.venueId} not found`);
    const id = `mach-${String(this.machineCounter++).padStart(3, "0")}`;
    const machine: AdminMachine = {
      id,
      venueId: input.venueId,
      locationLabel: input.locationLabel,
      model: input.model,
      status: input.status ?? "offline",
      firmware: "1.0.0",
      lastSeen: new Date(),
      installDate: input.installDate,
    };
    this.machines.push(machine);
    venue.machineIds = [...venue.machineIds, id];
    await this.appendAuditEntry("owner", "created_machine", "machine", id, `${venue.name} — ${input.locationLabel}`, `Model: ${input.model}`);
    return { ...machine };
  }

  // REAL API LATER: PATCH /machines/:id
  async updateMachine(id: string, input: Partial<Omit<MachineInput, "venueId">>): Promise<AdminMachine> {
    const idx = this.machines.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error(`Machine ${id} not found`);
    this.machines[idx] = { ...this.machines[idx], ...input };
    await this.appendAuditEntry("owner", "updated_machine", "machine", id, id, `Updated: ${Object.keys(input).join(", ")}`);
    return { ...this.machines[idx] };
  }

  // REAL API LATER: PATCH /machines/:id/archive
  async archiveMachine(id: string): Promise<void> {
    const machine = this.machines.find((m) => m.id === id);
    if (!machine) return;
    machine.archived = true;
    const venue = this.venues.find((v) => v.id === machine.venueId);
    await this.appendAuditEntry("owner", "archived_machine", "machine", id, `${venue?.name ?? machine.venueId} — ${machine.locationLabel}`, "Machine archived");
  }

  // REAL API LATER: PATCH /machines/:id/restore
  async restoreMachine(id: string): Promise<void> {
    const machine = this.machines.find((m) => m.id === id);
    if (!machine) return;
    machine.archived = false;
    const venue = this.venues.find((v) => v.id === machine.venueId);
    await this.appendAuditEntry("owner", "restored_machine", "machine", id, `${venue?.name ?? machine.venueId} — ${machine.locationLabel}`, "Machine restored");
  }

  async getEstateKpis(dateRange: DateRange): Promise<EstateKpis> {
    const sales = this.getAllSales().filter(
      (s) => s.timestamp >= dateRange.from && s.timestamp <= dateRange.to && !s.archived
    );
    const activeMachines = this.activeMachines().filter((m) => {
      const v = this.activeVenues().find((v) => v.id === m.venueId);
      return v?.status === "live" && m.status === "online";
    }).length;
    return {
      totalRevenueGbp: +sales.reduce((s, x) => s + x.amountGbp, 0).toFixed(2),
      unitsSold: sales.length,
      activeMachines,
      machinesWithFaults: this.activeMachines().filter((m) => m.status === "fault").length,
      openMaintenanceTickets: this.tickets.filter((t) => t.status === "open" && !t.archived).length,
      newInquiries: this.inquiries.filter((i) => i.status === "new" && !i.archived).length,
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
    return this.activeVenues()
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
    const activeMachs = this.activeMachines();
    const activeVens = this.activeVenues();
    return {
      offlineMachines: activeMachs.filter((m) => m.status === "offline" && activeVens.find((v) => v.id === m.venueId)?.status === "live"),
      faultMachines: activeMachs.filter((m) => m.status === "fault"),
      lowStockAlerts: allStock.filter((s) => s.quantity <= s.lowStockThreshold),
      overdueTickets: this.tickets.filter(
        (t) => !t.archived && t.status === "open" && Date.now() - t.openedAt.getTime() > overdueHours * 3_600_000
      ),
      newInquiries: this.inquiries.filter((i) => !i.archived && i.status === "new"),
    };
  }

  async getEstateSales(query: EstateSalesQuery): Promise<AdminSale[]> {
    return this.getAllSales().filter((s) => {
      if (s.archived) return false;
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
      if (i.archived) return false;
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

  // REAL API LATER: POST /inquiries
  async createInquiry(input: InquiryInput): Promise<Inquiry> {
    const id = `inq-${String(this.inquiries.length + 1).padStart(3, "0")}-${Date.now().toString(36)}`;
    const inquiry: Inquiry = {
      id,
      ...input,
      receivedAt: new Date(),
      status: "new",
      assignedTo: null,
      notes: [],
    };
    this.inquiries.push(inquiry);
    await this.appendAuditEntry("owner", "created_inquiry", "inquiry", id, input.venueName, `From ${input.contactName}`);
    return { ...inquiry };
  }

  // REAL API LATER: PATCH /inquiries/:id
  async updateInquiry(id: string, input: Partial<InquiryInput & { status: InquiryStatus; assignedTo: string | null; notes: string[] }>): Promise<Inquiry> {
    const idx = this.inquiries.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error(`Inquiry ${id} not found`);
    this.inquiries[idx] = { ...this.inquiries[idx], ...input };
    await this.appendAuditEntry("owner", "updated_inquiry", "inquiry", id, this.inquiries[idx].venueName, `Updated: ${Object.keys(input).join(", ")}`);
    return { ...this.inquiries[idx] };
  }

  // REAL API LATER: DELETE /inquiries/:id
  async deleteInquiry(id: string): Promise<void> {
    const idx = this.inquiries.findIndex((i) => i.id === id);
    if (idx === -1) return;
    const name = this.inquiries[idx].venueName;
    this.inquiries.splice(idx, 1);
    await this.appendAuditEntry("owner", "deleted_inquiry", "inquiry", id, name, "Inquiry deleted");
  }

  async getMaintenanceTickets(filter?: MaintenanceFilter): Promise<MaintenanceTicket[]> {
    return this.tickets.filter((t) => {
      if (t.archived) return false;
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

  // REAL API LATER: POST /maintenance
  async createMaintenanceTicket(input: TicketInput): Promise<MaintenanceTicket> {
    const id = `ticket-${String(this.tickets.length + 1).padStart(3, "0")}-${Date.now().toString(36)}`;
    const venue = this.venues.find((v) => v.id === input.venueId);
    const ticket: MaintenanceTicket = {
      id,
      machineId: input.machineId,
      venueId: input.venueId,
      type: input.type,
      priority: input.priority,
      status: "open",
      openedAt: new Date(),
      scheduledFor: input.scheduledFor ? new Date(input.scheduledFor) : null,
      completedAt: null,
      notes: input.notes,
      assignee: input.assignee,
    };
    this.tickets.push(ticket);
    await this.appendAuditEntry("owner", "created_ticket", "ticket", id, venue?.name ?? input.venueId, `${input.type} / ${input.priority}`);
    return { ...ticket };
  }

  // REAL API LATER: PATCH /maintenance/:id (full update)
  async updateMaintenanceTicket(id: string, input: Partial<TicketInput & { status: TicketStatus }>): Promise<MaintenanceTicket> {
    const idx = this.tickets.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error(`Ticket ${id} not found`);
    const t = this.tickets[idx];
    this.tickets[idx] = {
      ...t,
      ...input,
      scheduledFor: input.scheduledFor !== undefined ? (input.scheduledFor ? new Date(input.scheduledFor) : null) : t.scheduledFor,
      completedAt: input.status === "done" ? new Date() : t.completedAt,
    };
    await this.appendAuditEntry("owner", "updated_ticket", "ticket", id, id, `Updated: ${Object.keys(input).join(", ")}`);
    return { ...this.tickets[idx] };
  }

  // REAL API LATER: DELETE /maintenance/:id
  async deleteMaintenanceTicket(id: string): Promise<void> {
    const idx = this.tickets.findIndex((t) => t.id === id);
    if (idx === -1) return;
    this.tickets.splice(idx, 1);
    await this.appendAuditEntry("owner", "deleted_ticket", "ticket", id, id, "Ticket deleted");
  }

  async getEstateStock(): Promise<AdminStockItem[]> {
    const seeded = this.getStockSeeded();
    // Apply restock overrides
    return seeded.map((s) => this.restockedVenueIds.has(s.venueId) ? { ...s, quantity: s.capacity } : { ...s });
  }

  // REAL API LATER: PATCH /stock/:machineId/:slot
  async updateStockItem(machineId: string, slot: number, updates: Partial<StockItemInput>): Promise<void> {
    const item = this.getStockSeeded().find((s) => s.machineId === machineId && s.slot === slot);
    if (item) {
      if (updates.quantity !== undefined) item.quantity = Math.max(0, Math.min(updates.capacity ?? item.capacity, updates.quantity));
      if (updates.capacity !== undefined) item.capacity = updates.capacity;
      if (updates.fragrance !== undefined) item.fragrance = updates.fragrance;
      if (updates.lowStockThreshold !== undefined) item.lowStockThreshold = updates.lowStockThreshold;
      this.restockedVenueIds.delete(item.venueId);
    }
  }

  // REAL API LATER: POST /stock
  async createStockItem(input: StockItemInput): Promise<AdminStockItem> {
    const venue = this.venues.find((v) => v.id === input.venueId);
    const item: AdminStockItem = { ...input, venueName: venue?.name ?? input.venueId };
    this.getStockSeeded().push(item);
    await this.appendAuditEntry("owner", "created_stock_item", "venue", input.venueId, venue?.name ?? input.venueId, `Slot ${input.slot}: ${input.fragrance}`);
    return { ...item };
  }

  // REAL API LATER: DELETE /stock/:machineId/:slot
  async deleteStockItem(machineId: string, slot: number): Promise<void> {
    const stock = this.getStockSeeded();
    const idx = stock.findIndex((s) => s.machineId === machineId && s.slot === slot);
    if (idx !== -1) {
      const item = stock[idx];
      stock.splice(idx, 1);
      await this.appendAuditEntry("owner", "deleted_stock_item", "venue", item.venueId, item.venueName, `Slot ${slot}: ${item.fragrance}`);
    }
  }

  // REAL API LATER: DELETE /documents/:id
  async deleteDocument(id: string): Promise<void> {
    const idx = this.documents.findIndex((d) => d.id === id);
    if (idx === -1) return;
    const name = this.documents[idx].name;
    this.documents.splice(idx, 1);
    await this.appendAuditEntry("owner", "deleted_document", "document", id, name, "Document deleted");
  }

  // ── Payouts ─────────────────────────────────────────────────────────────────

  async getPayoutRecords(dateRange: DateRange): Promise<PayoutRecord[]> {
    const sales = this.getAllSales().filter(
      (s) => s.timestamp >= dateRange.from && s.timestamp <= dateRange.to
    );
    return this.activeVenues().map((v) => {
      const vSales = sales.filter((s) => s.venueId === v.id);
      const grossSales = vSales.reduce((sum, s) => sum + s.amountGbp, 0);

      if (v.partnershipModel !== "revenue-share") {
        return {
          venueId: v.id,
          venueName: v.name,
          area: v.area,
          contactName: v.contactName,
          contactEmail: v.contactEmail,
          partnershipModel: v.partnershipModel,
          commissionPct: 0,
          grossSalesGbp: +grossSales.toFixed(2),
          partnerShareGbp: 0,
          eclatShareGbp: +grossSales.toFixed(2),
          status: "na" as const,
        };
      }

      const partnerShare = grossSales * (v.commissionPct / 100);
      const eclatShare = grossSales - partnerShare;
      const state = this.payoutStates.get(v.id);

      return {
        venueId: v.id,
        venueName: v.name,
        area: v.area,
        contactName: v.contactName,
        contactEmail: v.contactEmail,
        partnershipModel: v.partnershipModel,
        commissionPct: v.commissionPct,
        grossSalesGbp: +grossSales.toFixed(2),
        partnerShareGbp: +partnerShare.toFixed(2),
        eclatShareGbp: +eclatShare.toFixed(2),
        status: state ? ("paid" as const) : grossSales > 0 ? ("due" as const) : ("na" as const),
        paidDate: state?.paidDate,
        paidReference: state?.paidReference,
      };
    });
  }

  // REAL API LATER: PATCH /payouts/:venueId { paidDate, reference }
  async markPayoutPaid(venueId: string, paidDate: string, reference: string): Promise<void> {
    this.payoutStates.set(venueId, { paidDate, paidReference: reference });
    const venue = this.venues.find((v) => v.id === venueId);
    await this.appendAuditEntry("owner", "marked_payout_paid", "payout", venueId, venue?.name ?? venueId, `Payout marked paid on ${paidDate}. Ref: ${reference}`);
  }

  // ── Profitability ────────────────────────────────────────────────────────────

  async getNetProfitability(dateRange: DateRange): Promise<NetProfitSummary[]> {
    const sales = this.getAllSales().filter(
      (s) => s.timestamp >= dateRange.from && s.timestamp <= dateRange.to
    );
    const days = Math.max(1, (dateRange.to.getTime() - dateRange.from.getTime()) / 86_400_000);

    const activeMachs = this.activeMachines();
    return this.activeVenues().filter((v) => {
      // Only include venues with at least one installed machine
      return activeMachs.some((m) => m.venueId === v.id && m.installDate !== "—");
    }).map((v) => {
      const vSales = sales.filter((s) => s.venueId === v.id);
      const grossRevenue = vSales.reduce((s, x) => s + x.amountGbp, 0);
      const units = vSales.length;
      const cogs = units * WHOLESALE_COST_PER_SALE_GBP;
      const commission =
        v.partnershipModel === "revenue-share"
          ? grossRevenue * (v.commissionPct / 100)
          : 0;
      const deployedMachines = activeMachs.filter(
        (m) => m.venueId === v.id && m.installDate !== "—"
      ).length;
      const servicing =
        deployedMachines * SERVICING_COST_PER_MACHINE_MONTH_GBP * (days / 30);
      const netProfit = grossRevenue - cogs - commission - servicing;
      const marginPct = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : -100;

      return {
        venueId: v.id,
        venueName: v.name,
        area: v.area,
        type: v.type,
        machineCount: deployedMachines,
        grossRevenueGbp: +grossRevenue.toFixed(2),
        cogsGbp: +cogs.toFixed(2),
        commissionGbp: +commission.toFixed(2),
        servicingGbp: +servicing.toFixed(2),
        netProfitGbp: +netProfit.toFixed(2),
        marginPct: +marginPct.toFixed(1),
      };
    });
  }

  async getEstateProfitTimeSeries(dateRange: DateRange): Promise<ProfitTimeSeries[]> {
    const allSales = this.getAllSales().filter(
      (s) => s.timestamp >= dateRange.from && s.timestamp <= dateRange.to
    );

    // Weighted avg commission rate across revenue-share venues
    const totalRev = allSales.reduce((s, x) => s + x.amountGbp, 0);
    const totalComm = allSales.reduce((s, x) => {
      const v = this.venues.find((v) => v.id === x.venueId);
      return s + (v?.partnershipModel === "revenue-share" ? x.amountGbp * (v.commissionPct / 100) : 0);
    }, 0);
    const avgCommRate = totalRev > 0 ? totalComm / totalRev : 0;

    const deployedMachines = this.activeMachines().filter(
      (m) => m.installDate !== "—" && this.activeVenues().find((v) => v.id === m.venueId)?.status !== "install-pending"
    ).length;
    const dailyServicing = (deployedMachines * SERVICING_COST_PER_MACHINE_MONTH_GBP) / 30;

    const byDay = new Map<string, { rev: number; units: number }>();
    const cur = new Date(dateRange.from);
    cur.setHours(0, 0, 0, 0);
    const end = new Date(dateRange.to);
    end.setHours(23, 59, 59, 999);
    while (cur <= end) {
      byDay.set(cur.toISOString().slice(0, 10), { rev: 0, units: 0 });
      cur.setDate(cur.getDate() + 1);
    }
    for (const s of allSales) {
      const key = s.timestamp.toISOString().slice(0, 10);
      const e = byDay.get(key);
      if (e) { e.rev += s.amountGbp; e.units += 1; }
    }

    return Array.from(byDay.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, { rev, units }]) => {
        const cogs = units * WHOLESALE_COST_PER_SALE_GBP;
        const comm = rev * avgCommRate;
        const netProfit = rev - cogs - comm - dailyServicing;
        return { date, revenueGbp: +rev.toFixed(2), netProfitGbp: +netProfit.toFixed(2) };
      });
  }

  // ── Restock ──────────────────────────────────────────────────────────────────

  // REAL API LATER: POST /venues/:venueId/restock — resets machine stock to full capacity
  async getRestockItems(): Promise<RestockItem[]> {
    const allStock = await this.getEstateStock();
    const venueMap = new Map(this.activeVenues().map((v) => [v.id, v]));
    return allStock
      .filter((s) => s.quantity <= s.lowStockThreshold)
      .map((s) => {
        const venue = venueMap.get(s.venueId)!;
        return {
          machineId: s.machineId,
          venueId: s.venueId,
          venueName: s.venueName,
          area: venue.area,
          lat: venue.lat,
          lng: venue.lng,
          slot: s.slot,
          fragrance: s.fragrance,
          currentQty: s.quantity,
          capacity: s.capacity,
          toLoad: s.capacity - s.quantity,
        };
      });
  }

  async markVenueRestocked(venueId: string): Promise<void> {
    this.restockedVenueIds.add(venueId);
    const venue = this.venues.find((v) => v.id === venueId);
    await this.appendAuditEntry("owner", "marked_restocked", "restock", venueId, venue?.name ?? venueId, "Venue marked as restocked — stock reset to capacity.");
  }

  // ── Fragrance analytics ──────────────────────────────────────────────────────

  // ── Audit log ────────────────────────────────────────────────────────────────

  async getAuditLog(limit = 100): Promise<AuditEntry[]> {
    return [...this.auditLog].reverse().slice(0, limit);
  }

  async appendAuditEntry(
    actor: string, action: string, entityType: AuditEntry["entityType"],
    entityId: string, entityName: string, detail: string
  ): Promise<void> {
    this.auditLog.push({
      id: `audit-${this.auditCounter++}`,
      timestamp: new Date().toISOString(),
      actor, action, entityType, entityId, entityName, detail,
    });
  }

  async getFragranceAnalytics(dateRange: DateRange): Promise<FragranceAnalytic[]> {
    const sales = this.getAllSales().filter(
      (s) => s.timestamp >= dateRange.from && s.timestamp <= dateRange.to
    );
    const venueMap = new Map(this.venues.map((v) => [v.id, v]));
    const days = Math.max(1, (dateRange.to.getTime() - dateRange.from.getTime()) / 86_400_000);
    const slowThreshold = SLOW_MOVER_THRESHOLD_UNITS_PER_30D * (days / 30);

    const map = new Map<string, { units: number; rev: number; byType: Record<string, { units: number; rev: number }> }>();
    for (const s of sales) {
      const venue = venueMap.get(s.venueId);
      const vType = venue?.type ?? "other";
      const e = map.get(s.fragrance) ?? { units: 0, rev: 0, byType: {} };
      e.units += 1;
      e.rev += s.amountGbp;
      const t = e.byType[vType] ?? { units: 0, rev: 0 };
      t.units += 1;
      t.rev += s.amountGbp;
      e.byType[vType] = t;
      map.set(s.fragrance, e);
    }

    return Array.from(map.entries())
      .map(([fragrance, data]) => {
        const avgPrice = data.units > 0 ? data.rev / data.units : 0;
        const tier: "standard" | "premium" = avgPrice >= 2.5 ? "premium" : "standard";
        const grossMargin = data.rev - data.units * WHOLESALE_COST_PER_SALE_GBP;
        const marginPct = data.rev > 0 ? (grossMargin / data.rev) * 100 : 0;
        return {
          fragrance,
          tier,
          totalUnits: data.units,
          totalRevenueGbp: +data.rev.toFixed(2),
          avgPriceGbp: +avgPrice.toFixed(2),
          grossMarginGbp: +grossMargin.toFixed(2),
          marginPct: +marginPct.toFixed(1),
          byVenueType: Object.fromEntries(
            Object.entries(data.byType).map(([k, v]) => [
              k,
              { units: v.units, revenueGbp: +v.rev.toFixed(2) },
            ])
          ),
          isSlowMover: data.units < slowThreshold,
        };
      })
      .sort((a, b) => b.totalUnits - a.totalUnits);
  }

  // ── Partners / contracts ─────────────────────────────────────────────────────

  async getPartnerContracts(): Promise<PartnerContract[]> {
    return this.activeVenues().map((v) => {
      const end = contractEndDate(v.goLiveDate, v.partnershipModel);
      const status = contractStatus(end, v.goLiveDate) as ContractStatus;
      const extraNotes = this.partnerNotes.get(v.id) ?? [];
      return {
        venueId: v.id,
        venueName: v.name,
        area: v.area,
        contactName: v.contactName,
        contactEmail: v.contactEmail,
        model: v.partnershipModel,
        commissionPct: v.commissionPct,
        startDate: v.goLiveDate,
        endDate: end,
        keyTerms: CONTRACT_KEY_TERMS[v.partnershipModel] ?? "",
        status,
        documentId: DOCUMENTS_SEED.find((d) => d.type === "contract" && d.venueId === v.id)?.id,
        notes: extraNotes,
      };
    });
  }

  // REAL API LATER: POST /partners/:venueId/notes
  async addPartnerNote(venueId: string, author: string, body: string): Promise<void> {
    const note: PartnerNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      author,
      body,
    };
    const existing = this.partnerNotes.get(venueId) ?? [];
    this.partnerNotes.set(venueId, [...existing, note]);
    const venue = VENUES.find((v) => v.id === venueId);
    await this.appendAuditEntry(author, "added_partner_note", "partner", venueId, venue?.name ?? venueId, body.slice(0, 80));
  }

  // ── Inventory ────────────────────────────────────────────────────────────────

  async getInventory(): Promise<InventoryItem[]> {
    if (this.inventoryItems.length === 0) {
      this.inventoryItems = buildInventorySeed(ALL_FRAGRANCES);
    }
    return [...this.inventoryItems];
  }

  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    return [...this.purchaseOrders].reverse();
  }

  // REAL API LATER: POST /purchase-orders — creates a PO in the ERP / supplier system
  async createPurchaseOrder(fragrance: string, qty: number, supplier: string, costPerUnit: number): Promise<PurchaseOrder> {
    const po: PurchaseOrder = {
      id: `po-${String(this.poCounter++).padStart(4, "0")}`,
      fragrance,
      qty,
      supplier,
      costPerUnit,
      totalCost: +(qty * costPerUnit).toFixed(2),
      status: "draft",
      createdAt: new Date().toISOString(),
    };
    this.purchaseOrders.push(po);
    await this.appendAuditEntry("owner", "created_purchase_order", "inventory", po.id, fragrance, `PO ${po.id}: ${qty} × ${fragrance} @ £${costPerUnit} from ${supplier}`);
    return po;
  }

  // REAL API LATER: PATCH /purchase-orders/:id { status }
  async updatePurchaseOrderStatus(id: string, status: PurchaseOrderStatus): Promise<void> {
    const po = this.purchaseOrders.find((p) => p.id === id);
    if (po) {
      po.status = status;
      await this.appendAuditEntry("owner", "updated_po_status", "inventory", id, po.fragrance, `PO ${id} status → ${status}`);
    }
  }

  // ── Reconciliation ───────────────────────────────────────────────────────────
  // REAL INTEGRATION LATER: replace the mock processor feed with real Stripe/SumUp/Adyen data.
  // Swap point: lib/admin/api-datasource.ts → getReconciliation()

  async getReconciliation(dateRange: DateRange): Promise<ReconciliationSummary> {
    const timeSeries = await this.getEstateSalesTimeSeries(dateRange);
    const rng = seededRandom(Math.floor(dateRange.from.getTime() / 86_400_000) % 9_999_991 + 1);

    const lines: ReconciliationLine[] = timeSeries.map((day) => {
      const machRev = day.revenueGbp;
      if (machRev === 0) {
        return { date: day.date, machineRevenue: 0, processorGross: 0, processorFees: 0, processorRefunds: 0, processorNet: 0, diff: 0, status: "zero" as const };
      }
      const hasDiscrepancy = rng() < 0.12; // 12% of trading days have a discrepancy
      const noise = hasDiscrepancy ? machRev * (rng() * 0.08 - 0.04) : 0;
      const refunds = rng() < 0.04 ? Math.round(rng() * 3) * 2 : 0;
      const processorGross = +(machRev + noise).toFixed(2);
      const processorFees = +(machRev * PROCESSOR_FEE_RATE).toFixed(2);
      const processorRefunds = refunds;
      const processorNet = +(processorGross - processorFees - processorRefunds).toFixed(2);
      const diff = +(processorGross - machRev).toFixed(2);
      const status: ReconciliationLine["status"] =
        Math.abs(diff) > RECONCILIATION_DISCREPANCY_THRESHOLD_GBP ? "discrepancy" : "matched";
      return { date: day.date, machineRevenue: machRev, processorGross, processorFees, processorRefunds, processorNet, diff, status };
    });

    const totals = lines.reduce(
      (acc, l) => ({
        rev: acc.rev + l.machineRevenue,
        gross: acc.gross + l.processorGross,
        fees: acc.fees + l.processorFees,
        refunds: acc.refunds + l.processorRefunds,
        net: acc.net + l.processorNet,
      }),
      { rev: 0, gross: 0, fees: 0, refunds: 0, net: 0 }
    );

    return {
      totalMachineRevenue: +totals.rev.toFixed(2),
      totalProcessorGross: +totals.gross.toFixed(2),
      totalProcessorFees: +totals.fees.toFixed(2),
      totalProcessorRefunds: +totals.refunds.toFixed(2),
      totalProcessorNet: +totals.net.toFixed(2),
      totalDiff: +(totals.gross - totals.rev).toFixed(2),
      matchedDays: lines.filter((l) => l.status === "matched").length,
      discrepancyDays: lines.filter((l) => l.status === "discrepancy").length,
      lines,
    };
  }

  // ── Machine ROI ──────────────────────────────────────────────────────────────

  async getMachineRoi(): Promise<MachineRoi[]> {
    const allSales = this.getAllSales();
    const now = Date.now();

    return this.activeMachines().filter((m) => m.installDate !== "—").map((m) => {
      const venue = this.activeVenues().find((v) => v.id === m.venueId)!;
      const installTs = new Date(m.installDate).getTime();
      const monthsInstalled = Math.max(0, (now - installTs) / (30.44 * 86_400_000));

      // Revenue from this machine since install
      const machineSales = allSales.filter(
        (s) => s.machineId === m.id && s.timestamp.getTime() >= installTs
      );
      const revenue = machineSales.reduce((s, x) => s + x.amountGbp, 0);
      const units = machineSales.length;
      const cogs = units * WHOLESALE_COST_PER_SALE_GBP;
      const commission = venue.partnershipModel === "revenue-share" ? revenue * (venue.commissionPct / 100) : 0;
      const servicing = monthsInstalled * SERVICING_COST_PER_MACHINE_MONTH_GBP;
      const netProfitToDate = revenue - cogs - commission - servicing;

      const purchaseCost = MACHINE_PURCHASE_COST_GBP[m.model] ?? 3000;
      const totalCapitalCost = purchaseCost + MACHINE_INSTALL_COST_GBP;
      const roiPct = totalCapitalCost > 0 ? (netProfitToDate / totalCapitalCost) * 100 : 0;
      const isPaidBack = netProfitToDate >= totalCapitalCost;
      const isOverdue = !isPaidBack && monthsInstalled > EXPECTED_PAYBACK_MONTHS;

      // Project payback month
      let projectedPaybackMonth: string | null = null;
      if (!isPaidBack && monthsInstalled > 1) {
        const monthlyNetRate = netProfitToDate / monthsInstalled;
        if (monthlyNetRate > 0) {
          const remainingProfit = totalCapitalCost - netProfitToDate;
          const monthsLeft = remainingProfit / monthlyNetRate;
          const paybackDate = new Date(installTs + (monthsInstalled + monthsLeft) * 30.44 * 86_400_000);
          projectedPaybackMonth = paybackDate.toISOString().slice(0, 7);
        }
      }

      return {
        machineId: m.id,
        venueId: m.venueId,
        venueName: venue.name,
        locationLabel: m.locationLabel,
        model: m.model,
        installDate: m.installDate,
        purchaseCost,
        installCost: MACHINE_INSTALL_COST_GBP,
        totalCapitalCost,
        netProfitToDate: +netProfitToDate.toFixed(2),
        roiPct: +roiPct.toFixed(1),
        monthsInstalled: +monthsInstalled.toFixed(1),
        isPaidBack,
        isOverdue,
        projectedPaybackMonth,
      };
    });
  }

  // ── Documents ────────────────────────────────────────────────────────────────

  async getDocuments(filter?: { venueId?: string; machineId?: string; type?: DocumentType }): Promise<ConsoleDocument[]> {
    return this.documents.filter((d) => {
      if (filter?.venueId && d.venueId !== filter.venueId) return false;
      if (filter?.machineId && d.machineId !== filter.machineId) return false;
      if (filter?.type && d.type !== filter.type) return false;
      return true;
    });
  }

  // REAL API LATER: POST /documents (multipart, uploads file to S3/Vercel Blob/Cloudflare R2)
  // The real implementation would: 1. upload the file to storage, 2. save metadata to DB.
  // For now, we only store metadata (no actual file).
  async addDocument(doc: Omit<ConsoleDocument, "id" | "uploadedAt">): Promise<ConsoleDocument> {
    const full: ConsoleDocument = {
      ...doc,
      id: `doc-${String(this.documents.length + 1).padStart(3, "0")}`,
      uploadedAt: new Date().toISOString(),
    };
    this.documents.push(full);
    await this.appendAuditEntry(doc.uploadedBy, "added_document", "document", full.id, doc.name, `Document type: ${doc.type}`);
    return full;
  }

  // ── Anomaly detection ────────────────────────────────────────────────────────
  // REAL INTEGRATION LATER: with a live sales feed this runs on streaming data.
  // On mock: returns seeded anomaly scenarios + any machine with 0 sales on a high-traffic day.

  async getSaleAnomalies(dateRange: DateRange): Promise<SaleAnomaly[]> {
    const seed = buildAnomalySeed().filter(
      (a) => a.date >= dateRange.from.toISOString().slice(0, 10) &&
             a.date <= dateRange.to.toISOString().slice(0, 10)
    );

    const periodSales = this.getAllSales().filter(
      (s) => s.timestamp >= dateRange.from && s.timestamp <= dateRange.to
    );
    const byMachineDate = new Map<string, number>();
    for (const s of periodSales) {
      const key = `${s.machineId}|${s.timestamp.toISOString().slice(0, 10)}`;
      byMachineDate.set(key, (byMachineDate.get(key) ?? 0) + 1);
    }

    const computed: SaleAnomaly[] = [];
    const activeMachines = this.activeMachines().filter((m) => m.status === "online");
    const seedMachineIds = new Set(seed.map((a) => a.machineId));

    const cur = new Date(dateRange.from);
    cur.setHours(12, 0, 0, 0);
    const end = new Date(dateRange.to);
    const DOW_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    while (cur <= end) {
      const dateStr = cur.toISOString().slice(0, 10);
      const dow = cur.getDay();
      for (const machine of activeMachines) {
        if (seedMachineIds.has(machine.id)) { cur.setDate(cur.getDate() + 1); continue; }
        const venue = this.activeVenues().find((v) => v.id === machine.venueId);
        if (!venue || venue.status !== "live") continue;
        const cfg = getTypeConfig(venue.type);
        if (cfg.closedDays?.includes(dow)) continue;
        const isWeekend = dow === 0 || dow === 5 || dow === 6;
        const expected = cfg.weekdayBase * (isWeekend ? cfg.weekendMult : 1);
        if (expected < ANOMALY_MIN_BASELINE) continue;
        const actual = byMachineDate.get(`${machine.id}|${dateStr}`) ?? 0;
        if (actual < expected * ANOMALY_LOW_FRACTION) {
          computed.push({
            machineId: machine.id,
            venueId: machine.venueId,
            venueName: venue.name,
            locationLabel: machine.locationLabel,
            date: dateStr,
            expectedUnits: Math.round(expected),
            actualUnits: actual,
            severity: actual === 0 ? "critical" : "warning",
            note: actual === 0
              ? `Zero sales on ${DOW_NAMES[dow]} — check machine is operational.`
              : `${actual} sales vs ~${Math.round(expected)} expected on ${DOW_NAMES[dow]}.`,
          });
        }
      }
      cur.setDate(cur.getDate() + 1);
    }

    return [...seed, ...computed].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 20);
  }

  // ── League table ─────────────────────────────────────────────────────────────

  async getLeagueTable(current: DateRange, previous: DateRange): Promise<LeagueTableRow[]> {
    const [currProfit, prevProfit, currTop] = await Promise.all([
      this.getNetProfitability(current),
      this.getNetProfitability(previous),
      this.getTopVenuesByRevenue(current, 50),
    ]);

    const unitsMap = new Map(currTop.map((v) => [v.venueId, v.unitsSold]));

    const prevRankMap = new Map(
      [...prevProfit]
        .sort((a, b) => b.grossRevenueGbp - a.grossRevenueGbp)
        .map((r, i) => [r.venueId, i + 1])
    );

    return currProfit
      .filter((r) => r.grossRevenueGbp > 0)
      .sort((a, b) => b.grossRevenueGbp - a.grossRevenueGbp)
      .map((r, i) => {
        const rank = i + 1;
        const prevRank = prevRankMap.get(r.venueId) ?? rank;
        return {
          rank,
          prevRank,
          movement: prevRank - rank,
          venueId: r.venueId,
          venueName: r.venueName,
          area: r.area,
          type: r.type,
          revenueGbp: r.grossRevenueGbp,
          netProfitGbp: r.netProfitGbp,
          unitsSold: unitsMap.get(r.venueId) ?? 0,
          marginPct: r.marginPct,
        };
      });
  }
}
