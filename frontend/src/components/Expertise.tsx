import {useQuery} from '@tanstack/react-query';
import {expertise, fallbackSkills} from '../content';
import {getSkills} from '../services/api';
import {useReveals} from '../hooks/useReveals';

export function Expertise() {
  const ref = useReveals<HTMLElement>();

  const {data: apiSkills} = useQuery({
    queryKey: ['skills'],
    queryFn: getSkills,
  });

  const skills = apiSkills ?? fallbackSkills;

  return (
    <section ref={ref} id="expertise" aria-labelledby="expertise-title" className="relative bg-void px-4 py-28 sm:px-6 md:px-[6vw] md:py-40">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between" data-reveal>
        <div>
          <p className="font-mono text-label text-terminal uppercase">{expertise.eyebrow}</p>
          <h2 id="expertise-title" className="mt-4 font-display text-display text-white">
            {expertise.heading}
          </h2>
        </div>
        <p className="font-mono text-label text-regolith/50 uppercase">{expertise.note}</p>
      </div>

      <ol className="mt-14 grid gap-4 md:mt-20 md:grid-cols-3 md:gap-5">
        {skills.map((e, i) => (
          <li
            key={e.id ?? e.name}
            data-reveal
            style={{transitionDelay: `${i * 110}ms`}}
            className={`group relative flex flex-col overflow-hidden rounded-[8px] p-6 ring-1 transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 md:p-8 ${
              e.featured ? 'bg-void-2 ring-terminal/60 hover:shadow-[0_30px_80px_-30px_rgb(0_255_136/0.35)]' : 'bg-void-2/60 ring-white/10 hover:ring-white/25'
            }`}
          >
            <svg aria-hidden="true" viewBox="0 0 200 200" className="absolute -top-10 -right-10 size-48 text-white/10 transition-transform duration-[1.2s] group-hover:rotate-45">
              {Array.from({length: Math.ceil(e.years / 2)}, (_, k) => (
                <ellipse key={k} cx="100" cy="100" rx={35 + k * 20} ry={16 + k * 9} fill="none" stroke="currentColor" transform={`rotate(${-15 + k * 12} 100 100)`} />
              ))}
              <circle cx="100" cy="100" r="8" fill="currentColor" />
            </svg>

            {e.featured && <span className="self-start rounded-[3px] bg-terminal px-2 py-1 font-mono text-[0.625rem] tracking-[0.14em] text-void uppercase">Core focus</span>}
            <h3 className={`font-display text-[1.25rem] tracking-[0.14em] text-white uppercase ${e.featured ? 'mt-5' : ''}`}>{e.name}</h3>
            <p className="mt-6 flex items-baseline gap-2">
              <span className="font-display text-[3.5rem] leading-none text-white">{e.years}</span>
              <span className="font-mono text-label text-regolith/60 uppercase">years</span>
            </p>
            <ul className="mt-8 space-y-2.5 border-t border-white/10 pt-6">
              {e.lines.map((l) => (
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