import {z} from 'zod';

// ============================================
// Types (match FastAPI backend schemas)
// ============================================

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

// ============================================
// API Client
// ============================================

const API_BASE = import.meta.env.VITE_API_URL || 'https://portfolio-api-hank.onrender.com/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new ApiError(res.status, text || res.statusText);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ============================================
// Public API (no auth)
// ============================================

export async function getProjects(): Promise<Project[]> {
  return fetchJson<Project[]>('/projects');
}

export async function getSkills(): Promise<Skill[]> {
  return fetchJson<Skill[]>('/skills');
}

export async function getHealth(): Promise<Health> {
  return fetchJson<Health>('/health');
}

export async function submitContact(data: ContactForm): Promise<ContactResponse> {
  return fetchJson<ContactResponse>('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ============================================
// Admin API (requires auth)
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
  const res = await fetchJson<{token: string}>('/admin/login', {
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
  return fetchJson<Project>('/admin/projects', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function updateProject(id: number, data: Partial<Project>): Promise<Project> {
  return fetchJson<Project>(`/admin/projects/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function deleteProject(id: number): Promise<void> {
  await fetchJson<void>(`/admin/projects/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

export async function createSkill(data: Omit<Skill, 'id'>): Promise<Skill> {
  return fetchJson<Skill>('/admin/skills', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function updateSkill(id: number, data: Partial<Skill>): Promise<Skill> {
  return fetchJson<Skill>(`/admin/skills/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function deleteSkill(id: number): Promise<void> {
  await fetchJson<void>(`/admin/skills/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}