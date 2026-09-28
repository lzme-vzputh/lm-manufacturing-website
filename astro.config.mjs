import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({ site: process.env.PUBLIC_SITE_URL || 'https://lm-manufacturing.pages.dev', integrations: [sitemap({filter: page => !/^\/(?:kh\/)?manage\/?$/.test(new URL(page).pathname)})] });
