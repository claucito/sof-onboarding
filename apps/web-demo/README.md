# web-demo — panel mínimo (leads)

SPA en Vite + React que consume `api-demo` para el MVP #2.

## Valor (3 líneas)

- Lista y crea “leads” de demostración contra la API del monorepo.
- Configuración explícita por variables `VITE_*` (ver `.env.example`).
- Pensado para red interna o preview; **no** exponer la clave en frontends públicos sin proxy.

## Cómo correr en local

Terminal 1 — API:

```bash
cp apps/api-demo/.env.example apps/api-demo/.env
# Definir DEMO_API_KEY (≥ 8 caracteres)
npm install
npm run dev -w api-demo
```

Terminal 2 — panel:

```bash
cp apps/web-demo/.env.example apps/web-demo/.env
# Mismos valores: VITE_API_URL=http://127.0.0.1:3333 y VITE_DEMO_API_KEY=<DEMO_API_KEY>
npm run dev -w web-demo
```

Abrir la URL que imprime Vite (puerto por defecto `5174`).

## Variables de entorno

Ver [`.env.example`](./.env.example).

## Handoff

- **API:** [apps/api-demo/README.md](../api-demo/README.md).
- **Despliegue:** al publicar el panel, preferir mismo origen que la API o gateway que inyecte credenciales; evitar reutilizar secretos del landing ([SOF-8](/SOF/issues/SOF-8) — escalar a @CEO si hay conflicto de CI/secretos).
