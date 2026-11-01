// src/components/ProjectsGridError.tsx
export default function ProjectsGridError() {
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