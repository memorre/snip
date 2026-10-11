import { prisma } from "@/lib/prisma";
import { DIRECT_REFERRER, UNKNOWN_LABEL } from "@/lib/stats-labels";

export async function listLinksForUser(userId: string) {
  const links = await prisma.link.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { clicks: true } } },
  });

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentCounts = await prisma.click.groupBy({
    by: ["linkId"],
    where: { linkId: { in: links.map((l) => l.id) }, createdAt: { gte: sevenDaysAgo } },
    _count: { id: true },
  });
  const recentByLink = new Map(recentCounts.map((r) => [r.linkId, r._count.id]));

  return links.map((l) => ({
    id: l.id,
    slug: l.slug,
    title: l.title,
    targetUrl: l.targetUrl,
    disabled: l.disabled,
    createdAt: l.createdAt.toISOString(),
    totalClicks: l._count.clicks,
    clicksLast7Days: recentByLink.get(l.id) ?? 0,
  }));
}

export type LinkSummaryDTO = Awaited<ReturnType<typeof listLinksForUser>>[number];

export async function getLinkForOwner(slug: string, ownerId: string) {
  return prisma.link.findFirst({ where: { slug, ownerId } });
}

export async function getActiveLinkBySlug(slug: string) {
  const link = await prisma.link.findUnique({ where: { slug } });
  if (!link || link.disabled) return null;
  if (link.expiresAt && link.expiresAt.getTime() < Date.now()) return null;
  return link;
}

function bucketByDay<T extends { createdAt: Date }>(rows: T[], days: number) {
  const buckets = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    d.setUTCDate(d.getUTCDate() - i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const row of rows) {
    const key = row.createdAt.toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  return Array.from(buckets.entries()).map(([date, count]) => ({ date, count }));
}

function topEntries(counts: Map<string, number>, limit = 6) {
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

export async function getLinkStats(linkId: string, days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const clicks = await prisma.click.findMany({
    where: { linkId, createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
    select: {
      createdAt: true,
      referrer: true,
      browser: true,
      os: true,
      deviceType: true,
      country: true,
      city: true,
    },
  });

  const referrerCounts = new Map<string, number>();
  const browserCounts = new Map<string, number>();
  const osCounts = new Map<string, number>();
  const deviceCounts = new Map<string, number>();
  const countryCounts = new Map<string, number>();
  const cityCounts = new Map<string, { city: string; country: string | null; count: number }>();

  for (const c of clicks) {
    const ref = refLabel(c.referrer);
    referrerCounts.set(ref, (referrerCounts.get(ref) ?? 0) + 1);
    const browser = c.browser ?? UNKNOWN_LABEL;
    browserCounts.set(browser, (browserCounts.get(browser) ?? 0) + 1);
    const os = c.os ?? UNKNOWN_LABEL;
    osCounts.set(os, (osCounts.get(os) ?? 0) + 1);
    deviceCounts.set(c.deviceType, (deviceCounts.get(c.deviceType) ?? 0) + 1);
    const country = c.country ?? UNKNOWN_LABEL;
    countryCounts.set(country, (countryCounts.get(country) ?? 0) + 1);
    if (c.city) {
      const key = `${c.country ?? ""}|${c.city}`;
      const entry = cityCounts.get(key) ?? { city: c.city, country: c.country, count: 0 };
      entry.count += 1;
      cityCounts.set(key, entry);
    }
  }

  return {
    totalClicks: clicks.length,
    daily: bucketByDay(clicks, days),
    byReferrer: topEntries(referrerCounts),
    byBrowser: topEntries(browserCounts),
    byOs: topEntries(osCounts),
    byDevice: topEntries(deviceCounts),
    byCountry: topEntries(countryCounts, 8),
    byCity: Array.from(cityCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 8),
    recent: clicks.slice(0, 12).map((c) => ({
      createdAt: c.createdAt.toISOString(),
      referrer: refLabel(c.referrer),
      browser: c.browser ?? UNKNOWN_LABEL,
      os: c.os ?? UNKNOWN_LABEL,
      deviceType: c.deviceType,
      country: c.country,
      city: c.city,
    })),
  };
}

export type LinkStatsDTO = Awaited<ReturnType<typeof getLinkStats>>;

function refLabel(referrer: string | null) {
  if (!referrer) return DIRECT_REFERRER;
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return referrer;
  }
}
