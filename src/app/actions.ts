"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { createLinkForUser } from "@/lib/links";
import type { MessageKey, MessageVars } from "@/i18n/types";

type CreateLinkValues = { targetUrl: string; slug: string; title: string };

export type ActionState =
  | {
      /**
       * A message key (plus its variables), not rendered text, so the form shows the error in
       * whatever language is active, even after a language switch.
       */
      errorKey?: MessageKey;
      errorVars?: MessageVars;
      /** The field the error is about, so the form can mark just that input. */
      field?: "targetUrl" | "slug";
      /** What was submitted, so the form can keep it after React resets it. */
      values?: CreateLinkValues;
      success?: boolean;
      slug?: string;
    }
  | undefined;

export async function createLink(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();

  const values: CreateLinkValues = {
    targetUrl: String(formData.get("targetUrl") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    title: String(formData.get("title") ?? ""),
  };

  // Validation and creation live in src/lib/links.ts, shared with POST /api/links.
  const result = await createLinkForUser(user.id, values);
  if (!result.ok) {
    return { errorKey: result.errorKey, errorVars: result.errorVars, field: result.field, values };
  }

  revalidatePath("/dashboard");
  return { success: true, slug: result.link.slug };
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
