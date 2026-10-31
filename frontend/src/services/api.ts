// src/services/api.ts

export interface Project {
  id: string; // UUID
  title: string;
  description: string;
  tech_stack: string[];
  github_url: string | null;
  live_url: string | null;
  is_visible: boolean;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

// Resposta paginada de GET /api/projects
export interface ProjectsResponse {
  items: Project[];
  total: number;
  page: number;
  page_size: number;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://portfolio-api-hank.onrender.com";

/** GET /api/projects: lista pública (somente projetos visíveis), paginada. */
export async function fetchProjects(params?: {
  page?: number;
  page_size?: number;
}): Promise<ProjectsResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page !== undefined) searchParams.set("page", String(params.page));
  if (params?.page_size !== undefined)
    searchParams.set("page_size", String(params.page_size));

  const query = searchParams.toString();
  const url = `${API_BASE_URL}/api/projects${query ? `?${query}` : ""}`;

  const response = await fetch(url, { next: { revalidate: 60 } });

  if (!response.ok) {
    throw new Error(`Erro ao buscar projetos: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/** GET /api/projects/{id} */
export async function fetchProjectById(id: string): Promise<Project> {
  const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    if (response.status === 404) throw new Error("Projeto não encontrado");
    throw new Error(`Erro ao buscar projeto: ${response.status} ${response.statusText}`);
  }

  return response.json();
}