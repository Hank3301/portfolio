// src/components/ProjectCard.tsx
interface ProjectCardProps {
  title: string;
  description: string;
  tech_stack: string[];
  github_url: string | null;
  live_url: string | null;
}

export default function ProjectCard({
  title,
  description,
  tech_stack,
  github_url,
  live_url,
}: ProjectCardProps) {
  return (
    <li className="group relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-indigo-500/30 hover:bg-zinc-900 transition-all duration-300 flex flex-col h-full">
      {/* Title */}
      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="text-zinc-300 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
        {description}
      </p>

      {/* Tech Stack - ul/li semânticos */}
      <ul className="flex flex-wrap gap-2 mb-4" aria-label="Tecnologias utilizadas">
        {tech_stack.map((tech) => (
          <li key={tech}>
            <span className="px-2.5 py-1 text-xs font-medium bg-indigo-500/10 text-indigo-300 rounded-full border border-indigo-500/20">
              {tech}
            </span>
          </li>
        ))}
      </ul>

      {/* Links */}
      <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
        {github_url && (
          <a
            href={github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-indigo-400 transition-colors group"
            aria-label={`Ver código no GitHub: ${title}`}
          >
            <svg className="h-5 w-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            <span>Código</span>
          </a>
        )}
        {live_url && (
          <a
            href={live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-indigo-400 transition-colors group"
            aria-label={`Ver demo ao vivo: ${title}`}
          >
            <svg className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>Demo</span>
          </a>
        )}
      </div>
    </li>
  );
}