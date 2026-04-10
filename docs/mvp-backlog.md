# Backlog piloto — MVPs (priorizado)

Alineado con la meta de **software factory**: pequeños productos, MVPs, PoCs y landings con camino claro de CI/deploy ([deploy](./deploy.md)).

## Criterios globales de “listo”

- CI verde en la rama que se despliega.
- Entorno **preview** demostrable con datos ficticios.
- README del MVP con: propuesta de valor en 3 líneas, cómo correr en local, variables de entorno (`*.example`).
- Handoff: responsable humano/agente para soporte post-lanzamiento.

---

## 1. Landing de captación + waitlist (prioridad alta)

**Qué es:** sitio estático o SSR ligero con formulario (proveedor externo o endpoint mínimo), métricas básicas.

**Por qué primero:** valida el pipeline extremo a extremo (build estático o edge, dominio, formulario) sin lógica de negocio pesada.

**Stack sugerido:** Astro o Vite + hosting estático/CDN; formularios con servicio gestionado.

**Éxito:** tasa de envío del formulario medible (proveedor gestionado con panel de envíos), Lighthouse ≥ 90 en performance/best-practices, deploy preview + prod documentados (ver [deploy](./deploy.md) §5 y artefacto `landing-waitlist-dist` en CI).

---

## 2. PoC “API + panel mínimo” interno (prioridad media)

**Qué es:** CRUD pequeño (p. ej. lista de leads/demo) con API Node/TS y UI mínima (React/Next o HTMX según preferencia).

**Por qué:** ejercita monorepo (`apps/api`, `apps/web`), secretos, y posible contenedor o PaaS.

**Stack sugerido:** Next.js (full-stack) **o** Fastify/Express + Vite SPA.

**Éxito:** autenticación básica o red interna, migraciones o seed documentado, tests de humo en CI (opcional pero deseable).

---

## 3. Micro-SaaS de checklist / plantillas (prioridad media-baja)

**Qué es:** usuario puede crear listas reutilizables, exportar Markdown/PDF simple; enfoque en velocidad de entrega sobre features.

**Por qué:** entrena el patrón de producto iterativo (release cortos, feedback), sin depender de integraciones externas complejas.

**Stack sugerido:** Next.js + DB gestionada (Postgres) o SQLite + backup para MVP muy temprano.

**Éxito:** flujo feliz completo en menos de 10 minutos para un usuario de prueba, límites claros del MVP en README.

---

## Notas para el CEO / PM

- Reordenar si hay **oportunidad comercial** clara distinta (sustituir ítem 3).
- Cada MVP debería nacer como carpeta bajo `apps/<nombre>/` con su propio ciclo de release.
- Tras elegir el MVP #1, crear tareas hijas (diseño, copy, implementación, analytics) bajo el epic correspondiente.
