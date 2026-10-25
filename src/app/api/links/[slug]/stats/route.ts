import { NextResponse } from "next/server";
import { getLinkForOwner, getLinkStats } from "@/lib/data";
import { getApiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/api-errors";

/** Longest range the stats can cover. The web and native apps ask for 7, 30 or 90 days. */
const MAX_DAYS = 365;

export async function GET(request: Request, { params }: RouteContext<"/api/links/[slug]/stats">) {
  const user = await getApiUser();
  if (!user) return apiError(401, "unauthorized");

  const { slug } = await params;
  const link = await getLinkForOwner(slug, user.id);
  if (!link) return apiError(404, "notFound");

  const { searchParams } = new URL(request.url);
  // A whole number of days in [1, MAX_DAYS]; anything unreadable falls back to 30, as before.
  const requested = Math.trunc(Number(searchParams.get("days") ?? "30")) || 30;
  const days = Math.min(Math.max(requested, 1), MAX_DAYS);

  const stats = await getLinkStats(link.id, days);
  return NextResponse.json({ ...stats, linkId: link.id });
}
