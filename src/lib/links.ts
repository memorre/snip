import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getLinkSummaryForUser, type LinkDetailDTO } from "@/lib/data";
import { isReservedSlug, isValidSlug, randomSlug } from "@/lib/slug";
import type { MessageKey, MessageVars } from "@/i18n/types";

// Link mutations shared by the Server Actions (the web dashboard) and the JSON API (the native app), so
// both validate and create links the same way.

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v.length === 0 ? undefined : v))
  .optional();

export const createSchema = z.object({
  // Web pages only: no javascript:, data:, tel: or other apps' schemes, which the dashboards would offer to open.
  targetUrl: z.url({ protocol: /^https?$/ }),
  slug: optionalText,
  title: optionalText,
});

export type CreateLinkInput = { targetUrl: string; slug?: string; title?: string };

/** The `errors.*` messages a failed create can return. The API sends the key's last part as `code`. */
type CreateErrorKey = Extract<
  MessageKey,
  "errors.invalidUrl" | "errors.invalidInput" | "errors.slugFormat" | "errors.slugReserved" | "errors.slugTaken"
>;

export type CreateLinkResult =
  | { ok: true; link: LinkDetailDTO }
  | {
      ok: false;
      errorKey: CreateErrorKey;
      errorVars?: MessageVars;
      field?: "targetUrl" | "slug";
      status: 400 | 409;
    };

/** Prisma's unique-constraint violation: another request took the slug between our check and insert. */
function isUniqueViolation(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

/** How many fresh random slugs to try if one collides at insert time (vanishingly rare). */
const RANDOM_SLUG_ATTEMPTS = 5;

export async function createLinkForUser(userId: string, input: CreateLinkInput): Promise<CreateLinkResult> {
  const parsed = createSchema.safeParse(input);
  if (!parsed.success) {
    const urlIssue = parsed.error.issues[0]?.path[0] === "targetUrl";
    return urlIssue
      ? { ok: false, errorKey: "errors.invalidUrl", field: "targetUrl", status: 400 }
      : { ok: false, errorKey: "errors.invalidInput", status: 400 };
  }

  const { targetUrl, title } = parsed.data;
  const customSlug = parsed.data.slug;
  if (customSlug) {
    if (isReservedSlug(customSlug)) {
      return { ok: false, errorKey: "errors.slugReserved", errorVars: { slug: customSlug }, field: "slug", status: 400 };
    }
    if (!isValidSlug(customSlug)) return { ok: false, errorKey: "errors.slugFormat", field: "slug", status: 400 };
    const existing = await prisma.link.findUnique({ where: { slug: customSlug } });
    if (existing) {
      return { ok: false, errorKey: "errors.slugTaken", errorVars: { slug: customSlug }, field: "slug", status: 409 };
    }
  }

  for (let attempt = 0; ; attempt++) {
    let slug = customSlug;
    if (!slug) {
      do {
        slug = randomSlug();
      } while (await prisma.link.findUnique({ where: { slug } }));
    }

    try {
      await prisma.link.create({ data: { slug, targetUrl, title, ownerId: userId } });
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;
      // A custom slug that was taken in the meantime is the user's to change; a random one we just retry.
      if (customSlug || attempt + 1 >= RANDOM_SLUG_ATTEMPTS) {
        return { ok: false, errorKey: "errors.slugTaken", errorVars: { slug }, field: "slug", status: 409 };
      }
      continue;
    }

    const link = await getLinkSummaryForUser(userId, slug);
    if (!link) throw new Error(`Link /${slug} vanished right after it was created`);
    return { ok: true, link };
  }
}

/**
 * Turns a link on or off. Takes the new state rather than flipping it, so a retried request (a double tap,
 * a flaky connection) can't undo itself. Returns the updated link, or null if the user owns no such link.
 */
export async function setLinkDisabled(userId: string, slug: string, disabled: boolean) {
  const { count } = await prisma.link.updateMany({ where: { slug, ownerId: userId }, data: { disabled } });
  if (count === 0) return null;
  return getLinkSummaryForUser(userId, slug);
}

/** Deletes a link and, by cascade, its clicks. Returns false if the user owns no such link. */
export async function deleteLinkForUser(userId: string, slug: string) {
  const { count } = await prisma.link.deleteMany({ where: { slug, ownerId: userId } });
  return count > 0;
}
