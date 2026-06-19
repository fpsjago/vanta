export type Skin = 'midnight' | 'carbon' | 'studio';

export interface NavLink {
  label: string;
  href: string; // base-relative, no leading slash
}

export interface OptimizedImage {
  avif: string;
  webp: string;
  fallback: string;
  width: number;
  height: number;
  alt: string;
  avifSm?: string;
  webpSm?: string;
}

export interface SpecRow { label: string; value: string; }
export interface Stat { value: string; label: string; suffix?: string; }

export interface Trim {
  id: string;
  name: string;
  paint: string;   // css color for the swatch / token
  image: OptimizedImage;
  price: string;
}
