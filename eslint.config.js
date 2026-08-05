import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";

/**
 * Lint config for the Next.js app.
 *
 * Scope note: TypeScript files (`app/**` routes) are checked by `tsc` during
 * `next build`, which is stricter than anything ESLint would add here, so this
 * config focuses on the JS/JSX feature code. The Vite-era `react-refresh`
 * plugin has been dropped — its "only export components" rule fights the
 * deliberate pattern of colocating a provider with its hook.
 */
export default defineConfig([
  globalIgnores([".next/**", "node_modules/**", "backend/**", "**/*.ts", "**/*.tsx"]),
  {
    files: ["src/**/*.{js,jsx}"],
    extends: [js.configs.recommended, reactHooks.configs["recommended-latest"]],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        // `process.env.NEXT_PUBLIC_*` is inlined at build time and is valid in
        // both client and server modules.
        process: "readonly",
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]", argsIgnorePattern: "^_" }],
    },
  },
]);
