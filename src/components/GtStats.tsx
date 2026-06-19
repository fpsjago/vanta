import { useEffect, useRef } from 'react';
import { useReveal } from '../hooks/useReveal';

interface CountStat {
  /** Numeric target the digit counts to. */
  to: number;
  /** Decimal places to render while counting. */
  decimals?: number;
  /** Thousands separator for large numbers (e.g. 1,020). */
  group?: boolean;
  prefix?: string;
  suffix: string;
  label: string;
  detail: string;
}

// Performance act — the real numbers, counted up once when scrolled into view.
const STATS: CountStat[] = [
  { to: 2.4, decimals: 1, suffix: 's', label: '0–100 km/h', detail: 'Launch-controlled, full charge, dry tarmac.' },
  { to: 7.1, decimals: 1, suffix: 's', label: '0–200 km/h', detail: 'Torque holds flat to the second motor’s ceiling.' },
  { to: 412, group: true, suffix: 'km/h', label: 'Top speed · limited', detail: 'Electronically capped. The motors have more.' },
  { to: 9.6, decimals: 1, suffix: 's', label: 'Standing 400 m', detail: 'Quarter mile from a dead stop, one gear, no shift.' },
];

function format(v: number, s: CountStat): string {
  const fixed = v.toFixed(s.decimals ?? 0);
  if (!s.group) return fixed;
  // group the integer part only
  const [int, frac] = fixed.split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return frac ? `${grouped}.${frac}` : grouped;
}

export function GtStats() {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const digits = Array.from(root.querySelectorAll<HTMLElement>('[data-count]'));
    if (!digits.length) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const settle = (el: HTMLElement) => {
      const stat = STATS[Number(el.dataset.index)];
      if (stat) el.textContent = format(stat.to, stat);
    };
    if (reduce) { digits.forEach(settle); return; }

    const run = (el: HTMLElement) => {
      const stat = STATS[Number(el.dataset.index)];
      if (!stat) return;
      const start = performance.now();
      const dur = 1500;
      const ease = (t: number) => 1 - Math.pow(1 - t, 3);
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        el.textContent = format(stat.to * ease(t), stat);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    // Fire-if-in-view IntersectionObserver (NOT ScrollTrigger.once).
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { run(e.target as HTMLElement); io.unobserve(e.target); }
      }),
      { threshold: 0.4 }
    );
    digits.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) { run(el); }
      else io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative">
      <ol className="relative grid gap-px sm:grid-cols-2 lg:grid-cols-4 border border-[var(--line)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--line)]">
        {STATS.map((s, i) => (
          <li
            key={s.label}
            data-reveal
            className="panel !rounded-none !border-0 bg-[var(--surface)] p-7 lg:p-8 flex flex-col gap-4 min-h-[clamp(13rem,18vw,16rem)]"
            style={{ '--reveal-delay': `${i * 0.08}s` } as React.CSSProperties}
          >
            <span className="label-mono text-[var(--plasma-2)]/90">{String(i + 1).padStart(2, '0')}</span>
            <div className="mt-auto">
              <div className="font-display font-extrabold leading-[0.9] tracking-[-0.02em] text-[var(--bone)] text-[length:clamp(2.8rem,5vw,4.4rem)]">
                {s.prefix}<span data-count data-index={i} className="hud-digit">{s.prefix}{format(0, s)}</span>
                <span className="text-[var(--plasma-2)] text-[0.34em] align-top ml-1.5 tracking-normal">{s.suffix}</span>
              </div>
              <div className="mt-2 font-mono text-[var(--text-xs)] uppercase tracking-[0.12em] text-[var(--bone)]">{s.label}</div>
              <p className="mt-3 text-[var(--text-sm)] text-[var(--muted)] leading-relaxed max-w-[34ch]">{s.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
