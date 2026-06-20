import { useRef, useState } from 'react';
import { useReveal } from '../../hooks/useReveal';
import type { OptimizedImage } from '../../types';

export interface TeaseTrim { id: string; name: string; paint: string; price: string; sub: string; image: OptimizedImage; }

/** Archetype 8 — color-swap teaser (the moment of agency) → Configure. */
export function ConfigTease({ trims, base }: { trims: TeaseTrim[]; base: string }) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const [active, setActive] = useState(0);
  const trim = trims[active] ?? trims[0];
  if (!trim) return null;

  return (
    <section ref={ref} className="section relative overflow-hidden glow" aria-label="Configure the GT">
      <div className="bgtypo text-[length:clamp(6rem,20vw,18rem)] -top-4 right-[-2%] opacity-70" aria-hidden="true">SPEC</div>
      <div className="container-wide relative">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <span className="kicker mb-4"><span className="w-1.5 h-1.5 rounded-full bg-[var(--plasma)]" /> 06 / CONFIGURE</span>
            <h2 data-reveal className="font-display font-extrabold text-[length:var(--text-4xl)] leading-[0.95] tracking-[-0.03em] text-[var(--bone)] max-w-[14ch]">Four finishes. One is yours.</h2>
          </div>
          <a href={`${base}configure/?trim=${trim.id}`} data-reveal className="btn-line w-fit">Open the configurator →</a>
        </div>

        <div data-reveal className="relative">
          {/* stacked crossfade renders */}
          <div className="relative aspect-[16/9] w-full">
            <div className="absolute inset-0 glow-center" aria-hidden="true" />
            {trims.map((t, i) => (
              <picture key={t.id}>
                <source srcSet={t.image.avif} type="image/avif" />
                <source srcSet={t.image.webp} type="image/webp" />
                <img
                  src={t.image.fallback} alt={t.image.alt} width={t.image.width} height={t.image.height}
                  loading="lazy" decoding="async"
                  className={`art absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ease-out ${i === active ? 'opacity-100' : 'opacity-0'}`}
                />
              </picture>
            ))}
          </div>

          {/* swatch row */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-3" role="group" aria-label="Paint">
              {trims.map((t, i) => (
                <button
                  key={t.id} onClick={() => setActive(i)} aria-label={t.name} aria-pressed={i === active}
                  className={`w-10 h-10 rounded-full grid place-items-center transition-transform ${i === active ? 'scale-110' : 'hover:scale-105'}`}
                >
                  <span className={`block w-8 h-8 rounded-full border ${i === active ? 'border-[var(--plasma)]' : 'border-[var(--line-strong)]'}`} style={{ backgroundColor: t.paint }} />
                </button>
              ))}
            </div>
            <div className="sm:text-right">
              <div className="font-display font-bold text-[length:var(--text-xl)] text-[var(--bone)]">{trim.name} <span className="text-[var(--muted)] font-normal text-[length:var(--text-base)]">· from {trim.price}</span></div>
              <p className="label-mono mt-1 max-w-[40ch] sm:ml-auto">{trim.sub}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
