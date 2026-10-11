import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentUser, requireUser } from "@/lib/session";
import { getLinkForOwner, getLinkStats } from "@/lib/data";
import { getT } from "@/i18n/server";
import { LinkAnalyticsClient } from "./link-analytics-client";

export async function generateMetadata({ params }: PageProps<"/dashboard/[slug]">): Promise<Metadata> {
  const [{ slug }, t, user] = await Promise.all([params, getT(), getCurrentUser()]);
  // A missing or someone else's link gets the 404 title, matching the not-found page the visitor sees.
  const link = user ? await getLinkForOwner(slug, user.id) : null;
  return { title: link ? t("meta.analytics", { slug }) : t("meta.notFound") };
}

export default async function LinkAnalyticsPage({ params }: PageProps<"/dashboard/[slug]">) {
  const user = await requireUser();
  const { slug } = await params;

  const link = await getLinkForOwner(slug, user.id);
  if (!link) notFound();

  const stats = await getLinkStats(link.id, 30);

  return (
    <LinkAnalyticsClient
      link={{
        slug: link.slug,
        title: link.title,
        targetUrl: link.targetUrl,
        disabled: link.disabled,
        createdAt: link.createdAt.toISOString(),
      }}
      initialStats={{ ...stats, linkId: link.id }}
    />
  );
}
