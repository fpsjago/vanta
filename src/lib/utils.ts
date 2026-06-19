export const BASE = import.meta.env.BASE_URL.replace(/\/?$/, '/');

/** Prefix an internal path with the site base. Pass paths WITHOUT a leading slash. */
export function withBase(path = ''): string {
  return `${BASE}${path.replace(/^\//, '')}`;
}

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export function pad(n: number, width = 2): string {
  return String(n).padStart(width, '0');
}

export function specDate(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
}
