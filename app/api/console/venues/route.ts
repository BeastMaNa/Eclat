import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAdminDataSource } from "@/lib/admin";
import { z } from "zod";

const venueSchema = z.object({
  name: z.string().min(1).max(120),
  area: z.string().min(1).max(80),
  type: z.string().min(1).max(60),
  address: z.string().min(1).max(200),
  lat: z.number().default(0),
  lng: z.number().default(0),
  status: z.enum(["live", "install-pending", "paused"]),
  goLiveDate: z.string().default("—"),
  partnershipModel: z.enum(["revenue-share", "lease", "purchase"]),
  commissionPct: z.number().min(0).max(100),
  contactName: z.string().min(1).max(100),
  contactEmail: z.string().email(),
});

const patchSchema = z.union([
  z.object({ id: z.string(), action: z.enum(["archive", "restore"]) }),
  venueSchema.partial().extend({ id: z.string() }),
]);

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const ds = getAdminDataSource();
  const venues = await ds.getVenues({ includeArchived: true });
  return NextResponse.json(venues);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  let raw: unknown;
  try { raw = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = venueSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  }
  const ds = getAdminDataSource();
  const venue = await ds.createVenue(parsed.data);
  return NextResponse.json(venue, { status: 201 });
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
  const parsed = patchSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  }
  const body = parsed.data;
  const ds = getAdminDataSource();
  if ("action" in body && body.action === "archive") {
    await ds.archiveVenue(body.id);
  } else if ("action" in body && body.action === "restore") {
    await ds.restoreVenue(body.id);
  } else {
    const { id, ...updates } = body as { id: string } & Record<string, unknown>;
    await ds.updateVenue(id, updates as Parameters<typeof ds.updateVenue>[1]);
  }
  return NextResponse.json({ ok: true });
}
