// src/components/ProjectsGrid.tsx
'use client';

import { Suspense } from 'react';
import ProjectsGridContent from './ProjectsGridContent';
import ProjectsGridSkeleton from './ProjectsGridSkeleton';
import { ProjectsErrorBoundary } from './ProjectsErrorBoundary';
import ProjectsGridError from './ProjectsGridError';

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
          <ProjectsErrorBoundary fallback={<ProjectsGridError />}>
            <ProjectsGridContent />
          </ProjectsErrorBoundary>
        </Suspense>
      </div>
    </section>
  );
}