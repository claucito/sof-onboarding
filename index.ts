/**
 * Punto de anclaje TypeScript para que `tsc` y ESLint type-aware tengan entrada en la raíz.
 * Los MVPs reales viven en apps/*.
 */
export const REPO_ROOT_MARKER = "sof-monorepo-root" as const;
