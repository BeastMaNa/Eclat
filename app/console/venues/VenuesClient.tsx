"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Archive, RotateCcw } from "lucide-react";
import { FormModal } from "@/app/console/_components/FormModal";
import { ConfirmDialog } from "@/app/console/_components/ConfirmDialog";
import { ToastList } from "@/app/console/_components/ToastList";
import { useToast } from "@/app/console/_components/useToast";
import type { Venue, VenueStatus, PartnershipModel, VenueInput } from "@/lib/admin/types";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(v);

const STATUS_STYLES: Record<VenueStatus, string> = {
  "live": "bg-green-50 text-green-700",
  "install-pending": "bg-amber-50 text-amber-700",
  "paused": "bg-stone/10 text-stone",
};

const MODEL_LABEL: Record<PartnershipModel, string> = {
  "revenue-share": "Rev Share",
  "lease": "Lease",
  "purchase": "Purchase",
};

const TYPE_LABEL: Record<string, string> = {
  "cocktail-bar": "Cocktail Bar", "hotel": "Hotel", "nightclub": "Nightclub",
  "bar-restaurant": "Bar & Restaurant", "restaurant": "Restaurant",
  "food-hall": "Food Hall", "arcade-bar": "Arcade Bar",
};

const VENUE_TYPES = Object.keys(TYPE_LABEL);

// ── Venue form ────────────────────────────────────────────────────────────────

