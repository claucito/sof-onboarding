import Link from "next/link";

import { createTemplate } from "@/app/actions/templates";

type Props = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export default async function NewTemplatePage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const err = typeof sp.error === "string" ? sp.error : undefined;

  return (
    <>
      <nav className="no-print" style={{ marginBottom: "1.5rem" }}>
        <Link href="/">← Inicio</Link>
      </nav>
      <h1>Nueva plantilla</h1>
      <p className="lead">Título y un ítem por línea (orden se conserva).</p>

      {err === "missing-title" ? <p className="error">El título es obligatorio.</p> : null}
      {err === "missing-lines" ? <p className="error">Añade al menos una línea no vacía.</p> : null}

      <form action={createTemplate} className="card stack">
        <div>
          <label htmlFor="title">Título</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Ej. Lanzamiento landing"
            required
          />
        </div>
        <div>
          <label htmlFor="lines">Ítems (uno por línea)</label>
          <textarea
            id="lines"
            name="lines"
            placeholder={"Revisar copy\nComprobar OG image\nProbar formulario"}
            required
          />
        </div>
        <div className="row">
          <button type="submit">Guardar plantilla</button>
          <Link className="button secondary" href="/">
            Cancelar
          </Link>
        </div>
      </form>
    </>
  );
}
