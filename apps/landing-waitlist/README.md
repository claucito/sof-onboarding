# landing-waitlist

## Propuesta de valor (3 líneas)

- Landing mínima para **captar interés** antes del lanzamiento.
- **Lista de espera** con email (y nombre opcional) vía **proveedor gestionado** (POST clásico a Formspree, Getform u otro): sin mock en preview/prod cuando configuras la URL en build.
- Salida **estática** (Astro): rápida, barata en CDN y alineada con [docs/deploy.md](../../docs/deploy.md).

## Cómo correr en local

Requisitos: Node 20+ (ver raíz del monorepo).

```bash
npm install
cp apps/landing-waitlist/.env.example apps/landing-waitlist/.env
# Edita .env: PUBLIC_WAITLIST_FORM_ACTION y PUBLIC_SITE_URL (p. ej. http://localhost:4321)
npm run dev -w landing-waitlist
```

Abre la URL que muestra Astro (por defecto `http://localhost:4321`).

Build de producción:

```bash
npm run build -w landing-waitlist
npm run preview -w landing-waitlist
```

## Variables de entorno

Copia `.env.example` a `.env` en esta carpeta (no lo subas al repo).

| Variable                       | Descripción                                                                                                                             |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `PUBLIC_WAITLIST_FORM_ACTION`  | URL `action` del formulario (endpoint del proveedor). **Obligatoria** para que el formulario real se incluya en el HTML estático.       |
| `PUBLIC_SITE_URL`              | Origen público del sitio (sin `/` final). Define `site` en Astro y la URL absoluta de redirección tras el envío (`_next` → `/gracias`). |
| `PUBLIC_WAITLIST_FORM_SUBJECT` | Opcional. Asunto del mensaje en bandeja del proveedor (Formspree: `_subject`).                                                          |

En **CI**, el job de build puede leer `WAITLIST_FORM_ACTION` y `LANDING_WAITLIST_SITE_URL` del repositorio (ver [.github/workflows/ci.yml](../../.github/workflows/ci.yml)) para generar un artefacto con formulario activo y `_next` correcto.

## Validar el funnel (preview o producción)

1. Despliega `dist/` con las variables de entorno de build correctas (mismo origen que `PUBLIC_SITE_URL`).
2. Abre la home, envía un email de prueba.
3. Comprueba en el panel del proveedor (p. ej. Formspree → Submissions) que aparece el envío.
4. Confirma redirección a `/gracias` tras un envío correcto (requiere `PUBLIC_SITE_URL` alineado con el dominio real).

## Deploy

1. Registra un formulario en tu proveedor (recomendado: [Formspree](https://formspree.io) plan gratuito para pruebas).
2. En el hosting o en CI, exporta antes del build:
   - `PUBLIC_WAITLIST_FORM_ACTION`
   - `PUBLIC_SITE_URL` (URL del preview o producción)
3. `npm run build -w landing-waitlist` → artefacto en `apps/landing-waitlist/dist/`.
4. Sube `dist/` al hosting estático (S3+CDN, Netlify, Vercel, Cloudflare Pages, etc.).

Detalle del pipeline y secretos: [docs/deploy.md](../../docs/deploy.md) (sección «landing-waitlist»).

## Handoff / soporte

- **Owner técnico:** CTO / ingeniería (scaffold y CI).
- **Owner producto:** CEO valida preview y decide copy (posible rol CMO futuro).
- **Secretos:** URL del formulario y dominio público viven solo en el proveedor de forms + variables del hosting / GitHub Actions; no en el repo.

## Lighthouse

La plantilla evita JS innecesario, usa fuentes del sistema y HTML semántico. Objetivo: ≥ 90 en performance y best practices en preview con HTTPS del proveedor.
