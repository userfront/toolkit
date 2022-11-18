import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    define: {
      "import.meta.vitest": false,
    },
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "ToolkitReact",
      formats: ["es", "umd"],
      filename: (format) => `toolkit-react.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  test: {
    includeSource: ["src/**/*.{js,jsx,ts,tsx}"],
    coverage: {
      reporter: ["text", "json-summary", "json"],
    },
  },
});
