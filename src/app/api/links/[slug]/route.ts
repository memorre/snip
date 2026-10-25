import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getLinkSummaryForUser } from "@/lib/data";
import { getApiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/api-errors";
import { rejectWriteRequest } from "@/lib/api-guard";
import { deleteLinkForUser, setLinkDisabled } from "@/lib/links";

// One of the signed-in user's links, by slug. Another user's link answers 404, exactly like a missing one.

export async function GET(_request: Request, { params }: RouteContext<"/api/links/[slug]">) {
  const user = await getApiUser();
  if (!user) return apiError(401, "unauthorized");

  const { slug } = await params;
  const link = await getLinkSummaryForUser(user.id, slug);
  if (!link) return apiError(404, "notFound");
  return NextResponse.json(link);
}

/**
 * Turns a link on or off: `{ "disabled": true | false }` -> 200 `{ link }`. An explicit value rather than a
 * toggle, so retries are harmless.
 */
export async function PATCH(request: Request, { params }: RouteContext<"/api/links/[slug]">) {
  const rejected = await rejectWriteRequest(request, { json: true });
  if (rejected) return rejected;

  const user = await getApiUser();
  if (!user) return apiError(401, "unauthorized");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError(400, "invalidInput");
  }
  const disabled = (body as { disabled?: unknown } | null)?.disabled;
  if (typeof disabled !== "boolean") return apiError(400, "invalidInput");

  const { slug } = await params;
  const link = await setLinkDisabled(user.id, slug, disabled);
  if (!link) return apiError(404, "notFound");

  revalidatePath("/dashboard");
  return NextResponse.json({ link });
}

/** Deletes a link and its recorded clicks: 204, or 404 if there is no such link. */
export async function DELETE(request: Request, { params }: RouteContext<"/api/links/[slug]">) {
  const rejected = await rejectWriteRequest(request, { json: false });
  if (rejected) return rejected;

  const user = await getApiUser();
  if (!user) return apiError(401, "unauthorized");

  const { slug } = await params;
  if (!(await deleteLinkForUser(user.id, slug))) return apiError(404, "notFound");

  revalidatePath("/dashboard");
  return new Response(null, { status: 204 });
}
