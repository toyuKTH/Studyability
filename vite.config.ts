import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: `https://gits-15.sys.kth.se/pages/DH2321-2025-Group-10/studyability/`,
});
