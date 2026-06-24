import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAdminDataSource } from "@/lib/admin";
import type { InquiryStatus } from "@/lib/admin/types";

// REAL API LATER: replace with a real DB write
export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const { id, status, note } = await request.json() as { id: string; status: InquiryStatus; note?: string };
  const ds = getAdminDataSource();
  await ds.updateInquiryStatus(id, status, note);
  return NextResponse.json({ ok: true });
}
