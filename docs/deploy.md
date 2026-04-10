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
3. Secreto opcional `WAITLIST_FORM_ACTION`: misma semántica que en CI (Formspree / proveedor del formulario).
4. El deploy corre en **push a `main`/`master`** cuando cambian `apps/landing-waitlist/`, la raíz del lockfile o el propio workflow; también se puede lanzar a mano con **Actions → Deploy landing-waitlist → Run workflow**.
5. **Seguridad:** nunca pegues tokens PAT en comentarios de issues ni en código. Crea el token en GitHub → Developer settings → revoca cualquier token expuesto y guarda uno nuevo solo como **Actions secret** del repo (p. ej. si algún proveedor lo exige). Para Pages con el flujo oficial suele bastar el `GITHUB_TOKEN` del workflow (permisos `pages: write` ya declarados en el YAML).

**Preview en PR:** sigue siendo el artefacto `landing-waitlist-dist` del workflow [ci.yml](../.github/workflows/ci.yml).

## 7. Siguiente mejora

Workflow de deploy con **entorno `production` y aprobadores** en GitHub (revisión manual antes de publicar) y, si aplica, `Dockerfile` en apps con servidor.
