"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Archive, RotateCcw } from "lucide-react";
import type { AdminMachine, MachineStatusValue, MachineInput } from "@/lib/admin/types";
import { FormModal } from "@/app/console/_components/FormModal";
import { ConfirmDialog } from "@/app/console/_components/ConfirmDialog";
import { ToastList } from "@/app/console/_components/ToastList";
import { useToast } from "@/app/console/_components/useToast";

const MSTATUS_STYLES: Record<MachineStatusValue, string> = {
  online:  "bg-green-50 text-green-700",
  fault:   "bg-red-50 text-red-600",
  offline: "bg-stone/10 text-stone",
};

// ── Machine form ──────────────────────────────────────────────────────────────

function MachineForm({
  venueId,
  initial,
  onClose,
  onSaved,
}: {
  venueId: string;
  initial?: AdminMachine | null;
  onClose: () => void;
  onSaved: (msg: string) => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState<MachineInput>({
    venueId,
    locationLabel: initial?.locationLabel ?? "",
    model: initial?.model ?? "ÉV-1",
    installDate: initial?.installDate === "—" ? "" : (initial?.installDate ?? ""),
    status: initial?.status ?? "offline",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof MachineInput>(k: K, v: MachineInput[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch("/api/console/machines", {
      method: initial ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(initial ? { id: initial.id, ...form } : form),
    });
    setSaving(false);
    if (!res.ok) { setError("Save failed. Please try again."); return; }
    router.refresh();
    onSaved(initial ? "Machine updated" : "Machine added");
    onClose();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <p className="font-sans text-xs text-red-600">{error}</p>}

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Location label</span>
          <input type="text" required className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs"
            value={form.locationLabel} onChange={(e) => set("locationLabel", e.target.value)} />
        </label>
        <label className="block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Model</span>
          <input type="text" required className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs"
            value={form.model} onChange={(e) => set("model", e.target.value)} />
        </label>
        <label className="block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Install date</span>
          <input type="date" className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs"
            value={form.installDate ?? ""} onChange={(e) => set("installDate", e.target.value)} />
        </label>
        <label className="block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Status</span>
          <select className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs bg-white"
            value={form.status} onChange={(e) => set("status", e.target.value as MachineStatusValue)}>
            <option value="offline">Offline</option>
            <option value="online">Online</option>
            <option value="fault">Fault</option>
          </select>
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-stone/20 font-sans text-xs font-semibold text-stone">Cancel</button>
        <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-ink text-bone font-sans text-xs font-semibold disabled:opacity-50">
          {saving ? "Saving…" : initial ? "Save changes" : "Add machine"}
        </button>
      </div>
    </form>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  venueId: string;
  machines: (AdminMachine & { archived?: boolean })[];
}

export function VenueMachinesClient({ venueId, machines: initial }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const { toasts, addToast, removeToast } = useToast();
  const [showArchived, setShowArchived] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editMachine, setEditMachine] = useState<AdminMachine | null>(null);
  const [archiveMachine, setArchiveMachineState] = useState<AdminMachine | null>(null);
  const [restoreMachine, setRestoreMachineState] = useState<AdminMachine | null>(null);
  const [acting, setActing] = useState(false);

  const visible = showArchived
    ? initial.filter((m) => m.archived)
    : initial.filter((m) => !m.archived);

  const archivedCount = initial.filter((m) => m.archived).length;

  async function sendAction(id: string, action: "archive" | "restore") {
    setActing(true);
    const res = await fetch("/api/console/machines", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    setActing(false);
    setArchiveMachineState(null);
    setRestoreMachineState(null);
    if (res.ok) {
      addToast(action === "archive" ? "Machine archived" : "Machine restored");
      startTransition(() => router.refresh());
    } else {
      addToast("Action failed", "error");
    }
  }

  return (
    <div>
      <ToastList toasts={toasts} onRemove={removeToast} />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone">
            Machines ({visible.length})
          </p>
          {archivedCount > 0 && (
            <button
              onClick={() => setShowArchived((v) => !v)}
              className="font-sans text-[10px] text-stone/50 hover:text-stone transition-colors"
            >
              {showArchived ? "Show active" : `+${archivedCount} archived`}
            </button>
          )}
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-ink/5 hover:bg-ink/10 font-sans text-[10px] font-semibold text-ink transition-colors"
        >
          <Plus size={11} /> Add machine
        </button>
      </div>

      {visible.length === 0 ? (
        <p className="text-stone text-xs">{showArchived ? "No archived machines." : "No active machines."}</p>
      ) : (
        <div className="space-y-2">
          {visible.map((m) => (
            <div key={m.id} className={`flex items-center justify-between py-2 border-b border-stone/5 last:border-0 group ${m.archived ? "opacity-60" : ""}`}>
              <div className="min-w-0 flex-1">
                <p className="font-sans text-xs font-semibold text-ink">{m.id} · {m.locationLabel}</p>
                <p className="font-sans text-[10px] text-stone">{m.model} · FW {m.firmware}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-2 py-0.5 rounded-full font-sans text-[10px] font-semibold ${MSTATUS_STYLES[m.status]}`}>
                  {m.status}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!m.archived && (
                    <button onClick={() => setEditMachine(m)} className="p-0.5 text-stone/50 hover:text-ink transition-colors" aria-label="Edit">
                      <Pencil size={12} />
                    </button>
                  )}
                  {!m.archived && (
                    <button onClick={() => setArchiveMachineState(m)} className="p-0.5 text-stone/50 hover:text-amber-600 transition-colors" aria-label="Archive">
                      <Archive size={12} />
                    </button>
                  )}
                  {m.archived && (
                    <button onClick={() => setRestoreMachineState(m)} className="p-0.5 text-stone/50 hover:text-green-700 transition-colors" aria-label="Restore">
                      <RotateCcw size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {addOpen && (
        <FormModal title="Add machine" onClose={() => setAddOpen(false)} size="sm">
          <MachineForm venueId={venueId} onClose={() => setAddOpen(false)} onSaved={addToast} />
        </FormModal>
      )}
      {editMachine && (
        <FormModal title="Edit machine" onClose={() => setEditMachine(null)} size="sm">
          <MachineForm venueId={venueId} initial={editMachine} onClose={() => setEditMachine(null)} onSaved={addToast} />
        </FormModal>
      )}
      {archiveMachine && (
        <ConfirmDialog
          mode="archive"
          title={`Archive ${archiveMachine.id}?`}
          description="The machine will be marked inactive. Restore it anytime."
          onConfirm={() => sendAction(archiveMachine.id, "archive")}
          onCancel={() => setArchiveMachineState(null)}
          isPending={acting}
        />
      )}
      {restoreMachine && (
        <ConfirmDialog
          mode="restore"
          title={`Restore ${restoreMachine.id}?`}
          onConfirm={() => sendAction(restoreMachine.id, "restore")}
          onCancel={() => setRestoreMachineState(null)}
          isPending={acting}
        />
      )}
    </div>
  );
}
