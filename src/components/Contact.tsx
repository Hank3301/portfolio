import {useEffect, useState, type FormEvent} from 'react';
import {brand, contact} from '../content';
import {useReveals} from '../hooks/useReveals';
import {submitContact} from '../services/api';

type Status = 'idle' | 'invalid' | 'sending' | 'sent' | 'error';

function useCountdown(target: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const ms = Math.max(0, new Date(target).getTime() - now);
  const s = Math.floor(ms / 1000);
  return {d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60};
}

export function Contact() {
  const ref = useReveals<HTMLElement>();
  const t = useCountdown(contact.window);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      setStatus('invalid');
      form.reportValidity();
      return;
    }
    setStatus('sending');
    setErrorMsg('');

    const data = new FormData(form);
    try {
      await submitContact({
        name: String(data.get('name')),
        email: String(data.get('email')),
        track: String(data.get('track')),
        context: String(data.get('context')),
      });
      setStatus('sent');
      form.reset();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao enviar. Tente novamente.');
    }
  };

  const field = 'w-full rounded-[4px] bg-white/[0.04] px-4 py-3.5 text-body text-white ring-1 ring-white/15 outline-none placeholder:text-regolith/40 focus:ring-terminal user-invalid:ring-red-400/70';
  const units: [string, number][] = [['Days', t.d], ['Hrs', t.h], ['Min', t.m], ['Sec', t.s]];

  return (
    <section ref={ref} id="contact" aria-labelledby="contact-title" className="relative overflow-hidden bg-void px-4 pb-28 sm:px-6 md:px-[6vw] md:pb-40">
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-[62vw] left-1/2 size-[90vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_50%_30%,rgba(0,255,136,0.25),rgba(0,255,136,0.03)_55%,transparent_70%)]" />

      <div className="relative grid gap-12 border-t border-white/10 pt-20 md:grid-cols-2 md:gap-16 md:pt-28">
        <div data-reveal>
          <p className="font-mono text-label text-terminal uppercase">{contact.eyebrow}</p>
          <h2 id="contact-title" className="mt-4 font-display text-display text-white">
            {contact.heading}
          </h2>
          <p className="mt-5 max-w-[28rem] text-body text-regolith/70">{contact.body}</p>

          <div className="mt-10">
            <p className="font-mono text-label text-regolith/50 uppercase">{contact.windowLabel}</p>
            <div className="mt-3 flex gap-2 md:gap-3" role="timer" aria-label={`${t.d} days, ${t.h} hours, ${t.m} minutes until next availability`}>
              {units.map(([label, v]) => (
                <div key={label} className="brackets min-w-[4.25rem] px-3 py-3 text-center text-white/25 md:min-w-[5.5rem]">
                  <span className="block font-display text-[1.5rem] text-white tabular-nums md:text-[2.25rem]">{String(v).padStart(2, '0')}</span>
                  <span className="mt-1 block font-mono text-[0.625rem] tracking-[0.14em] text-regolith/60 uppercase">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3" aria-label="Links">
            <a href={brand.github} target="_blank" rel="noopener" className="flex items-center gap-2 rounded-[4px] ring-1 ring-white/15 px-4 py-2.5 font-mono text-label text-white/75 hover:bg-white/5 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </a>
            <a href={brand.linkedin} target="_blank" rel="noopener" className="flex items-center gap-2 rounded-[4px] ring-1 ring-white/15 px-4 py-2.5 font-mono text-label text-white/75 hover:bg-white/5 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
            <a href={brand.twitter} target="_blank" rel="noopener" className="flex items-center gap-2 rounded-[4px] ring-1 ring-white/15 px-4 py-2.5 font-mono text-label text-white/75 hover:bg-white/5 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 9.24-3.303.856-7.487-8.12-8.07 9.12H1.463l7.654-8.243L0 2.25h3.243l6.91 7.494 7.026-8.244h3.238l-6.586 7.393 7.517 7.815z"/></svg>
              Twitter
            </a>
          </div>
        </div>

        <form noValidate onSubmit={onSubmit} aria-describedby="contact-status" className="space-y-3" data-reveal>
          <label className="block">
            <span className="mb-1.5 block font-mono text-label text-regolith/60 uppercase">{contact.form.nameLabel}</span>
            <input name="name" required autoComplete="name" placeholder={contact.form.namePlaceholder} className={field} onInput={() => setStatus('idle')} />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-mono text-label text-regolith/60 uppercase">{contact.form.emailLabel}</span>
            <input name="email" type="email" required autoComplete="email" placeholder={contact.form.emailPlaceholder} className={field} onInput={() => setStatus('idle')} />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-mono text-label text-regolith/60 uppercase">{contact.form.trackLabel}</span>
            <select name="track" required className={`${field} appearance-none`}>
              {contact.tracks.map((tr) => (
                <option key={tr.value} value={tr.value} className="bg-void">{tr.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block font-mono text-label text-regolith/60 uppercase">{contact.form.contextLabel}</span>
            <textarea name="context" required rows={4} placeholder={contact.form.contextPlaceholder} className={`${field} resize-none`} onInput={() => setStatus('idle')} />
          </label>
          <button type="submit" disabled={status === 'sending'} className="mt-2 w-full rounded-[4px] bg-white px-5 py-4 font-mono text-label text-void uppercase transition-colors hover:bg-terminal disabled:opacity-50 disabled:cursor-not-allowed">
            {status === 'sending' ? 'Enviando...' : contact.form.submitLabel}
          </button>
          <p id="contact-status" role="status" className="min-h-[1.25rem] text-[0.8125rem] text-regolith/70">
            {status === 'invalid' && contact.form.invalidMsg}
            {status === 'sent' && contact.form.sentMsg.replace('{email}', brand.email)}
            {status === 'error' && <span className="text-red-400">{errorMsg}</span>}
          </p>
        </form>
      </div>
    </section>
  );
}