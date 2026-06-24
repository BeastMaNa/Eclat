import { NextResponse } from "next/server";
import { getAdminDataSource } from "@/lib/admin";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { fragrance, qty, costPerUnit, supplier } = await req.json();
  if (!fragrance || !qty) {
    return NextResponse.json({ error: "fragrance and qty are required" }, { status: 400 });
  }

  const ds = getAdminDataSource();
  const po = await ds.createPurchaseOrder(fragrance, Number(qty), supplier ?? "Éclat Wholesale Ltd", Number(costPerUnit) || 0.45);

  return NextResponse.json({ po });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, status } = await req.json();
  if (!id || !status) {
    return NextResponse.json({ error: "id and status are required" }, { status: 400 });
  }

  const ds = getAdminDataSource();
  await ds.updatePurchaseOrderStatus(id, status);

  return NextResponse.json({ ok: true });
}
