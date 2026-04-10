import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/require-user";

import { ChecklistRows } from "./ChecklistRows";

type Props = { params: Promise<{ id: string }> };

export default async function ChecklistPage({ params }: Props) {
  const userId = await requireUserId();
  const { id } = await params;
  const checklist = await prisma.checklist.findFirst({
    where: { id, userId },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });

  if (!checklist) {
    notFound();
  }

  const rows = checklist.items.map((it) => ({ id: it.id, label: it.label, done: it.done }));

  return (
    <>
      <h1>{checklist.title}</h1>
      <p className="lead">
        Marca ítems al completarlos. Exporta Markdown, PDF generado en servidor o usa la vista de
        impresión del navegador.
      </p>

      <div className="card">
        <ChecklistRows checklistId={checklist.id} items={rows} />
      </div>

      <div className="row no-print">
        <a className="button secondary" href={`/api/checklists/${checklist.id}/export.md`} download>
          Descargar .md
        </a>
        <a
          className="button secondary"
          href={`/api/checklists/${checklist.id}/export.pdf`}
          download
        >
          Descargar .pdf
        </a>
        <Link
          className="button secondary"
          href={`/checklists/${checklist.id}/print`}
          target="_blank"
        >
          Vista imprimible (PDF)
        </Link>
      </div>
    </>
  );
}
