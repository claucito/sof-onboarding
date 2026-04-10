import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/.astro/**",
      "**/*.astro",
      "eslint.config.js",
    ],
  },
  eslint.configs.recommended,
  {
    files: ["**/*.config.mjs"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  ...tseslint.configs.recommendedTypeChecked.map((cfg) => ({
    ...cfg,
    files: ["**/*.{ts,tsx}"],
    ignores: ["apps/api-demo/**", "apps/web-demo/**", "apps/checklist-saas/**"],
  })),
  ...tseslint.configs.recommendedTypeChecked.map((cfg) => ({
    ...cfg,
    files: ["apps/api-demo/**/*.ts"],
    languageOptions: {
      ...cfg.languageOptions,
      globals: { ...cfg.languageOptions?.globals, ...globals.node },
      parserOptions: {
        ...cfg.languageOptions?.parserOptions,
        project: "./apps/api-demo/tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  })),
  ...tseslint.configs.recommendedTypeChecked.map((cfg) => ({
    ...cfg,
    files: ["apps/web-demo/src/**/*.{ts,tsx}"],
    languageOptions: {
      ...cfg.languageOptions,
      globals: { ...cfg.languageOptions?.globals, ...globals.browser },
      parserOptions: {
        ...cfg.languageOptions?.parserOptions,
        project: "./apps/web-demo/tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  })),
  ...tseslint.configs.recommendedTypeChecked.map((cfg) => ({
    ...cfg,
    files: ["apps/checklist-saas/src/**/*.{ts,tsx}"],
    languageOptions: {
      ...cfg.languageOptions,
      globals: { ...cfg.languageOptions?.globals, ...globals.browser, ...globals.node },
      parserOptions: {
        ...cfg.languageOptions?.parserOptions,
        project: "./apps/checklist-saas/tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  })),
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["apps/api-demo/**", "apps/web-demo/**", "apps/checklist-saas/**"],
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  eslintConfigPrettier,
);
