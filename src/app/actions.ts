"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { isValidSlug, randomSlug } from "@/lib/slug";

export type ActionState = { error?: string; success?: boolean; slug?: string } | undefined;

const createSchema = z.object({
  targetUrl: z.string().url("Enter a valid URL, including https://"),
  slug: z
    .string()
    .trim()
    .transform((v) => (v.length === 0 ? undefined : v))
    .optional(),
  title: z
    .string()
    .trim()
    .transform((v) => (v.length === 0 ? undefined : v))
    .optional(),
});

export async function createLink(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();

  const parsed = createSchema.safeParse({
    targetUrl: formData.get("targetUrl"),
    slug: formData.get("slug"),
    title: formData.get("title"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  let { slug } = parsed.data;
  if (slug) {
    if (!isValidSlug(slug)) {
      return { error: "Slugs must be 3-32 characters: letters, numbers, - and _ only." };
    }
    const existing = await prisma.link.findUnique({ where: { slug } });
    if (existing) return { error: `"${slug}" is already taken.` };
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
