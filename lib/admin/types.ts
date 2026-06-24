import type { PaymentType, SalesTimeSeries } from "@/lib/dashboard/types";
export type { PaymentType, SalesTimeSeries };

// ─── Enumerations ──────────────────────────────────────────────────────────────

export type VenueStatus = "live" | "install-pending" | "paused";
export type PartnershipModel = "revenue-share" | "lease" | "purchase";
export type MachineStatusValue = "online" | "offline" | "fault";
export type InquiryStatus = "new" | "contacted" | "qualified" | "won" | "lost";
export type TicketStatus = "open" | "scheduled" | "done";
export type TicketType = "restock" | "fault" | "install" | "service";
export type Priority = "low" | "medium" | "high" | "urgent";

// ─── Domain models ─────────────────────────────────────────────────────────────

export interface Venue {
  id: string;
  name: string;
  area: string;
  type: string; // "cocktail-bar" | "hotel" | "nightclub" | "restaurant" | ...
  address: string;
  lat: number;
  lng: number;
  status: VenueStatus;
  partnershipModel: PartnershipModel;
  goLiveDate: string; // "YYYY-MM-DD"
  commissionPct: number;
  contactName: string;
  contactEmail: string;
  machineIds: string[];
  archived?: boolean;
}

export interface AdminMachine {
  id: string;
  venueId: string;
  locationLabel: string;
  model: string;
  status: MachineStatusValue;
  firmware: string;
  lastSeen: Date;
  installDate: string; // "YYYY-MM-DD"
  archived?: boolean;
}

export interface AdminSale {
  id: string;
  timestamp: Date;
  fragrance: string;
  machineId: string;
  venueId: string;
  venueName: string;
  amountGbp: number;
  paymentType: PaymentType;
  archived?: boolean;
}

export interface Inquiry {
  id: string;
  venueName: string;
  contactName: string;
  contactEmail: string;
  venueType: string;
  city: string;
  message: string;
  receivedAt: Date;
  status: InquiryStatus;
  assignedTo: string | null;
  notes: string[];
  archived?: boolean;
}

export interface MaintenanceTicket {
  id: string;
  machineId: string;
  venueId: string;
  type: TicketType;
  priority: Priority;
  status: TicketStatus;
  openedAt: Date;
  scheduledFor: Date | null;
  completedAt: Date | null;
  notes: string;
  assignee: string;
  archived?: boolean;
}

export interface AdminStockItem {
  machineId: string;
  venueId: string;
  venueName: string;
  slot: number;
  fragrance: string;
  quantity: number;
  capacity: number;
  lowStockThreshold: number;
}

// ─── Aggregates ────────────────────────────────────────────────────────────────

export interface EstateKpis {
  totalRevenueGbp: number;
  unitsSold: number;
  activeMachines: number;
  machinesWithFaults: number;
  openMaintenanceTickets: number;
  newInquiries: number;
}

export interface VenueRevenueSummary {
  venueId: string;
  venueName: string;
  area: string;
  type: string;
  revenueGbp: number;
  unitsSold: number;
}

export interface AttentionItems {
  offlineMachines: AdminMachine[];
  faultMachines: AdminMachine[];
  lowStockAlerts: AdminStockItem[];
  overdueTickets: MaintenanceTicket[];
  newInquiries: Inquiry[];
}

// ─── Query types ───────────────────────────────────────────────────────────────

export interface DateRange {
  from: Date;
  to: Date;
}

export interface EstateSalesQuery {
  dateRange: DateRange;
  venueId?: string;
  machineId?: string;
  fragrance?: string;
  paymentType?: PaymentType;
}

export interface MaintenanceFilter {
  status?: TicketStatus;
  priority?: Priority;
  type?: TicketType;
  venueId?: string;
  assignee?: string;
}

export interface InquiryFilter {
  status?: InquiryStatus;
  assignedTo?: string;
}

// ─── Payouts ───────────────────────────────────────────────────────────────────

export type PayoutStatus = "due" | "paid" | "na";

export interface PayoutRecord {
  venueId: string;
  venueName: string;
  area: string;
  contactName: string;
  contactEmail: string;
  partnershipModel: PartnershipModel;
  commissionPct: number;
  grossSalesGbp: number;
  partnerShareGbp: number;
  eclatShareGbp: number;
  status: PayoutStatus;
  paidDate?: string;
  paidReference?: string;
}

// ─── Profitability ─────────────────────────────────────────────────────────────

export interface NetProfitSummary {
  venueId: string;
  venueName: string;
  area: string;
  type: string;
  machineCount: number;
  grossRevenueGbp: number;
  cogsGbp: number;
  commissionGbp: number;
  servicingGbp: number;
  netProfitGbp: number;
  marginPct: number;
}

export interface ProfitTimeSeries {
  date: string;
  revenueGbp: number;
  netProfitGbp: number;
}

// ─── Restock ───────────────────────────────────────────────────────────────────

export interface RestockItem {
  machineId: string;
  venueId: string;
  venueName: string;
  area: string;
  lat: number;
  lng: number;
  slot: number;
  fragrance: string;
  currentQty: number;
  capacity: number;
  toLoad: number;
}

// ─── Fragrances ────────────────────────────────────────────────────────────────

