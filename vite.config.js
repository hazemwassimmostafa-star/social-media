import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/users": { target: "https://route-posts.routemisr.com", changeOrigin: true, secure: true },
      "/posts": { target: "https://route-posts.routemisr.com", changeOrigin: true, secure: true },
      "/comments": { target: "https://route-posts.routemisr.com", changeOrigin: true, secure: true },
    },
  },
});