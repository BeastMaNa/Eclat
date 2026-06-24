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
