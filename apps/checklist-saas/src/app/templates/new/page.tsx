import Link from "next/link";

import { createTemplate } from "@/app/actions/templates";
import { MAX_TEMPLATE_LINE_LENGTH, MAX_TEMPLATE_LINES, MAX_TEMPLATE_TITLE_LENGTH } from "@/lib/limits";

type Props = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export default async function NewTemplatePage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const err = typeof sp.error === "string" ? sp.error : undefined;

  return (
    <>
      <h1>Nueva plantilla</h1>
      <p className="lead">Título y un ítem por línea (orden se conserva).</p>
      <p className="meta">
        Límites MVP: título ≤ {MAX_TEMPLATE_TITLE_LENGTH} caracteres; ≤ {MAX_TEMPLATE_LINES} ítems;
        cada línea ≤ {MAX_TEMPLATE_LINE_LENGTH} caracteres.
      </p>

      {err === "missing-title" ? <p className="error">El título es obligatorio.</p> : null}
      {err === "missing-lines" ? <p className="error">Añade al menos una línea no vacía.</p> : null}
      {err === "title-too-long" ? <p className="error">El título supera el límite permitido.</p> : null}
      {err === "too-many-lines" ? <p className="error">Demasiados ítems en la plantilla.</p> : null}
      {err === "line-too-long" ? <p className="error">Alguna línea supera el límite de caracteres.</p> : null}

      <form action={createTemplate} className="card stack">
        <div>
          <label htmlFor="title">Título</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Ej. Lanzamiento landing"
            maxLength={MAX_TEMPLATE_TITLE_LENGTH}
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
