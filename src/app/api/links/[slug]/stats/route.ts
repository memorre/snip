import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getLinkForOwner, getLinkStats } from "@/lib/data";

export async function GET(request: Request, { params }: RouteContext<"/api/links/[slug]/stats">) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const link = await getLinkForOwner(slug, session.user.id);
  if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { searchParams } = new URL(request.url);
  const days = Number(searchParams.get("days") ?? "30") || 30;

  const stats = await getLinkStats(link.id, days);
  return NextResponse.json({ ...stats, linkId: link.id });
}
