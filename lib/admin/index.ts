import type { AdminDataSource } from "./datasource";
import { MockAdminDataSource } from "./mock";

// ─── Factory ──────────────────────────────────────────────────────────────────
//
// Returns the active AdminDataSource.
//
// REAL API SWAP POINT:
//   1. Implement AdminDataSource in e.g. lib/admin/api-datasource.ts
//   2. Change the return below to `new ApiAdminDataSource(process.env.MACHINE_API_URL!, ...)`
//   3. Nothing in the console UI components needs to change.
//
// See README.md → "Connecting the real machine API" for the full procedure.

// Module-level singleton preserves in-memory state (inquiry/ticket mutations)
// across requests within the same server process.
let _instance: AdminDataSource | null = null;

export function getAdminDataSource(): AdminDataSource {
  if (!_instance) _instance = new MockAdminDataSource();
  return _instance;
}

export type { AdminDataSource } from "./datasource";
export type {
  Venue,
  AdminMachine,
  AdminSale,
  Inquiry,
  InquiryStatus,
  MaintenanceTicket,
  TicketStatus,
  TicketType,
  Priority,
  AdminStockItem,
  EstateKpis,
  VenueRevenueSummary,
  AttentionItems,
  DateRange,
  EstateSalesQuery,
  VenueStatus,
  PartnershipModel,
  MachineStatusValue,
} from "./types";
