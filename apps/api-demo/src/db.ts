import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import Database from "better-sqlite3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function migrationsDir(): string {
  return path.join(__dirname, "..", "migrations");
}

export function openDatabase(dbPath: string): Database.Database {
  const dir = path.dirname(dbPath);
  fs.mkdirSync(dir, { recursive: true });
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  return db;
}

export function migrate(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY NOT NULL,
      applied_at TEXT NOT NULL
    );
  `);

  const applied = new Set(
    db
      .prepare(`SELECT id FROM schema_migrations`)
      .all()
      .map((r) => (r as { id: string }).id),
  );

  const files = fs
    .readdirSync(migrationsDir())
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const insert = db.prepare(`INSERT INTO schema_migrations (id, applied_at) VALUES (?, ?)`);

  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = fs.readFileSync(path.join(migrationsDir(), file), "utf8");
    db.exec(sql);
    insert.run(file, new Date().toISOString());
  }
}

export type LeadRow = {
  id: string;
  name: string;
  email: string;
  notes: string;
  created_at: string;
};
