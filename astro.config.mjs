import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.smarttermitetulsa.com',
  output: 'static',
  integrations: [sitemap()],
  trailingSlash: 'ignore',
});
