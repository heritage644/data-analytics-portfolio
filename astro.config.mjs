import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';
import { prepareAssets } from './scripts/prepare-assets.mjs';

prepareAssets();
const site = process.env.SITE_URL || process.env.URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined);
export default defineConfig({
  site, base: process.env.BASE_PATH || '/', output: 'static', trailingSlash: 'always',
  devToolbar: { enabled: false },
  server: { host: '0.0.0.0', port: 4321, allowedHosts: ['.e2b.app','localhost'] },
  vite: {
    plugins: [tailwind()],
  },
});
