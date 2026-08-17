import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { listLinksForUser } from "@/lib/data";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const links = await listLinksForUser(session.user.id);
  return NextResponse.json(links);
}
