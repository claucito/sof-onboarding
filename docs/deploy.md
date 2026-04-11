# Deploy reproducible (landing / MVP)

Objetivo: mismo camino para **preview (pruebas)** y **producción mínima**, con secretos fuera del repo y builds verificados por CI.

## 1. Prerrequisitos

- Repo en GitHub (u otro proveedor con runners equivalentes).
- Rama principal `main` (o `master`; el workflow ya contempla ambas).
- Node 20 en local y en CI (alineado con `package.json` → `engines`).

## 2. Calidad antes de publicar

En cada PR/push, el workflow `.github/workflows/ci.yml` ejecuta `lint`, `format:check` y `typecheck`. No despliegues si CI está rojo.

## 3. Entornos

| Entorno        | Propósito                       | Datos / tráfico    |
| -------------- | ------------------------------- | ------------------ |
| **Preview**    | validar cambios, demos internas | datos ficticios    |
| **Producción** | usuarios reales / dominio final | backups + secretos |

Reglas:

- Variables distintas por entorno (`API_URL`, claves, analytics). Nunca commitear `.env`.
- Para landings estáticas: build local o en CI, artefacto subido al hosting (S3+CDN, Vercel, Netlify, etc.).
- Para MVPs con servidor: imagen reproducible (Docker) o PaaS con buildpack; documentar el comando exacto de build/start en el `README` de cada `apps/<nombre>/`.

## 4. Plantilla de checklist por nuevo MVP

1. Crear `apps/<nombre>/` con su `package.json` y scripts `build` / `start` (o export estático).
2. Añadir job o matriz en CI si el MVP necesita pasos extra (tests e2e, build de app).
3. Registrar secretos en el proveedor (preview vs prod).
4. Primera release: deploy a preview → smoke test → promote a prod con tag o aprobación manual.

## 5. `apps/landing-waitlist` — preview verificable

1. **Proveedor de formularios:** crear un endpoint en Formspree (u otro) y guardar su URL como secreto del repo `WAITLIST_FORM_ACTION` (en CI se expone al build como `PUBLIC_WAITLIST_FORM_ACTION`; ver [.github/workflows/ci.yml](../.github/workflows/ci.yml)).
2. **Dominio de preview:** definir la variable de repositorio `LANDING_WAITLIST_SITE_URL` (por ejemplo `https://deploy-preview-123.netlify.app`) para que Astro reciba `site` coherente y el formulario incluya el campo oculto `_next` con la URL absoluta de agradecimiento (`{site}/gracias`). En CI esta variable se mapea a `PUBLIC_SITE_URL` en el mismo workflow.
3. **CI:** el workflow [.github/workflows/ci.yml](../.github/workflows/ci.yml) ejecuta `npm run build:landing-waitlist` y publica el artefacto **`landing-waitlist-dist`** con el contenido de `apps/landing-waitlist/dist/` en cada push/PR. Descárgalo o enlázalo desde la pestaña _Actions_ → run → _Artifacts_ para inspección sin servidor propio.
4. **Smoke en preview:** subir `dist/` al hosting estático con las mismas variables usadas en el build; enviar un email de prueba y validar el envío en el panel del proveedor.

## 6. GitHub Pages (producción mínima reproducible)

Workflow: [.github/workflows/deploy-landing-pages.yml](../.github/workflows/deploy-landing-pages.yml).

1. En el repo de GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions** (el flujo sube el artefacto estático oficial).
2. Variable de repositorio `LANDING_WAITLIST_SITE_URL`: URL pública final de la landing (por ejemplo `https://<usuario>.github.io/<repo>/` o dominio custom). Astro usa esto como `site` y para redirecciones coherentes.
3. Secreto `WAITLIST_FORM_ACTION`: URL del proveedor (Formspree / Getform / etc.). El workflow de Pages **falla** si el HTML generado no incluye `<form>` (típico cuando el secreto falta o no llega al job), para no publicar otra vez la variante “preview sin backend”.
4. El deploy corre en **push a `main`/`master`** cuando cambian `apps/landing-waitlist/`, la raíz del lockfile o el propio workflow; también se puede lanzar a mano con **Actions → Deploy landing-waitlist → Run workflow**.
5. **Seguridad:** nunca pegues tokens PAT en comentarios de issues ni en código. Crea el token en GitHub → Developer settings → revoca cualquier token expuesto y guarda uno nuevo solo como **Actions secret** del repo (p. ej. si algún proveedor lo exige). Para Pages con el flujo oficial suele bastar el `GITHUB_TOKEN` del workflow (permisos `pages: write` ya declarados en el YAML).

