import { useEffect, useMemo, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { TRIMS, type Trim } from '../data/gt';
import type { OptimizedImage } from '../types';

type RenderMap = Record<string, OptimizedImage>;

interface ReserveProps {
  base: string;
  renders: RenderMap;       // trim.id → optimized render
  endpoint: string;         // PUBLIC_FORM_ENDPOINT ('' = in-page success)
}

type Step = 0 | 1 | 2;
type Status = 'idle' | 'submitting' | 'success' | 'error';

interface Details { name: string; email: string; city: string; phone: string; }
type FieldErrors = Partial<Record<keyof Details, string>>;

const STEPS = ['Configuration', 'Your details', 'Review'] as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIRST_TRIM: Trim = TRIMS[0]!; // TRIMS is a non-empty constant

function makeRef(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `VG-2026-${n}`;
}

export function Reserve({ base, renders, endpoint }: ReserveProps) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);

  // Preselect from ?trim= (configurator handoff).
  const initialTrim = useMemo<string>(() => {
    if (typeof window === 'undefined') return FIRST_TRIM.id;
    const q = new URLSearchParams(window.location.search).get('trim');
    return TRIMS.some((t) => t.id === q) ? (q as string) : FIRST_TRIM.id;
  }, []);

  const [step, setStep] = useState<Step>(0);
  const [trimId, setTrimId] = useState<string>(initialTrim);
  const [details, setDetails] = useState<Details>({ name: '', email: '', city: '', phone: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [confirmation, setConfirmation] = useState<string>('');
  const [serverError, setServerError] = useState<string>('');

  const trim = useMemo<Trim>(() => TRIMS.find((t) => t.id === trimId) ?? FIRST_TRIM, [trimId]);
  const render = renders[trim.id];

  // Move focus to the new step's heading for screen readers + keyboard users.
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (status === 'idle') headingRef.current?.focus(); }, [step, status]);

  const validate = (): boolean => {
    const e: FieldErrors = {};
    if (!details.name.trim()) e.name = 'Tell us who to reserve for.';
    if (!details.email.trim()) e.email = 'We send your confirmation here.';
    else if (!EMAIL_RE.test(details.email.trim())) e.email = 'That email looks incomplete.';
    if (!details.city.trim()) e.city = 'Your nearest delivery city.';
    if (!details.phone.trim()) e.phone = 'A number for your specialist to reach you.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const setField = (k: keyof Details, v: string) => {
    setDetails((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const goNext = () => {
    if (step === 1 && !validate()) return;
    setStep((s) => (Math.min(2, s + 1) as Step));
  };
  const goBack = () => setStep((s) => (Math.max(0, s - 1) as Step));

  const submit = async () => {
    if (!validate()) { setStep(1); return; }
    setStatus('submitting');
    setServerError('');
    const refNo = makeRef();
    const payload = {
      ...details,
      trim: trim.name,
      trimId: trim.id,
      price: trim.price,
      reservation: refNo,
      _subject: `VANTA GT reservation — ${trim.name} (${refNo})`,
    };

    if (!endpoint) {
      // Graceful in-page success (no backend wired).
      await new Promise((r) => setTimeout(r, 650));
      setConfirmation(refNo);
      setStatus('success');
      return;
    }
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setConfirmation(refNo);
      setStatus('success');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Network error');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div ref={ref} className="container relative z-[2]">
        <SuccessCard base={base} trim={trim} render={render} confirmation={confirmation} />
      </div>
    );
  }

  return (
    <div ref={ref} className="container-wide relative z-[2]">
      <div className="grid gap-10 lg:gap-16 lg:[grid-template-columns:1.55fr_1fr] items-start">
        {/* ── Main flow ── */}
        <div data-reveal>
          <Progress step={step} />

          <div className="mt-10 panel p-6 sm:p-9">
            {step === 0 && (
              <fieldset>
                <legend className="contents">
                  <h2 ref={headingRef} tabIndex={-1} className="font-display text-[length:var(--text-2xl)] outline-none">
                    Confirm your <span className="text-[var(--plasma-2)]">GT</span>.
                  </h2>
                </legend>
                <p className="mt-3 text-[var(--muted)] max-w-[48ch]">
                  Every GT shares the same 1,020 hp dual-motor heart. Choose the finish you want to wake up to.
                </p>
                <div className="mt-7 grid gap-4 sm:grid-cols-2" role="radiogroup" aria-label="Choose a finish">
                  {TRIMS.map((t) => (
                    <TrimCard key={t.id} trim={t} selected={t.id === trimId} onSelect={() => setTrimId(t.id)} />
                  ))}
                </div>
              </fieldset>
            )}

            {step === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); goNext(); }} noValidate>
                <h2 ref={headingRef} tabIndex={-1} className="font-display text-[length:var(--text-2xl)] outline-none">Your details.</h2>
                <p className="mt-3 text-[var(--muted)] max-w-[48ch]">No payment yet — just where to send your confirmation and which specialist to assign.</p>
                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <Field id="name" label="Full name" value={details.name} error={errors.name} autoComplete="name" onChange={(v) => setField('name', v)} />
                  <Field id="email" label="Email" type="email" value={details.email} error={errors.email} autoComplete="email" onChange={(v) => setField('email', v)} />
                  <Field id="city" label="Delivery city" value={details.city} error={errors.city} autoComplete="address-level2" onChange={(v) => setField('city', v)} />
                  <Field id="phone" label="Phone" type="tel" value={details.phone} error={errors.phone} autoComplete="tel" onChange={(v) => setField('phone', v)} />
                </div>
                <button type="submit" className="sr-only">Continue to review</button>
              </form>
            )}

            {step === 2 && (
              <div>
                <h2 ref={headingRef} tabIndex={-1} className="font-display text-[length:var(--text-2xl)] outline-none">Review &amp; reserve.</h2>
                <p className="mt-3 text-[var(--muted)] max-w-[48ch]">One last look. You can step back to change anything.</p>
                <dl className="mt-7 divide-y divide-[var(--line)] border-y border-[var(--line)]">
                  <ReviewRow label="Finish" value={`${trim.name} — ${trim.price}`} onEdit={() => setStep(0)} />
                  <ReviewRow label="Name" value={details.name} onEdit={() => setStep(1)} />
                  <ReviewRow label="Email" value={details.email} onEdit={() => setStep(1)} />
                  <ReviewRow label="City" value={details.city} onEdit={() => setStep(1)} />
                  <ReviewRow label="Phone" value={details.phone} onEdit={() => setStep(1)} />
                </dl>

                <div className="mt-6 flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--raise)] p-4">
                  <span className="ping mt-1 shrink-0" aria-hidden="true" />
                  <p className="text-[var(--text-sm)] text-[var(--bone)]/85">
                    A <strong className="text-[var(--bone)]">fully refundable $1,000 deposit</strong> holds your build slot. Refundable in full until you sign a purchase agreement — cancel anytime.
                  </p>
                </div>

                {status === 'error' && (
                  <p role="alert" className="mt-5 text-[var(--text-sm)] text-[var(--err)] flex items-center gap-2">
                    <span aria-hidden="true">⚠</span> We couldn&apos;t submit your reservation{serverError ? ` (${serverError})` : ''}. Please try again.
                  </p>
                )}
              </div>
            )}

            {/* ── Step nav ── */}
            <div className="mt-9 flex items-center justify-between gap-4">
              {step > 0 ? (
                <button type="button" onClick={goBack} className="btn-line !px-5 !py-3" disabled={status === 'submitting'}>← Back</button>
              ) : <span />}
              {step < 2 ? (
                <button type="button" onClick={goNext} className="btn-plasma" data-magnetic="0.2">
                  {step === 0 ? 'Continue →' : 'Review →'}
                </button>
              ) : (
                <button type="button" onClick={submit} className="btn-plasma" data-magnetic="0.2" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Reserving…' : 'Place reservation →'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Aside: chosen GT + why reserve ── */}
        <aside data-reveal="right" className="lg:sticky lg:top-28 flex flex-col gap-7">
          <div className="panel overflow-hidden">
            <div className="relative bg-[var(--void)] aspect-[4/3]">
              <div className="glow-center absolute inset-0" aria-hidden="true" />
              {render && (
                <picture className="relative z-[1] block w-full h-full">
                  {render.avifSm && <source media="(max-width: 640px)" srcSet={render.avifSm} type="image/avif" />}
                  <source srcSet={render.avif} type="image/avif" />
                  <source srcSet={render.webp} type="image/webp" />
                  <img src={render.fallback} alt={render.alt} width={render.width} height={render.height} loading="lazy" decoding="async" className="art w-full h-full object-contain" />
                </picture>
              )}
              <span className="absolute left-4 top-4 z-[2] label-mono flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full border border-[var(--line-strong)]" style={{ background: trim.paint }} aria-hidden="true" />{trim.name.toUpperCase()}</span>
            </div>
            <div className="flex items-end justify-between gap-4 p-5 border-t border-[var(--line)]">
              <div>
                <p className="label-mono">FROM</p>
                <p className="font-display text-[length:var(--text-2xl)] leading-none mt-1">{trim.price}</p>
              </div>
              <p className="label-mono text-right max-w-[16ch]">{trim.sub}</p>
            </div>
          </div>

          <div className="panel p-6">
            <p className="kicker"><span className="ping" aria-hidden="true" /> WHY RESERVE NOW</p>
            <ul className="mt-5 flex flex-col gap-4">
              {[
                ['Front of the line', 'Reservations are filled in order. Earlier slot, earlier delivery window.'],
                ['Locked pricing', 'Your finish price is held against future revisions through to order.'],
                ['Fully refundable', 'The $1,000 deposit returns in full until you sign. Zero risk to look closer.'],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-3">
                  <span className="charge-tick mt-1 shrink-0 h-4 w-4 rounded-full border border-[var(--plasma)] grid place-items-center text-[var(--plasma-2)] text-[0.6rem]" aria-hidden="true">✓</span>
                  <div>
                    <p className="font-display text-[length:var(--text-base)] font-bold leading-tight">{t}</p>
                    <p className="text-[var(--text-sm)] text-[var(--muted)] mt-1 leading-relaxed">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Progress({ step }: { step: Step }) {
  const pct = (step / (STEPS.length - 1)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <span className={`label-mono ${i <= step ? 'text-[var(--plasma-2)]' : 'text-[var(--muted)]'}`}>{String(i + 1).padStart(2, '0')}</span>
            <span className={`hidden sm:inline font-mono text-[0.66rem] uppercase tracking-[0.14em] ${i <= step ? 'text-[var(--bone)]' : 'text-[var(--muted)]'}`}>{label}</span>
          </div>
        ))}
      </div>
      <div className="relative h-px bg-[var(--line)]" aria-hidden="true">
        <div className="absolute inset-y-0 left-0 bg-[var(--plasma)] shadow-[0_0_10px_rgba(var(--plasma-rgb),0.7)] transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
      </div>
      <span className="sr-only" role="status">Step {step + 1} of {STEPS.length}: {STEPS[step]}</span>
    </div>
  );
}

function TrimCard({ trim, selected, onSelect }: { trim: Trim; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button" role="radio" aria-checked={selected} onClick={onSelect}
      className={`text-left rounded-[var(--radius-md)] border p-4 transition-all duration-300 ${selected ? 'border-[var(--plasma)] bg-[rgba(var(--plasma-rgb),0.06)]' : 'border-[var(--line)] bg-[var(--raise)] hover:border-[var(--line-strong)]'}`}
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full border border-[var(--line-strong)]" style={{ background: trim.paint }} aria-hidden="true" />
          <span className="font-display font-bold text-[length:var(--text-lg)]">{trim.name}</span>
        </span>
        <span className={`h-4 w-4 rounded-full border grid place-items-center ${selected ? 'border-[var(--plasma)]' : 'border-[var(--line-strong)]'}`} aria-hidden="true">
          {selected && <span className="h-2 w-2 rounded-full bg-[var(--plasma)]" />}
        </span>
      </div>
      <p className="mt-3 text-[var(--text-sm)] text-[var(--muted)] leading-relaxed">{trim.sub}</p>
      <p className="mt-3 label-mono text-[var(--bone)]">{trim.price}</p>
    </button>
  );
}

function Field({ id, label, value, onChange, error, type = 'text', autoComplete }: {
  id: keyof Details | string; label: string; value: string; onChange: (v: string) => void;
  error?: string; type?: string; autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--muted)]">{label}</label>
      <input
        id={id} name={id} type={type} value={value} autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined}
        className={`text-[16px] rounded-[var(--radius-sm)] bg-[var(--void)] border px-4 py-3 text-[var(--bone)] placeholder:text-[var(--muted)] transition-colors outline-none focus:border-[var(--focus)] ${error ? 'border-[var(--err)]' : 'border-[var(--line-strong)]'}`}
      />
      {error && <span id={`${id}-err`} className="text-[var(--text-xs)] text-[var(--err)]">{error}</span>}
    </div>
  );
}

function ReviewRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <dt className="label-mono shrink-0">{label}</dt>
      <dd className="flex items-center gap-3 min-w-0">
        <span className="truncate text-[var(--text-sm)] text-[var(--bone)]">{value || '—'}</span>
        <button type="button" onClick={onEdit} className="text-cta shrink-0">Edit</button>
      </dd>
    </div>
  );
}

function SuccessCard({ base, trim, render, confirmation }: { base: string; trim: Trim; render?: OptimizedImage; confirmation: string }) {
  return (
    <div data-reveal className="panel relative overflow-hidden max-w-[640px] mx-auto text-center p-8 sm:p-12">
      <div className="glow-center absolute inset-0" aria-hidden="true" />
      <div className="relative z-[1]">
        <p className="kicker justify-center"><span className="ping" aria-hidden="true" /> RESERVATION CONFIRMED</p>
        <h1 className="mt-5 font-display text-[length:var(--text-3xl)]">You&apos;re in line for the <span className="text-[var(--plasma-2)]">{trim.name}</span>.</h1>
        {render && (
          <picture className="block mt-7 mx-auto max-w-[420px]">
            <source srcSet={render.avif} type="image/avif" />
            <source srcSet={render.webp} type="image/webp" />
            <img src={render.fallback} alt={render.alt} width={render.width} height={render.height} loading="eager" decoding="async" className="w-full object-contain" />
          </picture>
        )}
        <div className="mt-7 inline-flex flex-col items-center gap-1 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--raise)] px-6 py-4">
          <span className="label-mono">RESERVATION №</span>
          <span className="font-mono text-[length:var(--text-xl)] tracking-[0.16em] text-[var(--bone)]">#{confirmation}</span>
        </div>
        <p className="mt-6 text-[var(--muted)] max-w-[46ch] mx-auto leading-relaxed">
          We&apos;ve emailed your confirmation. A specialist will reach out within two business days to walk you through the build. Your deposit stays fully refundable until you order.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a href={base} className="btn-plasma" data-magnetic="0.2">Back to VANTA</a>
          <a href={`${base}the-gt/`} className="btn-line">Explore the GT</a>
        </div>
      </div>
    </div>
  );
}
