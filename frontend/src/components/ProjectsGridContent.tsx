// src/components/ProjectsGridContent.tsx
// Server Component - async data fetching
import { fetchProjects } from '@/services/api';
import ProjectCard from './ProjectCard';
import ProjectsGridEmpty from './ProjectsGridEmpty';
import ProjectsGridError from './ProjectsGridError';

async function ProjectsGridContent() {
  let data: Awaited<ReturnType<typeof fetchProjects>> | null = null;
  try {
    data = await fetchProjects({ page: 1, page_size: 12 });
  } catch {
    data = null;
  }

  if (!data) return <ProjectsGridError />;
  if (data.items.length === 0) return <ProjectsGridEmpty />;

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Projetos em destaque">
      {data.items.map((project) => (
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
}

export default ProjectsGridContent;