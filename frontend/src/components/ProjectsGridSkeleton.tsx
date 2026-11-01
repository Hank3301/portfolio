// src/components/ProjectsGridSkeleton.tsx
export default function ProjectsGridSkeleton() {
  return (
    <div className="space-y-10" aria-busy="true" aria-label="Carregando projetos">
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Projetos em destaque (carregando)">
        {[...Array(6)].map((_, i) => (
          <li key={i} className="animate-pulse space-y-4 p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
            <div className="h-6 w-3/4 bg-zinc-800 rounded" />
            <div className="h-4 w-full bg-zinc-800 rounded" />
            <div className="h-4 w-2/3 bg-zinc-800 rounded mt-2" />
            <ul className="flex gap-2 flex-wrap">
              {[...Array(4)].map((_, j) => (
                <li key={j}><span className="block h-6 w-16 bg-zinc-800 rounded-full" /></li>
              ))}
            </ul>
            <div className="flex gap-3 pt-4 border-t border-zinc-800">
              <div className="h-10 w-24 bg-zinc-800 rounded-lg" />
              <div className="h-10 w-24 bg-zinc-800 rounded-lg" />
            </div>
          </li>
        ))}
      </ul>
      <div className="text-center text-sm text-zinc-500 pt-4 border-t border-zinc-800 animate-pulse">
        <p>O servidor está acordando, pode levar de 30 a 50 segundos…</p>
      </div>
    </div>
  );
}