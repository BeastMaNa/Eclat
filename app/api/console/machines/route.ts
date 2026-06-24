import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAdminDataSource } from "@/lib/admin";
import type { MachineInput } from "@/lib/admin/types";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const body = await request.json() as MachineInput;
  const ds = getAdminDataSource();
  const machine = await ds.createMachine(body);
  return NextResponse.json(machine, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const { id, action, ...updates } = await request.json() as { id: string; action?: "archive" | "restore" } & Partial<MachineInput>;
  const ds = getAdminDataSource();
  if (action === "archive") {
    await ds.archiveMachine(id);
  } else if (action === "restore") {
    await ds.restoreMachine(id);
  } else {
    await ds.updateMachine(id, updates as MachineInput);
  }
  return NextResponse.json({ ok: true });
}
