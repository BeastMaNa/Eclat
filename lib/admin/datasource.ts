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
} from "./types";

// ─── AdminDataSource interface ────────────────────────────────────────────────
//
// ALL operations console data access goes through this interface.
// The UI never imports MockAdminDataSource directly.
//
// To connect the real machine API:
//   1. Implement AdminDataSource in e.g. lib/admin/api-datasource.ts
//   2. Change the factory in lib/admin/index.ts to return the real implementation
//   3. Nothing in the console UI components changes.
//
// See README.md → "Connecting the real machine API" for the swap procedure.
//
// Methods marked "REAL API LATER" mutate state in the mock implementation.
// Replace with real HTTP/DB calls when going to production.

export interface AdminDataSource {
  // ── Venues ────────────────────────────────────────────────────────────────
  getVenues(): Promise<Venue[]>;
  getVenueById(id: string): Promise<Venue | null>;

  // ── Machines ──────────────────────────────────────────────────────────────
  getAllMachines(): Promise<AdminMachine[]>;
  getMachinesByVenue(venueId: string): Promise<AdminMachine[]>;

  // ── Estate overview ───────────────────────────────────────────────────────
  getEstateKpis(dateRange: DateRange): Promise<EstateKpis>;
  getEstateSalesTimeSeries(dateRange: DateRange): Promise<SalesTimeSeries[]>;
  getTopVenuesByRevenue(dateRange: DateRange, limit?: number): Promise<VenueRevenueSummary[]>;
  getTopFragrancesEstate(dateRange: DateRange, limit?: number): Promise<{ fragrance: string; units: number; revenueGbp: number }[]>;
  getAttentionItems(): Promise<AttentionItems>;

  // ── Sales ─────────────────────────────────────────────────────────────────
  getEstateSales(query: EstateSalesQuery): Promise<AdminSale[]>;

  // ── Inquiries ─────────────────────────────────────────────────────────────
  getInquiries(filter?: InquiryFilter): Promise<Inquiry[]>;
  /** REAL API LATER: POST /inquiries/:id/status */
  updateInquiryStatus(id: string, status: InquiryStatus, note?: string): Promise<void>;

  // ── Maintenance ───────────────────────────────────────────────────────────
  getMaintenanceTickets(filter?: MaintenanceFilter): Promise<MaintenanceTicket[]>;
  /** REAL API LATER: PATCH /maintenance/:id */
  updateTicketStatus(id: string, status: TicketStatus): Promise<void>;

  // ── Stock ─────────────────────────────────────────────────────────────────
  getEstateStock(): Promise<AdminStockItem[]>;
}
