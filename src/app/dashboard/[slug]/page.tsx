import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { getLinkForOwner, getLinkStats } from "@/lib/data";
import { LinkAnalyticsClient } from "./link-analytics-client";

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
