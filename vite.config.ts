import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      server: { entry: "server" },
      importProtection: { client: { files: ["**/server/**"] } },
    }),
    nitro({ preset: "cloudflare-module", output: { dir: "dist", serverDir: "dist/server", publicDir: "dist/client" }, cloudflare: { nodeCompat: true, deployConfig: true } }),
    react(),
  ],
});
