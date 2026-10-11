import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { listLinksForUser } from "@/lib/data";
import { getT } from "@/i18n/server";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    const t = await getT();
    return NextResponse.json({ error: t("errors.unauthorized") }, { status: 401 });
  }

  const links = await listLinksForUser(session.user.id);
  return NextResponse.json(links);
}
