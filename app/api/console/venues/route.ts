import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAdminDataSource } from "@/lib/admin";
import type { VenueInput } from "@/lib/admin/types";

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
  const body = await request.json() as VenueInput;
  const ds = getAdminDataSource();
  const venue = await ds.createVenue(body);
  return NextResponse.json(venue, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const { id, action, ...updates } = await request.json() as { id: string; action?: "archive" | "restore" } & Partial<VenueInput>;
  const ds = getAdminDataSource();
  if (action === "archive") {
    await ds.archiveVenue(id);
  } else if (action === "restore") {
    await ds.restoreVenue(id);
  } else {
    await ds.updateVenue(id, updates as VenueInput);
  }
  return NextResponse.json({ ok: true });
}
