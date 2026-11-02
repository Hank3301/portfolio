// src/components/ProjectsGrid.tsx
import { Suspense } from 'react';
import { ScrollReveal } from '@/components/ScrollReveal';
import ProjectsGridContent from './ProjectsGridContent';
import ProjectsGridSkeleton from './ProjectsGridSkeleton';

export default function ProjectsGrid() {
  return (
    <section id="projects" className="py-20 px-4 scroll-mt-20" aria-labelledby="projects-title">
      <div className="mx-auto max-w-7xl space-y-10">
        <ScrollReveal delay={0.1} direction="up">
          <header className="text-center">
            <h2 id="projects-title" className="text-3xl sm:text-4xl font-bold text-white">
              Projetos em Destaque
            </h2>
            <p className="mt-2 text-zinc-400 max-w-2xl mx-auto">
              Seleção de projetos públicos. Cada card mostra a stack tecnológica e links para código e demo.
            </p>
          </header>
        </ScrollReveal>

        <ScrollReveal delay={0.2} direction="up">
          <Suspense fallback={<ProjectsGridSkeleton />}>
            <ProjectsGridContent />
          </Suspense>
        </ScrollReveal>
      </div>
    </section>
  );
}