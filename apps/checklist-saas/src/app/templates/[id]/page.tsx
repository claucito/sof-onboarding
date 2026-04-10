import Link from "next/link";
import { notFound } from "next/navigation";

import { createChecklistFromTemplate } from "@/app/actions/templates";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/require-user";

type Props = { params: Promise<{ id: string }> };

export default async function TemplateDetailPage({ params }: Props) {
  const userId = await requireUserId();
  const { id } = await params;
  const template = await prisma.template.findFirst({
    where: { id, userId },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });

  if (!template) {
    notFound();
  }

  return (
    <>
      <h1>{template.title}</h1>
      <p className="lead">
        Plantilla con {template.items.length} ítems. Genera una lista editable a partir de ella.
      </p>

      <div className="card">
        <ol style={{ margin: 0, paddingLeft: "1.25rem" }}>
          {template.items.map((it) => (
            <li key={it.id}>{it.label}</li>
          ))}
        </ol>
      </div>

      <div className="row no-print">
        <form action={createChecklistFromTemplate.bind(null, template.id)}>
          <button type="submit">Crear checklist desde esta plantilla</button>
        </form>
        <Link className="button secondary" href="/templates/new">
          Otra plantilla
        </Link>
      </div>
    </>
  );
}
