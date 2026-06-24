"use client";

import { useState, useTransition } from "react";
import { AlertTriangle, Plus, CheckCircle2, Clock, Send } from "lucide-react";
import type { InventoryItem, PurchaseOrder } from "@/lib/admin/types";

const gbp = (v: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 2 }).format(v);

const PO_STATUS_LABELS: Record<string, { label: string; icon: React.ReactNode; cls: string }> = {
  draft:    { label: "Draft",    icon: <Clock size={11} />,         cls: "bg-stone/10 text-stone border-stone/20" },
  sent:     { label: "Sent",     icon: <Send size={11} />,          cls: "bg-blue-50 text-blue-700 border-blue-200" },
  received: { label: "Received", icon: <CheckCircle2 size={11} />,  cls: "bg-green-50 text-green-700 border-green-200" },
};

interface Props {
  inventory: InventoryItem[];
  purchaseOrders: PurchaseOrder[];
}

export function InventoryClient({ inventory: initialInventory, purchaseOrders: initialPOs }: Props) {
  const [inventory] = useState(initialInventory);
  const [pos, setPOs] = useState(initialPOs);
  const [isPending, startTransition] = useTransition();
  const [showCreatePO, setShowCreatePO] = useState(false);
  const [poForm, setPoForm] = useState({ fragrance: "", qty: "", costPerUnit: "", supplier: "Éclat Wholesale Ltd" });
  const [poSaved, setPoSaved] = useState(false);

  const needsReorder = inventory.filter((i) => i.needsReorder);

  async function createPO() {
    if (!poForm.fragrance || !poForm.qty) return;
    startTransition(async () => {
      const res = await fetch("/api/console/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fragrance: poForm.fragrance,
          qty: Number(poForm.qty),
          costPerUnit: Number(poForm.costPerUnit) || 0.45,
          supplier: poForm.supplier,
        }),
      });
      if (res.ok) {
        const { po } = await res.json();
        setPOs((prev) => [po, ...prev]);
        setPoForm({ fragrance: "", qty: "", costPerUnit: "", supplier: "Éclat Wholesale Ltd" });
        setShowCreatePO(false);
        setPoSaved(true);
        setTimeout(() => setPoSaved(false), 3000);
      }
    });
  }

  async function advancePO(id: string, nextStatus: "sent" | "received") {
    startTransition(async () => {
      await fetch("/api/console/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      setPOs((prev) => prev.map((p) => (p.id === id ? { ...p, status: nextStatus } : p)));
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-serif text-xl font-bold text-ink">Central Inventory</h1>
        <button
          onClick={() => setShowCreatePO((v) => !v)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent/15 text-accent font-sans text-xs font-semibold hover:bg-accent/25 transition-colors"
        >
          <Plus size={13} /> New purchase order
        </button>
      </div>

      {/* Reorder alert */}
      {needsReorder.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2">
          <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-sans text-xs font-semibold text-amber-700">{needsReorder.length} fragrance{needsReorder.length !== 1 ? "s" : ""} below reorder threshold</p>
            <p className="font-sans text-xs text-amber-600 mt-0.5">{needsReorder.map((i) => i.fragrance).join(" · ")}</p>
          </div>
        </div>
      )}

      {/* PO saved confirmation */}
      {poSaved && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 flex items-center gap-2">
          <CheckCircle2 size={13} className="text-green-700" />
          <p className="font-sans text-xs text-green-700 font-semibold">Purchase order draft created.</p>
        </div>
      )}

      {/* Create PO form */}
      {showCreatePO && (
        <div className="bg-white border border-stone/10 rounded-xl p-5 space-y-4">
          <p className="font-sans text-xs font-semibold text-ink">New purchase order</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <label className="block font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-1">Fragrance</label>
              <input
                type="text"
                value={poForm.fragrance}
                onChange={(e) => setPoForm((p) => ({ ...p, fragrance: e.target.value }))}
                placeholder="e.g. Velvet Oud"
                className="w-full rounded-lg border border-stone/20 px-3 py-1.5 font-sans text-xs text-ink bg-white placeholder:text-stone/40 focus:outline-none focus:ring-1 focus:ring-accent/30"
                list="fragrance-list"
              />
              <datalist id="fragrance-list">
                {inventory.map((i) => <option key={i.fragrance} value={i.fragrance} />)}
              </datalist>
            </div>
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-1">Qty (units)</label>
              <input
                type="number"
                value={poForm.qty}
                onChange={(e) => setPoForm((p) => ({ ...p, qty: e.target.value }))}
                placeholder="24"
                min={1}
                className="w-full rounded-lg border border-stone/20 px-3 py-1.5 font-sans text-xs text-ink bg-white placeholder:text-stone/40 focus:outline-none focus:ring-1 focus:ring-accent/30"
              />
            </div>
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-1">Cost / unit £</label>
              <input
                type="number"
                step="0.01"
                value={poForm.costPerUnit}
                onChange={(e) => setPoForm((p) => ({ ...p, costPerUnit: e.target.value }))}
                placeholder="0.45"
                min={0}
                className="w-full rounded-lg border border-stone/20 px-3 py-1.5 font-sans text-xs text-ink bg-white placeholder:text-stone/40 focus:outline-none focus:ring-1 focus:ring-accent/30"
              />
            </div>
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-1">Supplier</label>
              <input
                type="text"
                value={poForm.supplier}
                onChange={(e) => setPoForm((p) => ({ ...p, supplier: e.target.value }))}
                className="w-full rounded-lg border border-stone/20 px-3 py-1.5 font-sans text-xs text-ink bg-white placeholder:text-stone/40 focus:outline-none focus:ring-1 focus:ring-accent/30"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={createPO}
              disabled={isPending || !poForm.fragrance || !poForm.qty}
              className="px-4 py-2 rounded-lg bg-accent text-bone font-sans text-xs font-semibold hover:bg-accent/80 disabled:opacity-40 transition-colors"
            >
              Create draft PO
            </button>
            <button
              onClick={() => setShowCreatePO(false)}
              className="px-4 py-2 rounded-lg border border-stone/20 font-sans text-xs text-stone hover:text-ink transition-colors"
            >
              Cancel
            </button>
          </div>
          <p className="font-sans text-[10px] text-stone italic">[PLACEHOLDER — Real integration: send PO to supplier via email/ERP on "sent" status]</p>
        </div>
      )}

      {/* Stock table */}
      <div className="bg-white border border-stone/10 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-stone/10">
          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-semibold">Central stock levels</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-stone/10">
                <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Fragrance</th>
                <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Tier</th>
                <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Stock</th>
                <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Threshold</th>
                <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Reorder Qty</th>
                <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Cost/unit</th>
                <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr
                  key={item.fragrance}
                  className={`border-b border-stone/5 ${item.needsReorder ? "bg-amber-50/40" : "hover:bg-stone/3"} transition-colors`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {item.needsReorder && <AlertTriangle size={11} className="text-amber-500 shrink-0" />}
                      <span className="font-sans text-xs font-semibold text-ink">{item.fragrance}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full font-sans text-[10px] font-semibold ${
                      item.tier === "premium" ? "bg-amber-50 text-amber-700" : "bg-stone/10 text-stone"
                    }`}>
                      {item.tier === "premium" ? "Premium" : "Standard"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-sans text-xs tabular-nums font-semibold text-ink">{item.currentStock}</td>
                  <td className="px-4 py-3 font-sans text-xs tabular-nums text-stone">{item.reorderThreshold}</td>
                  <td className="px-4 py-3 font-sans text-xs tabular-nums text-stone">{item.reorderQty}</td>
                  <td className="px-4 py-3 font-sans text-xs tabular-nums text-stone">{gbp(item.costPerUnit)}</td>
                  <td className="px-4 py-3">
                    {item.needsReorder ? (
                      <span className="px-2 py-0.5 rounded-full font-sans text-[10px] font-semibold border bg-amber-50 text-amber-700 border-amber-200">
                        Reorder
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full font-sans text-[10px] font-semibold border bg-green-50 text-green-700 border-green-200">
                        OK
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Purchase orders */}
      <div>
        <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-semibold mb-3">Purchase orders</p>
        {pos.length === 0 ? (
          <div className="bg-white border border-stone/10 rounded-xl py-8 text-center">
            <p className="font-sans text-sm text-stone">No purchase orders yet.</p>
          </div>
        ) : (
          <div className="bg-white border border-stone/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-stone/10">
                    <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">PO ID</th>
                    <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Fragrance</th>
                    <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Qty</th>
                    <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Supplier</th>
                    <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Total</th>
                    <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Status</th>
                    <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Created</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {pos.map((po) => {
                    const cfg = PO_STATUS_LABELS[po.status];
                    return (
                      <tr key={po.id} className="border-b border-stone/5 hover:bg-stone/3 transition-colors">
                        <td className="px-4 py-3 font-sans text-xs text-stone tabular-nums">{po.id}</td>
                        <td className="px-4 py-3 font-sans text-xs font-semibold text-ink">{po.fragrance}</td>
                        <td className="px-4 py-3 font-sans text-xs tabular-nums text-ink">{po.qty}</td>
                        <td className="px-4 py-3 font-sans text-xs text-stone">{po.supplier}</td>
                        <td className="px-4 py-3 font-sans text-xs tabular-nums text-ink font-semibold">{gbp(po.totalCost)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-sans text-[10px] font-semibold border ${cfg.cls}`}>
                            {cfg.icon} {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-sans text-xs text-stone tabular-nums">
                          {new Date(po.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                        </td>
                        <td className="px-4 py-3">
                          {po.status === "draft" && (
                            <button
                              onClick={() => advancePO(po.id, "sent")}
                              disabled={isPending}
                              className="font-sans text-[10px] text-accent hover:underline disabled:opacity-40"
                            >
                              Mark sent
                            </button>
                          )}
                          {po.status === "sent" && (
                            <button
                              onClick={() => advancePO(po.id, "received")}
                              disabled={isPending}
                              className="font-sans text-[10px] text-accent hover:underline disabled:opacity-40"
                            >
                              Mark received
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
