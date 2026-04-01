import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@mydrop-app": path.resolve(__dirname, "../mydrop-app"),
    },
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, "..")],
    },
  },
});
