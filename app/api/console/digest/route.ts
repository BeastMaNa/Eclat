// Owner digest — daily/weekly summary email.
//
// REAL INTEGRATION LATER: Configure RESEND_API_KEY in .env.local to send real emails.
// Without the key this route logs the digest to the console (dev-safe default).
//
// Trigger manually: POST /api/console/digest { period: "daily" | "weekly" }
// Production: set up a cron job (Vercel Cron / external) to call this route.

import { NextResponse } from "next/server";
import { getAdminDataSource } from "@/lib/admin";
import { auth } from "@/auth";
import { DIGEST_RECIPIENTS, DIGEST_FROM } from "@/lib/admin/costs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { period = "daily" } = await req.json().catch(() => ({}));
  const days = period === "weekly" ? 7 : 1;
  const to = new Date();
  const from = new Date(Date.now() - days * 86_400_000);

  const ds = getAdminDataSource();
  const [kpis, attention, anomalies] = await Promise.all([
    ds.getEstateKpis({ from, to }),
    ds.getAttentionItems(),
    ds.getSaleAnomalies({ from, to }),
  ]);

  const subject = `Éclat ${period === "weekly" ? "Weekly" : "Daily"} Digest — ${to.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;

  const body = `
Éclat Operations — ${subject}

Revenue (last ${days}d): £${kpis.totalRevenueGbp.toFixed(2)}
Units sold: ${kpis.unitsSold}
Active machines: ${kpis.activeMachines}
Open tickets: ${kpis.openMaintenanceTickets}
New inquiries: ${kpis.newInquiries}

Attention items:
- Offline machines: ${attention.offlineMachines.length}
- Fault machines: ${attention.faultMachines.length}
- Overdue tickets: ${attention.overdueTickets.length}

Anomalies detected (last ${days}d): ${anomalies.length}
${anomalies.slice(0, 5).map((a) => `  • ${a.venueName} — ${a.note}`).join("\n")}

---
To: ${DIGEST_RECIPIENTS.join(", ")}
`.trim();

  const hasResend = !!process.env.RESEND_API_KEY;

  if (hasResend) {
    // REAL INTEGRATION LATER: install resend and uncomment.
    // const { Resend } = await import("resend");
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({ from: DIGEST_FROM, to: DIGEST_RECIPIENTS, subject, text: body });
    console.log("[digest] RESEND_API_KEY present but send is stubbed. Implement in /api/console/digest/route.ts.");
  } else {
    console.log("\n[digest] RESEND_API_KEY not set — logging digest instead of sending.\n");
    console.log(`Subject: ${subject}`);
    console.log(body);
  }

  await ds.appendAuditEntry(
    (session.user as { name?: string | null }).name ?? "owner",
    "triggered_digest",
    "venue",
    "estate",
    "Estate",
    `${period} digest ${hasResend ? "sent" : "logged (no RESEND_API_KEY)"} to ${DIGEST_RECIPIENTS.join(", ")}`
  );

  return NextResponse.json({
    ok: true,
    sent: hasResend,
    logged: !hasResend,
    subject,
    recipients: DIGEST_RECIPIENTS,
  });
}
