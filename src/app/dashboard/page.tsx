import { requireUser } from "@/lib/session";
import { listLinksForUser } from "@/lib/data";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const user = await requireUser();
  const links = await listLinksForUser(user.id);

  return <DashboardClient userName={user.name} initialLinks={links} />;
}
