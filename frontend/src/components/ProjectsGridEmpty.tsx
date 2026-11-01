// src/components/ProjectsGridEmpty.tsx
export default function ProjectsGridEmpty() {
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