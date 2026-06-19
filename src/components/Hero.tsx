import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { OptimizedImage } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  car: OptimizedImage;   // GT render — the LCP poster
  video: string;         // base path to the ambient energy loop
  base: string;
}

export function Hero({ car, video, base }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const hudRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;

    const lines = Array.from(root.querySelectorAll<HTMLElement>('.line-inner'));
    const fades = Array.from(root.querySelectorAll<HTMLElement>('[data-hero-fade]'));
    const charge = root.querySelector<SVGPathElement>('.charge-path');
    const setHud = (v: number) => { if (hudRef.current) hudRef.current.textContent = String(Math.round(v)); };

    if (charge) {
      const len = charge.getTotalLength();
      charge.style.strokeDasharray = String(len);
      charge.style.strokeDashoffset = reduce ? '0' : String(len);
    }
    if (reduce) {
      gsap.set(lines, { yPercent: 0 });
      gsap.set(fades, { opacity: 1, y: 0 });
      setHud(412);
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(lines, { yPercent: 115 });
      gsap.set(fades, { opacity: 0, y: 18 });

      // Ignition sequence (on load) — all GSAP, decoupled from the video element.
      const tl = gsap.timeline({ delay: 0.15 });
      const hud = { v: 0 };
      tl.to(lines, { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.12 }, 0.1)
        .to(charge, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, 0.2)
        .to(hud, { v: 412, duration: 1.6, ease: 'power2.out', onUpdate: () => setHud(hud.v) }, 0.3)
        .to(fades, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 }, 0.5);

      // Scroll choreography (desktop only) — parallax car + content exit.
      if (!coarse) {
        const car = root.querySelector('[data-hero-car]');
        if (car) gsap.to(car, { yPercent: 8, scale: 1.06, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true } });
        gsap.to('[data-hero-content]', { opacity: 0, yPercent: -12, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: '65% top', scrub: true } });
        gsap.to('[data-hero-glow]', { opacity: 0.2, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true } });
      }
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden bg-[var(--void)]" aria-label="VANTA GT — engineered for the dark">
      {/* Ambient energy loop (behind, tinted) */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-[0.42] [mix-blend-mode:screen] pointer-events-none"
        autoPlay muted loop playsInline preload="none" aria-hidden="true"
      >
        <source src={`${video}`} type="video/mp4" />
      </video>
      {/* plasma glow + vignette */}
      <div data-hero-glow className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_55%_at_50%_62%,rgba(var(--plasma-rgb),0.18)_0%,transparent_65%)]" aria-hidden="true" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,var(--void)_0%,transparent_22%,transparent_55%,color-mix(in_srgb,var(--void)_92%,transparent)_100%)]" aria-hidden="true" />

      {/* The GT render — LCP poster */}
      <div data-hero-car className="absolute inset-0 z-[1] flex items-center justify-center will-change-transform">
        <picture className="w-full h-full">
          {car.avifSm && <source media="(max-width: 820px)" srcSet={car.avifSm} type="image/avif" />}
          {car.webpSm && <source media="(max-width: 820px)" srcSet={car.webpSm} type="image/webp" />}
          <source srcSet={car.avif} type="image/avif" />
          <source srcSet={car.webp} type="image/webp" />
          <img src={car.fallback} alt={car.alt} width={car.width} height={car.height} loading="eager" fetchPriority="high" decoding="async" className="w-full h-full object-contain object-[center_58%] md:object-[center_60%]" />
        </picture>
      </div>

      {/* Charge-line trace */}
      <svg className="absolute inset-x-0 bottom-[20%] z-[2] w-full h-[160px] pointer-events-none overflow-visible" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true">
        <path className="charge-path" d="M-20 120 C 280 60, 520 70, 720 96 S 1180 150, 1460 70" />
      </svg>

      {/* Content */}
      <div data-hero-content className="container-wide relative z-[3] pb-[clamp(2.5rem,6vw,5rem)] pt-28">
        <span data-hero-fade className="kicker mb-4"><span className="ping" /> VANTA · THE GT · CONCEPT</span>
        <h1 className="font-display font-extrabold text-[length:clamp(2.6rem,8vw,7rem)] leading-[0.9] tracking-[-0.03em] text-[var(--bone)]">
          <span className="line-mask"><span className="line-inner">Engineered</span></span>
          <span className="line-mask"><span className="line-inner">for the <span className="text-[var(--plasma-2)]">dark.</span></span></span>
        </h1>

        <div className="mt-7 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <p data-hero-fade className="text-[length:var(--text-lg)] text-[var(--bone)]/85 max-w-[42ch] leading-relaxed">
            A grand tourer with 1,020 horsepower of silence. Dual-motor AWD, 690&nbsp;km of range, and a body shaped entirely by airflow.
          </p>
          <div data-hero-fade className="hud flex items-end gap-6 shrink-0">
            <div>
              <div className="font-display font-extrabold text-[length:clamp(2.2rem,4vw,3.4rem)] leading-none text-[var(--bone)]"><span ref={hudRef} className="hud-digit">0</span><span className="text-[var(--plasma-2)] text-[0.42em] align-top ml-1">KM/H</span></div>
              <div className="label-mono mt-1">TOP SPEED, LIMITED</div>
            </div>
            <div className="hidden sm:block">
              <div className="font-display font-extrabold text-[length:clamp(2.2rem,4vw,3.4rem)] leading-none text-[var(--bone)]">2.4<span className="text-[var(--plasma-2)] text-[0.42em] align-top ml-1">S</span></div>
              <div className="label-mono mt-1">0–100 KM/H</div>
            </div>
          </div>
        </div>

        <div data-hero-fade className="mt-8 flex flex-wrap items-center gap-4">
          <a href={`${base}reserve/`} className="btn-plasma" data-magnetic="0.2">Reserve the GT →</a>
          <a href={`${base}configure/`} className="btn-line">Configure yours</a>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[3] flex flex-col items-center gap-2" aria-hidden="true">
        <span className="scroll-hint" /><span className="label-mono text-[0.58rem]">IGNITION</span>
      </div>
    </section>
  );
}
