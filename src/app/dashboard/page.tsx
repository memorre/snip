import type { Metadata } from "next";
import { requireUser } from "@/lib/session";
import { listLinksForUser } from "@/lib/data";
import { getT } from "@/i18n/server";
import { DashboardClient } from "./dashboard-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("meta.dashboard") };
}

export default async function DashboardPage() {
  const user = await requireUser();
  const links = await listLinksForUser(user.id);

  return <DashboardClient userName={user.name} initialLinks={links} />;
}
