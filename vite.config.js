import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Split heavy libraries into their own long-cached vendor chunks so a
        // page change doesn't re-download them and the initial chunk is smaller.
        manualChunks: {
          "vendor-motion": ["framer-motion"],
          "vendor-i18n": ["i18next", "react-i18next"],
        },
      },
    },
  },
  server: { port: 5173, host: true },
});
