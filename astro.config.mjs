import { defineConfig, fontProviders } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://jordanthirkle.com',
  integrations: [
    tailwind(),
    react(),
    mdx(),
    sitemap(),
  ],
  experimental: {
    rustCompiler: true,
  },
  fonts: [
    {
      name: 'Inter',
      cssVariable: '--font-inter',
      provider: fontProviders.google(),
    },
    {
      name: 'Outfit',
      cssVariable: '--font-outfit',
      provider: fontProviders.google(),
    },
  ],
});