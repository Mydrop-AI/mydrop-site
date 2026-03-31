import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function normalizeBasePath(basePath: string | undefined) {
  if (!basePath || basePath === "/") {
    return "/";
  }

  let normalized = basePath;
  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }
  if (!normalized.endsWith("/")) {
    normalized = `${normalized}/`;
  }

  return normalized;
}

export default defineConfig({
  base: normalizeBasePath(process.env.BASE_PATH),
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
