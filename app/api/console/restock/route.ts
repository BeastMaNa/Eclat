import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAdminDataSource } from "@/lib/admin";

// REAL API LATER: replace with a real inventory write — e.g. POST /machines/:machineId/restock
// This should trigger a full-capacity write to each slot in the venue's machines.
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const { venueId } = await request.json() as { venueId: string };
  const ds = getAdminDataSource();
  await ds.markVenueRestocked(venueId);
  return NextResponse.json({ ok: true });
}
