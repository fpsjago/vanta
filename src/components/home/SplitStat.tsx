import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useReveal } from '../../hooks/useReveal';
import type { OptimizedImage } from '../../types';

interface Step { fig: string; suffix: string; label: string; copy: string; }
const STEPS: Step[] = [
  { fig: '2.4', suffix: 's', label: '0–100 km/h', copy: 'Torque arrives before you finish the thought. No gears, no lag — just instant, silent violence.' },
  { fig: '1,300', suffix: 'N·m', label: 'Peak torque', copy: 'Vectored across both axles a thousand times a second. The GT rotates around you, not the other way round.' },
  { fig: '0.19', suffix: 'Cd', label: 'Drag coefficient', copy: 'A body shaped entirely by airflow. Nothing on it is decoration — every line moves air or it was deleted.' },
  { fig: '412', suffix: 'km/h', label: 'Top speed, limited', copy: 'Held back, not maxed out. The limiter is a choice; the aerodynamics are not.' },
];

/** Archetype 5 — sticky media, advancing stepped stats (NOT a card grid). */
export function SplitStat({ image }: { image: OptimizedImage }) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const figs = Array.from(root.querySelectorAll<HTMLElement>('[data-fig]'));
    const fire = () => figs.forEach((el) => {
      const raw = el.dataset.fig || '0';
      const target = parseFloat(raw.replace(/,/g, ''));
      const dec = raw.includes('.') ? (raw.split('.')[1]?.length ?? 0) : 0;
      const obj = { v: 0 };
      gsap.to(obj, { v: target, duration: 1.4, ease: 'power2.out', onUpdate: () => {
        el.textContent = obj.v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
      }});
    });
    const io = new IntersectionObserver((e) => { if (e.some((x) => x.isIntersecting)) { fire(); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden bg-[var(--surface)] border-y border-[var(--line)]" aria-label="Performance">
      <div className="container-wide grid lg:grid-cols-[1fr_1fr]">
        {/* sticky media */}
        <div className="relative lg:h-screen lg:sticky lg:top-0 flex items-center py-12 lg:py-0">
          <div className="glow-center absolute inset-0" aria-hidden="true" />
          <div className="relative w-full" data-reveal="scale">
            <span className="bgtypo text-[length:clamp(5rem,14vw,12rem)] -top-6 -left-2 opacity-80" aria-hidden="true">GT</span>
            <picture>
              <source srcSet={image.avif} type="image/avif" />
              <source srcSet={image.webp} type="image/webp" />
              <img src={image.fallback} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" className="art-duo-bone w-full h-auto object-contain" />
            </picture>
          </div>
        </div>
        {/* advancing steps */}
        <div className="relative py-16 lg:py-[28vh] flex flex-col gap-[18vh]">
          <span className="kicker"><span className="w-1.5 h-1.5 rounded-full bg-[var(--plasma)]" /> 02 / PERFORMANCE</span>
          {STEPS.map((s) => (
            <div key={s.label} data-reveal className="max-w-[42ch]">
              <div className="font-display font-extrabold text-[length:clamp(3rem,8vw,6.5rem)] leading-[0.85] tracking-[-0.03em] text-[var(--bone)]">
                <span data-fig={s.fig}>{s.fig}</span><span className="text-[var(--plasma-2)] text-[0.32em] align-top ml-2">{s.suffix}</span>
              </div>
              <div className="label-mono mt-3 mb-4">{s.label}</div>
              <p className="text-[length:var(--text-lg)] text-[var(--muted)] leading-relaxed">{s.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
