import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAdminDataSource } from "@/lib/admin";
import { z } from "zod";

const inquirySchema = z.object({
  venueName: z.string().min(1).max(120),
  contactName: z.string().min(1).max(100),
  contactEmail: z.string().email(),
  venueType: z.string().min(1).max(60),
  city: z.string().min(1).max(80),
  message: z.string().min(1).max(2000),
});

const statusSchema = z.enum(["new", "contacted", "qualified", "won", "lost"]);

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  let raw: unknown;
  try { raw = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  }
  const ds = getAdminDataSource();
  const inquiry = await ds.createInquiry(parsed.data);
  return NextResponse.json(inquiry, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  let raw: unknown;
  try { raw = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const body = raw as { id?: unknown; status?: unknown; note?: unknown } & Record<string, unknown>;
  if (!body.id || typeof body.id !== "string") {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }
  const ds = getAdminDataSource();
  if (body.status !== undefined) {
    const s = statusSchema.safeParse(body.status);
    if (!s.success) return NextResponse.json({ error: "Invalid status" }, { status: 422 });
    const note = typeof body.note === "string" ? body.note.slice(0, 1000) : undefined;
    await ds.updateInquiryStatus(body.id, s.data, note);
  } else {
    const upd = inquirySchema.partial().safeParse(body);
    if (!upd.success) return NextResponse.json({ error: "Validation failed" }, { status: 422 });
    await ds.updateInquiry(body.id, upd.data as Parameters<typeof ds.updateInquiry>[1]);
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const ds = getAdminDataSource();
  await ds.deleteInquiry(id);
  return NextResponse.json({ ok: true });
}
