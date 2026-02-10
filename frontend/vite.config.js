import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/products": "http://localhost:8080",
      "/raw-materials": "http://localhost:8080",
      "/product-materials": "http://localhost:8080",
      "/production": "http://localhost:8080",
    },
  },
});
