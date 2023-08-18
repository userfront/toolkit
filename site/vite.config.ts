import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: "inline",
  },
  server: {
    watch: {
      ignored: ["!**/node_modules/@userfront/toolkit/**"],
    },
  },
  optimizeDeps: {
    exclude: ["@userfront/toolkit"],
  },
});
