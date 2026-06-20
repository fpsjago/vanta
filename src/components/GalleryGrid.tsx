import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useReveal } from '../hooks/useReveal';
import type { OptimizedImage } from '../types';

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  span: 'wide' | 'tall' | 'default';
  caption: string;
  image: OptimizedImage;
}

interface GalleryGridProps {
  items: GalleryItem[];
  categories: string[];
}

// Asymmetric masonry footprints — cells are deliberately different sizes.
const SPAN_CLASS: Record<GalleryItem['span'], string> = {
  wide: 'sm:col-span-2 lg:col-span-3 aspect-[16/10]',
  tall: 'lg:row-span-2 aspect-[4/5] lg:aspect-auto',
  default: 'lg:col-span-2 aspect-[4/3]',
};

function Picture({ image, className, sizes }: { image: OptimizedImage; className?: string; sizes?: string }) {
  return (
    <picture>
      {image.avifSm && <source media="(max-width: 820px)" srcSet={image.avifSm} type="image/avif" />}
      {image.webpSm && <source media="(max-width: 820px)" srcSet={image.webpSm} type="image/webp" />}
      <source srcSet={image.avif} type="image/avif" />
      <source srcSet={image.webp} type="image/webp" />
      <img src={image.fallback} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" sizes={sizes} className={className} />
    </picture>
  );
}

export function GalleryGrid({ items, categories }: GalleryGridProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  const [active, setActive] = useState<string>('All');
  const [lightbox, setLightbox] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const filters = useMemo(() => ['All', ...categories], [categories]);
  const filtered = useMemo(
    () => (active === 'All' ? items : items.filter((i) => i.category === active)),
    [active, items]
  );

  const open = useCallback((index: number, el: HTMLButtonElement) => {
    triggerRef.current = el;
    setLightbox(index);
  }, []);
  const close = useCallback(() => {
    setLightbox(null);
    triggerRef.current?.focus();
  }, []);
  const step = useCallback((dir: number) => {
    setLightbox((cur) => {
      if (cur === null) return cur;
      return (cur + dir + filtered.length) % filtered.length;
    });
  }, [filtered.length]);

  // Body scroll lock + keyboard nav while the lightbox is open.
  useEffect(() => {
    if (lightbox === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [lightbox, close, step]);

  // Reset the open index if the filter changes underneath an open lightbox.
  useEffect(() => { if (lightbox !== null && lightbox >= filtered.length) setLightbox(null); }, [filtered.length, lightbox]);

  const current = lightbox === null ? null : filtered[lightbox];

  return (
    <div ref={rootRef}>
      {/* Filter pills */}
      <div data-reveal className="flex flex-wrap items-center gap-2.5 mb-10" role="group" aria-label="Filter gallery by category">
        {filters.map((f) => {
          const on = active === f;
          return (
            <button
              key={f}
              onClick={() => setActive(f)}
              aria-pressed={on}
              className={`font-mono text-[0.66rem] uppercase tracking-[0.16em] px-4 py-2.5 rounded-full border transition-colors duration-300 ${
                on
                  ? 'border-[var(--plasma)] text-[var(--plasma-ink)] bg-[var(--plasma)]'
                  : 'border-[var(--line-strong)] text-[var(--muted)] hover:text-[var(--bone)] hover:border-[var(--plasma)]'
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Asymmetric masonry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 auto-rows-[minmax(0,auto)] gap-4 lg:gap-5 lg:[grid-auto-flow:dense]">
        {filtered.map((item, i) => (
          <button
            key={item.id}
            data-reveal="scale"
            style={{ '--reveal-delay': `${(i % 6) * 0.05}s` } as React.CSSProperties}
            onClick={(e) => open(i, e.currentTarget)}
            aria-label={`View ${item.title} — ${item.category}`}
            className={`panel group relative !rounded-[var(--radius-lg)] text-left overflow-hidden ${SPAN_CLASS[item.span]}`}
          >
            <Picture
              image={item.image}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
              className="art absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
            <span className="absolute inset-0 bg-[linear-gradient(to_top,var(--void)_0%,transparent_42%,transparent_100%)] opacity-90" aria-hidden="true" />
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_70%_60%_at_50%_120%,rgba(var(--plasma-rgb),0.32)_0%,transparent_70%)]" aria-hidden="true" />
            <span className="absolute inset-x-0 bottom-0 p-5 lg:p-6 flex items-end justify-between gap-4 z-[2]">
              <span className="flex flex-col gap-1.5">
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[var(--plasma-2)]">{item.category}</span>
                <span className="font-display font-extrabold text-[length:var(--text-lg)] leading-none tracking-[-0.01em] text-[var(--bone)]">{item.title}</span>
              </span>
              <span className="shrink-0 w-9 h-9 grid place-items-center rounded-full border border-[var(--line-strong)] text-[var(--bone)] translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-hover:border-[var(--plasma)] transition-all duration-400" aria-hidden="true">↗</span>
            </span>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${current.title} — ${current.category}`}
          className="fixed inset-0 z-[var(--z-overlay)] flex items-center justify-center p-4 sm:p-8 bg-[color-mix(in_srgb,var(--void)_94%,transparent)] backdrop-blur-xl"
          onClick={close}
        >
          <div className="glow-center absolute inset-0 opacity-70 pointer-events-none" aria-hidden="true" />

          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-5 right-5 z-[3] w-11 h-11 grid place-items-center rounded-full border border-[var(--line-strong)] text-[var(--bone)] hover:border-[var(--plasma)] hover:text-[var(--plasma-2)] transition-colors"
          >✕</button>

          <button
            onClick={(e) => { e.stopPropagation(); step(-1); }}
            aria-label="Previous image"
            className="absolute left-3 sm:left-6 z-[3] w-11 h-11 grid place-items-center rounded-full border border-[var(--line-strong)] text-[var(--bone)] hover:border-[var(--plasma)] hover:text-[var(--plasma-2)] transition-colors"
          >←</button>
          <button
            onClick={(e) => { e.stopPropagation(); step(1); }}
            aria-label="Next image"
            className="absolute right-3 sm:right-6 z-[3] w-11 h-11 grid place-items-center rounded-full border border-[var(--line-strong)] text-[var(--bone)] hover:border-[var(--plasma)] hover:text-[var(--plasma-2)] transition-colors"
          >→</button>

          <figure className="relative z-[2] max-w-[min(1100px,92vw)] max-h-[86vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)]">
              <Picture
                image={current.image}
                sizes="92vw"
                className="w-full h-auto max-h-[74vh] object-contain"
              />
            </div>
            <figcaption className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="flex items-baseline gap-3">
                <span className="font-display font-extrabold text-[length:var(--text-xl)] text-[var(--bone)]">{current.title}</span>
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--plasma-2)]">{current.category}</span>
              </span>
              <span className="label-mono">{String((lightbox ?? 0) + 1).padStart(2, '0')} / {String(filtered.length).padStart(2, '0')}</span>
            </figcaption>
            <p className="mt-2 text-[var(--text-sm)] text-[var(--muted)] leading-relaxed max-w-[60ch]">{current.caption}</p>
          </figure>
        </div>
      )}
    </div>
  );
}
