import type {Project, Skill} from './services/api';

// ============================================
// Types (re-export from API)
// ============================================

export type {Project, Skill};

export const expertise = {
  eyebrow: 'Especialidades',
  heading: 'Três camadas da stack.',
  note: '',
  items: [] as any[],
};

// ============================================
// Static config (brand, nav, hero, contact UI)
// ============================================

export const brand = {
  name: 'Hugo Costa de Souza',
  handle: '@Hank3301',
  email: 'hcosta547@gmail.com',
  github: 'https://github.com/Hank3301',
  linkedin: 'https://www.linkedin.com/in/hugo-costa-de-souza-4a7291292/',
};

export const nav = [
  {label: 'Projetos', href: '#projects'},
  {label: 'Especialidades', href: '#expertise'},
  {label: 'Contato', href: '#contact'},
];

export const hero = {
  title: 'DESENVOLVEDOR BACKEND',
  subtitle: 'Automação • Bots • Agentes de IA',
  tagline: '',
  location: '',
};

export const intro = {
  eyebrow: 'Projetos',
  heading: '',
  body: '',
};

// ============================================
// Fallback data removed — API is the only source
// ============================================

export const contact = {
  eyebrow: 'Contato',
  heading: '',
  body: '',
  window: '',
  windowLabel: '',
  tracks: [] as any[],
  form: {} as any,
};