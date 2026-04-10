import path from "node:path";

import { randomUUID } from "node:crypto";

import { migrate, openDatabase } from "./db.js";

const DATABASE_PATH = process.env.DATABASE_PATH ?? "./data/demo.sqlite";
const db = openDatabase(path.resolve(DATABASE_PATH));
migrate(db);

const samples = [
  {
    name: "Lead demo",
    email: "demo@example.com",
    notes: "Creado por npm run seed",
  },
  {
    name: "Otra persona",
    email: "otra@example.com",
    notes: "",
  },
];

const insert = db.prepare(
  `INSERT INTO leads (id, name, email, notes, created_at) VALUES (?, ?, ?, ?, ?)`,
);

for (const s of samples) {
  insert.run(randomUUID(), s.name, s.email, s.notes, new Date().toISOString());
}

process.stdout.write(`Seed OK (${String(samples.length)} filas) en ${DATABASE_PATH}\n`);
