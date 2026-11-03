import {useEffect, useRef, useState} from 'react';
import {hero} from '../content';
import {useReducedMotion} from '../hooks/useReducedMotion';
import {useFitText} from '../hooks/useFitText';
import {easeOutCubic, lerp, pinProgress, range} from '../lib/math';
import {onFrame} from '../lib/scroll';

const STAGE_VH = 380;
const MOBILE_STAGE_VH = 120; // Reduced height for mobile

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLParagraphElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;
  const titleFit = useFitText<HTMLDivElement>();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvasRef.current!;
    const sync = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.round(c.clientWidth * dpr);
      c.height = Math.round(c.clientHeight * dpr);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(c);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let seed = 11;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const tokens = ['{', '}', '[', ']', '()', '=>', 'fn', 'struct', 'async', 'await', 'mut', 'ref', 'Box', 'Arc', 'Result', 'Option'];
    const particles = Array.from({length: 80}, () => ({
      x: rand(),
      y: rand(),
      token: tokens[Math.floor(rand() * tokens.length)],
      size: 0.5 + rand() * 0.8,
      speed: 0.15 + rand() * 0.35,
      opacity: 0.15 + rand() * 0.4,
    }));
    let lastTime = 0;

    return onFrame((time) => {
      const dt = lastTime ? Math.min(0.1, (time - lastTime) / 1000) : 1 / 60;
      lastTime = time;
      const root = rootRef.current;
      if (!root) return;
      const {p, rect} = pinProgress(root);
      if (rect.bottom < 0) return;

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const dpr = canvas.width / Math.max(1, w);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.font = `${12 * dpr}px "IBM Plex Mono", monospace`;
      ctx.fillStyle = '#00ff88';

      for (const pt of particles) {
        if (!reducedRef.current) {
          pt.y -= pt.speed * dt * 0.3;
          pt.x += (Math.sin(time * 0.001 + pt.y * 10) * 0.0005);
          if (pt.y < -0.1) pt.y = 1.1;
          if (pt.x < -0.1) pt.x = 1.1;
          if (pt.x > 1.1) pt.x = -0.1;
        }
        ctx.globalAlpha = pt.opacity * (1 - range(p, 0, 0.5));
        ctx.fillText(pt.token, pt.x * w, pt.y * h);
      }
      ctx.globalAlpha = 1;
    });
  }, []);

  useEffect(() => {
    let lastP = -1;
    return onFrame((_time) => {
      const root = rootRef.current;
      if (!root) return;
      const {p, rect} = pinProgress(root);
      if (rect.bottom < 0) return;
      if (Math.abs(p - lastP) < 0.00005) return;
      lastP = p;

      // Mobile: titles visible immediately, faster animation
      const tInStart = isMobile ? 0 : 0.05;
      const tInEnd = isMobile ? 0.1 : 0.25;
      const tOutStart = isMobile ? 0.8 : 0.45;
      const tOutEnd = isMobile ? 0.9 : 0.55;

      const tIn = easeOutCubic(range(p, tInStart, tInEnd));
      const tOut = range(p, tOutStart, tOutEnd);
      const title = titleFit.current!;
      title.style.opacity = String(tIn * (1 - tOut));
      title.style.transform = `translate3d(0, ${-p * (isMobile ? 4 : 8)}vh, 0)`;
      title.style.letterSpacing = `${lerp(0.5, 0.16, tIn)}em`;

      // Subtitle animation
      const subIn = easeOutCubic(range(p, isMobile ? 0.05 : 0.12, isMobile ? 0.15 : 0.35));
      subtitleRef.current!.style.opacity = String(subIn * (1 - tOut));
      subtitleRef.current!.style.transform = `translate3d(0, ${-p * (isMobile ? 3 : 6)}vh, 0)`;

      canvasRef.current!.style.opacity = String(1 - range(p, 0, 0.5));

      hudRef.current!.style.opacity = String(range(p, 0.05, 0.15) * (1 - range(p, 0.6, 0.7)));
      const secs = p * 5400;
      clockRef.current!.textContent = `UPTIME ${String(Math.floor(secs / 3600)).padStart(2, '0')}:${String(Math.floor((secs % 3600) / 60)).padStart(2, '0')}:${String(Math.floor(secs % 60)).padStart(2, '0')}`;
      statusRef.current!.textContent = range(p, 0.3, 0.6) > 0.5 ? 'PROCESSING' : 'IDLE';
    });
  }, [isMobile]);

  return (
    <section id="top" ref={rootRef} aria-label="Hero" className="relative" style={{height: `${isMobile ? MOBILE_STAGE_VH : STAGE_VH}svh`}}>
      <div className="sticky top-0 h-screen-s overflow-hidden bg-void">
        <div className="absolute inset-0" aria-hidden="true" style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} />
        <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div ref={titleFit} className="font-display text-hero text-white [text-shadow:0_4px_40px_rgba(0,255,136,0.3)] whitespace-nowrap" style={{marginRight: '-0.16em', opacity: isMobile ? 1 : 0}}>
            {hero.title}
          </div>
          <p ref={subtitleRef} className="mt-4 font-mono text-display text-terminal/90 uppercase tracking-[0.12em]" style={{opacity: isMobile ? 1 : 0}}>{hero.subtitle}</p>
        </div>
        <div ref={hudRef} aria-hidden="true" className="pointer-events-none absolute inset-4 font-mono text-[0.625rem] tracking-[0.14em] text-regolith/75 uppercase sm:inset-6 md:text-label" style={{opacity: isMobile ? 1 : 0}}>
          <div className="brackets absolute inset-0 text-regolith/40" />
          <div className="absolute top-16 left-3 space-y-1 md:top-20 md:left-4">
            <p ref={clockRef}>UPTIME 00:00:00</p>
            <p className="text-regolith/50">System clock</p>
          </div>
          <div className="absolute top-16 right-3 space-y-1 text-right md:top-20 md:right-4">
            <p>Status <span ref={statusRef} className="text-terminal">IDLE</span></p>
            <p className="text-regolith/50">Worker pool</p>
          </div>
          <div className="absolute right-3 bottom-3 flex items-center gap-2 md:right-4 md:bottom-4">
            Scroll <span className="inline-block animate-bounce motion-reduce:animate-none text-terminal">↓</span>
          </div>
        </div>
      </div>
    </section>
  );
}