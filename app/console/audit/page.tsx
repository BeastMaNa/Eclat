import { getAdminDataSource } from "@/lib/admin";
import { ClipboardList } from "lucide-react";
import type { AuditEntry } from "@/lib/admin/types";

export const dynamic = "force-dynamic";

const ENTITY_LABELS: Record<AuditEntry["entityType"], string> = {
  venue:     "Venue",
  machine:   "Machine",
  payout:    "Payout",
  ticket:    "Ticket",
  inquiry:   "Inquiry",
  document:  "Document",
  inventory: "Inventory",
  partner:   "Partner",
  restock:   "Restock",
};

const ENTITY_COLORS: Record<AuditEntry["entityType"], string> = {
  venue:     "bg-stone/10 text-stone",
  machine:   "bg-stone/10 text-stone",
  payout:    "bg-green-50 text-green-700",
  ticket:    "bg-red-50 text-red-700",
  inquiry:   "bg-blue-50 text-blue-700",
  document:  "bg-purple-50 text-purple-700",
  inventory: "bg-amber-50 text-amber-700",
  partner:   "bg-teal-50 text-teal-700",
  restock:   "bg-orange-50 text-orange-700",
};

export default async function AuditPage() {
  const ds = getAdminDataSource();
  const log = await ds.getAuditLog(200);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-xl font-bold text-ink">Audit Log</h1>
        <p className="font-sans text-xs text-stone mt-0.5">
          Append-only record of owner actions this session. Persists for the lifetime of the server process.
        </p>
      </div>

      {log.length === 0 ? (
        <div className="bg-white border border-stone/10 rounded-xl py-16 text-center">
          <ClipboardList size={24} className="mx-auto text-stone/30 mb-3" />
          <p className="font-sans text-sm text-stone">No audit entries yet.</p>
          <p className="font-sans text-xs text-stone/50 mt-1">Actions such as marking payouts paid, adding partner notes, and creating POs appear here.</p>
        </div>
      ) : (
        <div className="bg-white border border-stone/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-stone/10">
                  <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Time</th>
                  <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Actor</th>
                  <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Action</th>
                  <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Entity</th>
                  <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Name</th>
                  <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Detail</th>
                </tr>
              </thead>
              <tbody>
                {log.map((entry) => (
                  <tr key={entry.id} className="border-b border-stone/5 hover:bg-stone/3 transition-colors">
                    <td className="px-4 py-2.5 font-sans text-xs text-stone tabular-nums whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </td>
                    <td className="px-4 py-2.5 font-sans text-xs text-ink">{entry.actor}</td>
                    <td className="px-4 py-2.5 font-sans text-xs text-stone font-mono">{entry.action}</td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded-full font-sans text-[10px] font-semibold ${ENTITY_COLORS[entry.entityType]}`}>
                        {ENTITY_LABELS[entry.entityType]}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-sans text-xs text-ink max-w-[140px] truncate">{entry.entityName}</td>
                    <td className="px-4 py-2.5 font-sans text-xs text-stone max-w-[220px] truncate" title={entry.detail}>{entry.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="font-sans text-[10px] text-stone italic">
        [PLACEHOLDER — Real audit log: persist to database on every mutation. Currently in-memory only.]
      </p>
    </div>
  );
}
