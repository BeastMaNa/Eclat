import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { z } from "zod";

const bodySchema = z.object({
  category: z.string().min(1),
  description: z.string().min(5, "Please describe the issue"),
});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const result = bodySchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0]?.message ?? "Validation failed" }, { status: 422 });
  }

  const { category, description } = result.data;
  const { venueName, email, venueId } = session.user;
  const recipient = process.env.CONTACT_RECIPIENT_EMAIL ?? "hello@eclat.co.uk";
  const timestamp = new Date().toLocaleString("en-GB", { timeZone: "Europe/London" });

  const html = `
    <h2 style="font-family:Georgia,serif;color:#14110F;">Issue report from partner dashboard</h2>
    <table style="font-family:system-ui,sans-serif;font-size:14px;border-collapse:collapse;">
      <tr><td style="padding:6px 16px 6px 0;color:#8B8378;width:120px;">Venue</td><td style="padding:6px 0;color:#14110F;">${venueName} (${venueId})</td></tr>
      <tr><td style="padding:6px 16px 6px 0;color:#8B8378;">Email</td><td style="padding:6px 0;color:#14110F;"><a href="mailto:${email}">${email}</a></td></tr>
      <tr><td style="padding:6px 16px 6px 0;color:#8B8378;">Category</td><td style="padding:6px 0;color:#14110F;">${category}</td></tr>
      <tr><td style="padding:6px 16px 6px 0;color:#8B8378;">Submitted</td><td style="padding:6px 0;color:#14110F;">${timestamp}</td></tr>
      <tr><td style="padding:6px 16px 6px 0;color:#8B8378;vertical-align:top;">Description</td><td style="padding:6px 0;color:#14110F;">${description.replace(/\n/g, "<br>")}</td></tr>
    </table>
  `;

  const text = [
    "Issue report from partner dashboard",
    "",
    `Venue: ${venueName} (${venueId})`,
    `Email: ${email}`,
    `Category: ${category}`,
    `Submitted: ${timestamp}`,
    "",
    `Description:\n${description}`,
  ].join("\n");

  if (!process.env.RESEND_API_KEY) {
    console.log("[issue report — no RESEND_API_KEY]");
    console.log(text);
    return NextResponse.json({ success: true });
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Éclat Dashboard <noreply@eclat.co.uk>",
      to: recipient,
      replyTo: email,
      subject: `[Issue] ${category} — ${venueName}`,
      html,
      text,
    });
  } catch (err) {
    console.error("[issue report] Resend error:", err);
    return NextResponse.json({ error: "Failed to send. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
