import { randomUUID } from "node:crypto";

import type { FastifyInstance } from "fastify";

import type Database from "better-sqlite3";

import { parseLeadBody } from "./validate.js";
import type { LeadRow } from "./db.js";

export function registerLeadRoutes(app: FastifyInstance, db: Database.Database) {
  app.get("/leads", (_request, reply) => {
    const rows = db
      .prepare(
        `SELECT id, name, email, notes, created_at FROM leads ORDER BY datetime(created_at) DESC`,
      )
      .all() as LeadRow[];
    return reply.send({ items: rows });
  });

  app.get<{ Params: { id: string } }>("/leads/:id", (request, reply) => {
    const row = db
      .prepare(`SELECT id, name, email, notes, created_at FROM leads WHERE id = ?`)
      .get(request.params.id) as LeadRow | undefined;
    if (!row) {
      return reply.code(404).send({ error: "No encontrado" });
    }
    return reply.send(row);
  });

  app.post("/leads", (request, reply) => {
    const parsed = parseLeadBody(request.body);
    if (!parsed.ok) {
      return reply.code(400).send({ error: parsed.error });
    }
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const notes = parsed.value.notes ?? "";
    db.prepare(`INSERT INTO leads (id, name, email, notes, created_at) VALUES (?, ?, ?, ?, ?)`).run(
      id,
      parsed.value.name,
      parsed.value.email,
      notes,
      createdAt,
    );
    const row = db
      .prepare(`SELECT id, name, email, notes, created_at FROM leads WHERE id = ?`)
      .get(id) as LeadRow;
    return reply.code(201).send(row);
  });

  app.patch<{ Params: { id: string } }>("/leads/:id", (request, reply) => {
    const existing = db
      .prepare(`SELECT id, name, email, notes, created_at FROM leads WHERE id = ?`)
      .get(request.params.id) as LeadRow | undefined;
    if (!existing) {
      return reply.code(404).send({ error: "No encontrado" });
    }
    const body =
      request.body && typeof request.body === "object"
        ? (request.body as Record<string, unknown>)
        : {};
    const merged = {
      name: typeof body.name === "string" ? body.name : existing.name,
      email: typeof body.email === "string" ? body.email : existing.email,
      notes: typeof body.notes === "string" ? body.notes : existing.notes,
    };
    const parsed = parseLeadBody(merged);
    if (!parsed.ok) {
      return reply.code(400).send({ error: parsed.error });
    }
    const notes = parsed.value.notes ?? "";
    db.prepare(`UPDATE leads SET name = ?, email = ?, notes = ? WHERE id = ?`).run(
      parsed.value.name,
      parsed.value.email,
      notes,
      request.params.id,
    );
    const row = db
      .prepare(`SELECT id, name, email, notes, created_at FROM leads WHERE id = ?`)
      .get(request.params.id) as LeadRow;
    return reply.send(row);
  });

  app.delete<{ Params: { id: string } }>("/leads/:id", (request, reply) => {
    const res = db.prepare(`DELETE FROM leads WHERE id = ?`).run(request.params.id);
    if (res.changes === 0) {
      return reply.code(404).send({ error: "No encontrado" });
    }
    return reply.code(204).send();
  });
}
