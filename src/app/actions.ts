"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { isReservedSlug, isValidSlug, randomSlug } from "@/lib/slug";
import { getT } from "@/i18n/server";

type CreateLinkValues = { targetUrl: string; slug: string; title: string };

export type ActionState =
  | {
      error?: string;
      /** The field the error is about, so the form can mark just that input. */
      field?: "targetUrl" | "slug";
      /** What was submitted, so the form can keep it after React resets it. */
      values?: CreateLinkValues;
      success?: boolean;
      slug?: string;
    }
  | undefined;

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v.length === 0 ? undefined : v))
  .optional();

const createSchema = z.object({
  targetUrl: z.string().url(),
  slug: optionalText,
  title: optionalText,
});

export async function createLink(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  // Messages are rendered in the visitor's language (the "lang" cookie travels with the action request).
  const t = await getT();

  const values: CreateLinkValues = {
    targetUrl: String(formData.get("targetUrl") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    title: String(formData.get("title") ?? ""),
  };

  const parsed = createSchema.safeParse(values);
  if (!parsed.success) {
    const urlIssue = parsed.error.issues[0]?.path[0] === "targetUrl";
    return {
      error: t(urlIssue ? "errors.invalidUrl" : "errors.invalidInput"),
      field: urlIssue ? "targetUrl" : undefined,
      values,
    };
  }

  let { slug } = parsed.data;
  if (slug) {
    if (isReservedSlug(slug)) return { error: t("errors.slugReserved", { slug }), field: "slug", values };
    if (!isValidSlug(slug)) return { error: t("errors.slugFormat"), field: "slug", values };
    const existing = await prisma.link.findUnique({ where: { slug } });
    if (existing) return { error: t("errors.slugTaken", { slug }), field: "slug", values };
  } else {
    do {
      slug = randomSlug();
    } while (await prisma.link.findUnique({ where: { slug } }));
  }

  await prisma.link.create({
    data: {
      slug,
      targetUrl: parsed.data.targetUrl,
      title: parsed.data.title,
      ownerId: user.id,
    },
  });

  revalidatePath("/dashboard");
  return { success: true, slug };
}

export async function toggleLink(linkId: string) {
  const user = await requireUser();
  const link = await prisma.link.findFirst({ where: { id: linkId, ownerId: user.id } });
  if (!link) return;
  await prisma.link.update({ where: { id: link.id }, data: { disabled: !link.disabled } });
  revalidatePath("/dashboard");
}

export async function deleteLink(linkId: string) {
  const user = await requireUser();
  await prisma.link.deleteMany({ where: { id: linkId, ownerId: user.id } });
  revalidatePath("/dashboard");
}
