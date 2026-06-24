"use client";

import { useState, useTransition } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import type { MaintenanceTicket, TicketStatus, Priority, TicketType } from "@/lib/admin/types";

const PRIORITY_STYLES: Record<Priority, string> = {
  urgent: "bg-red-50 text-red-600",
  high:   "bg-amber-50 text-amber-700",
  medium: "bg-blue-50 text-blue-700",
  low:    "bg-stone/10 text-stone",
};

const STATUS_STYLES: Record<TicketStatus, string> = {
  open:      "bg-red-50 text-red-600",
  scheduled: "bg-amber-50 text-amber-700",
  done:      "bg-green-50 text-green-700",
};

const SLA_HOURS: Record<Priority, number> = {
  urgent: 4, high: 24, medium: 72, low: 168,
};

async function serverUpdateTicket(id: string, status: TicketStatus) {
  await fetch("/api/console/maintenance", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status }),
  });
}

interface Props {
  tickets: MaintenanceTicket[];
  venueNames: Record<string, string>;
}

export function MaintenanceClient({ tickets: initial, venueNames }: Props) {
  const [tickets, setTickets] = useState(initial);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "">("");
  const [typeFilter, setTypeFilter] = useState<TicketType | "">("");
  const [isPending, startTransition] = useTransition();

  const filtered = tickets.filter((t) => {
    if (statusFilter && t.status !== statusFilter) return false;
    if (priorityFilter && t.priority !== priorityFilter) return false;
    if (typeFilter && t.type !== typeFilter) return false;
    return true;
  });

  function isOverdue(t: MaintenanceTicket) {
    if (t.status === "done") return false;
    const sla = SLA_HOURS[t.priority] * 3_600_000;
    return Date.now() - t.openedAt.getTime() > sla;
  }

  function updateStatus(id: string, status: TicketStatus) {
    setTickets((prev) => prev.map((t) =>
      t.id === id ? { ...t, status, completedAt: status === "done" ? new Date() : t.completedAt } : t
    ));
    startTransition(() => { serverUpdateTicket(id, status); });
  }

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(["open", "scheduled", "done"] as TicketStatus[]).map((s) => (
          <button key={s} onClick={() => setStatusFilter(s === statusFilter ? "" : s)}
            className={`px-3 py-1.5 rounded-full font-sans text-xs border transition-colors ${statusFilter === s ? "bg-ink text-bone border-ink" : "border-stone/20 text-stone hover:text-ink"}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)} ({tickets.filter((t) => t.status === s).length})
          </button>
        ))}
        <div className="h-5 border-l border-stone/20 mx-0.5 self-center" />
        {(["urgent", "high", "medium", "low"] as Priority[]).map((p) => (
          <button key={p} onClick={() => setPriorityFilter(p === priorityFilter ? "" : p)}
            className={`px-3 py-1.5 rounded-full font-sans text-xs border transition-colors capitalize ${priorityFilter === p ? "bg-ink text-bone border-ink" : "border-stone/20 text-stone hover:text-ink"}`}>
            {p}
          </button>
        ))}
        <div className="h-5 border-l border-stone/20 mx-0.5 self-center" />
        {(["restock", "fault", "install", "service"] as TicketType[]).map((t) => (
          <button key={t} onClick={() => setTypeFilter(t === typeFilter ? "" : t)}
            className={`px-3 py-1.5 rounded-full font-sans text-xs border transition-colors capitalize ${typeFilter === t ? "bg-ink text-bone border-ink" : "border-stone/20 text-stone hover:text-ink"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-stone/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-stone/10">
                {["Ticket", "Venue", "Machine", "Type", "Priority", "Status", "Opened", "Assignee", "Actions"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => {
                const overdue = isOverdue(t);
                return (
                  <tr key={t.id} className={`border-b border-stone/5 ${i % 2 === 0 ? "" : "bg-stone/[0.02]"} ${overdue ? "bg-amber-50/40" : ""}`}>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1">
                        {overdue && <AlertTriangle size={11} className="text-amber-500 shrink-0" />}
                        <span className="font-sans text-xs font-semibold text-ink">{t.id}</span>
                      </div>
                      <p className="font-sans text-[10px] text-stone mt-0.5 max-w-[200px] line-clamp-1">{t.notes}</p>
                    </td>
                    <td className="px-3 py-2.5 text-ink">{venueNames[t.venueId] ?? t.venueId}</td>
                    <td className="px-3 py-2.5 text-stone">{t.machineId}</td>
                    <td className="px-3 py-2.5 capitalize text-stone">{t.type}</td>
                    <td className="px-3 py-2.5">
                      <span className={`px-1.5 py-0.5 rounded font-sans text-[10px] font-semibold capitalize ${PRIORITY_STYLES[t.priority]}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1">
                        <span className={`px-1.5 py-0.5 rounded font-sans text-[10px] font-semibold capitalize ${STATUS_STYLES[t.status]}`}>
                          {t.status}
                        </span>
                        {overdue && (
                          <span className="font-sans text-[10px] text-amber-600 flex items-center gap-0.5">
                            <Clock size={10} /> SLA
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-stone whitespace-nowrap">
                      {t.openedAt.toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-3 py-2.5 text-stone">{t.assignee || "—"}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex gap-1">
                        {(["open", "scheduled", "done"] as TicketStatus[])
                          .filter((s) => s !== t.status)
                          .map((s) => (
                            <button
                              key={s}
                              onClick={() => updateStatus(t.id, s)}
                              disabled={isPending}
                              className="px-2 py-0.5 rounded font-sans text-[10px] border border-stone/20 text-stone hover:text-ink hover:border-stone/40 transition-colors capitalize disabled:opacity-50"
                            >
                              → {s}
                            </button>
                          ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center font-sans text-sm text-stone py-8">No tickets match the current filters.</p>
        )}
      </div>
    </div>
  );
}
