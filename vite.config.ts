import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/brain-wrangler/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"],
      manifest: {
        name: "Brain Wrangler",
        short_name: "Wrangler",
        description: "ADHD-friendly Pomodoro + task wrangler",
        theme_color: "#111827",
        background_color: "#111827",
        display: "standalone",
        start_url: "/brain-wrangler/",
        scope: "/brain-wrangler/",
        icons: [
          { "src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
          { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
          { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
        ]
      }
    })
  ]
});