import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { getActiveLinkBySlug } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { parseGeo, parseUserAgent } from "@/lib/click-meta";
import { publishClick } from "@/lib/live";

export default async function RedirectPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const link = await getActiveLinkBySlug(slug);
  if (!link) notFound();

  const h = await headers();
  const ua = parseUserAgent(h.get("user-agent"));
  const geo = parseGeo(h);

  await prisma.click.create({
    data: {
      linkId: link.id,
      referrer: h.get("referer"),
      userAgent: h.get("user-agent"),
      browser: ua.browser,
      os: ua.os,
      deviceType: ua.deviceType,
      country: geo.country,
      city: geo.city,
    },
  });
  publishClick(link.id);

  redirect(link.targetUrl);
}
