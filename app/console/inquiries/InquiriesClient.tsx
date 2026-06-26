"use client";

import { useState, useTransition } from "react";
import { X, Check, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ConsoleHeader } from "@/app/console/_components/ConsoleHeader";
import type { Inquiry, InquiryStatus, InquiryInput } from "@/lib/admin/types";
import { FormModal } from "@/app/console/_components/FormModal";
import { ConfirmDialog } from "@/app/console/_components/ConfirmDialog";
import { ToastList } from "@/app/console/_components/ToastList";
import { useToast } from "@/app/console/_components/useToast";

const STATUSES: InquiryStatus[] = ["new", "contacted", "qualified", "won", "lost"];

const STATUS_STYLES: Record<InquiryStatus, { bg: string; text: string; label: string }> = {
  new:       { bg: "bg-blue-50",   text: "text-blue-700",   label: "New" },
  contacted: { bg: "bg-amber-50",  text: "text-amber-700",  label: "Contacted" },
  qualified: { bg: "bg-purple-50", text: "text-purple-700", label: "Qualified" },
  won:       { bg: "bg-green-50",  text: "text-green-700",  label: "Won" },
  lost:      { bg: "bg-stone/10",  text: "text-stone",      label: "Lost" },
};

// ── Inquiry form ──────────────────────────────────────────────────────────────

