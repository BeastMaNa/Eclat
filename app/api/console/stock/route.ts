import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAdminDataSource } from "@/lib/admin";
import type { StockItemInput } from "@/lib/admin/types";

function parseId(id: string): { machineId: string; slot: number } | null {
  // Format: "${machineId}-${slot}"  e.g. "M-001-3"
  const lastDash = id.lastIndexOf("-");
  if (lastDash < 0) return null;
  const machineId = id.slice(0, lastDash);
  const slot = parseInt(id.slice(lastDash + 1), 10);
  if (!machineId || isNaN(slot)) return null;
  return { machineId, slot };
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const body = await request.json() as StockItemInput;
  const ds = getAdminDataSource();
  const item = await ds.createStockItem(body);
  return NextResponse.json(item, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const { id, ...updates } = await request.json() as { id: string } & Partial<StockItemInput>;
  const parsed = parseId(id);
  if (!parsed) return NextResponse.json({ error: "Invalid id format" }, { status: 400 });
  const ds = getAdminDataSource();
  await ds.updateStockItem(parsed.machineId, parsed.slot, updates as Partial<StockItemInput>);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const parsed = parseId(id);
  if (!parsed) return NextResponse.json({ error: "Invalid id format" }, { status: 400 });
  const ds = getAdminDataSource();
  await ds.deleteStockItem(parsed.machineId, parsed.slot);
  return NextResponse.json({ ok: true });
}
