"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  MAX_TEMPLATE_LINE_LENGTH,
  MAX_TEMPLATE_LINES,
  MAX_TEMPLATE_TITLE_LENGTH,
} from "@/lib/limits";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/require-user";

function parseLines(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

export async function createTemplate(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const titleField = formData.get("title");
  const linesField = formData.get("lines");
  const title = typeof titleField === "string" ? titleField.trim() : "";
  const lines = parseLines(typeof linesField === "string" ? linesField : "");

  if (!title) {
    redirect("/templates/new?error=missing-title");
  }
  if (title.length > MAX_TEMPLATE_TITLE_LENGTH) {
    redirect("/templates/new?error=title-too-long");
  }
  if (lines.length === 0) {
    redirect("/templates/new?error=missing-lines");
  }
  if (lines.length > MAX_TEMPLATE_LINES) {
    redirect("/templates/new?error=too-many-lines");
  }
  if (lines.some((l) => l.length > MAX_TEMPLATE_LINE_LENGTH)) {
    redirect("/templates/new?error=line-too-long");
  }

  const template = await prisma.template.create({
    data: {
      title,
      userId,
      items: {
        create: lines.map((label, sortOrder) => ({ label, sortOrder })),
      },
    },
  });

  revalidatePath("/");
  redirect(`/templates/${template.id}`);
}

export async function createChecklistFromTemplate(templateId: string): Promise<void> {
  const userId = await requireUserId();
  const template = await prisma.template.findFirst({
    where: { id: templateId, userId },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });

  if (!template) {
    redirect("/?error=template-not-found");
  }

  const checklist = await prisma.checklist.create({
    data: {
      title: template.title,
      userId,
      templateId: template.id,
      items: {
        create: template.items.map((it) => ({
          label: it.label,
          sortOrder: it.sortOrder,
          done: false,
        })),
      },
    },
  });

  revalidatePath("/");
  revalidatePath(`/templates/${templateId}`);
  redirect(`/checklists/${checklist.id}`);
}
