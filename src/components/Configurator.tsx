import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import type { OptimizedImage } from '../types';

export interface ConfTrim { id: string; name: string; paint: string; price: string; sub: string; image: OptimizedImage; }

const SUMMARY = [
  { label: 'Output', value: '1,020 hp' },
  { label: 'Range · WLTP', value: '690 km' },
  { label: '0–100 km/h', value: '2.4 s' },
];

/** The configurator — 2D color/trim swap + cursor-parallax agency moment. State → Reserve. */
export function Configurator({ trims, base, initial }: { trims: ConfTrim[]; base: string; initial?: string }) {
  const initIdx = trims.findIndex((t) => t.id === initial);
  const startIdx = initIdx >= 0 ? initIdx : 0;
  const [active, setActive] = useState(startIdx);
  const stageRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const trim = trims[active] ?? trims[0];

  // Client-side ?trim= handoff from the configurator teaser / static prerender.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('trim');
    if (p) { const i = trims.findIndex((t) => t.id === p); if (i >= 0) setActive(i); }
  }, []);

  useEffect(() => {
    const stage = stageRef.current, car = carRef.current;
    if (!stage || !car) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(pointer: coarse)').matches) return;
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(car, { rotateY: nx * 10, rotateX: -ny * 5, x: nx * 24, y: ny * 12, duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
    };
    const onLeave = () => gsap.to(car, { rotateY: 0, rotateX: 0, x: 0, y: 0, duration: 1, ease: 'power3.out', overwrite: 'auto' });
    stage.addEventListener('pointermove', onMove); stage.addEventListener('pointerleave', onLeave);
    return () => { stage.removeEventListener('pointermove', onMove); stage.removeEventListener('pointerleave', onLeave); };
  }, []);

  if (!trim) return null;

  return (
    <section className="relative min-h-[100svh] pt-[88px] overflow-hidden glow" aria-label="Configure your VANTA GT">
      <span className="bgtypo text-[length:clamp(7rem,24vw,22rem)] top-[12%] left-1/2 -translate-x-1/2 opacity-60" aria-hidden="true">{trim.name.toUpperCase()}</span>

      <div className="container-wide relative grid lg:grid-cols-[1.4fr_0.9fr] gap-8 items-center min-h-[calc(100svh-88px)]">
        {/* stage */}
        <div ref={stageRef} className="relative [perspective:1400px] order-2 lg:order-1">
          <div className="absolute inset-0 glow-center" aria-hidden="true" />
          <div ref={carRef} className="relative aspect-[16/10] will-change-transform [transform-style:preserve-3d]">
            {trims.map((t, i) => (
              <picture key={t.id}>
                <source srcSet={t.image.avif} type="image/avif" />
                <source srcSet={t.image.webp} type="image/webp" />
                <img
                  src={t.image.fallback} alt={t.image.alt} width={t.image.width} height={t.image.height}
                  loading={i === startIdx ? 'eager' : 'lazy'} fetchPriority={i === startIdx ? 'high' : 'auto'} decoding="async"
                  className={`art absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ease-out ${i === active ? 'opacity-100' : 'opacity-0'}`}
                />
              </picture>
            ))}
          </div>
          <p className="label-mono text-center mt-2">DRAG-FREE · MOVE YOUR CURSOR TO ORBIT</p>
        </div>

        {/* controls */}
        <div className="order-1 lg:order-2 py-10">
          <span className="kicker mb-4"><span className="ping" /> CONFIGURE</span>
          <h1 className="font-display font-extrabold text-[length:clamp(2.2rem,5vw,3.6rem)] leading-[0.95] tracking-[-0.03em] text-[var(--bone)]">Build your GT.</h1>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <span className="label-mono">PAINT</span>
              <span className="font-mono text-[0.78rem] text-[var(--bone)]">{trim.name}</span>
            </div>
            <div className="flex items-center gap-3" role="group" aria-label="Paint">
              {trims.map((t, i) => (
                <button key={t.id} onClick={() => setActive(i)} aria-label={t.name} aria-pressed={i === active} className={`w-12 h-12 rounded-full grid place-items-center transition-transform ${i === active ? 'scale-110' : 'hover:scale-105'}`}>
                  <span className={`block w-9 h-9 rounded-full border ${i === active ? 'border-[var(--plasma)]' : 'border-[var(--line-strong)]'}`} style={{ backgroundColor: t.paint }} />
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-[var(--muted)] leading-snug max-w-[40ch]">{trim.sub}</p>
          </div>

          <dl className="mt-8 border-t border-[var(--line)]">
            {SUMMARY.map((s) => (
              <div key={s.label} className="flex items-center justify-between py-3 border-b border-[var(--line)]">
                <dt className="label-mono">{s.label}</dt>
                <dd className="font-mono text-[0.82rem] text-[var(--bone)]">{s.value}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between py-4">
              <dt className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--muted)]">From</dt>
              <dd className="font-display font-extrabold text-[length:var(--text-2xl)] text-[var(--bone)]">{trim.price}</dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`${base}reserve/?trim=${trim.id}`} className="btn-plasma" data-magnetic="0.2">Reserve this build →</a>
            <a href={`${base}the-gt/`} className="btn-line">Full spec</a>
          </div>
        </div>
      </div>
    </section>
  );
}
