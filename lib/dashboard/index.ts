import type { DashboardDataSource } from "./datasource";
import { MockDataSource } from "./mock";

// ─── Factory ──────────────────────────────────────────────────────────────────
//
// Returns the active DashboardDataSource.
// To connect the real machine API:
//   1. Implement DashboardDataSource in e.g. lib/dashboard/api-datasource.ts
//   2. Change the return below to `new ApiDataSource()`
//   3. Nothing in the dashboard UI components needs to change.
//
// See README.md → "How to connect the real machine API" for full details.

export function getDataSource(): DashboardDataSource {
  // Real API: return new ApiDataSource(process.env.MACHINE_API_URL!, process.env.MACHINE_API_KEY!)
  return new MockDataSource();
}

export type { DashboardDataSource } from "./datasource";
export type {
  Sale,
  StockItem,
  Machine,
  SalesQuery,
  KpiSummary,
  SalesTimeSeries,
  TopFragrance,
  DateRange,
  PaymentType,
} from "./types";
