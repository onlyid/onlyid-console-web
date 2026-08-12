import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import svgr from "vite-plugin-svgr"
import path from "path"

// prettier-ignore
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  base: "/console/",
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src")
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true
      }
    }
  }
})
