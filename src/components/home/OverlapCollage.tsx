import { useRef } from 'react';
import { useReveal } from '../../hooks/useReveal';
import type { OptimizedImage } from '../../types';

/**
 * Archetype 7 — the council-mandated GENUINE light act. Always bone/ink (escapes
 * the void+neon fingerprint), with layered, overlapping, parallaxed renders.
 */
export function OverlapCollage({ wide, inset }: { wide: OptimizedImage; inset: OptimizedImage }) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} className="section relative overflow-hidden bg-[#EDEBE4] text-[#14141A]" aria-label="Craft">
      <span className="absolute font-display font-black text-[length:clamp(7rem,22vw,20rem)] -top-2 -left-3 leading-[0.8] text-transparent [-webkit-text-stroke:1px_rgba(20,20,26,0.07)] pointer-events-none select-none" aria-hidden="true">CRAFT</span>
      <div className="container-wide relative grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-6 items-center">
        <div className="relative">
          <div data-reveal="scale" className="relative rounded-[var(--radius-md)] overflow-hidden border border-[#D8D5CC] shadow-[0_40px_100px_-30px_rgba(20,20,26,0.35)]" data-parallax="0.06">
            <picture>
              <source srcSet={wide.avif} type="image/avif" />
              <source srcSet={wide.webp} type="image/webp" />
              <img src={wide.fallback} alt={wide.alt} width={wide.width} height={wide.height} loading="lazy" decoding="async" className="art w-full h-full object-cover" />
            </picture>
          </div>
          {/* overlapping inset */}
          <div data-reveal className="absolute -bottom-8 -right-4 w-[46%] rounded-[var(--radius-md)] overflow-hidden border-4 border-[#EDEBE4] shadow-[0_30px_70px_-25px_rgba(20,20,26,0.4)]" data-parallax="-0.05">
            <picture>
              <source srcSet={inset.avif} type="image/avif" />
              <source srcSet={inset.webp} type="image/webp" />
              <img src={inset.fallback} alt={inset.alt} width={inset.width} height={inset.height} loading="lazy" decoding="async" className="art w-full h-full object-cover" />
            </picture>
          </div>
        </div>

        <div className="lg:pl-8">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-[#B30E57] mb-5 inline-flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#D11468]" /> 04 / CRAFT</span>
          <h2 data-reveal className="font-display font-extrabold text-[length:var(--text-4xl)] leading-[0.98] tracking-[-0.03em]">Assembled by eleven people. Signed by one.</h2>
          <div data-reveal className="mt-5 flex flex-col gap-1.5" aria-hidden="true">
            <svg viewBox="0 0 160 46" width="150" height="44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 31 C 12 13 18 13 22 29 C 26 43 32 43 36 27 C 40 13 46 13 50 29 C 54 43 60 43 66 25 L 73 31 M82 30 C 92 14 104 14 108 29 C 112 41 122 41 132 19" fill="none" stroke="#D11468" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-mono text-[0.62rem] tracking-[0.14em] text-[#5C5C64]">— M. Vanta, chief engineer</span>
          </div>
          <p data-reveal className="mt-6 text-[length:var(--text-lg)] leading-relaxed text-[#3C3C44] max-w-[46ch]">
            The cabin is assembled by hand under daylight-balanced studio lamps, then signed. Forged 22-inch wheels, a single-piece carbon tub, and an interior with exactly one screen — because the road deserves your eyes.
          </p>
          <ul className="mt-8 flex flex-col gap-3 max-w-[40ch]">
            {['Single-piece carbon monocoque', 'Hand-finished cabin · 1 display', 'Forged 22" aero wheels'].map((f) => (
              <li key={f} data-reveal className="flex items-center gap-3 font-mono text-[0.78rem] text-[#14141A]">
                <span className="w-1.5 h-1.5 bg-[#D11468]" />{f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
