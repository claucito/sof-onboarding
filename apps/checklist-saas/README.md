# checklist-saas (post–MVP #3)

Micro-SaaS de **plantillas** y **checklists** con **cuentas por usuario** (email + contraseña), exportación **Markdown** y **PDF** generado en servidor, más vista imprimible en el navegador.

## Propuesta de valor (3 líneas)

- Plantillas de tareas repetibles sin hojas de cálculo; cada usuario ve solo sus datos.
- Flujo feliz corto: registro → plantilla → checklist → marcar ítems → exportar `.md` / `.pdf` o imprimir.
- Next.js + Prisma; SQLite en local/CI y camino documentado hacia Postgres en preview/prod.

## Autenticación e aislamiento (modelo MVP)

**Implementado:** cuenta propia con **email + contraseña** (hash **bcrypt** en base de datos). La sesión es un **JWT** firmado con `AUTH_SECRET`, guardado en cookie **httpOnly** (30 días).

**No implementado (evolución razonable):** magic link (requiere proveedor de email), OAuth, equipos/roles, recuperación de contraseña. Si priorizas magic link, añade envío de correo y tokens de un solo uso sin eliminar el modelo actual hasta migrar usuarios.

## Qué incluye esta versión (y qué no)

Incluye:

- Registro e inicio de sesión; cierre de sesión.
- CRUD mínimo de plantillas (crear con título + líneas) **por usuario**.
- Instanciar checklist desde plantilla; toggle de ítems con persistencia.
- Descarga `.md` (GFM) y `.pdf` simple en servidor (`pdf-lib`), además de vista imprimible para PDF vía navegador.
- Validación de entradas con **límites explícitos** (ver `src/lib/limits.ts`).

No incluye (fuera de alcance explícito):

- API pública versionada, webhooks, integraciones pesadas.
- Notificaciones por email ni magic link.

## Cómo correr en local

Requisitos: Node ≥ 20, npm (workspaces del monorepo).

1. Desde la raíz del monorepo: `npm install`
2. Copia variables: `cp apps/checklist-saas/.env.example apps/checklist-saas/.env` y **ajusta `AUTH_SECRET`** (≥ 32 caracteres).
3. Si ya tenías `prisma/dev.db` **sin** columna `userId`, borra la base o el archivo y vuelve a crearla (cambio de esquema).
4. Aplica el esquema: `npm run db:push -w checklist-saas`
5. Arranca: `npm run dev -w checklist-saas` → [http://127.0.0.1:3040](http://127.0.0.1:3040) (redirige a `/login` si no hay sesión).

### Flujo de prueba (&lt;10 min)

1. **Registrarse** con email y contraseña (mín. 8 caracteres).
2. Inicio → **Nueva plantilla** → título + varias líneas → guardar.
3. En la plantilla → **Crear checklist desde esta plantilla**.
4. Marca ítems; **Descargar .md** y **Descargar .pdf**; opcionalmente **Vista imprimible (PDF)** del navegador.

## Variables de entorno

| Variable        | Uso                                                |
| --------------- | -------------------------------------------------- |
| `DATABASE_URL`  | SQLite local o Postgres en preview/prod.           |
| `AUTH_SECRET`   | Firma JWT; **obligatorio**, mínimo 32 caracteres.  |

Ver [`.env.example`](./.env.example).

## Base de datos y backup (MVP temprano)

- Por defecto: **SQLite** (`DATABASE_URL=file:./prisma/dev.db`). Copia `prisma/dev.db` para backup manual.
- Para **Postgres** gestionado: `DATABASE_URL` del proveedor, cambia `provider` en `prisma/schema.prisma` y ejecuta migraciones según tu política (`migrate` vs `db push` solo en entornos desechables).

## Deploy (preview / prod)

Alineado con [docs/deploy.md](../../docs/deploy.md) §8: build `npm run build:checklist-saas`, `start` en puerto **3040**, variables `DATABASE_URL` y **`AUTH_SECRET`** en el panel del proveedor (Vercel, Fly.io, Railway, etc.). En **producción** usa `NODE_ENV=production` para cookie `Secure`.

## CI

El workflow del monorepo ejecuta `prisma db push` con SQLite efímero y `npm run build -w checklist-saas` con `AUTH_SECRET` de placeholder para el build. No afecta a otras apps del monorepo salvo el job compartido.
