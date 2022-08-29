// Full Astro Configuration API Documentation:
// https://docs.astro.build/reference/configuration-reference
// @type-check enabled!
// VSCode and other TypeScript-enabled text editors will provide auto-completion,
// helpful tooltips, and warnings if your exported object is invalid.
// You can disable this by removing "@ts-check" and `@type` comments below.
import preact from '@astrojs/preact';
import svelte from "@astrojs/svelte";
import { defineConfig } from 'astro/config';

import image from "@astrojs/image";

// https://astro.build/config
export default defineConfig({
  integrations: [preact(), svelte(), image()],
  site: "https://benbrougher.tech"
});