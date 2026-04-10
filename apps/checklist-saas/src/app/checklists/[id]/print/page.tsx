import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { PrintToolbar } from "./PrintToolbar";

type Props = { params: Promise<{ id: string }> };

export default async function ChecklistPrintPage({ params }: Props) {
  const { id } = await params;
  const checklist = await prisma.checklist.findUnique({
    where: { id },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });

  if (!checklist) {
    notFound();
  }

  return (
    <>
      <PrintToolbar checklistId={checklist.id} />
      <h1 style={{ fontSize: "1.5rem" }}>{checklist.title}</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {checklist.items.map((it) => (
          <li key={it.id} style={{ margin: "0.35rem 0", display: "flex", gap: "0.5rem" }}>
            <span>{it.done ? "☑" : "☐"}</span>
            <span style={it.done ? { textDecoration: "line-through", color: "#555" } : undefined}>
              {it.label}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
