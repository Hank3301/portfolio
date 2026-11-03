import {useEffect, useRef, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {intro} from '../content';
import {listProjects} from '../services/api';
import {clamp, pinProgress, range} from '../lib/math';
import {onFrame} from '../lib/scroll';

const SECTION_VH = 340;
const MOBILE_SECTION_VH = 180; // Reduced height for mobile
// Fallback temático de programação (Unsplash - código em IDE escura)
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80';

export function Projects() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const cardRefs = useRef<HTMLLIElement[]>([]);
  const imgRefs = useRef<HTMLImageElement[]>([]);
  const barRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const {data: apiProjects, isLoading, error, refetch} = useQuery({
    queryKey: ['projects'],
    queryFn: listProjects,
  });

  // Deduplicate projects by ID
  const rawProjects = apiProjects?.projects ?? [];
  const seenIds = new Set<string>();
  const projects = rawProjects.filter((p) => {
    if (seenIds.has(p.id)) return false;
    seenIds.add(p.id);
    return true;
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let lastP = -1;
    return onFrame(() => {
      const root = rootRef.current;
      const track = trackRef.current;
      if (!root || !track) return;
      const {p, rect, vh} = pinProgress(root);
      // Mobile: don't restrict to viewport bounds as strictly
      if (!isMobile && (rect.bottom < 0 || rect.top > vh)) return;
      if (Math.abs(p - lastP) < 0.00005) return;
      lastP = p;

      const vw = window.innerWidth;
      const k = range(p, isMobile ? 0.02 : 0.04, isMobile ? 0.98 : 0.96);
      const travel = Math.max(0, track.offsetLeft + track.scrollWidth - vw * 0.94);
      track.style.transform = `translate3d(${-k * travel}px, 0, 0)`;

      let nearest = 0;
      let best = Infinity;
      cardRefs.current.forEach((card, i) => {
        const r = card.getBoundingClientRect();
        const off = (r.left + r.width / 2 - vw * 0.62) / vw;
        const a = clamp(Math.abs(off) * 1.6);
        card.style.opacity = String(1 - a * 0.55);
        card.style.transform = `scale(${1 - a * 0.07})`;
        imgRefs.current[i].style.transform = `translate3d(${off * -60}px, 0, 0) scale(1.12)`;
        if (Math.abs(off) < best) {
          best = Math.abs(off);
          nearest = i;
        }
      });
      barRef.current!.style.transform = `scaleX(${k})`;
      countRef.current!.textContent = `0${nearest + 1}`;
    });
  }, [isMobile]);

  const sectionHeight = isMobile ? MOBILE_SECTION_VH : SECTION_VH;

  if (isLoading) {
    if (!mounted) {
      // SSR: render minimal placeholder to avoid hydration mismatch
      return (
        <section ref={rootRef} id="projects" aria-labelledby="projects-title" className="relative bg-void" style={{height: `${sectionHeight}svh`}}>
          <div className="sticky top-0 h-screen-s flex items-center justify-center pt-16 md:h-screen-s md:pt-0">
            <div className="grid md:grid-cols-[minmax(320px,50%)_1fr] md:items-start md:h-screen-s gap-8 md:gap-0 px-4 sm:px-6 md:px-0 w-full">
              <div className="relative z-10 min-w-0 w-full md:min-w-[320px] md:pl-[3vw] md:pr-10 overflow-x-visible md:overflow-x-auto" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                <p className="font-mono text-label text-terminal uppercase">{intro.eyebrow}</p>
              </div>
            </div>
          </div>
        </section>
      );
    }
    // Client-side: show full skeleton
    return (
      <section ref={rootRef} id="projects" aria-labelledby="projects-title" className="relative bg-void" style={{height: `${sectionHeight}svh`}}>
        <div className="sticky top-0 h-screen-s flex items-center justify-center pt-16 md:h-screen-s md:pt-0">
          <div className="grid md:grid-cols-[minmax(320px,50%)_1fr] md:items-start md:h-screen-s gap-8 md:gap-0 px-4 sm:px-6 md:px-0 w-full">
            <div className="relative z-10 min-w-0 w-full md:min-w-[320px] md:pl-[3vw] md:pr-10 overflow-x-visible md:overflow-x-auto" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
              <p className="font-mono text-label text-terminal uppercase">{intro.eyebrow}</p>
            </div>
            <ol className="mt-8 flex gap-5 pl-4 sm:pl-6 md:mt-0 md:gap-7 md:pl-0" aria-busy="true">
              {[1, 2, 3].map((i) => (
                <li key={i} className="w-[70vw] shrink-0 origin-bottom sm:w-[44vw] md:w-[clamp(16rem,24vw,23rem)]">
                  <article className="animate-pulse">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-void-2" />
                    <footer className="mt-4 space-y-3">
                      <div className="h-6 bg-white/10 rounded w-3/4" />
                      <div className="h-4 bg-white/5 rounded w-1/2" />
                      <div className="h-4 bg-white/5 rounded w-1/3" />
                      <div className="flex gap-1.5"><div className="h-6 w-20 bg-white/5 rounded" /><div className="h-6 w-20 bg-white/5 rounded" /></div>
                    </footer>
                  </article>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section ref={rootRef} id="projects" aria-labelledby="projects-title" className="relative bg-void" style={{height: `${sectionHeight}svh`}}>
        <div className="sticky top-0 h-screen-s flex items-center justify-center pt-16 md:h-screen-s md:pt-0">
          <div className="grid md:grid-cols-[minmax(320px,50%)_1fr] md:items-start md:h-screen-s gap-8 md:gap-0 px-4 sm:px-6 md:px-0 w-full">
            <div className="relative z-10 min-w-0 w-full md:min-w-[320px] md:pl-[3vw] md:pr-10 overflow-x-visible md:overflow-x-auto" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
              <p className="font-mono text-label text-terminal uppercase">{intro.eyebrow}</p>
            </div>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 text-center" role="alert">
              <p className="text-regolith/70">Falha ao carregar os projetos.</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-[4px] bg-white px-4 py-2.5 font-mono text-label text-void uppercase transition-colors hover:bg-terminal"
              >
                Tentar de novo
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section ref={rootRef} id="projects" aria-labelledby="projects-title" className="relative bg-void" style={{height: `${sectionHeight}svh`}}>
        <div className="sticky top-0 h-screen-s flex items-center justify-center pt-16 md:h-screen-s md:pt-0">
          <div className="grid md:grid-cols-[minmax(320px,50%)_1fr] md:items-start md:h-screen-s gap-8 md:gap-0 px-4 sm:px-6 md:px-0 w-full">
            <div className="relative z-10 min-w-0 w-full md:min-w-[320px] md:pl-[3vw] md:pr-10 overflow-x-visible md:overflow-x-auto" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
              <p className="font-mono text-label text-terminal uppercase">{intro.eyebrow}</p>
            </div>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 text-center">
              <p className="text-regolith/70">Nenhum projeto publicado ainda.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={rootRef} id="projects" aria-labelledby="projects-title" className="relative bg-void" style={{height: `${sectionHeight}svh`}}>
      <div className="sticky top-0 h-screen-s flex items-center justify-center pt-16 md:h-screen-s md:pt-0">
        <div className="grid md:grid-cols-[minmax(320px,50%)_1fr] md:items-start md:h-screen-s gap-8 md:gap-0 px-4 sm:px-6 md:px-0 w-full">
          <div className="relative z-10 min-w-0 w-full md:min-w-[320px] md:pl-[3vw] md:pr-10 overflow-x-visible md:overflow-x-auto" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            <p className="font-mono text-label text-terminal uppercase">{intro.eyebrow}</p>
            <div className="mt-8 flex items-center gap-4 font-mono text-label text-regolith/60 uppercase hidden md:flex" aria-hidden="true">
              <span>
                <span ref={countRef} className="text-white">01</span>{' '}
                / 0{projects.length}
              </span>
              <span className="relative h-px w-32 bg-white/15">
                <span ref={barRef} className="absolute inset-0 origin-left bg-terminal" style={{transform: 'scaleX(0)'}} />
              </span>
            </div>
          </div>

          <ol ref={trackRef} className="mt-8 flex gap-5 pl-4 will-change-transform sm:pl-6 md:mt-0 md:gap-7 md:pl-0">
            {projects.map((p, i) => (
              <li
                key={p.id ?? p.title}
                ref={(el) => { if (el) cardRefs.current[i] = el; }}
                className="w-[70vw] shrink-0 origin-bottom sm:w-[44vw] md:w-[clamp(16rem,24vw,23rem)]"
              >
                <article>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-void-2">
                    <img
                      ref={(el) => { if (el) imgRefs.current[i] = el; }}
                      src={p.image}
                      alt=""
                      width={800}
                      height={600}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== FALLBACK_IMAGE) {
                          target.src = FALLBACK_IMAGE;
                        }
                      }}
                      className="size-full object-cover will-change-transform"
                    />
                    {p.tag && (
                      <span className="absolute top-3 left-3 rounded-[3px] bg-void/70 px-2 py-1 font-mono text-[0.625rem] tracking-[0.14em] text-terminal uppercase backdrop-blur">
                        {p.tag}
                      </span>
                    )}
                  </div>
                  <footer className="mt-4 space-y-3">
                    <div className="flex gap-4">
                      <span className="font-mono text-label text-terminal">0{i + 1}</span>
                      <span>
                        <span className="block font-display text-[0.9375rem] tracking-[0.08em] text-white uppercase">{p.title}</span>
                        <span className="mt-1.5 block text-[0.875rem] leading-relaxed text-regolith/65">{p.body}</span>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {p.stack.map((s) => (
                        <span key={s} className="rounded-[3px] bg-white/5 px-2.5 py-1 font-mono text-[0.625rem] text-regolith/80">{s}</span>
                      ))}
                    </div>
                    {p.link && (
                      <a href={p.link} className="inline-flex items-center gap-1.5 font-mono text-label text-terminal uppercase hover:text-white transition-colors">
                        Ver projeto
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </a>
                    )}
                  </footer>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}