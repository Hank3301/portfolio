import {z} from 'zod';
import {getProjectFallbackImage} from '../lib/images';

// ============================================
// Types (match FastAPI backend schemas)
// ============================================

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
  link: z.string().nullable(),
  liveUrl: z.string().nullable(),
  githubUrl: z.string().nullable(),
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

  static fromResponse(status: number, body: string): ApiError {
    let message = 'Erro na resposta da API';
    try {
      const parsed = JSON.parse(body);
      if (typeof parsed.detail === 'string') {
        message = parsed.detail;
      } else if (Array.isArray(parsed.detail)) {
        // FastAPI 422 validation errors: include field names from loc
        message = parsed.detail
          .map((e: {msg?: string; loc?: (string | number)[]; type?: string}) => {
            const field = Array.isArray(e.loc) ? e.loc.join('.') : '';
            const prefix = field ? `${field}: ` : '';
            return `${prefix}${e.msg ?? e.type ?? 'Erro de validação'}`;
          })
          .join('; ');
      } else if (parsed.message) {
        message = parsed.message;
      } else if (parsed.error) {
        message = parsed.error;
      }
    } catch {
      // Not JSON, use status text fallback
    }
    // 401 generic: don't override with login-specific message here.
    // loginAdmin uses fromResponse and the backend already returns "Usuário ou senha incorretos" in detail.
    return new ApiError('http', status, message);
  }
}

// ============================================
// API Client
// ============================================

const API_BASE = import.meta.env.VITE_API_URL || 'https://portfolio-api-hank.onrender.com/api';
const DEFAULT_TIMEOUT_MS = 60_000;

function buildHeaders(options?: RequestInit): Record<string, string> {
  const headers: Record<string, string> = {};
  const hasBody = options?.body != null && options?.body !== '';
  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }
  if (options?.headers) {
    Object.assign(headers, options.headers);
  }
  return headers;
}

async function parseJsonSafe<T>(res: Response): Promise<{success: boolean; data?: T; raw: string}> {
  const raw = await res.text().catch(() => '');
  try {
    const data = raw ? (JSON.parse(raw) as T) : (undefined as T);
    return {success: true, data, raw};
  } catch {
    return {success: false, raw};
  }
}

async function fetchWithTimeout<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    // Spread options FIRST, then override headers and signal so caller can customize
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: buildHeaders(options),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const {raw: body} = await parseJsonSafe(res);
      throw ApiError.fromResponse(res.status, body);
    }

    if (res.status === 204) return undefined as T;

    const {success, data, raw: _raw} = await parseJsonSafe<T>(res);
    if (!success) {
      throw new ApiError('format', res.status, 'Resposta não é JSON válido');
    }
    return data!;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof ApiError) throw err;
    throw ApiError.fromFetch(err);
  }
}

// ============================================
// Admin Token Helpers
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

// ============================================
// New API matching real backend contract
// ============================================

function mapApiProjectToUI(api: ApiProject): UIProject {
  // Always use local fallback image based on project ID
  const fallbackImage = getProjectFallbackImage(api.id);

  return {
    id: api.id,
    tag: api.tech_stack[0] ?? '',
    title: api.title,
    body: api.description,
    stack: api.tech_stack,
    link: api.live_url ?? api.github_url ?? null,
    liveUrl: api.live_url,
    githubUrl: api.github_url,
    image: fallbackImage,
  };
}

export async function listProjects(): Promise<{projects: UIProject[]; total: number}> {
  const response = await fetchWithTimeout<ProjectsResponse>(
    '/projects?page=1&page_size=100',
  );
  const parsed = ProjectsResponseSchema.safeParse(response);
  if (!parsed.success) {
    throw new ApiError('format', null, 'Formato de resposta inválido da API');
  }
  // total pode ser > 100; listProjects devolve a primeira página e o total real
  return {
    projects: parsed.data.items.map(mapApiProjectToUI),
    total: parsed.data.total,
  };
}

// Admin: fetch raw ApiProject data (with all fields including is_visible, description, etc.)
export async function listAdminProjects(): Promise<{projects: ApiProject[]; total: number}> {
  const response = await fetchWithTimeout<ProjectsResponse>(
    '/projects?page=1&page_size=100',
  );
  const parsed = ProjectsResponseSchema.safeParse(response);
  if (!parsed.success) {
    throw new ApiError('format', null, 'Formato de resposta inválido da API');
  }
  return {
    projects: parsed.data.items,
    total: parsed.data.total,
  };
}

export async function loginAdmin(username: string, password: string): Promise<TokenResponse> {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  // Reuse fetchWithTimeout; caller headers (form-urlencoded) override JSON
  const res = await fetchWithTimeout<TokenResponse>('/auth/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: formData.toString(),
  });

  // Validate with zod; fail if not matching TokenResponseSchema
  const parsed = TokenResponseSchema.safeParse(res);
  if (!parsed.success) {
    throw new ApiError('format', null, 'Resposta de login inválida');
  }
  setAdminToken(parsed.data.access_token);
  return parsed.data;
}

export async function getCurrentAdmin(): Promise<CurrentAdmin> {
  const token = getAdminToken();
  if (!token) {
    throw new ApiError('http', 401, 'Não autenticado');
  }
  const response = await fetchWithTimeout<CurrentAdmin>('/auth/me', {
    headers: {Authorization: `Bearer ${token}`},
  });
  const parsed = CurrentAdminSchema.safeParse(response);
  if (!parsed.success) {
    throw new ApiError('format', null, 'Formato de resposta /auth/me inválido');
  }
  return parsed.data;
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