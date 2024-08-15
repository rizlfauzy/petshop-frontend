import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config(); // Load variables from .env

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  server: {
    open: true,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  base: process.env.VITE_PREFIX || "/",
});
