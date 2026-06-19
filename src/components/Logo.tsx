interface LogoProps {
  size?: number; // rem
  live?: boolean;
  className?: string;
}

/** VANTA wordmark — heavy Unbounded with a plasma "charge" node (a power-on LED). */
export function Logo({ size = 1.15, live = false, className = '' }: LogoProps) {
  return (
    <span
      className={`inline-flex items-center gap-[0.55em] select-none leading-none ${className}`}
      style={{ fontSize: `${size}rem` }}
      aria-label="VANTA"
    >
      <span className="relative inline-flex" aria-hidden="true">
        <span className="block w-[0.42em] h-[0.42em] rounded-[1px] bg-[var(--plasma)] shadow-[0_0_8px_rgba(var(--plasma-rgb),0.8)]" />
        {live && (
          <span className="absolute inset-0 rounded-[1px] bg-[var(--plasma)] animate-ping" />
        )}
      </span>
      <span className="font-display font-extrabold tracking-[0.12em]" aria-hidden="true">VANTA</span>
    </span>
  );
}
