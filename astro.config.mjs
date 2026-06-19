// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// VANTA — cinematic EV-launch template. Static + Content Collections.
// https://astro.build/config
export default defineConfig({
  site: 'https://fpsjago.github.io',
  base: '/vanta',
  output: 'static',
  compressHTML: true,
  integrations: [react(), sitemap()],
  build: { assets: '_assets' },
  vite: { plugins: [tailwindcss()] },
  fonts: [
    {
      name: 'Unbounded',
      cssVariable: '--ff-display',
      provider: fontProviders.fontsource(),
      weights: ['400', '600', '700', '800', '900'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      name: 'Manrope',
      cssVariable: '--ff-body',
      provider: fontProviders.fontsource(),
      weights: ['400', '500', '600', '700'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      name: 'Martian Mono',
      cssVariable: '--ff-mono',
      provider: fontProviders.fontsource(),
      weights: ['400', '500', '600'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        jpeg: { mozjpeg: true, quality: 80 },
        webp: { effort: 6, quality: 80 },
        avif: { effort: 7, quality: 70, chromaSubsampling: '4:2:0' },
        png: { compressionLevel: 9 },
      },
    },
  },
});
