import { defineConfig } from "vite";
import { resolve } from "path";

/*
  This is for project-level options only.

  Build options are in build/build.cjs, as different options
  are needed for ESM and UMD builds.
*/

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@test": resolve(__dirname, "test"),
    },
  },
  test: {
    includeSource: ["src/**/*.{js,jsx,ts,tsx}"],
    coverage: {
      reporter: ["text", "json-summary", "json"],
    },
  },
});
