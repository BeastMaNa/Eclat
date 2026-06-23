import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getDataSource } from "@/lib/dashboard";
import { MapPin, Mail, Package, Percent, CheckCircle, CreditCard, LogOut } from "lucide-react";
import { SignOutButton } from "./_components/SignOutButton";

// Mock partnership & payout details — replace with real DB fetch in production
const VENUE_META: Record<string, {
  type: string;
  city: string;
  address: string;
  partnerSince: string;
  commissionPct: number;
  eclatContact: string;
  paymentSchedule: string;
  paymentBankName: string;
  paymentSortCode: string;
  paymentAccountLast4: string;
  lastPaymentGbp: number;
  lastPaymentDate: string;
}> = {
  "venue-001": {
    type: "Cocktail Bar",
    city: "Manchester",
    address: "3 Hardman St, Manchester M3 3HF",
    partnerSince: "January 2025",
    commissionPct: 20,
    eclatContact: "partnerships@eclat.co.uk",
    paymentSchedule: "Monthly — paid on the 15th",
    paymentBankName: "Barclays Business",
    paymentSortCode: "20-00-••",
    paymentAccountLast4: "••••3421",
    lastPaymentGbp: 892,
    lastPaymentDate: "15 Jun 2026",
  },
  "venue-002": {
    type: "Hotel",
    city: "Manchester",
    address: "10 King Street, Manchester M2 6AG",
    partnerSince: "March 2025",
    commissionPct: 20,
    eclatContact: "partnerships@eclat.co.uk",
    paymentSchedule: "Monthly — paid on the 15th",
    paymentBankName: "HSBC Business",
    paymentSortCode: "40-04-••",
    paymentAccountLast4: "••••7809",
    lastPaymentGbp: 430,
    lastPaymentDate: "15 Jun 2026",
  },
  "venue-003": {
    type: "Nightclub",
    city: "Manchester",
    address: "Trafford Wharf Rd, Manchester M17 1AB",
    partnerSince: "November 2024",
    commissionPct: 20,
    eclatContact: "partnerships@eclat.co.uk",
    paymentSchedule: "Monthly — paid on the 15th",
    paymentBankName: "Lloyds Business",
    paymentSortCode: "30-98-••",
    paymentAccountLast4: "••••5512",
    lastPaymentGbp: 1240,
    lastPaymentDate: "15 Jun 2026",
  },
};

const formatGbp = (v: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(v);

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/60 border border-stone/10 rounded-xl p-5 sm:p-6">
      <h2 className="font-sans text-xs tracking-[0.12em] uppercase text-stone mb-5">{title}</h2>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-stone/[0.08] last:border-0">
      <span className="font-sans text-sm text-stone shrink-0">{label}</span>
      <span className="font-sans text-sm text-ink font-medium text-right">{value}</span>
    </div>
  );
}

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { venueId, venueName, email } = session.user;
  const meta = VENUE_META[venueId];
  const ds = getDataSource();
  const machines = await ds.getMachines(venueId);

  return (
    <div>
      <div className="mb-8">
        <p className="font-sans text-xs tracking-[0.15em] uppercase text-stone mb-0.5">{venueName}</p>
        <h1 className="font-serif text-2xl font-bold text-ink">Account</h1>
      </div>

      <div className="space-y-6">
        {/* Partnership */}
        <Section title="Partnership">
          <div className="flex items-center gap-2.5 mb-5 bg-accent/[0.08] border border-accent/20 rounded-lg px-4 py-3">
            <CheckCircle size={15} className="text-accent shrink-0" />
            <p className="font-sans text-sm text-ink">
              Active partner since <span className="font-semibold">{meta?.partnerSince ?? "—"}</span>
            </p>
          </div>
          <Row label="Venue name" value={venueName} />
          <Row label="Venue type" value={meta?.type ?? "—"} />
          <Row label="Partnership tier" value="Revenue Share" />
          <Row
            label="Agreed commission"
            value={
              <span className="flex items-center gap-1.5 font-semibold text-accent">
                <Percent size={13} className="text-accent" />
                {meta?.commissionPct ?? 20}% of machine revenue
              </span>
            }
          />
          <Row label="Upfront cost" value={<span className="text-accent font-semibold">£0</span>} />
        </Section>

        {/* Payouts */}
        <Section title="Payouts">
          <div className="flex items-center gap-3 mb-5 bg-bone/60 rounded-lg px-4 py-3">
            <CreditCard size={15} className="text-stone shrink-0" />
            <div>
              <p className="font-sans text-sm font-medium text-ink">{meta?.paymentBankName ?? "—"}</p>
              <p className="font-sans text-xs text-stone">Sort: {meta?.paymentSortCode ?? "——"} · Acc: {meta?.paymentAccountLast4 ?? "————"}</p>
            </div>
          </div>
          <Row label="Payment schedule" value={meta?.paymentSchedule ?? "—"} />
          <Row label="Commission rate" value={
            <span className="font-semibold text-accent">{meta?.commissionPct ?? 20}%</span>
          } />
          <Row
            label="Last payment"
            value={
              <span className="flex flex-col items-end gap-0.5">
                <span className="font-semibold">{formatGbp(meta?.lastPaymentGbp ?? 0)}</span>
                <span className="text-xs text-stone font-normal">{meta?.lastPaymentDate ?? "—"}</span>
              </span>
            }
          />
          <Row
            label="Next payment"
            value={
              <span className="text-stone text-xs font-normal">
                Approx. 15 Jul 2026 — based on current month&apos;s sales
              </span>
            }
          />
          <p className="mt-4 font-sans text-xs text-stone leading-relaxed">
            To update your payout bank account, contact your Éclat account manager.
          </p>
        </Section>

        {/* Venue details */}
        <Section title="Venue details">
          <Row
            label="Address"
            value={
              <span className="flex items-center gap-1.5">
                <MapPin size={13} className="text-stone shrink-0" />
                {meta?.address ?? "—"}
              </span>
            }
          />
          <Row label="City" value={meta?.city ?? "—"} />
          <Row label="Login email" value={email} />
        </Section>

        {/* Machines */}
        <Section title="Your machines">
          {machines.length === 0 ? (
            <p className="font-sans text-sm text-stone">No machines assigned yet.</p>
          ) : (
            <div className="space-y-3">
              {machines.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between gap-3 bg-bone/40 rounded-lg px-4 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Package size={15} className="text-stone shrink-0" />
                    <div className="min-w-0">
                      <p className="font-sans text-sm font-medium text-ink">{m.locationLabel}</p>
                      <p className="font-sans text-xs text-stone">{m.model} · {m.id}</p>
                    </div>
                  </div>
                  <span className="font-sans text-xs bg-accent/10 text-accent border border-accent/20 rounded-full px-2.5 py-0.5 font-semibold shrink-0">
                    Active
                  </span>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Contact */}
        <Section title="Need help?">
          <p className="font-sans text-sm text-stone leading-relaxed mb-4">
            To update your venue details, adjust your partnership terms, or request a new machine placement, reach out to your Éclat account manager.
          </p>
          <a
            href={`mailto:${meta?.eclatContact ?? "partnerships@eclat.co.uk"}`}
            className="inline-flex items-center gap-2 bg-ink text-bone rounded-full px-5 py-2.5 font-sans text-sm font-semibold hover:bg-ink/80 transition-colors"
          >
            <Mail size={14} />
            {meta?.eclatContact ?? "partnerships@eclat.co.uk"}
          </a>
        </Section>

        {/* Sign out — mobile only (desktop uses sidebar button) */}
        <div className="lg:hidden">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
