import path from "node:path";

import cors from "@fastify/cors";
import Fastify from "fastify";

import { requireApiKey } from "./auth.js";
import { migrate, openDatabase } from "./db.js";
import { registerLeadRoutes } from "./leads.js";

const DEMO_API_KEY = process.env.DEMO_API_KEY;
if (!DEMO_API_KEY || DEMO_API_KEY.length < 8) {
  process.stderr.write(
    "DEMO_API_KEY es obligatorio y debe tener al menos 8 caracteres (ver .env.example).\n",
  );
  process.exit(1);
}

const PORT = Number(process.env.PORT ?? "3333");
const DATABASE_PATH = process.env.DATABASE_PATH ?? "./data/demo.sqlite";
const corsOriginRaw = process.env.CORS_ORIGIN;

const db = openDatabase(path.resolve(DATABASE_PATH));
migrate(db);

const app = Fastify({ logger: true });

await app.register(cors, {
  origin:
    corsOriginRaw === undefined || corsOriginRaw === ""
      ? true
      : corsOriginRaw === "*"
        ? true
        : corsOriginRaw.split(",").map((s) => s.trim()),
  credentials: true,
});

app.get("/health", () => ({ ok: true as const }));

await app.register(
  (scoped) => {
    scoped.addHook("preHandler", requireApiKey(DEMO_API_KEY));
    registerLeadRoutes(scoped, db);
  },
  { prefix: "/api" },
);

try {
  await app.listen({ port: PORT, host: "0.0.0.0" });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
