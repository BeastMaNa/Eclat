import { NextResponse } from "next/server";
import { getAdminDataSource } from "@/lib/admin";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const ds = getAdminDataSource();
  const documents = await ds.getDocuments();
  return NextResponse.json({ documents });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  if (!body.name || !body.type) {
    return NextResponse.json({ error: "name and type are required" }, { status: 400 });
  }

  const ds = getAdminDataSource();
  const doc = await ds.addDocument({
    name: body.name,
    type: body.type,
    url: body.url ?? "#placeholder",
    uploadedBy: body.uploadedBy ?? (session.user as { name?: string | null }).name ?? "owner",
    venueId: body.venueId,
    machineId: body.machineId,
    notes: body.notes,
  });

  return NextResponse.json({ doc });
}
