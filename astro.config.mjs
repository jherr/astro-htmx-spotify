import { defineConfig } from "astro/config";
import htmx from "astro-htmx";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [
    htmx(),
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
  ],
  adapter: node({
    mode: "middleware",
  }),
});
