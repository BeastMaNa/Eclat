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
  PayoutRecord,
  NetProfitSummary,
  ProfitTimeSeries,
  RestockItem,
  FragranceAnalytic,
  PartnerContract,
  InventoryItem,
  PurchaseOrder,
  PurchaseOrderStatus,
  ReconciliationSummary,
  MachineRoi,
  ConsoleDocument,
  DocumentType,
  AuditEntry,
  SaleAnomaly,
  LeagueTableRow,
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

  // ── Payouts ───────────────────────────────────────────────────────────────
  getPayoutRecords(dateRange: DateRange): Promise<PayoutRecord[]>;
  /** REAL API LATER: PATCH /payouts/:venueId { paidDate, reference } */
  markPayoutPaid(venueId: string, paidDate: string, reference: string): Promise<void>;

  // ── Profitability ─────────────────────────────────────────────────────────
  getNetProfitability(dateRange: DateRange): Promise<NetProfitSummary[]>;
  getEstateProfitTimeSeries(dateRange: DateRange): Promise<ProfitTimeSeries[]>;

  // ── Restock planner ───────────────────────────────────────────────────────
  getRestockItems(): Promise<RestockItem[]>;
  /** REAL API LATER: POST /venues/:venueId/restock */
  markVenueRestocked(venueId: string): Promise<void>;

  // ── Fragrance analytics ───────────────────────────────────────────────────
  getFragranceAnalytics(dateRange: DateRange): Promise<FragranceAnalytic[]>;

  // ── Partners / contracts ──────────────────────────────────────────────────
  getPartnerContracts(): Promise<PartnerContract[]>;
  /** REAL API LATER: POST /partners/:venueId/notes */
  addPartnerNote(venueId: string, author: string, body: string): Promise<void>;

  // ── Central inventory ─────────────────────────────────────────────────────
  getInventory(): Promise<InventoryItem[]>;
  getPurchaseOrders(): Promise<PurchaseOrder[]>;
  /** REAL API LATER: POST /purchase-orders */
  createPurchaseOrder(fragrance: string, qty: number, supplier: string, costPerUnit: number): Promise<PurchaseOrder>;
  /** REAL API LATER: PATCH /purchase-orders/:id */
  updatePurchaseOrderStatus(id: string, status: PurchaseOrderStatus): Promise<void>;

  // ── Reconciliation ────────────────────────────────────────────────────────
  // REAL INTEGRATION LATER: feed from payment processor (Stripe/SumUp/etc.)
  getReconciliation(dateRange: DateRange): Promise<ReconciliationSummary>;

  // ── Machine ROI ───────────────────────────────────────────────────────────
  getMachineRoi(): Promise<MachineRoi[]>;

  // ── Documents ─────────────────────────────────────────────────────────────
  getDocuments(filter?: { venueId?: string; machineId?: string; type?: DocumentType }): Promise<ConsoleDocument[]>;
  /** REAL API LATER: POST /documents (with file upload to storage) */
  addDocument(doc: Omit<ConsoleDocument, "id" | "uploadedAt">): Promise<ConsoleDocument>;

  // ── Audit log ─────────────────────────────────────────────────────────────
  getAuditLog(limit?: number): Promise<AuditEntry[]>;
  /** Append an entry — called by mutation methods internally in mock; in prod, call real API. */
  appendAuditEntry(actor: string, action: string, entityType: AuditEntry["entityType"], entityId: string, entityName: string, detail: string): Promise<void>;

  // ── Anomaly detection ─────────────────────────────────────────────────────
  // REAL INTEGRATION LATER: sharp anomaly detection requires a live sales feed
  getSaleAnomalies(dateRange: DateRange): Promise<SaleAnomaly[]>;

  // ── League table ──────────────────────────────────────────────────────────
  getLeagueTable(current: DateRange, previous: DateRange): Promise<LeagueTableRow[]>;
}
