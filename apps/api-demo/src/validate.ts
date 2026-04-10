export type LeadInput = {
  name: string;
  email: string;
  notes?: string;
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseLeadBody(
  body: unknown,
): { ok: true; value: LeadInput } | { ok: false; error: string } {
  if (body === null || typeof body !== "object") {
    return { ok: false, error: "Cuerpo JSON inválido" };
  }
  const o = body as Record<string, unknown>;
  const name = o.name;
  const email = o.email;
  const notes = o.notes;

  if (typeof name !== "string" || name.trim().length === 0) {
    return { ok: false, error: "name es obligatorio" };
  }
  if (typeof email !== "string" || !emailRe.test(email.trim())) {
    return { ok: false, error: "email inválido" };
  }
  if (notes !== undefined && typeof notes !== "string") {
    return { ok: false, error: "notes debe ser texto" };
  }

  return {
    ok: true,
    value: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      notes: typeof notes === "string" ? notes : undefined,
    },
  };
}
