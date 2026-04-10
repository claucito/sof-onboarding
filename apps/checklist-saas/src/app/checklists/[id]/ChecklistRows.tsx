"use client";

import { useTransition } from "react";

import { toggleChecklistItem } from "@/app/actions/checklists";

export type ChecklistRow = { id: string; label: string; done: boolean };

export function ChecklistRows({
  checklistId,
  items,
}: {
  checklistId: string;
  items: ChecklistRow[];
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div>
      {items.map((item) => (
        <div key={item.id} className={"check-row" + (item.done ? " done" : "")}>
          <input
            type="checkbox"
            checked={item.done}
            disabled={pending}
            onChange={() => {
              startTransition(() => {
                void toggleChecklistItem(checklistId, item.id, !item.done);
              });
            }}
            id={`item-${item.id}`}
          />
          <label htmlFor={`item-${item.id}`}>{item.label}</label>
        </div>
      ))}
    </div>
  );
}
