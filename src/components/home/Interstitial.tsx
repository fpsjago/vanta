import { useRef } from 'react';
import { useReveal } from '../../hooks/useReveal';

/** Archetype 6 — cinematic interstitial. The plasma color-flood IS the section. */
export function Interstitial() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} className="flood-plasma relative overflow-hidden min-h-[58vh] flex items-center" aria-label="The dark has a new shape">
      <div className="absolute inset-0 [mix-blend-mode:overlay] opacity-30 bg-[radial-gradient(ellipse_at_30%_30%,rgba(0,0,0,0.5),transparent_60%)]" aria-hidden="true" />
      <svg className="absolute inset-x-0 bottom-0 w-full h-[120px] opacity-40 pointer-events-none overflow-visible" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-20 80 C 360 20, 720 110, 1080 50 S 1480 30, 1480 30" fill="none" stroke="var(--plasma-ink)" strokeWidth="1.5" />
      </svg>
      <div className="container relative">
        <p data-reveal className="font-mono text-[0.7rem] uppercase tracking-[0.26em] mb-6">— 0 dB at a standstill</p>
        <h2 data-reveal className="font-display font-extrabold text-[length:clamp(2.6rem,9vw,8rem)] leading-[0.88] tracking-[-0.04em] max-w-[16ch]">
          You'll forget it's on.
        </h2>
      </div>
    </section>
  );
}
