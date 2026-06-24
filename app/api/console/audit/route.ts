import { NextResponse } from "next/server";
import { getAdminDataSource } from "@/lib/admin";
import { auth } from "@/auth";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 100), 500);

  const ds = getAdminDataSource();
  const log = await ds.getAuditLog(limit);

  return NextResponse.json({ log });
}
