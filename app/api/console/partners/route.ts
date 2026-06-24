import { NextResponse } from "next/server";
import { getAdminDataSource } from "@/lib/admin";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { venueId, body } = await req.json();
  if (!venueId || !body) {
    return NextResponse.json({ error: "venueId and body are required" }, { status: 400 });
  }

  const ds = getAdminDataSource();
  const author = (session.user as { name?: string | null; email?: string | null }).name ?? (session.user as { name?: string | null; email?: string | null }).email ?? "owner";
  await ds.addPartnerNote(venueId, author, body);

  return NextResponse.json({ ok: true });
}
