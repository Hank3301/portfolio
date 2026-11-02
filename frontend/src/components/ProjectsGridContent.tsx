// src/components/ProjectsGridContent.tsx
// Server Component - async data fetching
import { fetchProjects } from '@/services/api';
import HorizontalProjectsCarousel from './HorizontalProjectsCarousel';
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

  return <HorizontalProjectsCarousel projects={data.items} />;
}

export default ProjectsGridContent;