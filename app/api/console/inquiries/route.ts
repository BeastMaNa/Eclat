import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAdminDataSource } from "@/lib/admin";
import type { InquiryStatus, InquiryInput } from "@/lib/admin/types";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const body = await request.json() as InquiryInput;
  const ds = getAdminDataSource();
  const inquiry = await ds.createInquiry(body);
  return NextResponse.json(inquiry, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const body = await request.json() as { id: string; status?: InquiryStatus; note?: string } & Partial<InquiryInput>;
  const ds = getAdminDataSource();
  if (body.status !== undefined) {
    await ds.updateInquiryStatus(body.id, body.status, body.note);
  } else {
    const { id, ...updates } = body;
    await ds.updateInquiry(id, updates as InquiryInput);
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const ds = getAdminDataSource();
  await ds.deleteInquiry(id);
  return NextResponse.json({ ok: true });
}
