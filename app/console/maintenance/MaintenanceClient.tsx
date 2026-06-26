"use client";

import { useState, useTransition } from "react";
import { Clock, AlertTriangle, Plus, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ConsoleHeader } from "@/app/console/_components/ConsoleHeader";
import type {
  MaintenanceTicket, TicketStatus, Priority, TicketType, TicketInput,
} from "@/lib/admin/types";
import { FormModal } from "@/app/console/_components/FormModal";
import { ConfirmDialog } from "@/app/console/_components/ConfirmDialog";
import { ToastList } from "@/app/console/_components/ToastList";
import { useToast } from "@/app/console/_components/useToast";

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

// ── Ticket form ───────────────────────────────────────────────────────────────

function TicketForm({
  initial,
  venueNames,
  machineOptions,
  onClose,
  onSaved,
}: {
  initial?: MaintenanceTicket | null;
  venueNames: Record<string, string>;
  machineOptions: Array<{ id: string; venueId: string; label: string }>;
  onClose: () => void;
  onSaved: (msg: string) => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState<TicketInput>({
    machineId: initial?.machineId ?? "",
    venueId: initial?.venueId ?? "",
    type: initial?.type ?? "fault",
    priority: initial?.priority ?? "medium",
    notes: initial?.notes ?? "",
    assignee: initial?.assignee ?? "",
    scheduledFor: initial?.scheduledFor instanceof Date
      ? initial.scheduledFor.toISOString().slice(0, 10)
      : (initial?.scheduledFor ?? null),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof TicketInput>(k: K, v: TicketInput[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  const selectedMachine = machineOptions.find((m) => m.id === form.machineId);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch("/api/console/maintenance", {
      method: initial ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(initial ? { id: initial.id, ...form } : form),
    });
    setSaving(false);
    if (!res.ok) { setError("Save failed. Please try again."); return; }
    router.refresh();
    onSaved(initial ? "Ticket updated" : "Ticket created");
    onClose();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <p className="font-sans text-xs text-red-600">{error}</p>}

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Machine</span>
          <select className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs bg-white"
            value={form.machineId}
            onChange={(e) => {
              const m = machineOptions.find((x) => x.id === e.target.value);
              set("machineId", e.target.value);
              if (m) set("venueId", m.venueId);
            }}
            required>
            <option value="">Select machine…</option>
            {machineOptions.map((m) => (
              <option key={m.id} value={m.id}>{m.id} — {m.label}</option>
            ))}
          </select>
        </label>

        <label className="block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Venue</span>
          <input type="text" readOnly
            className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs bg-stone/5 text-stone"
            value={selectedMachine ? (venueNames[selectedMachine.venueId] ?? selectedMachine.venueId) : "—"} />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Type</span>
          <select className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs bg-white"
            value={form.type} onChange={(e) => set("type", e.target.value as TicketType)} required>
            {(["fault", "restock", "install", "service"] as TicketType[]).map((t) => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </label>
        <label className="block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Priority</span>
          <select className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs bg-white"
            value={form.priority} onChange={(e) => set("priority", e.target.value as Priority)} required>
            {(["urgent", "high", "medium", "low"] as Priority[]).map((p) => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="block space-y-1">
        <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Notes</span>
        <textarea rows={3} required
          className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs resize-none"
          value={form.notes} onChange={(e) => set("notes", e.target.value)} />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Assignee</span>
          <input type="text" className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs"
            value={form.assignee} onChange={(e) => set("assignee", e.target.value)} />
        </label>
        <label className="block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Scheduled for</span>
          <input type="date" className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs"
            value={form.scheduledFor ?? ""} onChange={(e) => set("scheduledFor", e.target.value || null)} />
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-stone/20 font-sans text-xs font-semibold text-stone">Cancel</button>
        <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-ink text-bone font-sans text-xs font-semibold disabled:opacity-50">
          {saving ? "Saving…" : initial ? "Save changes" : "Create ticket"}
        </button>
      </div>
    </form>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  tickets: MaintenanceTicket[];
  venueNames: Record<string, string>;
  machineOptions: Array<{ id: string; venueId: string; label: string }>;
}

export function MaintenanceClient({ tickets: initial, venueNames, machineOptions }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const { toasts, addToast, removeToast } = useToast();
  const [tickets, setTickets] = useState(initial);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "">("");
  const [typeFilter, setTypeFilter] = useState<TicketType | "">("");
  const [isPending, startStatusTransition] = useTransition();
  const [addOpen, setAddOpen] = useState(false);
  const [editTicket, setEditTicket] = useState<MaintenanceTicket | null>(null);
  const [deleteTicket, setDeleteTicketState] = useState<MaintenanceTicket | null>(null);
  const [deleting, setDeleting] = useState(false);

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
    startStatusTransition(async () => {
      await fetch("/api/console/maintenance", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
    });
  }

  async function handleDelete() {
    if (!deleteTicket) return;
    setDeleting(true);
    const res = await fetch(`/api/console/maintenance?id=${deleteTicket.id}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteTicketState(null);
    if (res.ok) {
      setTickets((prev) => prev.filter((t) => t.id !== deleteTicket.id));
      addToast("Ticket deleted");
    } else {
      addToast("Delete failed", "error");
    }
  }

  return (
    <>
      <ConsoleHeader
        title="Maintenance"
        actions={
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-ink text-bone font-sans text-xs font-semibold hover:bg-ink/80 transition-colors"
          >
            <Plus size={13} /> New ticket
          </button>
        }
      />
      <div className="p-4 pb-6 lg:p-6 space-y-3">
      <ToastList toasts={toasts} onRemove={removeToast} />

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
                      <div className="flex items-center gap-1.5">
                        {(["open", "scheduled", "done"] as TicketStatus[])
                          .filter((s) => s !== t.status)
                          .map((s) => (
                            <button key={s} onClick={() => updateStatus(t.id, s)} disabled={isPending}
                              className="px-2 py-0.5 rounded font-sans text-[10px] border border-stone/20 text-stone hover:text-ink hover:border-stone/40 transition-colors capitalize disabled:opacity-50">
                              → {s}
                            </button>
                          ))}
                        <div className="h-3 border-l border-stone/20 mx-0.5" />
                        <button onClick={() => setEditTicket(t)} className="p-0.5 text-stone/50 hover:text-ink transition-colors" aria-label="Edit">
                          <Pencil size={12} />
                        </button>
                        <button onClick={() => setDeleteTicketState(t)} className="p-0.5 text-stone/50 hover:text-red-500 transition-colors" aria-label="Delete">
                          <Trash2 size={12} />
                        </button>
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

      {/* Modals */}
      {addOpen && (
        <FormModal title="New maintenance ticket" onClose={() => setAddOpen(false)}>
          <TicketForm venueNames={venueNames} machineOptions={machineOptions} onClose={() => setAddOpen(false)} onSaved={(msg) => { addToast(msg); startTransition(() => router.refresh()); }} />
        </FormModal>
      )}
      {editTicket && (
        <FormModal title="Edit ticket" onClose={() => setEditTicket(null)}>
          <TicketForm initial={editTicket} venueNames={venueNames} machineOptions={machineOptions} onClose={() => setEditTicket(null)} onSaved={(msg) => { addToast(msg); startTransition(() => router.refresh()); }} />
        </FormModal>
      )}
      {deleteTicket && (
        <ConfirmDialog
          mode="delete"
          title={`Delete ticket ${deleteTicket.id}?`}
          description="This cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteTicketState(null)}
          isPending={deleting}
        />
      )}
      </div>
    </>
  );
}
