import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminDataSource } from "@/lib/admin";
import { PrintButton } from "./PrintButton";

interface Props {
  searchParams: Promise<{ venueId?: string; days?: string }>;
}

const gbp = (v: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(v);

const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default async function StatementPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") redirect("/login");

  const { venueId, days: daysParam } = await searchParams;
  if (!venueId) redirect("/console/payouts");

  const days = daysParam === "7" ? 7 : daysParam === "90" ? 90 : 30;
  const to = new Date();
  const from = new Date(Date.now() - days * 86_400_000);

  const ds = getAdminDataSource();
  const records = await ds.getPayoutRecords({ from, to });
  const record = records.find((r) => r.venueId === venueId);
  if (!record) redirect("/console/payouts");

  const today = new Date();

  return (
    <>
      <style>{`@media print { .no-print { display: none !important; } }`}</style>

      {/* Actions bar */}
      <div className="no-print flex items-center justify-between gap-4 mb-8 pb-6 border-b border-stone/10">
        <div className="flex items-center gap-3">
          <PrintButton />
        </div>
        <a
          href="/console/payouts"
          className="font-sans text-xs text-stone hover:text-ink transition-colors"
        >
          ← Back to payouts
        </a>
      </div>

      {/* Statement body */}
      <div className="max-w-2xl mx-auto space-y-8 py-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-serif text-2xl text-ink tracking-tight">Éclat</p>
            <p className="font-sans text-xs text-stone mt-0.5">Partner Statement</p>
          </div>
          <div className="text-right">
            <p className="font-sans text-xs text-stone">Statement date</p>
            <p className="font-sans text-sm font-semibold text-ink">{fmtDate(today)}</p>
          </div>
        </div>

        {/* To / From */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-2">To</p>
            <p className="font-sans text-sm font-semibold text-ink">{record.contactName}</p>
            <p className="font-sans text-sm text-stone">{record.venueName}</p>
            <p className="font-sans text-xs text-stone mt-0.5">{record.contactEmail}</p>
          </div>
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-2">From</p>
            <p className="font-sans text-sm font-semibold text-ink">Éclat Fragrance Ltd</p>
            <p className="font-sans text-xs text-stone">hello@eclat.co.uk</p>
          </div>
        </div>

        {/* Period */}
        <div className="bg-stone/5 rounded-xl px-5 py-4">
          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone mb-1">Billing period</p>
          <p className="font-sans text-sm font-semibold text-ink">
            {fmtDate(from)} – {fmtDate(to)}
          </p>
        </div>

        {/* Breakdown */}
        {record.partnershipModel !== "revenue-share" ? (
          <div className="border border-stone/10 rounded-xl p-5">
            <p className="font-sans text-sm text-stone">
              This venue operates on a <strong className="text-ink capitalize">{record.partnershipModel.replace("-", " ")}</strong> agreement.
              No commission settlement applies for this period.
            </p>
            <p className="font-sans text-sm font-semibold text-ink mt-3">
              Gross machine sales: {gbp(record.grossSalesGbp)}
            </p>
          </div>
        ) : (
          <div className="border border-stone/10 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone/10 bg-stone/3">
                  <th className="px-5 py-3 text-left font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Description</th>
                  <th className="px-5 py-3 text-right font-sans text-[10px] uppercase tracking-[0.1em] text-stone font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-stone/5">
                  <td className="px-5 py-3 font-sans text-sm text-ink">Gross machine sales</td>
                  <td className="px-5 py-3 font-sans text-sm text-ink text-right tabular-nums">{gbp(record.grossSalesGbp)}</td>
                </tr>
                <tr className="border-b border-stone/5">
                  <td className="px-5 py-3 font-sans text-sm text-stone">
                    Partner commission ({record.commissionPct}% of gross sales)
                  </td>
                  <td className="px-5 py-3 font-sans text-sm text-stone text-right tabular-nums">{gbp(record.partnerShareGbp)}</td>
                </tr>
                <tr className="border-b border-stone/5">
                  <td className="px-5 py-3 font-sans text-sm text-stone">Éclat share</td>
                  <td className="px-5 py-3 font-sans text-sm text-stone text-right tabular-nums">{gbp(record.eclatShareGbp)}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-stone/3">
                  <td className="px-5 py-4 font-sans text-sm font-bold text-ink">Amount due to {record.venueName}</td>
                  <td className="px-5 py-4 font-serif text-xl font-bold text-ink text-right tabular-nums">
                    {gbp(record.partnerShareGbp)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Status */}
        {record.status === "paid" && (
          <div className="flex items-center gap-2 text-green-700 font-sans text-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
            Paid {record.paidDate} · Ref: {record.paidReference}
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-stone/10 pt-6 space-y-1">
          <p className="font-sans text-xs text-stone">Payment terms: 30 days from statement date.</p>
          <p className="font-sans text-xs text-stone">Questions? Contact hello@eclat.co.uk</p>
          <p className="font-sans text-xs text-stone/50 mt-3">
            Generated by Éclat Operations Console · {fmtDate(today)}
          </p>
        </div>
      </div>
    </>
  );
}
