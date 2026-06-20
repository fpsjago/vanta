import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReveal } from '../../hooks/useReveal';
import type { OptimizedImage } from '../../types';

gsap.registerPlugin(ScrollTrigger);

export interface RailItem { img: OptimizedImage; n: string; title: string; note: string; }

/** Archetype 4 — horizontal pinned rail with cursor-displacement on the plates. */
export function DesignRail({ items }: { items: RailItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  useReveal(sectionRef);

  useEffect(() => {
    const section = sectionRef.current, track = trackRef.current;
    if (!section || !track) return;
    const desktop = window.matchMedia('(min-width: 1024px)').matches && !window.matchMedia('(pointer: coarse)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (desktop && !reduce) {
        const distance = () => track.scrollWidth - window.innerWidth + 96;
        gsap.to(track, {
          x: () => -distance(), ease: 'none',
          scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true },
        });
        const bar = section.querySelector<HTMLElement>('[data-rail-bar]');
        if (bar) ScrollTrigger.create({ trigger: section, start: 'top top', end: () => `+=${distance()}`, scrub: true, onUpdate: (s) => { bar.style.transform = `scaleX(${s.progress})`; } });
      }
      // cursor displacement on each plate
      if (!reduce && !window.matchMedia('(pointer: coarse)').matches) {
        section.querySelectorAll<HTMLElement>('[data-plate]').forEach((plate) => {
          const img = plate.querySelector('img');
          const onMove = (e: PointerEvent) => {
            const r = plate.getBoundingClientRect();
            const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
            gsap.to(img, { x: nx * 26, y: ny * 18, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
          };
          const onLeave = () => gsap.to(img, { x: 0, y: 0, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
          plate.addEventListener('pointermove', onMove); plate.addEventListener('pointerleave', onLeave);
        });
      }
    }, section);
    return () => ctx.revert();
  }, [items.length]);

  return (
    <section ref={sectionRef} className="relative bg-[var(--void)] lg:h-screen lg:overflow-hidden" aria-label="Design — shaped by airflow">
      <div className="container-wide relative pt-16 lg:pt-12 lg:absolute lg:top-10 lg:left-0 lg:right-0 z-10 pointer-events-none">
        <span className="kicker mb-2"><span className="w-1.5 h-1.5 rounded-full bg-[var(--plasma)]" /> 03 / DESIGN</span>
        <h2 className="font-display font-extrabold text-[length:clamp(1.8rem,4vw,3.2rem)] leading-none tracking-[-0.03em] text-[var(--bone)]">Shaped by airflow, nothing else.</h2>
      </div>

      <div className="lg:h-screen lg:flex lg:items-center">
        <div ref={trackRef} className="flex flex-col gap-8 lg:flex-row lg:gap-8 lg:w-max lg:items-stretch px-[clamp(1.25rem,4vw,2.5rem)] lg:pl-[clamp(1.5rem,5vw,4rem)] lg:pr-24 pb-16 lg:pb-0 lg:pt-24">
          {items.map((it) => (
            <article key={it.n} data-reveal data-plate className="panel relative shrink-0 w-full lg:w-[min(78vw,560px)] overflow-hidden group">
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--void)]">
                <div className="absolute inset-0 glow-center" aria-hidden="true" />
                <picture>
                  <source srcSet={it.img.avif} type="image/avif" />
                  <source srcSet={it.img.webp} type="image/webp" />
                  <img src={it.img.fallback} alt={it.img.alt} width={it.img.width} height={it.img.height} loading="lazy" decoding="async" className="art-duo-bone w-full h-full object-contain will-change-transform scale-[1.06]" />
                </picture>
              </div>
              <div className="p-6 flex items-end justify-between gap-4">
                <div>
                  <div className="font-display font-bold text-[length:var(--text-xl)] tracking-tight text-[var(--bone)]">{it.title}</div>
                  <p className="mt-1.5 text-sm text-[var(--muted)] max-w-[34ch] leading-snug">{it.note}</p>
                </div>
                <span className="font-mono text-[0.66rem] text-[var(--plasma-2)]">{it.n}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="hidden lg:block absolute bottom-8 left-[clamp(1.5rem,5vw,4rem)] right-24 h-px bg-[var(--line)] z-10">
        <div data-rail-bar className="h-px bg-[var(--plasma)] origin-left scale-x-0" />
      </div>
    </section>
  );
}
