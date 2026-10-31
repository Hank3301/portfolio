// src/components/ProjectsGrid.tsx
import { Suspense } from 'react';
import { fetchProjects } from '@/services/api';
import ProjectCard from './ProjectCard';

async function ProjectsGridContent() {
  try {
    const { items } = await fetchProjects({ page: 1, page_size: 12 });

    if (items.length === 0) {
      return (
        <div className="text-center py-12" role="status">
          <svg className="mx-auto h-12 w-12 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-zinc-300">Nenhum projeto visível</h3>
          <p className="mt-1 text-zinc-500">Projetos marcados como públicos aparecerão aqui.</p>
        </div>
      );
    }

    return (
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Projetos em destaque">
        {items.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            tech_stack={project.tech_stack}
            github_url={project.github_url}
            live_url={project.live_url}
          />
        ))}
      </ul>
    );
  } catch {
    return (
      <div className="text-center py-12" role="alert">
        <svg className="mx-auto h-12 w-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-zinc-300">Não foi possível carregar os projetos</h3>
        <p className="mt-1 text-zinc-500 max-w-md mx-auto">
          Tente novamente em instantes. O servidor pode estar acordando do modo hibernação (30–50s no plano gratuito do Render).
        </p>
      </div>
    );
  }
}

export default function ProjectsGrid() {
  return (
    <section id="projects" className="py-20 px-4 scroll-mt-20" aria-labelledby="projects-title">
      <div className="mx-auto max-w-7xl space-y-10">
        <header className="text-center">
          <h2 id="projects-title" className="text-3xl sm:text-4xl font-bold text-white">
            Projetos em Destaque
          </h2>
          <p className="mt-2 text-zinc-400 max-w-2xl mx-auto">
            Seleção de projetos públicos. Cada card mostra a stack tecnológica e links para código e demo.
          </p>
        </header>

        <Suspense fallback={<ProjectsGridSkeleton />}>
          <ProjectsGridContent />
        </Suspense>
      </div>
    </section>
  );
}

function ProjectsGridSkeleton() {
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