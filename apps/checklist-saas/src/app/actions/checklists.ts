"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/require-user";

export async function toggleChecklistItem(
  checklistId: string,
  itemId: string,
  done: boolean,
): Promise<void> {
  const userId = await requireUserId();

  const checklist = await prisma.checklist.findFirst({
    where: { id: checklistId, userId },
  });
  if (!checklist) {
    return;
  }

  const item = await prisma.checklistItem.findFirst({
    where: { id: itemId, checklistId },
  });

  if (!item) {
    return;
  }

  await prisma.checklistItem.update({
    where: { id: itemId },
    data: { done },
  });

  revalidatePath(`/checklists/${checklistId}`);
  revalidatePath(`/checklists/${checklistId}/print`);
}
