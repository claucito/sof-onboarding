import { defineConfig } from "astro/config";

// `PUBLIC_SITE_URL` en build (preview/prod) alimenta `import.meta.env.SITE` y redirecciones del formulario.
const site = process.env.PUBLIC_SITE_URL?.trim() || "https://preview.example.com";

export default defineConfig({
  site,
  compressHTML: true,
});
