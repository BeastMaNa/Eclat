"use client";

import { useState, useTransition } from "react";
import { Users, Clock, AlertTriangle, ChevronDown, ChevronUp, Plus, Send } from "lucide-react";
import type { PartnerContract, ContractStatus } from "@/lib/admin/types";

const STATUS_CONFIG: Record<ContractStatus, { label: string; cls: string }> = {
  active:          { label: "Active",          cls: "bg-green-50 text-green-700 border-green-200" },
  "expiring-soon": { label: "Expiring Soon",   cls: "bg-amber-50 text-amber-700 border-amber-200" },
  lapsed:          { label: "Lapsed",          cls: "bg-red-50 text-red-700 border-red-200" },
  pending:         { label: "Pending",         cls: "bg-stone/10 text-stone border-stone/20" },
};

const MODEL_LABELS: Record<string, string> = {
  "revenue-share": "Revenue share",
  "lease":         "Lease",
  "purchase":      "Purchase",
};

function daysUntil(dateStr: string) {
  return Math.round((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
}

interface Props {
  contracts: PartnerContract[];
}

export function PartnersClient({ contracts }: Props) {
  const [filter, setFilter] = useState<"all" | ContractStatus>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [noteBody, setNoteBody] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const filtered = contracts.filter(
    (c) => filter === "all" || c.status === filter
  );

  const counts = {
    all: contracts.length,
    active: contracts.filter((c) => c.status === "active").length,
    "expiring-soon": contracts.filter((c) => c.status === "expiring-soon").length,
    lapsed: contracts.filter((c) => c.status === "lapsed").length,
    pending: contracts.filter((c) => c.status === "pending").length,
  };

  async function submitNote(venueId: string) {
    const body = noteBody[venueId]?.trim();
    if (!body) return;
    startTransition(async () => {
      await fetch("/api/console/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venueId, body }),
      });
      setNoteBody((prev) => ({ ...prev, [venueId]: "" }));
      setSaved((prev) => ({ ...prev, [venueId]: true }));
      setTimeout(() => setSaved((prev) => ({ ...prev, [venueId]: false })), 2000);
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-serif text-xl font-bold text-ink">Partners</h1>
        <p className="font-sans text-xs text-stone">{contracts.length} partner venues</p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["active", "expiring-soon", "lapsed", "pending"] as ContractStatus[]).map((s) => {
          const cfg = STATUS_CONFIG[s];
          return (
            <button
              key={s}
              onClick={() => setFilter(filter === s ? "all" : s)}
              className={`bg-white border rounded-xl p-4 text-left transition-all ${
                filter === s ? "ring-2 ring-accent" : "border-stone/10"
              }`}
            >
              <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-1">{cfg.label}</p>
              <p className={`font-serif text-2xl font-bold ${s === "expiring-soon" ? "text-amber-600" : s === "lapsed" ? "text-red-600" : "text-ink"}`}>
                {counts[s]}
              </p>
            </button>
          );
        })}
      </div>

      {/* Expiring soon alert */}
      {contracts.some((c) => c.status === "expiring-soon") && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2">
          <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-sans text-xs font-semibold text-amber-700">Contracts expiring soon</p>
            <p className="font-sans text-xs text-amber-600 mt-0.5">
              {contracts.filter((c) => c.status === "expiring-soon").map((c) => `${c.venueName} (${daysUntil(c.endDate)}d)`).join(" · ")}
            </p>
          </div>
        </div>
      )}

      {/* Contracts list */}
      <div className="space-y-2">
        {filtered.map((c) => {
          const isOpen = expanded === c.venueId;
          const cfg = STATUS_CONFIG[c.status];
          const days = daysUntil(c.endDate);

          return (
            <div key={c.venueId} className="bg-white border border-stone/10 rounded-xl overflow-hidden">
              {/* Row */}
              <button
                onClick={() => setExpanded(isOpen ? null : c.venueId)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-stone/3 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-sans text-xs font-semibold text-ink">{c.venueName}</span>
                    <span className="font-sans text-xs text-stone">{c.area}</span>
                    <span className={`px-2 py-0.5 rounded-full font-sans text-[10px] font-semibold border ${cfg.cls}`}>
                      {cfg.label}
                    </span>
                    {c.status === "expiring-soon" && (
                      <span className="font-sans text-[10px] text-amber-600 flex items-center gap-0.5">
                        <Clock size={10} /> {days}d left
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-[10px] text-stone mt-0.5">
                    {MODEL_LABELS[c.model]} · {c.commissionPct}% · {c.contactName}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="font-sans text-[10px] text-stone">Ends</p>
                    <p className="font-sans text-xs font-semibold text-ink">{c.endDate}</p>
                  </div>
                  {isOpen ? <ChevronUp size={14} className="text-stone" /> : <ChevronDown size={14} className="text-stone" />}
                </div>
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div className="border-t border-stone/10 px-5 py-4 space-y-5">
                  {/* Key info */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-0.5">Contact</p>
                      <p className="font-sans text-xs font-semibold text-ink">{c.contactName}</p>
                      <a href={`mailto:${c.contactEmail}`} className="font-sans text-xs text-accent hover:underline">{c.contactEmail}</a>
                    </div>
                    <div>
                      <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-0.5">Contract period</p>
                      <p className="font-sans text-xs text-ink">{c.startDate} → {c.endDate}</p>
                      {c.documentId && (
                        <a href={`/console/documents`} className="font-sans text-xs text-accent hover:underline mt-0.5 inline-block">View document →</a>
                      )}
                    </div>
                    <div>
                      <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-0.5">Key terms</p>
                      <p className="font-sans text-[10px] text-stone leading-relaxed">{c.keyTerms}</p>
                    </div>
                  </div>

                  {/* Relationship notes */}
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-3">Relationship notes</p>
                    {c.notes.length > 0 ? (
                      <div className="space-y-2 mb-3">
                        {c.notes.map((n) => (
                          <div key={n.id} className="bg-stone/5 rounded-lg px-3 py-2">
                            <p className="font-sans text-[10px] text-stone mb-0.5">
                              {n.author} · {new Date(n.timestamp).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                            <p className="font-sans text-xs text-ink">{n.body}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="font-sans text-xs text-stone mb-3">No notes yet.</p>
                    )}

                    {/* Add note */}
                    <div className="flex gap-2">
                      <textarea
                        value={noteBody[c.venueId] ?? ""}
                        onChange={(e) => setNoteBody((prev) => ({ ...prev, [c.venueId]: e.target.value }))}
                        placeholder="Add a relationship note…"
                        rows={2}
                        className="flex-1 rounded-lg border border-stone/20 px-3 py-2 font-sans text-xs text-ink bg-white placeholder:text-stone/40 resize-none focus:outline-none focus:ring-1 focus:ring-accent/30"
                      />
                      <button
                        onClick={() => submitNote(c.venueId)}
                        disabled={isPending || !noteBody[c.venueId]?.trim()}
                        className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-accent/15 text-accent font-sans text-xs font-semibold hover:bg-accent/25 disabled:opacity-40 transition-colors"
                      >
                        <Send size={12} />
                        {saved[c.venueId] ? "Saved!" : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center">
          <Users size={24} className="mx-auto text-stone/30 mb-2" />
          <p className="font-sans text-sm text-stone">No contracts match the current filter.</p>
        </div>
      )}

      <p className="font-sans text-[10px] text-stone">
        Contract end dates are derived from go-live date + model term. Update in the data layer once real contract dates are confirmed.{" "}
        <span className="italic">[PLACEHOLDER — Real contract management: connect to DocuSign or Notion database]</span>
      </p>
    </div>
  );
}
