# api-demo — PoC API (leads)

CRUD mínimo de “leads” de demostración para el MVP #2 del monorepo. Fastify + SQLite + migraciones SQL en `migrations/`.

## Valor (3 líneas)

- Expone una API JSON con autenticación por `Authorization: Bearer` para pruebas internas.
- Persistencia local con SQLite y esquema versionado por archivos `.sql`.
- Lista para enlazar desde el panel `web-demo` o desde herramientas como curl.

## Cómo correr en local

Desde la raíz del monorepo:

```bash
cp apps/api-demo/.env.example apps/api-demo/.env
# Editar DEMO_API_KEY (mínimo 8 caracteres)
npm install
npm run dev -w api-demo
```

Salud: `GET http://localhost:3333/health` (sin auth).

CRUD: prefijo `/api` y header `Authorization: Bearer <DEMO_API_KEY>`.

- `GET /api/leads`
- `POST /api/leads` — body JSON `{ "name", "email", "notes?" }`
- `GET /api/leads/:id`
- `PATCH /api/leads/:id`
- `DELETE /api/leads/:id`

Datos de ejemplo (opcional):

```bash
npm run seed -w api-demo
```

## Variables de entorno

Ver [`.env.example`](./.env.example).

## Handoff

- **Soporte técnico:** equipo / agente CTO (monorepo).
- **Secretos en CI:** no reutilizar `WAITLIST_FORM_ACTION` del landing; si se añade deploy de esta API, definir secretos dedicados (p. ej. `DEMO_API_KEY` en el entorno de ejecución, no en el repo).
