"use client";

import { useState, useTransition } from "react";
import { ChevronDown, X, Check } from "lucide-react";
import type { Inquiry, InquiryStatus } from "@/lib/admin/types";

const STATUSES: InquiryStatus[] = ["new", "contacted", "qualified", "won", "lost"];

const STATUS_STYLES: Record<InquiryStatus, { bg: string; text: string; label: string }> = {
  new:       { bg: "bg-blue-50",   text: "text-blue-700",   label: "New" },
  contacted: { bg: "bg-amber-50",  text: "text-amber-700",  label: "Contacted" },
  qualified: { bg: "bg-purple-50", text: "text-purple-700", label: "Qualified" },
  won:       { bg: "bg-green-50",  text: "text-green-700",  label: "Won" },
  lost:      { bg: "bg-stone/10",  text: "text-stone",      label: "Lost" },
};

const OWNERS = ["Miko R.", "Jordan A.", "Priya S."];

async function serverUpdateStatus(id: string, status: InquiryStatus, note?: string) {
  await fetch("/api/console/inquiries", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status, note }),
  });
}

interface Props { initialInquiries: Inquiry[] }

export function InquiriesClient({ initialInquiries }: Props) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [selected, setSelected] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | "">("");
  const [isPending, startTransition] = useTransition();

  const filtered = inquiries.filter((i) => !statusFilter || i.status === statusFilter);
  const selectedInquiry = inquiries.find((i) => i.id === selected);

  function updateStatus(id: string, status: InquiryStatus) {
    setInquiries((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
    startTransition(() => { serverUpdateStatus(id, status); });
  }

  function addNote(id: string) {
    if (!noteText.trim()) return;
    const note = noteText.trim();
    setInquiries((prev) => prev.map((i) => i.id === id ? { ...i, notes: [...i.notes, note] } : i));
    setNoteText("");
    startTransition(() => { serverUpdateStatus(id, selectedInquiry!.status, note); });
  }

  return (
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
              <button
                key={inq.id}
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
                  <button
                    key={s}
                    onClick={() => updateStatus(selectedInquiry.id, s)}
                    disabled={active || isPending}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full font-sans text-[10px] font-semibold border transition-colors disabled:cursor-default ${
                      active ? `${st.bg} ${st.text} border-transparent` : "border-stone/20 text-stone hover:text-ink"}`}
                  >
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
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={2}
              placeholder="Internal note…"
              className="w-full border border-stone/20 rounded-lg px-3 py-2 font-sans text-xs text-ink placeholder:text-stone/50 focus:outline-none focus:ring-1 focus:ring-accent resize-none"
            />
            <button
              onClick={() => addNote(selectedInquiry.id)}
              disabled={!noteText.trim() || isPending}
              className="mt-2 w-full bg-ink text-bone rounded-lg py-1.5 font-sans text-xs font-semibold hover:bg-ink/80 transition-colors disabled:opacity-50"
            >
              Save note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
