import type { DashboardDataSource } from "./datasource";
import type {
  Sale,
  StockItem,
  Machine,
  SalesQuery,
  KpiSummary,
  SalesTimeSeries,
  TopFragrance,
} from "./types";

// ─── Static seed data ─────────────────────────────────────────────────────────

const FRAGRANCES = [
  "Oud & Amber",
  "White Musk",
  "Bergamot Noir",
  "Rose Absolute",
  "Vetiver Cedar",
  "Jasmine & Sandalwood",
  "Black Pepper & Iris",
  "Neroli Luxe",
];

const PAYMENT_TYPES: Sale["paymentType"][] = ["card", "apple_pay", "google_pay"];

const VENUE_MACHINES: Record<string, Machine[]> = {
  "venue-001": [
    { id: "mach-001", venueId: "venue-001", locationLabel: "Main Entrance", model: "Tower S1" },
    { id: "mach-002", venueId: "venue-001", locationLabel: "VIP Lounge", model: "Counter" },
  ],
  "venue-002": [
    { id: "mach-003", venueId: "venue-002", locationLabel: "Bar Area", model: "Slim" },
  ],
  "venue-003": [
    { id: "mach-004", venueId: "venue-003", locationLabel: "Reception", model: "Tower S1" },
    { id: "mach-005", venueId: "venue-003", locationLabel: "Cloakroom", model: "Counter" },
    { id: "mach-006", venueId: "venue-003", locationLabel: "Terrace", model: "Slim" },
  ],
};

// ─── Deterministic pseudo-random helpers ──────────────────────────────────────

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

// ─── Sales generator ──────────────────────────────────────────────────────────

function generateSales(venueId: string, daysBack = 60): Sale[] {
  const machines = VENUE_MACHINES[venueId] ?? [];
  if (machines.length === 0) return [];

  const rng = seededRandom(venueId.charCodeAt(6) * 31337 + 1);
  const sales: Sale[] = [];
  const now = Date.now();
  let idCounter = 1;

  for (let day = daysBack; day >= 0; day--) {
    const baseDate = now - day * 86_400_000;
    // 3–14 sales per day per machine, more on weekends
    const date = new Date(baseDate);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const perMachine = isWeekend ? Math.floor(rng() * 8) + 6 : Math.floor(rng() * 6) + 3;

    for (const machine of machines) {
      for (let i = 0; i < perMachine; i++) {
        const offsetMs = Math.floor(rng() * 72_000_000); // within 20h window
        sales.push({
          id: `sale-${venueId}-${idCounter++}`,
          timestamp: new Date(baseDate + offsetMs),
          fragrance: pick(FRAGRANCES, rng),
          machineId: machine.id,
          venueId,
          amountGbp: +(5 + rng() * 10).toFixed(2), // £5–£15
          paymentType: pick(PAYMENT_TYPES, rng),
        });
      }
    }
  }

  return sales.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

// ─── Stock generator ──────────────────────────────────────────────────────────

function generateStock(venueId: string): StockItem[] {
  const machines = VENUE_MACHINES[venueId] ?? [];
  const rng = seededRandom(venueId.charCodeAt(6) * 99991 + 7);
  const items: StockItem[] = [];

  for (const machine of machines) {
    const slots = machine.model === "Counter" ? 6 : machine.model === "Slim" ? 10 : 12;
    for (let slot = 1; slot <= slots; slot++) {
      const capacity = 20;
      const quantity = Math.floor(rng() * capacity);
      items.push({
        machineId: machine.id,
        slot,
        fragrance: FRAGRANCES[(slot - 1) % FRAGRANCES.length],
        quantity,
        capacity,
        lowStockThreshold: 4,
      });
    }
  }

  return items;
}

// ─── MockDataSource implementation ────────────────────────────────────────────

export class MockDataSource implements DashboardDataSource {
  private salesCache = new Map<string, Sale[]>();

  private getSalesForVenue(venueId: string): Sale[] {
    if (!this.salesCache.has(venueId)) {
      this.salesCache.set(venueId, generateSales(venueId));
    }
    return this.salesCache.get(venueId)!;
  }

  private filterSales(query: SalesQuery): Sale[] {
    return this.getSalesForVenue(query.venueId).filter((s) => {
      const inRange =
        s.timestamp >= query.dateRange.from && s.timestamp <= query.dateRange.to;
      const fragranceMatch = !query.fragrance || s.fragrance === query.fragrance;
      return inRange && fragranceMatch;
    });
  }

  async getMachines(venueId: string): Promise<Machine[]> {
    return VENUE_MACHINES[venueId] ?? [];
  }

  async getSales(query: SalesQuery): Promise<Sale[]> {
    return this.filterSales(query);
  }

  async getKpis(query: SalesQuery): Promise<KpiSummary> {
    const sales = this.filterSales(query);
    const totalRevenueGbp = sales.reduce((s, x) => s + x.amountGbp, 0);
    const unitsSold = sales.length;
    const days = Math.max(
      1,
      Math.round(
        (query.dateRange.to.getTime() - query.dateRange.from.getTime()) / 86_400_000
      )
    );
    return {
      totalRevenueGbp: +totalRevenueGbp.toFixed(2),
      unitsSold,
      avgUnitsPerDay: +(unitsSold / days).toFixed(1),
      avgRevenuePerDay: +(totalRevenueGbp / days).toFixed(2),
    };
  }

  async getSalesTimeSeries(query: SalesQuery): Promise<SalesTimeSeries[]> {
    const sales = this.filterSales(query);
    const byDay = new Map<string, { rev: number; units: number }>();

    const cur = new Date(query.dateRange.from);
    cur.setHours(0, 0, 0, 0);
    const end = new Date(query.dateRange.to);
    end.setHours(23, 59, 59, 999);

    while (cur <= end) {
      byDay.set(cur.toISOString().slice(0, 10), { rev: 0, units: 0 });
      cur.setDate(cur.getDate() + 1);
    }

    for (const sale of sales) {
      const key = sale.timestamp.toISOString().slice(0, 10);
      const entry = byDay.get(key);
      if (entry) {
        entry.rev += sale.amountGbp;
        entry.units += 1;
      }
    }

    return Array.from(byDay.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, { rev, units }]) => ({
        date,
        revenueGbp: +rev.toFixed(2),
        units,
      }));
  }

  async getTopFragrances(query: SalesQuery, limit = 5): Promise<TopFragrance[]> {
    const sales = this.filterSales(query);
    const map = new Map<string, { units: number; rev: number }>();

    for (const sale of sales) {
      const entry = map.get(sale.fragrance) ?? { units: 0, rev: 0 };
      entry.units += 1;
      entry.rev += sale.amountGbp;
      map.set(sale.fragrance, entry);
    }

    return Array.from(map.entries())
      .map(([fragrance, { units, rev }]) => ({
        fragrance,
        units,
        revenueGbp: +rev.toFixed(2),
      }))
      .sort((a, b) => b.units - a.units)
      .slice(0, limit);
  }

  async getStock(venueId: string): Promise<StockItem[]> {
    return generateStock(venueId);
  }

  async getLowStockAlerts(venueId: string): Promise<StockItem[]> {
    const stock = generateStock(venueId);
    return stock.filter((s) => s.quantity <= s.lowStockThreshold);
  }

  async getFragranceNames(venueId: string): Promise<string[]> {
    const sales = this.getSalesForVenue(venueId);
    return [...new Set(sales.map((s) => s.fragrance))].sort();
  }
}
