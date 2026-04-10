import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { ChecklistRows } from "./ChecklistRows";

type Props = { params: Promise<{ id: string }> };

export default async function ChecklistPage({ params }: Props) {
  const { id } = await params;
  const checklist = await prisma.checklist.findUnique({
    where: { id },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });

  if (!checklist) {
    notFound();
  }

  const rows = checklist.items.map((it) => ({ id: it.id, label: it.label, done: it.done }));

  return (
    <>
      <nav className="no-print row" style={{ marginBottom: "1rem" }}>
        <Link href="/">← Inicio</Link>
      </nav>
      <h1>{checklist.title}</h1>
      <p className="lead">
        Marca ítems al completarlos. Exporta Markdown o usa la vista de impresión para PDF.
      </p>

      <div className="card">
        <ChecklistRows checklistId={checklist.id} items={rows} />
      </div>

      <div className="row no-print">
        <a className="button secondary" href={`/api/checklists/${checklist.id}/export.md`} download>
          Descargar .md
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
