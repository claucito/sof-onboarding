"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function toggleChecklistItem(
  checklistId: string,
  itemId: string,
  done: boolean,
): Promise<void> {
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
