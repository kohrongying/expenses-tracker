import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        codeSplitting: {
          firebase: [
            "firebase/compat/app",
            "firebase/compat/auth",
            "firebase/compat/database",
          ],
          vendor: ["react", "react-dom", "react-router-dom", "react-redux"],
        },
      },
    },
  },
});
