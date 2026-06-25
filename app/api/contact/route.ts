import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const bodySchema = z.object({
  venueName: z.string().min(2),
  contactName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  venueType: z.string().min(1),
  message: z.string().min(10),
  consent: z.boolean(),
});

// Escape user-supplied strings before embedding them in HTML email bodies.
function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export async function POST(request: NextRequest) {
  // Rate limit: 5 submissions per 15 minutes per IP
  const ip = getClientIp(request.headers);
  const { ok } = checkRateLimit(`contact:${ip}`, { limit: 5, windowMs: 15 * 60_000 });
  if (!ok) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a few minutes before trying again." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const result = bodySchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Validation failed", issues: result.error.issues }, { status: 422 });
  }

  const data = result.data;
  const recipient = process.env.CONTACT_RECIPIENT_EMAIL ?? "hello@eclat.co.uk";

  const html = `
    <h2 style="font-family:Georgia,serif;color:#14110F;">New Éclat venue enquiry</h2>
    <table style="font-family:system-ui,sans-serif;font-size:14px;border-collapse:collapse;">
      <tr><td style="padding:6px 16px 6px 0;color:#8B8378;width:140px;">Venue</td><td style="padding:6px 0;color:#14110F;">${escHtml(data.venueName)}</td></tr>
      <tr><td style="padding:6px 16px 6px 0;color:#8B8378;">Name</td><td style="padding:6px 0;color:#14110F;">${escHtml(data.contactName)}</td></tr>
      <tr><td style="padding:6px 16px 6px 0;color:#8B8378;">Email</td><td style="padding:6px 0;color:#14110F;"><a href="mailto:${escHtml(data.email)}">${escHtml(data.email)}</a></td></tr>
      <tr><td style="padding:6px 16px 6px 0;color:#8B8378;">Phone</td><td style="padding:6px 0;color:#14110F;">${escHtml(data.phone ?? "—")}</td></tr>
      <tr><td style="padding:6px 16px 6px 0;color:#8B8378;">Venue type</td><td style="padding:6px 0;color:#14110F;">${escHtml(data.venueType)}</td></tr>
      <tr><td style="padding:6px 16px 6px 0;color:#8B8378;vertical-align:top;">Message</td><td style="padding:6px 0;color:#14110F;">${escHtml(data.message).replace(/\n/g, "<br>")}</td></tr>
    </table>
  `;

  const text = [
    "New Éclat venue enquiry",
    "",
    `Venue: ${data.venueName}`,
    `Name: ${data.contactName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone ?? "—"}`,
    `Venue type: ${data.venueType}`,
    "",
    `Message:\n${data.message}`,
  ].join("\n");

  if (!process.env.RESEND_API_KEY) {
    console.log("[contact form — no RESEND_API_KEY, logging submission]");
    console.log(text);
    return NextResponse.json({ success: true });
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Éclat Website <noreply@eclat.co.uk>",
      to: recipient,
      replyTo: data.email,
      subject: `New venue enquiry: ${data.venueName}`,
      html,
      text,
    });
  } catch (err) {
    console.error("[contact form] Resend error:", err);
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
