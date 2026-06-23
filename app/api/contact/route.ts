import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  venueName: z.string().min(2),
  contactName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  venueType: z.string().min(1),
  message: z.string().min(10),
  consent: z.boolean(),
});

export async function POST(request: NextRequest) {
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
      <tr><td style="padding:6px 16px 6px 0;color:#8B8378;width:140px;">Venue</td><td style="padding:6px 0;color:#14110F;">${data.venueName}</td></tr>
      <tr><td style="padding:6px 16px 6px 0;color:#8B8378;">Name</td><td style="padding:6px 0;color:#14110F;">${data.contactName}</td></tr>
      <tr><td style="padding:6px 16px 6px 0;color:#8B8378;">Email</td><td style="padding:6px 0;color:#14110F;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
      <tr><td style="padding:6px 16px 6px 0;color:#8B8378;">Phone</td><td style="padding:6px 0;color:#14110F;">${data.phone ?? "—"}</td></tr>
      <tr><td style="padding:6px 16px 6px 0;color:#8B8378;">Venue type</td><td style="padding:6px 0;color:#14110F;">${data.venueType}</td></tr>
      <tr><td style="padding:6px 16px 6px 0;color:#8B8378;vertical-align:top;">Message</td><td style="padding:6px 0;color:#14110F;">${data.message.replace(/\n/g, "<br>")}</td></tr>
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