function InquiryForm({ onClose, onSaved }: { onClose: () => void; onSaved: (msg: string) => void }) {
  const router = useRouter();
  const [form, setForm] = useState<InquiryInput>({
    venueName: "", contactName: "", contactEmail: "",
    venueType: "", city: "", message: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof InquiryInput>(k: K, v: InquiryInput[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch("/api/console/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) { setError("Save failed. Please try again."); return; }
    router.refresh();
    onSaved("Inquiry created");
    onClose();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <p className="font-sans text-xs text-red-600">{error}</p>}

      <div className="grid grid-cols-2 gap-3">
        <label className="col-span-2 block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Venue name</span>
          <input type="text" required className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs"
            value={form.venueName} onChange={(e) => set("venueName", e.target.value)} />
        </label>
        <label className="block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Venue type</span>
          <input type="text" required className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs"
            value={form.venueType} onChange={(e) => set("venueType", e.target.value)} />
        </label>
        <label className="block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">City</span>
          <input type="text" required className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs"
            value={form.city} onChange={(e) => set("city", e.target.value)} />
        </label>
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
        <label className="col-span-2 block space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-wide text-stone">Message</span>
          <textarea rows={3} required
            className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs resize-none"
            value={form.message} onChange={(e) => set("message", e.target.value)} />
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-stone/20 font-sans text-xs font-semibold text-stone">Cancel</button>
        <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-ink text-bone font-sans text-xs font-semibold disabled:opacity-50">
          {saving ? "Saving…" : "Create inquiry"}
        </button>
      </div>
    </form>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props { initialInquiries: Inquiry[] }

export function InquiriesClient({ initialInquiries }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const { toasts, addToast, removeToast } = useToast();
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [selected, setSelected] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | "">("");
  const [isPending, startStatusTransition] = useTransition();
  const [addOpen, setAddOpen] = useState(false);
  const [deleteInquiry, setDeleteInquiryState] = useState<Inquiry | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = inquiries.filter((i) => !statusFilter || i.status === statusFilter);
  const selectedInquiry = inquiries.find((i) => i.id === selected);

  function updateStatus(id: string, status: InquiryStatus) {
    setInquiries((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
    startStatusTransition(async () => {
      await fetch("/api/console/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
    });
  }

  function addNote(id: string) {
    if (!noteText.trim()) return;
    const note = noteText.trim();
    setInquiries((prev) => prev.map((i) => i.id === id ? { ...i, notes: [...i.notes, note] } : i));
    setNoteText("");
    startStatusTransition(async () => {
      await fetch("/api/console/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: selectedInquiry!.status, note }),
      });
    });
  }

  async function handleDelete() {
    if (!deleteInquiry) return;
    setDeleting(true);
    const res = await fetch(`/api/console/inquiries?id=${deleteInquiry.id}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteInquiryState(null);
    if (res.ok) {
      setInquiries((prev) => prev.filter((i) => i.id !== deleteInquiry.id));
      if (selected === deleteInquiry.id) setSelected(null);
      addToast("Inquiry deleted");
    } else {
      addToast("Delete failed", "error");
    }
  }

  return (
    <>
      <ConsoleHeader
        title="Inquiries"
        actions={
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-ink text-bone font-sans text-xs font-semibold hover:bg-ink/80 transition-colors"
          >
            <Plus size={13} /> New inquiry
          </button>
        }
      />
      <div className="p-4 pb-6 lg:p-6 space-y-4">
      <ToastList toasts={toasts} onRemove={removeToast} />

      <div className="flex flex-col lg:flex-row gap-4">
        {/* List */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Status filter */}
          <div className="flex gap-1.5 flex-wrap">
            <button onClick={() => setStatusFilter("")}
              className={`px-3 py-1.5 rounded-full font-sans text-xs border transition-colors ${!statusFilter ? "bg-ink text-bone border-ink" : "border-stone/20 text-stone hover:text-ink"}`}>
              All ({inquiries.length})
            </button>
            {STATUSES.map((s) => {
              const count = inquiries.filter((i) => i.status === s).length;
              return (
                <button key={s} onClick={() => setStatusFilter(s === statusFilter ? "" : s)}
                  className={`px-3 py-1.5 rounded-full font-sans text-xs border transition-colors ${statusFilter === s ? "bg-ink text-bone border-ink" : "border-stone/20 text-stone hover:text-ink"}`}>
                  {STATUS_STYLES[s].label} ({count})
                </button>
              );
            })}
          </div>

          <div className="space-y-2">
            {filtered.map((inq) => {
              const st = STATUS_STYLES[inq.status];
              return (
                <div key={inq.id} className="relative group">
                  <button
                    onClick={() => setSelected(selected === inq.id ? null : inq.id)}
                    className={`w-full text-left bg-white border rounded-xl p-4 transition-all ${selected === inq.id ? "border-accent/40 shadow-sm" : "border-stone/10 hover:border-stone/20"}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <p className="font-sans text-sm font-semibold text-ink truncate">{inq.venueName}</p>
                        <p className="font-sans text-xs text-stone">{inq.contactName} · {inq.city}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2 py-0.5 rounded-full font-sans text-[10px] font-semibold ${st.bg} ${st.text}`}>
                          {st.label}
                        </span>
                        {inq.assignedTo && (
                          <span className="font-sans text-[10px] text-stone">{inq.assignedTo}</span>
                        )}
                      </div>
                    </div>
                    <p className="font-sans text-xs text-stone line-clamp-2">{inq.message}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="font-sans text-[10px] text-stone/60">
                        {inq.receivedAt.toLocaleDateString("en-GB")}
                      </span>
                      {inq.notes.length > 0 && (
                        <span className="font-sans text-[10px] text-stone/60">{inq.notes.length} note{inq.notes.length > 1 ? "s" : ""}</span>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteInquiryState(inq); }}
                    className="absolute top-3 right-3 p-1 text-stone/0 group-hover:text-stone/40 hover:!text-red-500 transition-colors"
                    aria-label="Delete inquiry"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <p className="font-sans text-sm text-stone text-center py-8 bg-white border border-stone/10 rounded-xl">
                No inquiries match the current filter.
              </p>
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selectedInquiry && (
          <div className="lg:w-80 shrink-0 bg-white border border-stone/15 rounded-xl p-4 space-y-4 h-fit lg:sticky lg:top-6">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-sans text-sm font-semibold text-ink">{selectedInquiry.venueName}</p>
                <p className="font-sans text-xs text-stone">{selectedInquiry.venueType} · {selectedInquiry.city}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-stone hover:text-ink p-0.5">
                <X size={14} />
              </button>
            </div>

            <div className="text-xs space-y-1">
              <p><span className="text-stone">Contact:</span> <span className="font-semibold text-ink">{selectedInquiry.contactName}</span></p>
              <p><span className="text-stone">Email:</span> <a href={`mailto:${selectedInquiry.contactEmail}`} className="text-accent hover:text-ink">{selectedInquiry.contactEmail}</a></p>
              <p><span className="text-stone">Received:</span> <span className="text-ink">{selectedInquiry.receivedAt.toLocaleDateString("en-GB")}</span></p>
            </div>

            <div className="bg-stone/5 rounded-lg p-3">
              <p className="font-sans text-xs text-ink leading-relaxed">{selectedInquiry.message}</p>
            </div>

            {/* Status change */}
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-2">Status</p>
              <div className="flex flex-wrap gap-1.5">
                {STATUSES.map((s) => {
                  const st = STATUS_STYLES[s];
                  const active = selectedInquiry.status === s;
                  return (
                    <button key={s} onClick={() => updateStatus(selectedInquiry.id, s)} disabled={active || isPending}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full font-sans text-[10px] font-semibold border transition-colors disabled:cursor-default ${
                        active ? `${st.bg} ${st.text} border-transparent` : "border-stone/20 text-stone hover:text-ink"}`}>
                      {active && <Check size={10} />}
                      {st.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            {selectedInquiry.notes.length > 0 && (
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-2">Notes</p>
                <ul className="space-y-1.5">
                  {selectedInquiry.notes.map((note, i) => (
                    <li key={i} className="font-sans text-xs text-ink bg-stone/5 rounded-lg px-3 py-2">{note}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Add note */}
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-2">Add note</p>
              <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} rows={2}
                placeholder="Internal note…"
                className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs text-ink placeholder:text-stone/50 focus:outline-none focus:ring-1 focus:ring-accent resize-none" />
              <button onClick={() => addNote(selectedInquiry.id)} disabled={!noteText.trim() || isPending}
                className="mt-2 w-full bg-ink text-bone rounded-lg py-1.5 font-sans text-xs font-semibold hover:bg-ink/80 transition-colors disabled:opacity-50">
                Save note
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {addOpen && (
        <FormModal title="New inquiry" onClose={() => setAddOpen(false)}>
          <InquiryForm onClose={() => setAddOpen(false)} onSaved={addToast} />
        </FormModal>
      )}
      {deleteInquiry && (
        <ConfirmDialog
          mode="delete"
          title={`Delete inquiry from ${deleteInquiry.venueName}?`}
          description="This permanently removes the inquiry and all its notes."
          onConfirm={handleDelete}
          onCancel={() => setDeleteInquiryState(null)}
          isPending={deleting}
        />
      )}
      </div>
    </>
  );
}
