"use client";

import { useState, useTransition } from "react";
import { FileText, Plus, ExternalLink, Trash2 } from "lucide-react";
import type { ConsoleDocument, DocumentType } from "@/lib/admin/types";
import { ConfirmDialog } from "@/app/console/_components/ConfirmDialog";
import { ToastList } from "@/app/console/_components/ToastList";
import { useToast } from "@/app/console/_components/useToast";

const TYPE_CONFIG: Record<DocumentType, { label: string; cls: string }> = {
  contract:  { label: "Contract",  cls: "bg-blue-50 text-blue-700 border-blue-200" },
  warranty:  { label: "Warranty",  cls: "bg-purple-50 text-purple-700 border-purple-200" },
  insurance: { label: "Insurance", cls: "bg-green-50 text-green-700 border-green-200" },
  supplier:  { label: "Supplier",  cls: "bg-amber-50 text-amber-700 border-amber-200" },
  other:     { label: "Other",     cls: "bg-stone/10 text-stone border-stone/20" },
};

interface Props {
  documents: ConsoleDocument[];
}

export function DocumentsClient({ documents: initialDocs }: Props) {
  const [docs, setDocs] = useState(initialDocs);
  const [filter, setFilter] = useState<"all" | DocumentType>("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", type: "contract" as DocumentType, notes: "", venueId: "", uploadedBy: "owner" });
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const { toasts, addToast, removeToast } = useToast();
  const [deleteDoc, setDeleteDoc] = useState<ConsoleDocument | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = docs.filter((d) => filter === "all" || d.type === filter);

  async function submit() {
    if (!form.name) return;
    startTransition(async () => {
      const res = await fetch("/api/console/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, url: "#placeholder" }),
      });
      if (res.ok) {
        const { doc } = await res.json();
        setDocs((prev) => [doc, ...prev]);
        setForm({ name: "", type: "contract", notes: "", venueId: "", uploadedBy: "owner" });
        setShowForm(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    });
  }

  async function handleDeleteDoc() {
    if (!deleteDoc) return;
    setDeleting(true);
    const res = await fetch(`/api/console/documents?id=${deleteDoc.id}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteDoc(null);
    if (res.ok) {
      setDocs((prev) => prev.filter((d) => d.id !== deleteDoc.id));
      addToast("Document removed");
    } else {
      addToast("Delete failed", "error");
    }
  }

  const counts: Record<string, number> = { all: docs.length };
  for (const type of Object.keys(TYPE_CONFIG)) {
    counts[type] = docs.filter((d) => d.type === type).length;
  }

  return (
    <div className="space-y-5">
      <ToastList toasts={toasts} onRemove={removeToast} />
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-xl font-bold text-ink">Documents</h1>
          <p className="font-sans text-xs text-stone mt-0.5">
            Metadata store — links and notes only.{" "}
            <span className="italic text-stone/60">[PLACEHOLDER — Actual file upload: connect Vercel Blob / S3]</span>
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent/15 text-accent font-sans text-xs font-semibold hover:bg-accent/25 transition-colors"
        >
          <Plus size={13} /> Add document
        </button>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2">
          <p className="font-sans text-xs text-green-700 font-semibold">Document metadata saved.</p>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="bg-white border border-stone/10 rounded-xl p-5 space-y-4">
          <p className="font-sans text-xs font-semibold text-ink">Add document record</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-1">Document name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. The Alchemist — Contract 2025"
                className="w-full rounded-lg border border-stone/20 px-3 py-1.5 font-sans text-xs text-ink bg-white placeholder:text-stone/40 focus:outline-none focus:ring-1 focus:ring-accent/30"
              />
            </div>
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as DocumentType }))}
                className="w-full rounded-lg border border-stone/20 px-3 py-1.5 font-sans text-xs text-ink bg-white focus:outline-none focus:ring-1 focus:ring-accent/30"
              >
                {(Object.keys(TYPE_CONFIG) as DocumentType[]).map((t) => (
                  <option key={t} value={t}>{TYPE_CONFIG[t].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-1">Notes (optional)</label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                placeholder="e.g. Signed copy with legal"
                className="w-full rounded-lg border border-stone/20 px-3 py-1.5 font-sans text-xs text-ink bg-white placeholder:text-stone/40 focus:outline-none focus:ring-1 focus:ring-accent/30"
              />
            </div>
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-1">Uploaded by</label>
              <input
                type="text"
                value={form.uploadedBy}
                onChange={(e) => setForm((p) => ({ ...p, uploadedBy: e.target.value }))}
                className="w-full rounded-lg border border-stone/20 px-3 py-1.5 font-sans text-xs text-ink bg-white focus:outline-none focus:ring-1 focus:ring-accent/30"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={submit}
              disabled={isPending || !form.name}
              className="px-4 py-2 rounded-lg bg-accent text-bone font-sans text-xs font-semibold hover:bg-accent/80 disabled:opacity-40 transition-colors"
            >
              Save metadata
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg border border-stone/20 font-sans text-xs text-stone hover:text-ink transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Type filters */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded-full font-sans text-xs font-semibold border transition-colors ${
            filter === "all" ? "bg-accent/15 border-accent/30 text-ink" : "border-stone/20 text-stone hover:text-ink"
          }`}
        >
          All ({counts.all})
        </button>
        {(Object.keys(TYPE_CONFIG) as DocumentType[]).map((t) => (
          counts[t] > 0 && (
            <button
              key={t}
              onClick={() => setFilter(filter === t ? "all" : t)}
              className={`px-3 py-1 rounded-full font-sans text-xs font-semibold border transition-colors ${
                filter === t ? "bg-accent/15 border-accent/30 text-ink" : "border-stone/20 text-stone hover:text-ink"
              }`}
            >
              {TYPE_CONFIG[t].label} ({counts[t]})
            </button>
          )
        ))}
      </div>

      {/* Documents list */}
      <div className="space-y-2">
        {filtered.map((doc) => {
          const cfg = TYPE_CONFIG[doc.type];
          return (
            <div key={doc.id} className="bg-white border border-stone/10 rounded-xl px-5 py-4 flex items-start gap-4 group">
              <FileText size={18} className="text-stone/40 mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-sans text-xs font-semibold text-ink">{doc.name}</span>
                  <span className={`px-2 py-0.5 rounded-full font-sans text-[10px] font-semibold border ${cfg.cls}`}>
                    {cfg.label}
                  </span>
                </div>
                {doc.notes && <p className="font-sans text-[10px] text-stone mt-0.5">{doc.notes}</p>}
                <p className="font-sans text-[10px] text-stone/50 mt-0.5">
                  Added {new Date(doc.uploadedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} by {doc.uploadedBy}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={doc.url === "#placeholder" ? undefined : doc.url}
                  aria-disabled={doc.url === "#placeholder"}
                  className={`flex items-center gap-1 font-sans text-xs ${
                    doc.url === "#placeholder"
                      ? "text-stone/30 cursor-not-allowed"
                      : "text-accent hover:underline"
                  }`}
                >
                  <ExternalLink size={12} />
                  {doc.url === "#placeholder" ? "Upload pending" : "Open"}
                </a>
                <button
                  onClick={() => setDeleteDoc(doc)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-stone/40 hover:text-red-500 transition-all"
                  aria-label="Delete document"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center">
          <FileText size={24} className="mx-auto text-stone/30 mb-2" />
          <p className="font-sans text-sm text-stone">No documents match the current filter.</p>
        </div>
      )}

      {deleteDoc && (
        <ConfirmDialog
          mode="delete"
          title={`Delete "${deleteDoc.name}"?`}
          description="This removes the metadata record. It cannot be undone."
          onConfirm={handleDeleteDoc}
          onCancel={() => setDeleteDoc(null)}
          isPending={deleting}
        />
      )}
    </div>
  );
}
