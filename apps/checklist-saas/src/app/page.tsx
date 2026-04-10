import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [templates, checklists] = await Promise.all([
    prisma.template.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.checklist.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return (
    <>
      <nav className="no-print" style={{ marginBottom: "1.5rem" }}>
        <Link href="/templates/new">Nueva plantilla</Link>
      </nav>
      <h1>Checklist MVP</h1>
      <p className="lead">
        Plantillas reutilizables y listas con exportación Markdown. Flujo feliz en &lt;10 min: crear
        plantilla → generar checklist → marcar ítems → exportar o imprimir a PDF.
      </p>

      <h2>Plantillas</h2>
      {templates.length === 0 ? (
        <p className="meta">
          Aún no hay plantillas. <Link href="/templates/new">Crea la primera</Link>.
        </p>
      ) : (
        <div className="stack">
          {templates.map((t) => (
            <div key={t.id} className="card">
              <h3>
                <Link href={`/templates/${t.id}`}>{t.title}</Link>
              </h3>
              <div className="meta">Actualizado {t.createdAt.toISOString().slice(0, 10)}</div>
            </div>
          ))}
        </div>
      )}

      <h2>Listas recientes</h2>
      {checklists.length === 0 ? (
        <p className="meta">Las listas aparecen aquí al usar una plantilla.</p>
      ) : (
        <div className="stack">
          {checklists.map((c) => (
            <div key={c.id} className="card">
              <h3>
                <Link href={`/checklists/${c.id}`}>{c.title}</Link>
              </h3>
              <div className="meta">Creada {c.createdAt.toISOString().slice(0, 10)}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
