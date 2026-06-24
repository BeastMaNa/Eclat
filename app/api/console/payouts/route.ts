import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAdminDataSource } from "@/lib/admin";

// REAL API LATER: replace with a real DB write — e.g. UPDATE payouts SET status='paid', paid_date=?, reference=? WHERE venue_id=?
export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const { venueId, paidDate, reference } = await request.json() as {
    venueId: string;
    paidDate: string;
    reference: string;
  };
  const ds = getAdminDataSource();
  await ds.markPayoutPaid(venueId, paidDate, reference);
  return NextResponse.json({ ok: true });
}
