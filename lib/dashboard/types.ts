// ─── Domain models ────────────────────────────────────────────────────────────

export type PaymentType = "card" | "apple_pay" | "google_pay";

export interface Sale {
  id: string;
  timestamp: Date;
  fragrance: string;
  machineId: string;
  venueId: string;
  amountGbp: number;
  paymentType: PaymentType;
}

export interface StockItem {
  machineId: string;
  slot: number;
  fragrance: string;
  quantity: number;
  capacity: number;
  lowStockThreshold: number;
}

export interface Machine {
  id: string;
  venueId: string;
  locationLabel: string;
  model: string;
}

// ─── Query types ──────────────────────────────────────────────────────────────

export interface DateRange {
  from: Date;
  to: Date;
}

export interface SalesQuery {
  venueId: string;
  dateRange: DateRange;
  fragrance?: string;
}

export interface KpiSummary {
  totalRevenueGbp: number;
  unitsSold: number;
  avgUnitsPerDay: number;
  avgRevenuePerDay: number;
}

export interface SalesTimeSeries {
  date: string; // "YYYY-MM-DD"
  revenueGbp: number;
  units: number;
}

export interface TopFragrance {
  fragrance: string;
  units: number;
  revenueGbp: number;
}
