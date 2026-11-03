import {z} from 'zod';

// ============================================
// Types (match FastAPI backend schemas)
// ============================================

// --- Legacy types (kept for existing components) ---
export const ProjectSchema = z.object({
  id: z.number().optional(),
  tag: z.string(),
  title: z.string(),
  body: z.string(),
  stack: z.array(z.string()),
  link: z.string(),
  image: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const SkillSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  years: z.number(),
  lines: z.array(z.string()),
  featured: z.boolean().optional(),
  cta: z.string().optional(),
});

export const ContactFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  track: z.string().min(1),
  context: z.string().min(1),
});

export const ContactResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

export const HealthSchema = z.object({
  status: z.string(),
  version: z.string().optional(),
});

export type Project = z.infer<typeof ProjectSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type ContactForm = z.infer<typeof ContactFormSchema>;
export type ContactResponse = z.infer<typeof ContactResponseSchema>;
export type Health = z.infer<typeof HealthSchema>;

// --- New types matching real backend contract ---
export const ApiProjectSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  tech_stack: z.array(z.string()).default([]),
  github_url: z.string().url().nullable(),
  live_url: z.string().url().nullable(),
  is_visible: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const ProjectsResponseSchema = z.object({
  items: z.array(ApiProjectSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  page_size: z.number().int().positive(),
});

export const AdminLoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const TokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string().default('bearer'),
});

export const CurrentAdminSchema = z.object({
  username: z.string(),
  message: z.string(),
});

export type ApiProject = z.infer<typeof ApiProjectSchema>;
export type ProjectsResponse = z.infer<typeof ProjectsResponseSchema>;
export type AdminLoginRequest = z.infer<typeof AdminLoginSchema>;
export type TokenResponse = z.infer<typeof TokenResponseSchema>;
export type CurrentAdmin = z.infer<typeof CurrentAdminSchema>;

// --- UI Project type (mapped from ApiProject) ---
export const UISchema = z.object({
  id: z.string(),
  tag: z.string(),
  title: z.string(),
  body: z.string(),
  stack: z.array(z.string()),
  link: z.string(),
  image: z.string(),
});

export type UIProject = z.infer<typeof UISchema>;

// ============================================
// Error types
// ============================================

export type ApiErrorKind = 'network' | 'timeout' | 'format' | 'http';

export class ApiError extends Error {
  constructor(
    public readonly kind: ApiErrorKind,
    public readonly status: number | null,
    message: string,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static fromFetch(err: unknown, status: number | null = null): ApiError {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return new ApiError('timeout', null, 'O servidor está acordando, tente de novo em instantes', err);
    }
    if (err instanceof TypeError && err.message.includes('fetch')) {
      return new ApiError('network', null, 'Erro de rede ao conectar com a API', err);
    }
    return new ApiError('http', status, 'Erro na resposta da API', err);
  }
}

// ============================================
// API Client
// ============================================

const API_BASE = import.meta.env.VITE_API_URL || 'https://portfolio-api-hank.onrender.com/api';
const DEFAULT_TIMEOUT_MS = 60_000;

async function fetchWithTimeout<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new ApiError('http', res.status, text || res.statusText);
    }

    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof ApiError) throw err;
    throw ApiError.fromFetch(err);
  }
}

// ============================================
// Legacy Public API (kept for existing components)
// ============================================

export async function getProjects(): Promise<Project[]> {
  return fetchWithTimeout<Project[]>('/projects');
}

export async function getSkills(): Promise<Skill[]> {
  return fetchWithTimeout<Skill[]>('/skills');
}

export async function getHealth(): Promise<Health> {
  return fetchWithTimeout<Health>('/health');
}

