import { useEffect, type RefObject } from 'react';

/**
 * Island-safe scroll reveal. The global observer in BaseLayout skips
 * astro-island descendants (React #418), so each React section reveals its
 * own [data-reveal] / [data-reveal-stagger] here. Fires immediately if already in view.
 */
export function useReveal(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-stagger]'));
    if (!targets.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach((el) => el.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }),
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
    );
    targets.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('visible');
      else io.observe(el);
    });
    return () => io.disconnect();
  }, [ref]);
}
