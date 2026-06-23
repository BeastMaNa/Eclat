import type {
  Sale,
  StockItem,
  Machine,
  SalesQuery,
  KpiSummary,
  SalesTimeSeries,
  TopFragrance,
  DateRange,
} from "./types";

// ─── DashboardDataSource interface ────────────────────────────────────────────
//
// ALL dashboard data access goes through this interface.
// The UI never imports MockDataSource directly — it receives a DashboardDataSource.
// To connect the real machine API, implement this interface and swap the factory
// in lib/dashboard/index.ts. Nothing else changes.
//
// See README.md → "How to connect the real machine API" for the swap procedure.

export interface DashboardDataSource {
  /** All machines belonging to this venue */
  getMachines(venueId: string): Promise<Machine[]>;

  /** Paginated/filterable sales records */
  getSales(query: SalesQuery): Promise<Sale[]>;

  /** KPI summary for the date range */
  getKpis(query: SalesQuery): Promise<KpiSummary>;

  /** Daily time-series for the line chart */
  getSalesTimeSeries(query: SalesQuery): Promise<SalesTimeSeries[]>;

  /** Top N fragrances by units sold */
  getTopFragrances(query: SalesQuery, limit?: number): Promise<TopFragrance[]>;

  /** Current stock state for all machines in the venue */
  getStock(venueId: string): Promise<StockItem[]>;

  /** Low-stock items (quantity ≤ lowStockThreshold) */
  getLowStockAlerts(venueId: string): Promise<StockItem[]>;

  /** Distinct fragrances ever sold in this venue — for filter dropdowns */
  getFragranceNames(venueId: string): Promise<string[]>;
}
