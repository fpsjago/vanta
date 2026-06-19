import { useEffect, useRef, useState } from 'react';
import { Logo } from './Logo';
import type { Skin } from '../types';

interface NavProps { base: string; }

const LINKS = [
  { label: 'The GT', href: 'the-gt/' },
  { label: 'Configure', href: 'configure/' },
  { label: 'Gallery', href: 'gallery/' },
  { label: 'Story', href: 'story/' },
  { label: 'Contact', href: 'contact/' },
];
const SKINS: Array<{ id: Skin; label: string; cls: string }> = [
  { id: 'midnight', label: 'Midnight', cls: 'bg-[#08080B]' },
  { id: 'carbon', label: 'Carbon', cls: 'bg-[#2A2A33]' },
  { id: 'studio', label: 'Studio', cls: 'bg-[#EDEBE4]' },
];

export function Nav({ base }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState<string>(() => (typeof window !== 'undefined' ? window.location.pathname : base));
  const [skin, setSkin] = useState<Skin>('midnight');
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const onLoad = () => { setPath(window.location.pathname); setOpen(false); };
    document.addEventListener('astro:page-load', onLoad);
    try {
      const s = localStorage.getItem('vanta-skin') as Skin | null;
      setSkin(s ?? ((document.documentElement.dataset.skin as Skin) || 'midnight'));
    } catch { /* noop */ }
    return () => { window.removeEventListener('scroll', onScroll); document.removeEventListener('astro:page-load', onLoad); };
  }, []);

  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);

  const applySkin = (id: Skin) => {
    document.documentElement.setAttribute('data-skin', id);
    try { localStorage.setItem('vanta-skin', id); } catch { /* noop */ }
    setSkin(id);
  };
  const isActive = (href: string) => path.startsWith(`${base}${href}`);

  return (
    <>
      <header
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[100] transition-[background-color,backdrop-filter,border-color] duration-300 ease-out border-b ${
          scrolled ? 'bg-[color-mix(in_srgb,var(--void)_72%,transparent)] backdrop-blur-xl border-[var(--line)]' : 'bg-transparent border-transparent'
        }`}
      >
        <nav className="container-wide flex items-center justify-between h-[72px]" aria-label="Primary">
          <a href={base} className="text-[var(--bone)] hover:text-[var(--plasma-2)] transition-colors" aria-label="VANTA home"><Logo size={1.2} live /></a>

          <ul className="hidden lg:flex items-center gap-9">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={`${base}${l.href}`}
                  aria-current={isActive(l.href) ? 'page' : undefined}
                  className={`font-mono text-[0.68rem] uppercase tracking-[0.18em] transition-colors ${isActive(l.href) ? 'text-[var(--plasma-2)]' : 'text-[var(--muted)] hover:text-[var(--bone)]'}`}
                >{l.label}</a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <SkinSwitcher skin={skin} onChange={applySkin} />
            <a href={`${base}reserve/`} className="hidden sm:inline-flex btn-plasma !py-2.5 !px-5 !text-[0.66rem]" data-magnetic="0.2">Reserve</a>
            <button
              className="lg:hidden flex flex-col gap-[5px] p-2 -mr-2" aria-label="Toggle menu" aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span className={`block h-[1.5px] w-6 bg-[var(--bone)] transition-transform duration-300 ${open ? 'translate-y-[6.5px] rotate-45' : ''}`} />
              <span className={`block h-[1.5px] w-6 bg-[var(--bone)] transition-opacity duration-300 ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-[1.5px] w-6 bg-[var(--bone)] transition-transform duration-300 ${open ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay — sibling of header, slide-in */}
      <div
        className={`lg:hidden fixed inset-0 z-[99] bg-[var(--void)] transition-transform duration-400 ease-out ${open ? 'translate-x-0' : 'translate-x-full pointer-events-none'}`}
        aria-hidden={!open}
      >
        <div className="glow absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative h-full flex flex-col pt-[88px] pb-10 px-7 overflow-y-auto">
          <ul className="flex flex-col">
            {LINKS.map((l, i) => (
              <li key={l.href} className="border-b border-[var(--line)]">
                <a href={`${base}${l.href}`} className="flex items-center gap-3 py-5 font-display text-2xl font-extrabold tracking-tight text-[var(--bone)]" onClick={() => setOpen(false)}>
                  <span className="font-mono text-[0.6rem] text-[var(--plasma-2)]">{String(i + 1).padStart(2, '0')}</span>{l.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={`${base}reserve/`} className="btn-plasma mt-8 w-full" onClick={() => setOpen(false)}>Reserve the GT</a>
          <div className="mt-auto pt-8 flex items-center justify-between">
            <span className="label-mono">SKIN</span><SkinSwitcher skin={skin} onChange={applySkin} />
          </div>
        </div>
      </div>
    </>
  );
}

function SkinSwitcher({ skin, onChange }: { skin: Skin; onChange: (s: Skin) => void }) {
  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="Color skin">
      {SKINS.map((s) => (
        <button
          key={s.id} onClick={() => onChange(s.id)} aria-label={`${s.label} skin`} aria-pressed={skin === s.id} title={s.label}
          className="w-6 h-6 grid place-items-center rounded-full"
        >
          <span className={`block w-3.5 h-3.5 rounded-full border transition-transform ${s.cls} ${skin === s.id ? 'border-[var(--plasma)] scale-110' : 'border-[var(--line-strong)] hover:scale-105'}`} />
        </button>
      ))}
    </div>
  );
}
