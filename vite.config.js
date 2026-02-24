import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://api.le-systeme-solaire.net/rest",
        changeOrigin: true,
        secure: false, // Bypass SSL issues locally
        rewrite: (path) => path.replace(/^\/api/, ""),
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
        },
      },
    },
  },
});