**Preview en PR:** sigue siendo el artefacto `landing-waitlist-dist` del workflow [ci.yml](../.github/workflows/ci.yml).

## 7. `apps/api-demo` + `apps/web-demo` — PoC API + panel (MVP #2)

1. **Autenticación / exposición:** la API valida `Authorization: Bearer` con `DEMO_API_KEY` (ver [apps/api-demo/.env.example](../apps/api-demo/.env.example)). El SPA lee `VITE_DEMO_API_KEY` en build: **no** uses esa clave en frontales 100% públicos; limítalo a **preview, VPN o red interna**, o coloca un proxy/gateway que añada el header y no exponga la clave al navegador.
2. **CORS:** `CORS_ORIGIN` en la API (lista separada por comas o vacío para reflejar `Origin` en desarrollo). En producción restringe orígenes conocidos.
3. **Datos demo:** SQLite en `DATABASE_PATH`; migraciones en `apps/api-demo/migrations/`. Tras arrancar la API, `npm run seed -w api-demo` carga filas de ejemplo (ver README del paquete).
4. **CI:** [ci.yml](../.github/workflows/ci.yml) corre `test:api-demo`, `build:api-demo` y `build:web-demo` con `VITE_API_URL` / `VITE_DEMO_API_KEY` de placeholder para validar el empaquetado.
5. **Preview verificable:** levantar API (`npm run start -w api-demo` tras `build` y variables de entorno) y servir `apps/web-demo/dist/` con un servidor estático configurando en build las mismas `VITE_*` que apunten a esa API, **o** ejecutar `npm run dev` en ambos workspaces según [apps/web-demo/README.md](../apps/web-demo/README.md).

## 8. `apps/checklist-saas` — micro-SaaS checklist / plantillas (MVP #3)

1. **Build:** `npm run build:checklist-saas` en la raíz (tras `npm ci`). El build del paquete ejecuta `prisma migrate deploy` antes de `next build`; CI usa **Postgres 16** en servicio (ver [.github/workflows/ci.yml](../.github/workflows/ci.yml)).
2. **Variables:** copiar [apps/checklist-saas/.env.example](../apps/checklist-saas/.env.example) → `.env` en esa app. **Obligatorias en runtime:** `DATABASE_URL` (**PostgreSQL**) y **`AUTH_SECRET`** (≥ 32 caracteres; firma JWT de sesión).
3. **Arranque:** `npm run start -w checklist-saas` (puerto **3040** por defecto) tras build; en local, `npm run dev -w checklist-saas`.
4. **Preview demostrable:** desplegar como cualquier app Next.js (Vercel, Fly.io, Railway, etc.) con `DATABASE_URL` y `AUTH_SECRET` en el panel; registrar un usuario de prueba y crear una plantilla desde la UI (flujo documentado en [apps/checklist-saas/README.md](../apps/checklist-saas/README.md)).
5. **Vercel (monorepo):** en el proyecto, **Root Directory** = `apps/checklist-saas` (el `vercel.json` de esa carpeta usa `installCommand` / `buildCommand` desde la raíz del repo). Configura **`DATABASE_URL`** (Postgres gestionado: Neon, Supabase, Vercel Postgres, etc.) y **`AUTH_SECRET`** en *Environment Variables* de Vercel (Preview + Production). El build aplica migraciones automáticamente.
6. **URL HTTPS de preview (canónica):** documentar aquí la URL pública una vez exista el primer deploy (p. ej. `https://….vercel.app`), para enlazarla desde smoke/evidencias sin buscar en el panel del proveedor.
7. **GitHub Actions (preview):** con el proyecto Vercel enlazado y variables `DATABASE_URL` / `AUTH_SECRET` en el panel (Preview), añade en el repo los secretos `VERCEL_TOKEN`, `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID` y ejecuta manualmente [deploy-checklist-saas-vercel.yml](../.github/workflows/deploy-checklist-saas-vercel.yml) (*Actions → Deploy checklist-saas (Vercel preview) → Run workflow*). Copia la URL de despliegue del log y actualiza el punto 6 anterior.

## 9. Siguiente mejora

Workflow de deploy con **entorno `production` y aprobadores** en GitHub (revisión manual antes de publicar) y, si aplica, `Dockerfile` en apps con servidor.
