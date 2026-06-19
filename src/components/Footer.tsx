import { useRef } from 'react';
import { Logo } from './Logo';
import { useReveal } from '../hooks/useReveal';

interface FooterProps { base: string; }

const COLS: Array<{ title: string; links: Array<{ label: string; href: string }> }> = [
  { title: 'The Car', links: [
    { label: 'The GT', href: 'the-gt/' },
    { label: 'Configure', href: 'configure/' },
    { label: 'Gallery', href: 'gallery/' },
    { label: 'Reserve', href: 'reserve/' },
  ]},
  { title: 'Brand', links: [
    { label: 'Story', href: 'story/' },
    { label: 'Contact', href: 'contact/' },
  ]},
  { title: 'Legal', links: [
    { label: 'Privacy', href: 'legal/privacy/' },
    { label: 'Terms', href: 'legal/terms/' },
    { label: 'Warranty', href: 'legal/warranty/' },
  ]},
];

export function Footer({ base }: FooterProps) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <footer ref={ref} className="relative border-t border-[var(--line)] bg-[var(--surface)] overflow-hidden">
      <div className="glow absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="bgtypo text-[length:clamp(7rem,24vw,22rem)] -bottom-[6%] -right-[3%] opacity-90" aria-hidden="true">VANTA</div>

      <div className="container-wide relative py-16 lg:py-20">
        <div className="grid gap-12 lg:gap-8 lg:[grid-template-columns:1.6fr_1fr_1fr_1fr]">
          <div data-reveal className="flex flex-col gap-5 max-w-[34ch]">
            <a href={base} className="text-[var(--bone)] w-fit"><Logo size={1.5} live /></a>
            <p className="font-display text-2xl font-extrabold tracking-tight text-[var(--bone)] leading-[1.05]">Engineered<br />for the dark.</p>
            <p className="text-sm text-[var(--muted)] leading-relaxed">An electric grand tourer built to be felt before it's heard. Reserve the flagship — first deliveries open now.</p>
            <a href={`${base}reserve/`} className="btn-plasma w-fit mt-1" data-magnetic="0.2">Reserve the GT →</a>
          </div>

          {COLS.map((col) => (
            <nav key={col.title} data-reveal aria-label={col.title} className="flex flex-col gap-4">
              <span className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-[var(--muted)]">{col.title}</span>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={`${base}${l.href}`} className="text-sm text-[var(--bone)] hover:text-[var(--plasma-2)] transition-colors inline-flex items-center gap-1.5 group">
                      <span className="w-0 group-hover:w-3 h-px bg-[var(--plasma)] transition-all duration-300" aria-hidden="true" />{l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="hairline mt-14 mb-6" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="label-mono flex items-center gap-2.5"><span className="ping" aria-hidden="true" />© 2026 VANTA MOTORS · CONCEPT SHOWN</p>
          <p className="label-mono">A <a href="https://fullstackevolved.com" target="_blank" rel="noopener noreferrer" className="text-[var(--plasma-2)] hover:text-[var(--bone)]">Full Stack Evolved</a> template</p>
        </div>
      </div>
    </footer>
  );
}
