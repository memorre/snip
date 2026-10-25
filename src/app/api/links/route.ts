import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { listLinksForUser } from "@/lib/data";
import { getApiUser } from "@/lib/api-auth";
import { apiError, codeFromKey } from "@/lib/api-errors";
import { rejectWriteRequest } from "@/lib/api-guard";
import { createLinkForUser } from "@/lib/links";

export async function GET() {
  const user = await getApiUser();
  if (!user) return apiError(401, "unauthorized");

  const links = await listLinksForUser(user.id);
  return NextResponse.json(links);
}

/** An optional text field: absent, null or a string. Anything else makes the request invalid. */
function optionalString(value: unknown): string | undefined | false {
  if (value === undefined || value === null) return undefined;
  return typeof value === "string" ? value : false;
}

/**
 * Creates a link: `{ targetUrl, slug?, title? }` -> 201 `{ link, shortUrl }`. The JSON twin of the
 * `createLink` Server Action (same validation, same error keys), for clients that can't call actions.
 */
export async function POST(request: Request) {
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
  if (typeof body !== "object" || body === null || Array.isArray(body)) return apiError(400, "invalidInput");

  const { targetUrl, slug, title } = body as Record<string, unknown>;
  const slugValue = optionalString(slug);
  const titleValue = optionalString(title);
  if (typeof targetUrl !== "string") return apiError(400, "invalidUrl", { field: "targetUrl" });
  if (slugValue === false || titleValue === false) return apiError(400, "invalidInput");

  const result = await createLinkForUser(user.id, { targetUrl, slug: slugValue, title: titleValue });
  if (!result.ok) {
    return apiError(result.status, codeFromKey(result.errorKey), { vars: result.errorVars, field: result.field });
  }

  revalidatePath("/dashboard");
  const shortUrl = `${new URL(request.url).origin}/${result.link.slug}`;
  return NextResponse.json({ link: result.link, shortUrl }, { status: 201 });
}
