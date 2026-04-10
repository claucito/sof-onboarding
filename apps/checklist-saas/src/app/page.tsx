import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/require-user";

export const dynamic = "force-dynamic";

type Props = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export default async function HomePage({ searchParams }: Props) {
  const userId = await requireUserId();
  const sp = (await searchParams) ?? {};
  const err = typeof sp.error === "string" ? sp.error : undefined;

  const [templates, checklists] = await Promise.all([
    prisma.template.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.checklist.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return (
    <>
      <h1>Checklist MVP</h1>
      {err === "template-not-found" ? (
        <p className="error">No se encontró esa plantilla o no te pertenece.</p>
      ) : null}
      <p className="lead">
        Plantillas reutilizables y listas con exportación Markdown y PDF. Flujo feliz en &lt;10 min:
        registrar → plantilla → checklist → marcar ítems → exportar.
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
              <div className="meta">Creada {t.createdAt.toISOString().slice(0, 10)}</div>
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
