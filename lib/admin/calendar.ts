import type { AdminDataSource } from "./datasource";

export type CalendarEventType =
  | "maintenance"
  | "inquiry"
  | "payout"
  | "contract"
  | "install"
  | "delivery";

export interface CalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  date: string; // YYYY-MM-DD — avoids timezone serialisation issues
  venueId?: string;
  venueName?: string;
  machineId?: string;
  status?: string;
  assignee?: string;
  priority?: string;
  description?: string;
  href: string; // link back to source record
  badge?: string; // subtype label e.g. "fault", "restock", "expiring-soon"
}

export const EVENT_CONFIG: Record<
  CalendarEventType,
  { label: string; chipClass: string; dotClass: string; cta: string }
> = {
  maintenance: {
    label: "Maintenance",
    chipClass: "bg-amber-50 text-amber-800 border-amber-200",
    dotClass: "bg-amber-500",
    cta: "Open ticket",
  },
  inquiry: {
    label: "Inquiry",
    chipClass: "bg-sky-50 text-sky-800 border-sky-200",
    dotClass: "bg-sky-500",
    cta: "View lead",
  },
  payout: {
    label: "Payout",
    chipClass: "bg-violet-50 text-violet-800 border-violet-200",
    dotClass: "bg-violet-500",
    cta: "View payout",
  },
  contract: {
    label: "Contract",
    chipClass: "bg-[#C9A684]/10 text-[#6B4423] border-[#C9A684]/40",
    dotClass: "bg-[#C9A684]",
    cta: "View contract",
  },
  install: {
    label: "Install",
    chipClass: "bg-teal-50 text-teal-800 border-teal-200",
    dotClass: "bg-teal-500",
    cta: "View venue",
  },
  delivery: {
    label: "Delivery",
    chipClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dotClass: "bg-emerald-500",
    cta: "View inventory",
  },
};

export const ALL_CALENDAR_TYPES: CalendarEventType[] = [
  "maintenance",
  "inquiry",
  "payout",
  "contract",
  "install",
  "delivery",
];

function toDateStr(d: Date | string | null | undefined): string | null {
  if (!d) return null;
  try {
    const date = typeof d === "string" ? new Date(d) : d;
    if (isNaN(date.getTime())) return null;
    return date.toISOString().slice(0, 10);
  } catch {
    return null;
  }
}