export async function submitContact(data: ContactForm): Promise<ContactResponse> {
  return fetchWithTimeout<ContactResponse>('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ============================================
// Legacy Admin API (kept for existing components)
// ============================================

let adminToken: string | null = null;

export function setAdminToken(token: string | null) {
  adminToken = token;
  if (token) {
    localStorage.setItem('admin_token', token);
  } else {
    localStorage.removeItem('admin_token');
  }
}

export function getAdminToken(): string | null {
  if (adminToken) return adminToken;
  return localStorage.getItem('admin_token');
}

function authHeaders(): Record<string, string> {
  const token = getAdminToken();
  return token ? {Authorization: `Bearer ${token}`} : {};
}

export async function adminLogin(password: string): Promise<{token: string}> {
  const res = await fetchWithTimeout<{token: string}>('/admin/login', {
    method: 'POST',
    body: JSON.stringify({password}),
  });
  setAdminToken(res.token);
  return res;
}

export async function adminLogout(): Promise<void> {
  setAdminToken(null);
}

export async function createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
  return fetchWithTimeout<Project>('/admin/projects', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function updateProject(id: number, data: Partial<Project>): Promise<Project> {
  return fetchWithTimeout<Project>(`/admin/projects/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function deleteProject(id: number): Promise<void> {
  await fetchWithTimeout<void>(`/admin/projects/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

export async function createSkill(data: Omit<Skill, 'id'>): Promise<Skill> {
  return fetchWithTimeout<Skill>('/admin/skills', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function updateSkill(id: number, data: Partial<Skill>): Promise<Skill> {
  return fetchWithTimeout<Skill>(`/admin/skills/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function deleteSkill(id: number): Promise<void> {
  await fetchWithTimeout<void>(`/admin/skills/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

// ============================================
// New API matching real backend contract
// ============================================

function mapApiProjectToUI(api: ApiProject): UIProject {
  return {
    id: api.id,
    tag: api.tech_stack[0] ?? 'outro',
    title: api.title,
    body: api.description,
    stack: api.tech_stack,
    link: api.live_url ?? api.github_url ?? '#',
    image: `/media/cards/m${((Math.abs(hashCode(api.id)) % 4) + 1)}.webp`,
  };
}

function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return h;
}

export async function listProjects(): Promise<{projects: UIProject[]; total: number}> {
  const response = await fetchWithTimeout<ProjectsResponse>(
    '/projects?page=1&page_size=100',
  );
  const parsed = ProjectsResponseSchema.safeParse(response);
  if (!parsed.success) {
    throw new ApiError('format', null, 'Formato de resposta inválido da API');
  }
  return {
    projects: parsed.data.items.map(mapApiProjectToUI),
    total: parsed.data.total,
  };
}

export async function loginAdmin(username: string, password: string): Promise<TokenResponse> {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new ApiError('http', res.status, text || 'Credenciais inválidas');
  }

  const data = TokenResponseSchema.parse(await res.json());
  setAdminToken(data.access_token);
  return data;
}

export async function getCurrentAdmin(): Promise<CurrentAdmin> {
  const token = getAdminToken();
  if (!token) {
    throw new ApiError('http', 401, 'Não autenticado');
  }

  return fetchWithTimeout<CurrentAdmin>('/auth/me', {
    headers: {Authorization: `Bearer ${token}`},
  });
}

export async function createProjectApi(data: {
  title: string;
  description: string;
  tech_stack: string[];
  github_url: string | null;
  live_url: string | null;
  is_visible: boolean;
}): Promise<ApiProject> {
  const token = getAdminToken();
  if (!token) throw new ApiError('http', 401, 'Não autenticado');

  return fetchWithTimeout<ApiProject>('/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function updateProjectApi(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    tech_stack: string[];
    github_url: string | null;
    live_url: string | null;
    is_visible: boolean;
  }>,
): Promise<ApiProject> {
  const token = getAdminToken();
  if (!token) throw new ApiError('http', 401, 'Não autenticado');

  return fetchWithTimeout<ApiProject>(`/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function deleteProjectApi(id: string): Promise<void> {
  const token = getAdminToken();
  if (!token) throw new ApiError('http', 401, 'Não autenticado');

  await fetchWithTimeout<void>(`/projects/${id}`, {
    method: 'DELETE',
    headers: {Authorization: `Bearer ${token}`},
  });
}