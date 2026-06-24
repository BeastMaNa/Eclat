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
  VenueInput,
  MachineInput,
  TicketInput,
  InquiryInput,
  StockItemInput,
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
  /** Returns active (non-archived) venues by default. */
  getVenues(opts?: { includeArchived?: boolean }): Promise<Venue[]>;
  getVenueById(id: string): Promise<Venue | null>;
  /** REAL API LATER: POST /venues */
  createVenue(input: VenueInput): Promise<Venue>;
  /** REAL API LATER: PATCH /venues/:id */
  updateVenue(id: string, input: Partial<VenueInput>): Promise<Venue>;
  /** REAL API LATER: PATCH /venues/:id/archive — cascades to machines */
  archiveVenue(id: string): Promise<void>;
  /** REAL API LATER: PATCH /venues/:id/restore */
  restoreVenue(id: string): Promise<void>;

  // ── Machines ──────────────────────────────────────────────────────────────
  /** Returns active (non-archived) machines by default. */
  getAllMachines(opts?: { includeArchived?: boolean }): Promise<AdminMachine[]>;
  getMachinesByVenue(venueId: string, opts?: { includeArchived?: boolean }): Promise<AdminMachine[]>;
  /** REAL API LATER: POST /machines */
  createMachine(input: MachineInput): Promise<AdminMachine>;
  /** REAL API LATER: PATCH /machines/:id */
  updateMachine(id: string, input: Partial<Omit<MachineInput, "venueId">>): Promise<AdminMachine>;
  /** REAL API LATER: PATCH /machines/:id/archive */
  archiveMachine(id: string): Promise<void>;
  /** REAL API LATER: PATCH /machines/:id/restore */
  restoreMachine(id: string): Promise<void>;

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
  /** REAL API LATER: POST /inquiries */
  createInquiry(input: InquiryInput): Promise<Inquiry>;
  /** REAL API LATER: PATCH /inquiries/:id */
  updateInquiry(id: string, input: Partial<InquiryInput & { status: InquiryStatus; assignedTo: string | null; notes: string[] }>): Promise<Inquiry>;
  /** REAL API LATER: DELETE /inquiries/:id */
  deleteInquiry(id: string): Promise<void>;

  // ── Maintenance ───────────────────────────────────────────────────────────
  getMaintenanceTickets(filter?: MaintenanceFilter): Promise<MaintenanceTicket[]>;
  /** REAL API LATER: PATCH /maintenance/:id */
  updateTicketStatus(id: string, status: TicketStatus): Promise<void>;
  /** REAL API LATER: POST /maintenance */
  createMaintenanceTicket(input: TicketInput): Promise<MaintenanceTicket>;
  /** REAL API LATER: PATCH /maintenance/:id (full update) */
  updateMaintenanceTicket(id: string, input: Partial<TicketInput & { status: TicketStatus }>): Promise<MaintenanceTicket>;
  /** REAL API LATER: DELETE /maintenance/:id */
  deleteMaintenanceTicket(id: string): Promise<void>;

  // ── Stock ─────────────────────────────────────────────────────────────────
  getEstateStock(): Promise<AdminStockItem[]>;
  /** REAL API LATER: PATCH /stock/:machineId/:slot */
  updateStockItem(machineId: string, slot: number, updates: Partial<StockItemInput>): Promise<void>;
  /** REAL API LATER: POST /stock */
  createStockItem(input: StockItemInput): Promise<AdminStockItem>;
  /** REAL API LATER: DELETE /stock/:machineId/:slot */
  deleteStockItem(machineId: string, slot: number): Promise<void>;

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
  /** REAL API LATER: DELETE /documents/:id */
  deleteDocument(id: string): Promise<void>;

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
