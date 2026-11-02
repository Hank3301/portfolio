import type {Project, Skill} from './services/api';

// ============================================
// Types (re-export from API)
// ============================================

export type {Project, Skill};

export const expertise = {
  eyebrow: 'Especialidades',
  heading: 'Três camadas da stack.',
  note: 'Anos desde 2023 — o aprendizado não para.',
  items: [] as any[],
};

// ============================================
// Static config (brand, nav, hero, contact UI)
// ============================================

export const brand = {
  name: 'Hugo Costa de Souza',
  handle: '@hugocostadesouza',
  email: 'hugo@email.com',
  github: 'https://github.com/hugocostadesouza',
  linkedin: 'https://linkedin.com/in/hugocostadesouza',
  twitter: 'https://twitter.com/hugocostadesouza',
};

export const nav = [
  {label: 'Projetos', href: '#projects'},
  {label: 'Especialidades', href: '#expertise'},
  {label: 'Contato', href: '#contact'},
  {label: 'Admin', href: '/admin', admin: true},
];

export const hero = {
  title: 'BACKEND DEVELOPER & CS STUDENT',
  subtitle: 'Automação • Bots • Agentes de IA',
  tagline: 'Construindo sistemas escaláveis que pensam.',
  location: 'Remoto • UTC-3',
};

export const intro = {
  eyebrow: 'Trabalhos selecionados',
  heading: 'Sistemas que rodam enquanto você dorme.',
  body: 'De APIs de alta vazão a agentes autônomos — projetos que mostram como lógica de backend vira alavanca de negócio.',
};

// ============================================
// Fallback data (used when API fails or during build)
// ============================================

export const fallbackProjects: Project[] = [
  {
    tag: 'API / Infra',
    title: 'Payment Gateway',
    body: 'Camada de transações distribuída processando 50k+ req/s com garantias de idempotência.',
    stack: ['Go', 'PostgreSQL', 'Kafka', 'k8s'],
    link: '#',
    image: '/media/cards/p1-gateway.svg',
  },
  {
    tag: 'Automação',
    title: 'Plataforma de Pipeline ETL',
    body: 'Pipelines de dados auto-recuperáveis com DAGs declarativas e rastreamento de linhagem.',
    stack: ['Python', 'Airflow', 'ClickHouse', 'Redis'],
    link: '#',
    image: '/media/cards/p2-etl.svg',
  },
  {
    tag: 'Bots',
    title: 'Framework de Trading Bot',
    body: 'Motor de estratégias orientado a eventos com backtesting, controles de risco e execução multi-venue.',
    stack: ['Rust', 'TimescaleDB', 'NATS', 'WebAssembly'],
    link: '#',
    image: '/media/cards/p3-trading.svg',
  },
  {
    tag: 'Agentes de IA',
    title: 'Orquestrador Multi-Agente',
    body: 'Supervisor baseado em LangGraph coordenando agentes especializados para geração de código.',
    stack: ['TypeScript', 'LangGraph', 'PostgreSQL', 'WebSocket'],
    link: '#',
    image: '/media/cards/p4-agents.svg',
  },
];

export const fallbackSkills: Skill[] = [
  {
    name: 'Engenharia de Backend',
    years: 2,
    lines: ['APIs de alta performance & throughput', 'Arquitetura de microsserviços', 'Bancos de dados & modelagem de dados'],
    cta: 'Aprofundar →',
  },
  {
    name: 'Automação',
    years: 3,
    lines: ['Orquestração de workflows', 'Arquitetura de pipelines de dados', 'Infraestrutura auto-recuperável'],
    cta: 'Aprofundar →',
    featured: true,
  },
  {
    name: 'Agentes de IA',
    years: 1,
    lines: ['Orquestração multi-agente', 'Desenvolvimento guiado por eval', 'Uso de ferramentas & sistemas de memória'],
    cta: 'Aprofundar →',
  },
];

export const contact = {
  eyebrow: 'Contato',
  heading: 'Aberto a estágios & posições júnior',
  body: 'Escolha uma trilha, mande seu contexto — respondo com uma proposta escopada.',
  window: '2025-01-01T00:00:00Z',
  windowLabel: 'Disponível para início imediato',
  tracks: [
    {value: 'consulting', label: 'Consultoria — Arquitetura & Estratégia'},
    {value: 'development', label: 'Desenvolvimento — Build & Ship'},
    {value: 'advisory', label: 'Advisory — Code Review & Mentoria'},
  ],
  form: {
    nameLabel: 'Nome',
    namePlaceholder: 'Seu nome completo',
    emailLabel: 'Email',
    emailPlaceholder: 'seu@email.com',
    trackLabel: 'Trilha',
    contextLabel: 'Contexto',
    contextPlaceholder: 'O que você está construindo? Restrições, prazo, stack...',
    submitLabel: 'Enviar solicitação',
    invalidMsg: 'Todos os campos são obrigatórios — seja conciso.',
    sentMsg: 'Seu app de email deve abrir com o rascunho. Se não: {email}.',
  },
};