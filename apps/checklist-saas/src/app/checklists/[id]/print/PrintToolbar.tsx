"use client";

import Link from "next/link";

export function PrintToolbar({ checklistId }: { checklistId: string }) {
  return (
    <p className="no-print" style={{ marginBottom: "1rem" }}>
      <Link href={`/checklists/${checklistId}`}>← Volver</Link>
      {" · "}
      <button type="button" className="button secondary" onClick={() => window.print()}>
        Imprimir / Guardar como PDF
      </button>
    </p>
  );
}