export interface FragranceAnalytic {
  fragrance: string;
  tier: "standard" | "premium";
  totalUnits: number;
  totalRevenueGbp: number;
  avgPriceGbp: number;
  grossMarginGbp: number;
  marginPct: number;
  byVenueType: Record<string, { units: number; revenueGbp: number }>;
  isSlowMover: boolean;
}

// ─── Partners / contracts ──────────────────────────────────────────────────────

export type ContractStatus = "active" | "expiring-soon" | "lapsed" | "pending";

export interface PartnerNote {
  id: string;
  timestamp: string; // ISO
  author: string;
  body: string;
}

export interface PartnerContract {
  venueId: string;
  venueName: string;
  area: string;
  contactName: string;
  contactEmail: string;
  model: PartnershipModel;
  commissionPct: number;
  startDate: string;   // YYYY-MM-DD
  endDate: string;     // YYYY-MM-DD
  keyTerms: string;
  status: ContractStatus;
  documentId?: string;
  notes: PartnerNote[];
}

// ─── Inventory ─────────────────────────────────────────────────────────────────

export interface InventoryItem {
  fragrance: string;
  tier: "standard" | "premium";
  currentStock: number;
  reorderThreshold: number;
  reorderQty: number;
  supplierName: string;
  costPerUnit: number;
  needsReorder: boolean;
}

export type PurchaseOrderStatus = "draft" | "sent" | "received";

export interface PurchaseOrder {
  id: string;
  fragrance: string;
  qty: number;
  supplier: string;
  costPerUnit: number;
  totalCost: number;
  status: PurchaseOrderStatus;
  createdAt: string; // ISO
}

// ─── Reconciliation ────────────────────────────────────────────────────────────

export type ReconciliationLineStatus = "matched" | "discrepancy" | "zero";

export interface ReconciliationLine {
  date: string;
  machineRevenue: number;
  processorGross: number;
  processorFees: number;
  processorRefunds: number;
  processorNet: number;
  diff: number;
  status: ReconciliationLineStatus;
}

export interface ReconciliationSummary {
  totalMachineRevenue: number;
  totalProcessorGross: number;
  totalProcessorFees: number;
  totalProcessorRefunds: number;
  totalProcessorNet: number;
  totalDiff: number;
  matchedDays: number;
  discrepancyDays: number;
  lines: ReconciliationLine[];
}

// ─── Machine ROI ───────────────────────────────────────────────────────────────

export interface MachineRoi {
  machineId: string;
  venueId: string;
  venueName: string;
  locationLabel: string;
  model: string;
  installDate: string;
  purchaseCost: number;
  installCost: number;
  totalCapitalCost: number;
  netProfitToDate: number;
  roiPct: number;
  monthsInstalled: number;
  isPaidBack: boolean;
  isOverdue: boolean;
  projectedPaybackMonth: string | null;
}

// ─── Documents ─────────────────────────────────────────────────────────────────

export type DocumentType = "contract" | "warranty" | "insurance" | "supplier" | "other";

export interface ConsoleDocument {
  id: string;
  name: string;
  type: DocumentType;
  venueId?: string;
  machineId?: string;
  url: string;       // real: storage URL; mock: "#placeholder"
  uploadedAt: string;
  uploadedBy: string;
  notes?: string;
}

// ─── Audit log ─────────────────────────────────────────────────────────────────

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  entityType: "venue" | "machine" | "payout" | "ticket" | "inquiry" | "document" | "inventory" | "partner" | "restock";
  entityId: string;
  entityName: string;
  detail: string;
}

// ─── Anomaly alerts ────────────────────────────────────────────────────────────

export type AnomalySeverity = "warning" | "critical";

export interface SaleAnomaly {
  machineId: string;
  venueId: string;
  venueName: string;
  locationLabel: string;
  date: string;
  expectedUnits: number;
  actualUnits: number;
  severity: AnomalySeverity;
  note: string;
}

// ─── League table ──────────────────────────────────────────────────────────────

export interface LeagueTableRow {
  rank: number;
  prevRank: number;
  movement: number;
  venueId: string;
  venueName: string;
  area: string;
  type: string;
  revenueGbp: number;
  netProfitGbp: number;
  unitsSold: number;
  marginPct: number;
}

// ─── Write / input types ───────────────────────────────────────────────────────

export interface VenueInput {
  name: string;
  area: string;
  type: string;
  address: string;
  lat: number;
  lng: number;
  status: VenueStatus;
  partnershipModel: PartnershipModel;
  goLiveDate: string;
  commissionPct: number;
  contactName: string;
  contactEmail: string;
}

export interface MachineInput {
  venueId: string;
  locationLabel: string;
  model: string;
  installDate: string;
  status?: MachineStatusValue;
}

export interface TicketInput {
  machineId: string;
  venueId: string;
  type: TicketType;
  priority: Priority;
  notes: string;
  assignee: string;
  scheduledFor?: string | null; // ISO string
}

export interface InquiryInput {
  venueName: string;
  contactName: string;
  contactEmail: string;
  venueType: string;
  city: string;
  message: string;
}

export interface StockItemInput {
  machineId: string;
  venueId: string;
  slot: number;
  fragrance: string;
  quantity: number;
  capacity: number;
  lowStockThreshold: number;
}
