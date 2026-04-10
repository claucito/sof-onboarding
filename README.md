# Software factory — repo base

Monorepo ligero para MVPs, landings y PoCs. Cada producto vive bajo `apps/<nombre>/` con su propio `package.json` cuando haga falta.

**Repo remoto:** [sof-onboarding](https://github.com/claucito/sof-onboarding) (onboarding Software Factory; landing waitlist en `apps/landing-waitlist`).

## Stack por defecto

- **Runtime**: Node.js 20+
- **Lenguaje**: TypeScript (modo estricto)
- **Lint**: ESLint 9 (flat config) + reglas recomendadas TypeScript
- **Formato**: Prettier

## Scripts (raíz)

| Comando                          | Uso                                             |
| -------------------------------- | ----------------------------------------------- |
| `npm run lint`                   | ESLint en todo el repo                          |
| `npm run format`                 | Prettier write                                  |
| `npm run typecheck`              | Raíz + `api-demo`, `web-demo`, `checklist-saas` |
| `npm run build:landing-waitlist` | Build estático landing                          |
| `npm run build:api-demo`         | Compila API PoC (Fastify)                       |
| `npm run build:web-demo`         | Build panel Vite/React                          |
| `npm run test:api-demo`          | Tests Vitest (api-demo)                         |

Los proyectos en `apps/*` pueden añadir sus propios scripts; la raíz agrupa el mínimo común. PoC MVP #2: `apps/api-demo` + `apps/web-demo`.

## Convenciones

1. **Carpetas**: `apps/` productos entregables; `packages/` código compartido opcional.
2. **Nombres**: kebab-case para carpetas de apps; módulos en camelCase/PascalCase según el estilo del framework elegido.
3. **Commits**: mensajes claros en español o inglés, una intención por commit.
4. **Secrets**: nunca en el repo; usar `.env` local y `.env.example` documentado.

## CI y deploy

- **CI**: workflow en `.github/workflows/ci.yml` (lint, formato, typecheck, builds y artefacto de la landing).
- **Deploy landing (GitHub Pages)**: `.github/workflows/deploy-landing-pages.yml` — ver `docs/deploy.md` para activar Pages y variables.
- **Guía detallada**: `docs/deploy.md` (preview vs producción mínima, checklist por MVP).

## Backlog de MVPs

Priorización y criterios de éxito: `docs/mvp-backlog.md`.

## Próximos pasos sugeridos

- Elegir el MVP #1 con CEO y crear `apps/<nombre>/` + tareas de implementación.
