import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getLinkForOwner, getLinkStats } from "@/lib/data";
import { getT } from "@/i18n/server";

export async function GET(request: Request, { params }: RouteContext<"/api/links/[slug]/stats">) {
  const session = await auth();
  if (!session?.user) {
    const t = await getT();
    return NextResponse.json({ error: t("errors.unauthorized") }, { status: 401 });
  }

  const { slug } = await params;
  const link = await getLinkForOwner(slug, session.user.id);
  if (!link) {
    const t = await getT();
    return NextResponse.json({ error: t("errors.notFound") }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const days = Number(searchParams.get("days") ?? "30") || 30;

  const stats = await getLinkStats(link.id, days);
  return NextResponse.json({ ...stats, linkId: link.id });
}
