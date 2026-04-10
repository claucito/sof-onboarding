"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

function parseLines(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

export async function createTemplate(formData: FormData): Promise<void> {
  const titleField = formData.get("title");
  const linesField = formData.get("lines");
  const title = typeof titleField === "string" ? titleField.trim() : "";
  const lines = parseLines(typeof linesField === "string" ? linesField : "");

  if (!title) {
    redirect("/templates/new?error=missing-title");
  }
  if (lines.length === 0) {
    redirect("/templates/new?error=missing-lines");
  }

  const template = await prisma.template.create({
    data: {
      title,
      items: {
        create: lines.map((label, sortOrder) => ({ label, sortOrder })),
      },
    },
  });

  revalidatePath("/");
  redirect(`/templates/${template.id}`);
}

export async function createChecklistFromTemplate(templateId: string): Promise<void> {
  const template = await prisma.template.findUnique({
    where: { id: templateId },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });

  if (!template) {
    redirect("/?error=template-not-found");
  }

  const checklist = await prisma.checklist.create({
    data: {
      title: template.title,
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
