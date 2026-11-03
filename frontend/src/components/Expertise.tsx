import {expertise} from '../content';
import {useReveals} from '../hooks/useReveals';

const skillGroups = [
  {
    name: 'BACKEND',
    lines: [
      'Python',
      'FastAPI',
      'SQLAlchemy',
      'PostgreSQL / Supabase',
    ],
  },
  {
    name: 'FRONTEND & TOOLING',
    lines: [
      'React',
      'TypeScript',
      'Vite',
      'Tailwind',
      'Git',
    ],
  },
  {
    name: 'INFRA & DEPLOY',
    lines: [
      'Render',
      'Vercel',
    ],
  },
];

export function Expertise() {
  const ref = useReveals<HTMLElement>();

  return (
    <section ref={ref} id="expertise" aria-labelledby="expertise-title" className="relative bg-void px-4 py-28 sm:px-6 md:px-[6vw] md:py-40">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between" data-reveal>
        <div>
          <p className="font-mono text-label text-terminal uppercase">{expertise.eyebrow}</p>
          <h2 id="expertise-title" className="mt-4 font-display text-display text-white">
            {expertise.heading}
          </h2>
        </div>
      </div>

      <ol className="mt-14 grid gap-4 md:mt-20 md:grid-cols-3 md:gap-5">
        {skillGroups.map((group, i) => (
          <li
            key={group.name}
            data-reveal
            style={{transitionDelay: `${i * 110}ms`}}
            className="group relative flex flex-col overflow-hidden rounded-[8px] p-6 ring-1 transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 md:p-8 bg-void-2/60 ring-white/10 hover:ring-white/25"
          >
            <h3 className="font-display text-[1.25rem] tracking-[0.14em] text-white uppercase">{group.name}</h3>
            <ul className="mt-8 space-y-2.5 border-t border-white/10 pt-6">
              {group.lines.map((l) => (
                <li key={l} className="flex gap-3 text-[0.9375rem] text-regolith/80">
                  <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-terminal" />
                  {l}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}