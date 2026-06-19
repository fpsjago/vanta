import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Archetype 2 — kinetic type IS the section. Carries a real spec, zero imagery. */
export function KineticAct() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      const lines = root.querySelectorAll('.kin-line');
      gsap.set(lines, { yPercent: 110, opacity: 0 });
      gsap.to(lines, {
        yPercent: 0, opacity: 1, duration: 1.1, ease: 'power4.out', stagger: 0.14,
        scrollTrigger: { trigger: root, start: 'top 70%', once: true },
      });
      // big figure drifts up slightly faster than the page (parallax depth)
      gsap.to(root.querySelector('.kin-fig'), {
        yPercent: -12, ease: 'none',
        scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section relative overflow-hidden glow-center" aria-label="One charge, 690 kilometres">
      <div className="bgtypo text-[length:clamp(8rem,30vw,28rem)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70" aria-hidden="true">690</div>
      <span className="float-line left-[12%] top-0 h-40" aria-hidden="true" />
      <span className="float-dot right-[16%] top-[24%]" aria-hidden="true" />
      <div className="container relative text-center">
        <span className="kicker justify-center mb-8"><span className="w-1.5 h-1.5 rounded-full bg-[var(--plasma)]" /> 01 / RANGE</span>
        <h2 className="font-display font-extrabold tracking-[-0.03em] text-[var(--bone)] leading-[0.92]">
          <span className="line-mask"><span className="kin-line block text-[length:clamp(2.4rem,7vw,6rem)]">One charge.</span></span>
          <span className="line-mask"><span className="kin-line kin-fig block text-[length:clamp(4rem,17vw,15rem)] text-[var(--plasma-2)] leading-[0.82] my-1">690 km</span></span>
          <span className="line-mask"><span className="kin-line block text-[length:clamp(2.4rem,7vw,6rem)]">of dark road.</span></span>
        </h2>
        <p className="mt-9 mx-auto max-w-[46ch] text-[length:var(--text-lg)] text-[var(--muted)] leading-relaxed">
          A 110&nbsp;kWh pack on a 900-volt architecture. Drive from dusk to the coast and back without thinking about a plug — then take 18 minutes for the next 80%.
        </p>
      </div>
    </section>
  );
}