function VenueForm({
  initial,
  onClose,
  onSaved,
}: {
  initial?: Venue | null;
  onClose: () => void;
  onSaved: (msg: string) => void;
}) {
  const router = useRouter();
  const blank: VenueInput = {
    name: "", area: "", type: "cocktail-bar", address: "",
    lat: 53.479, lng: -2.245, status: "install-pending",
    partnershipModel: "revenue-share", goLiveDate: "",
    commissionPct: 15, contactName: "", contactEmail: "",
  };
  const [form, setForm] = useState<VenueInput>(initial ? {
    name: initial.name, area: initial.area, type: initial.type,
    address: initial.address ?? "", lat: initial.lat, lng: initial.lng,
    status: initial.status, partnershipModel: initial.partnershipModel,
    goLiveDate: initial.goLiveDate ?? "", commissionPct: initial.commissionPct,
    contactName: initial.contactName, contactEmail: initial.contactEmail,
  } : blank);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof VenueInput>(k: K, v: VenueInput[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch("/api/console/venues", {
      method: initial ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(initial ? { id: initial.id, ...form } : form),
    });
    setSaving(false);
    if (!res.ok) { setError("Save failed. Please try again."); return; }
    router.refresh();
    onSaved(initial ? `${form.name} updated` : `${form.name} added`);
    onClose();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <p className="font-sans text-xs text-red-600">{error}</p>}

      <div className="grid grid-cols-2 gap-3">
        <label className="col-span-2 block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Venue name</span>
          <input type="text" required className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs"
            value={form.name} onChange={(e) => set("name", e.target.value)} />
        </label>
        <label className="block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Area</span>
          <input type="text" required className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs"
            value={form.area} onChange={(e) => set("area", e.target.value)} />
        </label>
        <label className="block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Type</span>
          <select className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs bg-white"
            value={form.type} onChange={(e) => set("type", e.target.value)} required>
            {VENUE_TYPES.map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
          </select>
        </label>
      </div>

      <label className="block space-y-1">
        <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Address</span>
        <input type="text" className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs"
          value={form.address} onChange={(e) => set("address", e.target.value)} />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Lat</span>
          <input type="number" step="any" required className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs"
            value={form.lat} onChange={(e) => set("lat", parseFloat(e.target.value) || 0)} />
        </label>
        <label className="block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Lng</span>
          <input type="number" step="any" required className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs"
            value={form.lng} onChange={(e) => set("lng", parseFloat(e.target.value) || 0)} />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Status</span>
          <select className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs bg-white"
            value={form.status} onChange={(e) => set("status", e.target.value as VenueStatus)} required>
            <option value="install-pending">Install pending</option>
            <option value="live">Live</option>
            <option value="paused">Paused</option>
          </select>
        </label>
        <label className="block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Go-live date</span>
          <input type="date" className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs"
            value={form.goLiveDate} onChange={(e) => set("goLiveDate", e.target.value)} />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Partnership model</span>
          <select className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs bg-white"
            value={form.partnershipModel} onChange={(e) => set("partnershipModel", e.target.value as PartnershipModel)} required>
            <option value="revenue-share">Revenue share</option>
            <option value="lease">Lease</option>
            <option value="purchase">Purchase</option>
          </select>
        </label>
        <label className="block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Commission %</span>
          <input type="number" min={0} max={100} step={0.5} className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs"
            value={form.commissionPct} onChange={(e) => set("commissionPct", parseFloat(e.target.value) || 0)} />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Contact name</span>
          <input type="text" required className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs"
            value={form.contactName} onChange={(e) => set("contactName", e.target.value)} />
        </label>
        <label className="block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Contact email</span>
          <input type="email" required className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs"
            value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-stone/20 font-sans text-xs font-semibold text-stone">Cancel</button>
        <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-ink text-bone font-sans text-xs font-semibold disabled:opacity-50">
          {saving ? "Saving…" : initial ? "Save changes" : "Add venue"}
        </button>
      </div>
    </form>
  );
}

// ── Main client component ─────────────────────────────────────────────────────

interface Props {
  venues: (Venue & { archived?: boolean })[];
  machineCountMap: Record<string, number>;
  revenueMap: Record<string, number>;
}

export function VenuesClient({ venues, machineCountMap, revenueMap }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const { toasts, addToast, removeToast } = useToast();
  const [statusFilter, setStatusFilter] = useState<VenueStatus | "">("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editVenue, setEditVenue] = useState<Venue | null>(null);
  const [archiveVenue, setArchiveVenueState] = useState<Venue | null>(null);
  const [restoreVenue, setRestoreVenueState] = useState<Venue | null>(null);
  const [acting, setActing] = useState(false);

  const uniqueTypes = useMemo(() => [...new Set(venues.map((v) => v.type))].sort(), [venues]);

  const filtered = useMemo(() => venues.filter((v) => {
    if (!showArchived && v.archived) return false;
    if (showArchived && !v.archived) return false;
    if (statusFilter && v.status !== statusFilter) return false;
    if (typeFilter && v.type !== typeFilter) return false;
    return true;
  }), [venues, statusFilter, typeFilter, showArchived]);

  const archivedCount = venues.filter((v) => v.archived).length;

  async function sendAction(id: string, action: "archive" | "restore") {
    setActing(true);
    const res = await fetch("/api/console/venues", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    setActing(false);
    if (res.ok) {
      addToast(action === "archive" ? "Venue archived" : "Venue restored");
      startTransition(() => router.refresh());
    } else {
      addToast("Action failed", "error");
    }
    setArchiveVenueState(null);
    setRestoreVenueState(null);
  }

  return (
    <div className="space-y-4">
      <ToastList toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-serif text-xl font-bold text-ink">Venues</h1>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-ink text-bone font-sans text-xs font-semibold hover:bg-ink/80 transition-colors"
        >
          <Plus size={13} /> Add venue
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap items-center">
        <button onClick={() => { setStatusFilter(""); setTypeFilter(""); setShowArchived(false); }}
          className={`px-3 py-1.5 rounded-full font-sans text-xs border transition-colors ${!statusFilter && !typeFilter && !showArchived ? "bg-ink text-bone border-ink" : "border-stone/20 text-stone hover:text-ink"}`}>
          All
        </button>
        {(["live", "install-pending", "paused"] as VenueStatus[]).map((s) => (
          <button key={s} onClick={() => { setStatusFilter(s === statusFilter ? "" : s); setShowArchived(false); }}
            className={`px-3 py-1.5 rounded-full font-sans text-xs border transition-colors ${statusFilter === s && !showArchived ? "bg-ink text-bone border-ink" : "border-stone/20 text-stone hover:text-ink"}`}>
            {s === "install-pending" ? "Pending" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        {uniqueTypes.map((t) => (
          <button key={t} onClick={() => { setTypeFilter(t === typeFilter ? "" : t); setShowArchived(false); }}
            className={`px-3 py-1.5 rounded-full font-sans text-xs border transition-colors ${typeFilter === t && !showArchived ? "bg-ink text-bone border-ink" : "border-stone/20 text-stone hover:text-ink"}`}>
            {TYPE_LABEL[t] ?? t}
          </button>
        ))}
        {archivedCount > 0 && (
          <button onClick={() => { setShowArchived((v) => !v); setStatusFilter(""); setTypeFilter(""); }}
            className={`px-3 py-1.5 rounded-full font-sans text-xs border transition-colors ${showArchived ? "bg-ink text-bone border-ink" : "border-stone/20 text-stone hover:text-ink"}`}>
            Archived ({archivedCount})
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-stone/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-stone/10">
                {["Venue", "Area", "Type", "Machines", "Status", "Model", "Revenue", ""].map((h, i) => (
                  <th key={i} className="px-3 py-2.5 text-left font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((v, i) => (
                <tr key={v.id} className={`border-b border-stone/5 hover:bg-stone/[0.02] transition-colors ${i % 2 === 0 ? "" : "bg-stone/[0.02]"} ${v.archived ? "opacity-60" : ""}`}>
                  <td className="px-3 py-2.5">
                    <Link href={`/console/venues/${v.id}`} className="font-sans text-xs font-semibold text-ink hover:text-accent transition-colors">
                      {v.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-stone">{v.area}</td>
                  <td className="px-3 py-2.5 text-stone">{TYPE_LABEL[v.type] ?? v.type}</td>
                  <td className="px-3 py-2.5 text-stone">{machineCountMap[v.id] ?? 0}</td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded-full font-sans text-[10px] font-semibold ${STATUS_STYLES[v.status]}`}>
                      {v.status === "install-pending" ? "Pending" : v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-stone">{MODEL_LABEL[v.partnershipModel]}</td>
                  <td className="px-3 py-2.5 font-semibold text-ink">{fmt(revenueMap[v.id] ?? 0)}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      {!v.archived && (
                        <button onClick={() => setEditVenue(v)} className="p-1 text-stone/50 hover:text-ink transition-colors" aria-label="Edit venue">
                          <Pencil size={13} />
                        </button>
                      )}
                      {!v.archived && (
                        <button onClick={() => setArchiveVenueState(v)} className="p-1 text-stone/50 hover:text-amber-600 transition-colors" aria-label="Archive venue">
                          <Archive size={13} />
                        </button>
                      )}
                      {v.archived && (
                        <button onClick={() => setRestoreVenueState(v)} className="p-1 text-stone/50 hover:text-green-700 transition-colors" aria-label="Restore venue">
                          <RotateCcw size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center font-sans text-sm text-stone py-8">No venues match the current filters.</p>
        )}
      </div>

      {/* Modals */}
      {addOpen && (
        <FormModal title="Add venue" onClose={() => setAddOpen(false)} size="lg">
          <VenueForm onClose={() => setAddOpen(false)} onSaved={addToast} />
        </FormModal>
      )}
      {editVenue && (
        <FormModal title={`Edit ${editVenue.name}`} onClose={() => setEditVenue(null)} size="lg">
          <VenueForm initial={editVenue} onClose={() => setEditVenue(null)} onSaved={addToast} />
        </FormModal>
      )}
      {archiveVenue && (
        <ConfirmDialog
          mode="archive"
          title={`Archive ${archiveVenue.name}?`}
          description="This will also archive all machines at this venue. Machines must be restored individually."
          onConfirm={() => sendAction(archiveVenue.id, "archive")}
          onCancel={() => setArchiveVenueState(null)}
          isPending={acting}
        />
      )}
      {restoreVenue && (
        <ConfirmDialog
          mode="restore"
          title={`Restore ${restoreVenue.name}?`}
          description="The venue will be restored. Machines at this venue remain archived and must be restored separately."
          onConfirm={() => sendAction(restoreVenue.id, "restore")}
          onCancel={() => setRestoreVenueState(null)}
          isPending={acting}
        />
      )}
    </div>
  );
}
