# checklist-saas (MVP #3)

Micro-SaaS de **plantillas** y **checklists** reutilizables: define una plantilla (ítems en orden), genera una lista editable, marca progreso y exporta **Markdown** o usa **imprimir → PDF** del navegador.

## Propuesta de valor (3 líneas)

- Plantillas de tareas repetibles sin hojas de cálculo ni cuentas complejas.
- Un flujo feliz corto: plantilla → checklist → marcar ítems → exportar o imprimir.
- Base Next.js + Prisma lista para pasar a Postgres gestionado cuando dejes el MVP muy temprano.

## Qué incluye este MVP (y qué no)

Incluye:

- CRUD mínimo de plantillas (crear con título + líneas).
- Instanciar checklist desde plantilla (copia ítems).
- Toggle de ítems con persistencia en SQLite (local) o en la DB que configures.
- Descarga `.md` con checkboxes estilo GFM.
- Vista imprimible para **Guardar como PDF** desde el navegador.

No incluye (fuera de alcance explícito):

- Autenticación multiusuario, equipos, permisos.
- API pública versionada, webhooks, integraciones.
- Generación server-side de PDF (se usa impresión del cliente).

## Cómo correr en local

Requisitos: Node ≥ 20, npm (workspaces del monorepo).

1. Desde la raíz del monorepo: `npm install`
2. Copia variables: `cp apps/checklist-saas/.env.example apps/checklist-saas/.env`
3. Aplica el esquema: `npm run db:push -w checklist-saas`
4. Arranca: `npm run dev -w checklist-saas` → [http://127.0.0.1:3040](http://127.0.0.1:3040)

### Flujo de prueba (&lt;10 min)

1. Inicio → **Nueva plantilla** → título + varias líneas → guardar.
2. En la plantilla → **Crear checklist desde esta plantilla**.
3. Marca algunos ítems; **Descargar .md** y abre el archivo.
4. Abre **Vista imprimible (PDF)** → imprimir / guardar como PDF.

## Base de datos y backup (MVP temprano)

- Por defecto: **SQLite** (`DATABASE_URL=file:./prisma/dev.db` en `.env`). Copia el archivo `prisma/dev.db` para un backup manual sencillo.
- Para **Postgres** gestionado: pon `DATABASE_URL` de tu proveedor, cambia en `prisma/schema.prisma` el `provider` a `postgresql` y ejecuta `npx prisma migrate dev` (o `db push` solo en entornos desechables).

## CI

El workflow del monorepo ejecuta `prisma db push` con SQLite efímero y `npm run build -w checklist-saas`. No afecta a `landing-waitlist`, `api-demo` ni `web-demo`.
