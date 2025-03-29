import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: '/Studyability/',
  plugins: [react()],
  // resolve: {
  //   alias: {
  //     "react-virtualized/List": "react-virtualized/dist/es/List",
  //   },
  // },
});