// ─── SWAP POINT ───────────────────────────────────────────────────────────────
//
// getCalendarEvents() is the single place to replace when wiring the real API.
// The calendar UI receives CalendarEvent[] only — no data-layer types leak
// into the view layer. To connect the real backend:
//   1. Implement a real AdminDataSource in lib/admin/api-datasource.ts
//   2. This function calls ds.getMaintenanceTickets(), ds.getInquiries() etc.
//      which are already on the AdminDataSource interface — no further changes
//      needed in the UI.
//
// ─────────────────────────────────────────────────────────────────────────────
export async function getCalendarEvents(
  ds: AdminDataSource,
): Promise<CalendarEvent[]> {
  const [tickets, inquiries, machines, contracts, payouts, pos, venues] =
    await Promise.all([
      ds.getMaintenanceTickets(),
      ds.getInquiries(),
      ds.getAllMachines(),
      ds.getPartnerContracts(),
      ds.getPayoutRecords({
        from: new Date("2024-01-01"),
        to: new Date(Date.now() + 730 * 86_400_000), // 2 years ahead
      }),
      ds.getPurchaseOrders(),
      ds.getVenues(),
    ]);

  const venueMap = new Map(venues.map((v) => [v.id, v.name]));
  const events: CalendarEvent[] = [];

  // ── Maintenance tickets ──────────────────────────────────────────────────
  const ticketTypeLabel: Record<string, string> = {
    fault: "Fault",
    restock: "Restock",
    install: "Machine install",
    service: "Service",
  };
  for (const t of tickets) {
    if (t.archived) continue;
    const primaryDate = toDateStr(t.scheduledFor) ?? toDateStr(t.openedAt);
    if (!primaryDate) continue;
    const venueName = venueMap.get(t.venueId);
    events.push({
      id: `maint-${t.id}`,
      title: `${ticketTypeLabel[t.type] ?? t.type}${venueName ? ` — ${venueName}` : ""}`,
      type: "maintenance",
      date: primaryDate,
      venueId: t.venueId,
      venueName,
      machineId: t.machineId,
      status: t.status,
      assignee: t.assignee || undefined,
      priority: t.priority,
      description: t.notes,
      href: "/console/maintenance",
      badge: t.type,
    });
    // Completion event (if different from scheduled date)
    if (t.completedAt) {
      const doneDate = toDateStr(t.completedAt);
      if (doneDate && doneDate !== primaryDate) {
        events.push({
          id: `maint-done-${t.id}`,
          title: `${ticketTypeLabel[t.type] ?? t.type} done${venueName ? ` — ${venueName}` : ""}`,
          type: "maintenance",
          date: doneDate,
          venueId: t.venueId,
          venueName,
          machineId: t.machineId,
          status: "done",
          description: t.notes,
          href: "/console/maintenance",
          badge: t.type,
        });
      }
    }
  }

  // ── Inquiries ────────────────────────────────────────────────────────────
  for (const inq of inquiries) {
    if (inq.archived) continue;
    const dateStr = toDateStr(inq.receivedAt);
    if (!dateStr) continue;
    events.push({
      id: `inq-${inq.id}`,
      title: `Lead: ${inq.venueName}`,
      type: "inquiry",
      date: dateStr,
      venueName: inq.venueName,
      status: inq.status,
      assignee: inq.assignedTo ?? undefined,
      description: `${inq.contactName} · ${inq.city}`,
      href: "/console/inquiries",
    });
  }

  // ── Payouts ──────────────────────────────────────────────────────────────
  // Paid records: event at paidDate.
  // Due records: event at end of current month as an upcoming obligation.
  const today = new Date();
  const eomStr = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    .toISOString()
    .slice(0, 10);

  for (const p of payouts) {
    if (p.status === "paid" && p.paidDate) {
      events.push({
        id: `payout-paid-${p.venueId}`,
        title: `Payout paid — ${p.venueName}`,
        type: "payout",
        date: p.paidDate,
        venueId: p.venueId,
        venueName: p.venueName,
        status: "paid",
        description:
          p.partnerShareGbp > 0
            ? `£${p.partnerShareGbp.toFixed(2)} partner share`
            : `Lease / purchase — no commission`,
        href: "/console/payouts",
      });
    } else if (p.status === "due" && p.partnerShareGbp > 0) {
      events.push({
        id: `payout-due-${p.venueId}`,
        title: `Payout due — ${p.venueName}`,
        type: "payout",
        date: eomStr,
        venueId: p.venueId,
        venueName: p.venueName,
        status: "due",
        description: `£${p.partnerShareGbp.toFixed(2)} partner share due`,
        href: "/console/payouts",
      });
    }
  }

  // ── Contract dates ───────────────────────────────────────────────────────
  for (const c of contracts) {
    if (c.startDate && c.startDate !== "—") {
      events.push({
        id: `contract-start-${c.venueId}`,
        title: `Go-live — ${c.venueName}`,
        type: "contract",
        date: c.startDate,
        venueId: c.venueId,
        venueName: c.venueName,
        status: c.status,
        description: `${c.model.replace(/-/g, " ")} contract starts`,
        href: "/console/partners",
      });
    }
    if (c.endDate) {
      events.push({
        id: `contract-end-${c.venueId}`,
        title: `Contract expiry — ${c.venueName}`,
        type: "contract",
        date: c.endDate,
        venueId: c.venueId,
        venueName: c.venueName,
        status: c.status,
        description: `${c.model.replace(/-/g, " ")} contract ends`,
        href: "/console/partners",
        badge: c.status,
      });
    }
  }

  // ── Machine installs ─────────────────────────────────────────────────────
  for (const m of machines) {
    if (!m.installDate || m.installDate === "—") continue;
    const venueName = venueMap.get(m.venueId);
    events.push({
      id: `install-${m.id}`,
      title: `Install — ${m.locationLabel}${venueName ? `, ${venueName}` : ""}`,
      type: "install",
      date: m.installDate,
      venueId: m.venueId,
      venueName,
      machineId: m.id,
      status: m.status === "online" ? "done" : "pending",
      description: `${m.model} at ${m.locationLabel}`,
      href: "/console/venues",
    });
  }

  // ── Purchase orders (deliveries) ─────────────────────────────────────────
  for (const po of pos) {
    const dateStr = toDateStr(po.createdAt);
    if (!dateStr) continue;
    events.push({
      id: `po-${po.id}`,
      title: `PO: ${po.fragrance}`,
      type: "delivery",
      date: dateStr,
      status: po.status,
      description: `${po.qty} × ${po.fragrance} from ${po.supplier}`,
      href: "/console/inventory",
      badge: po.status,
    });
  }

  return events;
}
