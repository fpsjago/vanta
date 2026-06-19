import { useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal';

interface ContactFormProps { endpoint: string; }
type Status = 'idle' | 'submitting' | 'success' | 'error';
interface Fields { name: string; email: string; message: string; }
type FieldErrors = Partial<Record<keyof Fields, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm({ endpoint }: ContactFormProps) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);

  const [fields, setFields] = useState<Fields>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState<string>('');

  const set = (k: keyof Fields, v: string) => {
    setFields((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = (): boolean => {
    const e: FieldErrors = {};
    if (!fields.name.trim()) e.name = 'Your name, please.';
    if (!fields.email.trim()) e.email = 'We reply here.';
    else if (!EMAIL_RE.test(fields.email.trim())) e.email = 'That email looks incomplete.';
    if (!fields.message.trim()) e.message = 'Tell us what you need.';
    else if (fields.message.trim().length < 10) e.message = 'A little more detail helps.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    setServerError('');
    const payload = { ...fields, _subject: `VANTA enquiry — ${fields.name}` };

    if (!endpoint) {
      await new Promise((r) => setTimeout(r, 600));
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
      setStatus('success');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Network error');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div ref={ref} className="panel relative overflow-hidden p-8 sm:p-10 text-center">
        <div className="glow-center absolute inset-0" aria-hidden="true" />
        <div className="relative z-[1]">
          <p className="kicker justify-center"><span className="ping" aria-hidden="true" /> MESSAGE SENT</p>
          <h2 className="mt-5 font-display text-[length:var(--text-2xl)]">We&apos;ve got it.</h2>
          <p className="mt-4 text-[var(--muted)] max-w-[42ch] mx-auto leading-relaxed">
            Thanks, {fields.name.split(' ')[0] || 'there'}. A real person reads every message — expect a reply within one business day.
          </p>
          <button
            type="button"
            onClick={() => { setFields({ name: '', email: '', message: '' }); setStatus('idle'); }}
            className="btn-line mt-7 !px-5 !py-3"
          >Send another →</button>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref}>
      <form onSubmit={onSubmit} noValidate data-reveal className="panel p-6 sm:p-8 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="c-name" className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--muted)]">Name</label>
          <input
            id="c-name" name="name" type="text" autoComplete="name" value={fields.name}
            onChange={(e) => set('name', e.target.value)}
            aria-invalid={!!errors.name} aria-describedby={errors.name ? 'c-name-err' : undefined}
            className={`text-[16px] rounded-[var(--radius-sm)] bg-[var(--void)] border px-4 py-3 outline-none focus:border-[var(--focus)] ${errors.name ? 'border-[var(--err)]' : 'border-[var(--line-strong)]'}`}
          />
          {errors.name && <span id="c-name-err" className="text-[var(--text-xs)] text-[var(--err)]">{errors.name}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="c-email" className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--muted)]">Email</label>
          <input
            id="c-email" name="email" type="email" autoComplete="email" value={fields.email}
            onChange={(e) => set('email', e.target.value)}
            aria-invalid={!!errors.email} aria-describedby={errors.email ? 'c-email-err' : undefined}
            className={`text-[16px] rounded-[var(--radius-sm)] bg-[var(--void)] border px-4 py-3 outline-none focus:border-[var(--focus)] ${errors.email ? 'border-[var(--err)]' : 'border-[var(--line-strong)]'}`}
          />
          {errors.email && <span id="c-email-err" className="text-[var(--text-xs)] text-[var(--err)]">{errors.email}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="c-message" className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--muted)]">Message</label>
          <textarea
            id="c-message" name="message" rows={5} value={fields.message}
            onChange={(e) => set('message', e.target.value)}
            aria-invalid={!!errors.message} aria-describedby={errors.message ? 'c-message-err' : undefined}
            className={`text-[16px] rounded-[var(--radius-sm)] bg-[var(--void)] border px-4 py-3 outline-none focus:border-[var(--focus)] resize-y min-h-[140px] ${errors.message ? 'border-[var(--err)]' : 'border-[var(--line-strong)]'}`}
          />
          {errors.message && <span id="c-message-err" className="text-[var(--text-xs)] text-[var(--err)]">{errors.message}</span>}
        </div>

        {status === 'error' && (
          <p role="alert" className="text-[var(--text-sm)] text-[var(--err)] flex items-center gap-2">
            <span aria-hidden="true">⚠</span> Couldn&apos;t send{serverError ? ` (${serverError})` : ''}. Please try again, or email us directly.
          </p>
        )}

        <button type="submit" className="btn-plasma w-full mt-1" data-magnetic="0.2" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : 'Send message →'}
        </button>
      </form>
    </div>
  );
}
