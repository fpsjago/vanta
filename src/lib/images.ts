import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import type { OptimizedImage } from '../types';

const FILES = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/*.{jpg,jpeg,png,webp}',
  { eager: true }
);

interface OptimizeOpts {
  width: number;
  alt: string;
  avifQuality?: number;
  webpQuality?: number;
  mobileWidth?: number;
}

/** Build-time AVIF+WebP optimization for an image in src/assets/images. */
export async function optimize(filename: string, opts: OptimizeOpts): Promise<OptimizedImage> {
  const mod = FILES[`/src/assets/images/${filename}`];
  if (!mod) throw new Error(`[vanta] image not found: src/assets/images/${filename}`);
  const src = mod.default;
  const width = Math.min(opts.width, src.width);
  const height = Math.round(width * (src.height / src.width));

  const [avif, webp] = await Promise.all([
    getImage({ src, format: 'avif', width, quality: opts.avifQuality ?? 62 }),
    getImage({ src, format: 'webp', width, quality: opts.webpQuality ?? 78 }),
  ]);
  const result: OptimizedImage = { avif: avif.src, webp: webp.src, fallback: webp.src, width, height, alt: opts.alt };

  if (opts.mobileWidth && opts.mobileWidth < width) {
    const sm = Math.min(opts.mobileWidth, src.width);
    const [avifSm, webpSm] = await Promise.all([
      getImage({ src, format: 'avif', width: sm, quality: opts.avifQuality ?? 60 }),
      getImage({ src, format: 'webp', width: sm, quality: opts.webpQuality ?? 76 }),
    ]);
    result.avifSm = avifSm.src;
    result.webpSm = webpSm.src;
  }
  return result;
}
