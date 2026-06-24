"use client";

import { useState, useTransition, useMemo, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Package, Truck, CheckSquare, Square, AlertTriangle,
  Plus, Pencil, Trash2,
} from "lucide-react";
import { FormModal } from "@/app/console/_components/FormModal";
import { ConfirmDialog } from "@/app/console/_components/ConfirmDialog";
import { ToastList } from "@/app/console/_components/ToastList";
import { useToast } from "@/app/console/_components/useToast";
import type { AdminStockItem, RestockItem, Venue, AdminMachine } from "@/lib/admin/types";
import { RestockClient } from "@/app/console/restock/RestockClient";

interface Props {
  allStock: AdminStockItem[];
  restockItems: RestockItem[];
  venues: Venue[];
  machines: AdminMachine[];
  view: "stock" | "restock";
}

// ── Stock slot form ──────────────────────────────────────────────────────────

interface SlotFormData {
  venueId: string;
  machineId: string;
  slot: number | "";
  fragrance: string;
  quantity: number | "";
  capacity: number | "";
  lowStockThreshold: number | "";
}

function SlotForm({
  venues,
  machines,
  initial,
  onClose,
  onSaved,
}: {
  venues: Venue[];
  machines: AdminMachine[];
  initial?: AdminStockItem | null;
  onClose: () => void;
  onSaved: (msg: string) => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState<SlotFormData>({
    venueId: initial?.venueId ?? "",
    machineId: initial?.machineId ?? "",
    slot: initial?.slot ?? "",
    fragrance: initial?.fragrance ?? "",
    quantity: initial?.quantity ?? "",
    capacity: initial?.capacity ?? "",
    lowStockThreshold: initial?.lowStockThreshold ?? 3,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filteredMachines = machines.filter((m) => !form.venueId || m.venueId === form.venueId);

  function set(key: keyof SlotFormData, val: string | number) {
    setForm((p) => ({ ...p, [key]: val }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const method = initial ? "PATCH" : "POST";
    const body = initial
      ? { id: `${initial.machineId}-${initial.slot}`, ...form }
      : form;
    const res = await fetch("/api/console/stock", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (!res.ok) { setError("Save failed. Please try again."); return; }
    router.refresh();
    onSaved(initial ? "Slot updated" : "Slot added");
    onClose();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <p className="font-sans text-xs text-red-600">{error}</p>}

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Venue</span>
          <select
            className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs text-ink bg-white"
            value={form.venueId}
            onChange={(e) => { set("venueId", e.target.value); set("machineId", ""); }}
            required
          >
            <option value="">Select venue…</option>
            {venues.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </label>

        <label className="block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Machine</span>
          <select
            className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs text-ink bg-white"
            value={form.machineId}
            onChange={(e) => set("machineId", e.target.value)}
            required
          >
            <option value="">Select machine…</option>
            {filteredMachines.map((m) => <option key={m.id} value={m.id}>{m.id}</option>)}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Slot #</span>
          <input
            type="number" min={1} max={20}
            className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs"
            value={form.slot}
            onChange={(e) => set("slot", parseInt(e.target.value) || "")}
            required
          />
        </label>

        <label className="block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Fragrance</span>
          <input
            type="text"
            className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs"
            value={form.fragrance}
            onChange={(e) => set("fragrance", e.target.value)}
            required
          />
        </label>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <label className="block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Qty</span>
          <input
            type="number" min={0}
            className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs"
            value={form.quantity}
            onChange={(e) => set("quantity", parseInt(e.target.value) || 0)}
            required
          />
        </label>
        <label className="block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Capacity</span>
          <input
            type="number" min={1}
            className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs"
            value={form.capacity}
            onChange={(e) => set("capacity", parseInt(e.target.value) || "")}
            required
          />
        </label>
        <label className="block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Low alert</span>
          <input
            type="number" min={0}
            className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs"
            value={form.lowStockThreshold}
            onChange={(e) => set("lowStockThreshold", parseInt(e.target.value) || 0)}
            required
          />
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-stone/20 font-sans text-xs font-semibold text-stone">Cancel</button>
        <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-ink text-bone font-sans text-xs font-semibold disabled:opacity-50">
          {saving ? "Saving…" : initial ? "Save changes" : "Add slot"}
        </button>
      </div>
    </form>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function StockTabsClient({ allStock, restockItems, venues, machines, view }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const { toasts, addToast, removeToast } = useToast();

  const [addSlotOpen, setAddSlotOpen] = useState(false);
  const [editSlot, setEditSlot] = useState<AdminStockItem | null>(null);
  const [deleteSlot, setDeleteSlot] = useState<AdminStockItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const lowItems = allStock.filter((s) => s.quantity <= s.lowStockThreshold);
  const emptyItems = allStock.filter((s) => s.quantity === 0);

  // Group by venue
  const byVenue = useMemo(() => {
    const map = new Map<string, AdminStockItem[]>();
    allStock.forEach((s) => {
      if (!map.has(s.venueId)) map.set(s.venueId, []);
      map.get(s.venueId)!.push(s);
    });
    return map;
  }, [allStock]);

  const restockPriority = useMemo(() => venues
    .map((v) => {
      const vStock = byVenue.get(v.id) ?? [];
      const lowCount = vStock.filter((s) => s.quantity <= s.lowStockThreshold).length;
      const emptyCount = vStock.filter((s) => s.quantity === 0).length;
      return { venue: v, lowCount, emptyCount, score: emptyCount * 2 + lowCount };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score), [venues, byVenue]);

  function switchTab(newView: "stock" | "restock") {
    const params = new URLSearchParams();
    if (newView !== "stock") params.set("view", newView);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  async function handleDelete() {
    if (!deleteSlot) return;
    setDeleting(true);
    const res = await fetch(`/api/console/stock?id=${deleteSlot.machineId}-${deleteSlot.slot}`, {
      method: "DELETE",
    });
    setDeleting(false);
    setDeleteSlot(null);
    if (res.ok) {
      addToast("Slot removed");
      startTransition(() => router.refresh());
    } else {
      addToast("Delete failed", "error");
    }
  }

  const tabs: { id: "stock" | "restock"; label: string; icon: React.ElementType }[] = [
    { id: "stock", label: "Stock levels", icon: Package },
    { id: "restock", label: "Restock planner", icon: Truck },
  ];

  return (
    <div className="space-y-5">
      <ToastList toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-serif text-xl font-bold text-ink">Stock</h1>
        <div className="flex gap-2">
          {view === "stock" && (
            <>
              <div className="bg-white border border-amber-200 rounded-xl px-3 py-2">
                <p className="font-sans text-[10px] text-stone">Low stock</p>
                <p className="font-serif text-lg font-bold text-amber-600">{lowItems.length}</p>
              </div>
              <div className="bg-white border border-red-200 rounded-xl px-3 py-2">
                <p className="font-sans text-[10px] text-stone">Empty</p>
                <p className="font-serif text-lg font-bold text-red-500">{emptyItems.length}</p>
              </div>
              <button
                onClick={() => setAddSlotOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-ink text-bone font-sans text-xs font-semibold hover:bg-ink/80 transition-colors"
              >
                <Plus size={13} /> Add slot
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-stone/5 rounded-xl p-1 w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => switchTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-sans text-xs font-semibold transition-colors ${
              view === id ? "bg-white text-ink shadow-sm" : "text-stone hover:text-ink"
            }`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Stock levels tab ─────────────────────────────────────────────── */}
      {view === "stock" && (
        <>
          {restockPriority.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-amber-700 mb-3">Restock priority</p>
              <div className="space-y-1.5">
                {restockPriority.slice(0, 5).map(({ venue, lowCount, emptyCount }) => (
                  <div key={venue.id} className="flex items-center justify-between gap-3">
                    <Link href={`/console/venues/${venue.id}`} className="font-sans text-xs font-semibold text-ink hover:text-accent transition-colors">
                      {venue.name}
                    </Link>
                    <div className="flex gap-2 font-sans text-xs text-stone">
                      {emptyCount > 0 && <span className="text-red-600 font-semibold">{emptyCount} empty</span>}
                      {lowCount > 0 && <span className="text-amber-600">{lowCount} low</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {venues
              .filter((v) => byVenue.has(v.id))
              .map((venue) => {
                const vStock = byVenue.get(venue.id)!;
                const vMachines = machines.filter((m) => m.venueId === venue.id && vStock.some((s) => s.machineId === m.id));
                return (
                  <div key={venue.id} className="bg-white border border-stone/10 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Link href={`/console/venues/${venue.id}`} className="font-sans text-sm font-semibold text-ink hover:text-accent transition-colors">
                        {venue.name}
                      </Link>
                      <span className="font-sans text-xs text-stone">{venue.area}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {vMachines.map((machine) => {
                        const mStock = vStock.filter((s) => s.machineId === machine.id);
                        return (
                          <div key={machine.id} className="border border-stone/10 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-sans text-xs font-semibold text-ink">{machine.id}</p>
                              <p className="font-sans text-[10px] text-stone">{machine.locationLabel}</p>
                            </div>
                            <div className="space-y-1.5">
                              {mStock.map((s) => {
                                const pct = Math.max(0, Math.min(100, (s.quantity / s.capacity) * 100));
                                const isEmpty = s.quantity === 0;
                                const isLow = !isEmpty && s.quantity <= s.lowStockThreshold;
                                return (
                                  <div key={s.slot} className="flex items-center gap-2 group">
                                    <span className="font-sans text-[10px] text-stone/60 w-3 shrink-0 text-right">{s.slot}</span>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-sans text-[10px] text-ink truncate mb-0.5">{s.fragrance}</p>
                                      <div className="h-1 bg-stone/10 rounded-full">
                                        <div
                                          className={`h-full rounded-full transition-all ${isEmpty ? "bg-red-400" : isLow ? "bg-amber-400" : "bg-accent"}`}
                                          style={{ width: `${pct}%` }}
                                        />
                                      </div>
                                    </div>
                                    <span className={`font-sans text-[10px] shrink-0 tabular-nums ${isEmpty ? "text-red-600 font-bold" : isLow ? "text-amber-600 font-semibold" : "text-stone"}`}>
                                      {s.quantity}/{s.capacity}
                                    </span>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button onClick={() => setEditSlot(s)} className="p-0.5 text-stone/50 hover:text-ink" aria-label="Edit slot">
                                        <Pencil size={10} />
                                      </button>
                                      <button onClick={() => setDeleteSlot(s)} className="p-0.5 text-stone/50 hover:text-red-500" aria-label="Delete slot">
                                        <Trash2 size={10} />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}

      {/* ── Restock planner tab ──────────────────────────────────────────── */}
      {view === "restock" && (
        <RestockClient items={restockItems} />
      )}

      {/* Modals */}
      {addSlotOpen && (
        <FormModal title="Add stock slot" onClose={() => setAddSlotOpen(false)}>
          <SlotForm venues={venues} machines={machines} onClose={() => setAddSlotOpen(false)} onSaved={addToast} />
        </FormModal>
      )}
      {editSlot && (
        <FormModal title="Edit stock slot" onClose={() => setEditSlot(null)}>
          <SlotForm venues={venues} machines={machines} initial={editSlot} onClose={() => setEditSlot(null)} onSaved={addToast} />
        </FormModal>
      )}
      {deleteSlot && (
        <ConfirmDialog
          mode="delete"
          title={`Delete slot ${deleteSlot.slot} on ${deleteSlot.machineId}?`}
          description={`${deleteSlot.fragrance} — this cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteSlot(null)}
          isPending={deleting}
        />
      )}
    </div>
  );
}
