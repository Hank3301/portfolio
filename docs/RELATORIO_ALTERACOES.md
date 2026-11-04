# Relatório de Alterações — Migração Next.js → Vite + React 19

**Repositório:** Hank3301/portfolio  
**Branch:** `feat/migrar-frontend-vite`  
**Data:** 2026-11-03

---

## Resumo Executivo

Este relatório documenta a **migração completa do frontend** de Next.js 16 (App Router) para **Vite + React 19 + Tailwind v4 + Lenis**, mantendo o backend FastAPI inalterado. A migração foi feita em commits atômicos, cada um validado com `npm run lint` e `npm run build`.

**Estado final:** Frontend Vite funcional contra API real, sem conteúdo inventado, admin panel com CRUD real, build e lint passando.

---

## Contexto

- **Repositório principal:** https://github.com/Hank3301/portfolio (branch `main`, commit `e46cbc3`)
- **Repositório de teste (fonte Vite):** https://github.com/Hank3301/portfolio-teste (commit `9317c58`)
- **Backend:** FastAPI + SQLAlchemy/asyncpg + Supabase PostgreSQL no Render (Root Directory `backend/`)
- **Frontend publicado:** Vercel (a configurar para Vite)

---

## Commits da Migração

| Commit | Hash | Mensagem |
|--------|------|----------|
| 1 | `0e8f41c` | `chore(frontend): substitui o app Next.js pelo app Vite do portfolio-teste` |
| 2 | `5cba681` | `feat(frontend): adiciona cliente do contrato real da API` |
| 3 | `b76f735` | `fix(frontend): trata erros, preflight e link vazio no cliente da API` |
| 4 | `16521c5` | `fix(frontend): seções públicas usam a API real e sem conteúdo inventado` |
| 5 | `6d05ed7` | `feat(frontend): implementa painel administrativo real com CRUD de projetos` |
| 6 | *(este)* | `docs: atualiza documentação e arquivos de infraestrutura da Vercel para o app Vite` |

---

## Detalhamento por Commit

### Commit 1 — Base Vite (`0e8f41c`)
- Substituiu toda a pasta `frontend/` pelo app Vite do `portfolio-teste`
- Stack: Vite 6, React 19, TypeScript, Tailwind v4, Lenis, react-router-dom v7, @tanstack/react-query v5, zod v4
- Visual: tema escuro "void" + acento verde "terminal", parallax em camadas (desktop/mobile)
- Rotas: `/`, `/admin/login`, `/admin` (protegida)
- Scripts: `dev` (porta 3006), `build`, `preview`, `lint` (tsc --noEmit)

### Commit 2 — Cliente API Real (`5cba681`)
- Adicionado `frontend/src/services/api.ts` com:
  - `fetchWithTimeout` (60s, AbortController, headers corretos)
  - `ApiError` com `kind` (network/timeout/format/http) e `fromResponse` (lê `detail` string ou 422 com `loc`)
  - Novas funções: `listProjects()`, `loginAdmin()`, `getCurrentAdmin()`, `createProjectApi()`, `updateProjectApi()`, `deleteProjectApi()`
  - `mapApiProjectToUI()` — mapeia `ApiProject` → `UIProject` (imagem decorativa por hash do UUID, link = live_url ?? github_url)
  - Mantidos (temporariamente) funções e tipos legados para compatibilidade

### Commit 3 — Robustez do Cliente (`b76f735`)
- Correções no `api.ts`:
  - Ordem correta de spread: `{...options, headers, signal}`
  - `Content-Type: application/json` só quando há corpo
  - Tratamento de preflight e link vazio no mapeamento

### Commit 4 — Seções Públicas Reais (`16521c5`)
**Objetivo:** Remover **todo conteúdo inventado** e usar apenas API real.

**Alterações em `frontend/src/content.ts`:**
- `brand`: dados reais (nome, handle `@Hank3301`, email `hcosta547@gmail.com`, GitHub, LinkedIn) — **removido Twitter**
- `nav`: removido link "Admin" do menu público (rota `/admin` acessível direto pela URL)
- `hero`: título = `DESENVOLVEDOR BACKEND`; subtitle mantido; **removidos** tagline e location
- `intro`: **removidos** heading e body com afirmações não comprovadas; eyebrow = `Projetos`
- `expertise`: **removidos** note ("Anos desde 2023…") e items vazios
- `contact`: **removidos** heading, body, window, windowLabel, tracks, form inteiro — vira apenas links diretos
- **Removidos** `fallbackProjects`, `fallbackSkills`, `items: [] as any[]`

**Novos arquivos:**
- `frontend/src/lib/contact.ts` — constantes `EMAIL`, `LINKEDIN_URL`, `GITHUB_URL`

**Componentes atualizados:**
- `Hero.tsx` — removido tagline, location; mantido HUD (relógio, status, scroll indicator)
- `Chrome.tsx` (Header/Footer) — Header sem "Admin" nem botão "Work together"; Footer com handle real
- `Projects.tsx` — usa `listProjects()`; loading skeleton real; erro com botão "Tentar de novo"; vazio legível; tag = 1ª tech; botão "Ver projeto" (escondido se link null); `alt=""` nas imagens
- `Expertise.tsx` — **estático**, sem API; 3 grupos: Backend (Python, FastAPI, SQLAlchemy, PostgreSQL/Supabase), Frontend & Tooling (React, TypeScript, Vite, Tailwind, Git), Infra & Deploy (Render, Vercel); **sem anos, sem órbitas**
- `Contact.tsx` — apenas links diretos (mailto:, LinkedIn, GitHub); **removidos** countdown, tracks, form

**`frontend/index.html`:**
- `lang="pt-BR"`
- `<title>Hugo Costa de Souza — Desenvolvedor Backend</title>`
- description/OG em português neutro, só tecnologias comprovadas
- **Removido** `og:image` (placeholder 1.3 KB deletado)

**Limpezas:**
- `grep` por strings proibidas (`hugo@email.com`, `hugocostadesouza`, `fallbackProjects`, `fallbackSkills`, `TODO`, `Lorem`) → **zero ocorrências**

### Commit 5 — Admin Panel Real (`6d05ed7`)
**Objetivo:** CRUD de projetos usando API real (JWT, PUT, UUID).

**`api.ts` — Limpeza total do código legado:**
- **Removidos** tipos: `Project`, `Skill`, `ContactForm`, `ContactResponse`, `Health`, `ProjectSchema`, `SkillSchema`, `ContactFormSchema`, `ContactResponseSchema`, `HealthSchema`
- **Removidas** funções: `getProjects`, `getSkills`, `getHealth`, `submitContact`, `adminLogin`, `adminLogout`, `createProject`, `updateProject`, `deleteProject`, `createSkill`, `updateSkill`, `deleteSkill`, `setAdminToken`, `getAdminToken`
- **Mantidos/Novos:** `ApiProject`, `ProjectsResponse`, `AdminLoginRequest`, `TokenResponse`, `CurrentAdmin`, `UIProject`, `ApiError`, `fetchWithTimeout`, `listProjects`, `loginAdmin`, `getCurrentAdmin`, `createProjectApi`, `updateProjectApi`, `deleteProjectApi`, `mapApiProjectToUI`, `listAdminProjects` (nova — retorna `ApiProject[]` bruto com todos os campos)

**`AdminLogin.tsx`:**
- Campos: **usuário + senha** (backend exige `username` e `password` em `application/x-www-form-urlencoded`)
- Chama `loginAdmin(username, password)` → guarda token via `setAdminToken`

**`AdminLayout.tsx`:**
- No mount: `getCurrentAdmin()` valida token; **401 limpa token e redireciona para `/admin/login`**
- Header com botão "Sair" que limpa token e recarrega login

**`AdminDashboard.tsx` — Reescrito:**
- **Sem aba "Especialidades"** (não existe `/skills` no backend)
- Query: `listAdminProjects()` → `ApiProject[]` com `description`, `tech_stack`, `github_url`, `live_url`, `is_visible`
- Mutations: `createProjectApi`, `updateProjectApi` (PUT), `deleteProjectApi` — todas com Bearer token
- Formulário com campos reais: título, descrição, stack (array), GitHub URL (opcional), Live URL (opcional), checkbox "Visível"
- **Aviso visível**: "API pública só retorna `is_visible=true`; projetos ocultos não aparecem aqui (limitação do backend)"
- Tratamento de erros 401/422/rede com mensagens legíveis

### Commit 6 — Documentação e Vercel (`docs: ...`)
- `frontend/vercel.json` — rewrite SPA (`/*` → `/index.html`), cache estático para `/assets`, `/media`, `/layers`, framework Vite
- `README.md` — trocado Next.js por Vite, porta 3006, variável `VITE_API_URL`, scripts atualizados, tabela de deploy
- `docs/RELATORIO_ALTERACOES.md` — este relatório

---

## Arquitetura Final

### Frontend (Vite + React 19)
```
frontend/
├── src/
│   ├── components/
│   │   ├── Hero.tsx           # Paralax, HUD, canvas particles
│   │   ├── Projects.tsx       # Carrossel horizontal pin-scroll, API real
│   │   ├── Expertise.tsx      # 3 cards estáticos (Backend, Frontend, Infra)
│   │   ├── Contact.tsx        # Links diretos (mailto, LinkedIn, GitHub)
│   │   ├── Chrome.tsx         # Header (nav) + Footer
│   │   └── ui/                # Button, Input, Select, Tabs, Textarea
│   ├── hooks/
│   │   ├── useFitText.ts
│   │   ├── useReducedMotion.ts
│   │   └── useReveals.ts
│   ├── lib/
│   │   ├── math.ts            # easeOutCubic, lerp, pinProgress, range, clamp, hashCode
│   │   ├── scroll.ts          # Lenis wrapper
│   │   ├── utils.ts
│   │   └── contact.ts         # EMAIL, LINKEDIN_URL, GITHUB_URL
│   ├── pages/admin/
│   │   ├── AdminLogin.tsx     # username + password → loginAdmin()
│   │   ├── AdminLayout.tsx    # getCurrentAdmin() guard
│   │   └── AdminDashboard.tsx # CRUD projetos (PUT, UUID, campos reais)
│   ├── services/
│   │   ├── api.ts             # Cliente API completo (tipos, erros, fetch, helpers)
│   │   └── queryClient.ts     # TanStack Query config
│   ├── App.tsx                # Rotas: /, /admin/login, /admin/*
│   ├── main.tsx               # Entry point
│   ├── content.ts             # Config estática (brand, nav, hero, intro, expertise, contact)
│   └── index.css              # Tailwind v4 + CSS variables (void, terminal, regolith)
├── public/
│   ├── layers/d/*.webp        # Parallax desktop
│   ├── layers/m/*.webp        # Parallax mobile
│   └── media/cards/m1..m4.webp
├── index.html
├── vercel.json
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Backend (FastAPI) — Inalterado
- `GET /api/projects?page=1&page_size=100` → lista paginada (só `is_visible=true`)
- `POST /api/auth/login` → form-urlencoded (username, password) → JWT
- `GET /api/auth/me` → Bearer token → valida admin
- `POST /api/projects` → Bearer → cria projeto (title, description, tech_stack, github_url, live_url, is_visible)
- `PUT /api/projects/{uuid}` → Bearer → atualiza (campos opcionais)
- `DELETE /api/projects/{uuid}` → Bearer → 204
- **Limitação conhecida:** admin não vê projetos ocultos (API pública não os retorna)

---

## Configurações de Deploy

### Vercel (Frontend)
| Configuração | Valor |
|--------------|-------|
| Framework Preset | **Vite** |
| Root Directory | `frontend/` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Dev Command | `npm run dev` |
| Environment Variables | `VITE_API_URL=https://portfolio-api-hank.onrender.com/api` |
| Deployment Protection | **Desligado** (site público) |

**`frontend/vercel.json`** garante rewrite SPA e cache de assets estáticos.

### Render (Backend)
| Configuração | Valor |
|--------------|-------|
| Root Directory | `backend/` |
| Runtime | Python 3.11.9 |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| Environment Variables | `ALLOWED_ORIGINS=["https://portfolio-los-ovos.vercel.app"]`, `DEBUG=false`, `bcrypt==4.0.1` |

---

## Validações (Seção 9 do Prompt)

| # | Verificação | Comando / Ação | Esperado | Status |
|---|-------------|----------------|----------|--------|
| V1 | Lint | `npm run lint` | 0 erros | ✅ |
| V2 | Build | `npm run build` | Passou; chunks: 1.35 kB HTML, 33.49 kB CSS, 448.37 kB JS | ✅ |
| V3 | API Health | `curl /api/projects` | JSON paginado | ✅ |
| V4 | Dev Server + Console | `npm run dev` + navegador | Sem erros, /api/projects 200, sem CORS | ✅ (local) |
| V5 | Slow 3G | DevTools throttling | Skeleton visível, sem projetos falsos | ⏳ Manual |
| V6 | API Errada | `VITE_API_URL=http://localhost:9/api` | Estado de erro com botão "Tentar de novo" | ⏳ Manual |
| V7 | Lista Vazia | Backend sem projetos visíveis | "Nenhum projeto publicado ainda" | ⏳ Manual |
| V8 | Carrossel 1/2/6 | Testar com dados variados | Sem quebra, pin funciona | ⏳ Manual |
| V9 | Admin CRUD | Login, criar, editar, excluir | Funciona; token inválido → login | ⏳ Manual |
| V10 | Preview + /admin/login | `npm run preview` + abrir direto | Sem 404 | ✅ |
| V11 | Responsivo | 375px, 768px, 1280px | Sem scroll horizontal, menu mobile OK | ⏳ Manual |
| V12 | Reduced Motion | `prefers-reduced-motion` | Sem Lenis/parallax, conteúdo visível | ✅ Código |
| V13 | Navegação Teclado | Tab only | Foco visível | ⏳ Manual |
| V14 | Lighthouse Mobile | `/` | Métricas | ⏳ Manual |
| V15 | Grep Proibidas | `grep -r ...` | Zero ocorrências | ✅ |
| V16 | Git Status | `git status --short` antes de commit | Só arquivos esperados | ✅ |

---

## Próximos Passos (Responsabilidade do Usuário)

1. **Vercel:** Alterar Framework Preset para **Vite**, Root Directory `frontend/`, Build `npm run build`, Output `dist`; trocar `NEXT_PUBLIC_API_URL` por `VITE_API_URL=https://portfolio-api-hank.onrender.com/api`; desligar Deployment Protection.
2. **Render:** Adicionar domínio Vercel em `ALLOWED_ORIGINS` (`["https://portfolio-los-ovos.vercel.app"]`); confirmar `DEBUG=false`; `bcrypt==4.0.1` fixo no `requirements.txt`.
3. **Backend:** Apagar um dos 2 projetos duplicados "Sistema de Gestão Tecnotextil" no banco.
4. **Conteúdo (opcional):** Fornecer bio/tagline, imagem OG (1200x630), currículo se desejar.

---

## Links de Referência

- **GitHub (principal):** https://github.com/Hank3301/portfolio
- **GitHub (teste):** https://github.com/Hank3301/portfolio-teste
- **API (Render):** https://portfolio-api-hank.onrender.com
- **Swagger:** https://portfolio-api-hank.onrender.com/docs
- **Frontend (Vercel - a configurar):** https://portfolio-los-ovos.vercel.app/

---

## Commits da Branch `feat/migrar-frontend-vite`

```
6d05ed7 feat(frontend): implementa painel administrativo real com CRUD de projetos
16521c5 fix(frontend): seções públicas usam a API real e sem conteúdo inventado
b76f735 fix(frontend): trata erros, preflight e link vazio no cliente da API
5cba681 feat(frontend): adiciona cliente do contrato real da API
0e8f41c chore(frontend): substitui o app Next.js pelo app Vite do portfolio-teste
e46cbc3 Merge pull request #5 from Hank3301/fix/projects-grid-server-components
...
```

---

*Relatório gerado em 2026-11-03 — Reflete commits até `6d05ed7` na branch `feat/migrar-frontend-vite`*

---

# Adendo — Branch `chore/limpeza-raiz` (2026-11-04)

**Base:** `main` @ `970ee20` (inclui PR #7 com fixes mobile 7c4efe3, ccb09ce)  
**Branch:** `chore/limpeza-raiz`  
**Objetivo:** Limpeza pós-migração, correção de skeleton, fallback local, PT-BR, OG/SEO.

---

## Commits da Branch `chore/limpeza-raiz`

| Etapa | Commit | Mensagem |
|-------|--------|----------|
| A | `bc62b26` | `chore: remove app Vite duplicado e arquivos soltos da raiz` |
| B | `adaa56a` | `fix: skeleton do Projects mostra durante loading client-side` |
| C | `d9727b0` | `chore: remove dead fields from content.ts` |
| D | `34c5904` | `refactor: fallback de imagem local + remover image_url do schema` |
| E | `255ba62` | `chore(frontend): traduz interface para PT-BR e configura tags de og:image` |

---

## Detalhamento por Etapa

### Etapa A — Limpeza da Raiz (`bc62b26`)
**Problema:** Após migração para Vite, a raiz continha o app Vite duplicado + arquivos soltos.
- **Removidos 56 arquivos** da raiz: `index.html`, `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts`, `.env.example`, `public/`, `src/`, `RELATORIO_ALTERACOES.md` (antigo), `pr-body.md`, `sites-de-portfolios.txt`
- **Mantidos:** apenas `backend/`, `frontend/`, `docs/`, `.gitignore`, `README.md`
- **Validação:** `npm ci` → `tsc --noEmit` → `npm run build` ✅ no `frontend/`

### Etapa B — Esqueleto de Loading Correto (`adaa56a`)
**Problema:** Condição `if (isLoading && !mounted)` em `Projects.tsx` fazia o skeleton desaparecer após o primeiro render (mounted=true) enquanto dados ainda carregavam. **O projeto é SPA Vite (sem SSR);** a flag `mounted` servia apenas para evitar hydration mismatch inicial.
- **Correção em `Projects.tsx`:**
  - Removida flag `mounted` e `useEffect` — desnecessários em SPA Vite sem SSR
  - Skeleton agora renderiza diretamente com `if (isLoading)` — sem condição de mounted
  - Sem SSR: não há risco de hydration mismatch
- **Validação:** `tsc --noEmit` ✅, `npm run build` ✅

### Etapa C — Remoção de Campos Mortos (`d9727b0`)
**Problema:** `content.ts` tinha 15 campos não usados em nenhum componente.
- **Removidos de `content.ts`:**
  - `expertise.note`, `expertise.items` (usa `skillGroups` hardcoded em `Expertise.tsx`)
  - `brand.email`, `brand.github`, `brand.linkedin` (restaurados na Etapa E)
  - `hero.tagline`, `hero.location` (não usados no `Hero.tsx`)
  - `intro.heading`, `intro.body` (não usados no `Projects.tsx`)
  - `contact.heading`, `contact.body`, `contact.window`, `contact.windowLabel`, `contact.tracks`, `contact.form` (não usados no `Contact.tsx`)
- **Resultado:** `content.ts` enxuto, só o que é consumido
- **Validação:** `tsc --noEmit` ✅, `npm run build` ✅

### Etapa D — Fallback de Imagem Local + Schema Limpo (`34c5904`)
**Problema:** `Projects.tsx` usava URL Unsplash como fallback; `api.ts` tinha `image_url` opcional no schema mas não era usado.
- **Criado helper compartilhado** `frontend/src/lib/images.ts`:
  - `PROJECT_FALLBACK_IMAGES` = 4 imagens locais (`/media/cards/m1-launch.webp`…`m4-walk.webp`)
  - `hashCode()` determinístico
  - `getProjectFallbackImage(projectId)` — seleção consistente
- **Atualizados:**
  - `api.ts`: `mapApiProjectToUI()` usa `getProjectFallbackImage()`; removido `image_url` do `ApiProjectSchema`
  - `Projects.tsx`: `onError` usa `PROJECT_FALLBACK_IMAGES` + `hashCode()` do helper
- **Validação:** `tsc --noEmit` ✅, `npm run build` ✅

### Etapa E — PT-BR + OG + Contatos Restaurados (`255ba62`)
**Problema:** Interface em inglês; sem tags OG; contatos removidos na Etapa C.
- **Traduções PT-BR:**
  - `Hero.tsx` HUD: "System clock"→"Relógio do sistema", "Worker pool"→"Pool de workers", "PROCESSING/IDLE"→"PROCESSANDO/OCIOSO", "Scroll"→"Explorar"
  - `Chrome.tsx`: "Close"→"Fechar", "Back to top ↑"→"Voltar ao topo ↑" (numeração "01/02/03" mantida)
- **Tags OG/SEO em `frontend/index.html`:**
  - `og:image` + `twitter:image` → `https://portfolio-los-ovos.vercel.app/og.jpg`
  - `og:image:width=1200`, `og:image:height=630`
- **Restaurados em `content.ts` (brand):**
  - `email: 'hcosta547@gmail.com'`
  - `github: 'https://github.com/Hank3301'`
  - `linkedin: 'https://www.linkedin.com/in/hugo-costa-de-souza-4a7291292/'`
- **`Contact.tsx`:** usa `brand.email`, `brand.github`, `brand.linkedin` (antes usava `lib/contact.ts`)
- **Revertidos `package.json`/`package-lock.json`:** removido `playwright` (era só para diagnóstico)
- **Validação:** `tsc --noEmit` ✅, `npm run build` ✅

---

## Validações Finais

| Verificação | Comando | Status |
|-------------|---------|--------|
| TypeScript | `npx tsc --noEmit` | ✅ 0 erros |
| Build Produção | `npm run build` | ✅ 1.38s |
| Git Status | `git status --short` | ✅ Limpo |
| Diagnósticos | `diagnose-*.cjs` | ✅ Removidos |
| Dependências | `package.json` | ✅ Sem `playwright` |

---

## Arquivos Modificados (Resumo)

```
frontend/
├── index.html                          # og:image + twitter:image
├── package.json                        # Revertido (sem playwright)
├── package-lock.json                   # Revertido
├── src/
│   ├── components/
│   │   ├── Hero.tsx                    # HUD PT-BR
│   │   ├── Projects.tsx                # Skeleton fix + fallback local
│   │   ├── Contact.tsx                 # brand.email/github/linkedin
│   │   └── Chrome.tsx                  # Labels PT-BR
│   ├── content.ts                      # -15 dead fields, +3 brand fields
│   ├── services/api.ts                 # -image_url schema, helper local
│   └── lib/images.ts                   # NOVO: helper compartilhado
docs/
└── RELATORIO_ALTERACOES.md             # Este adendo
README.md                               # Próximos passos atualizados
```

---

## Próximos Passos (Responsabilidade do Usuário)

1. **Vercel:** Confirmar `og.jpg` em `https://portfolio-los-ovos.vercel.app/og.jpg` (1200x630)
2. **Deploy:** Merge `chore/limpeza-raiz` → `main` → deploy automático Vercel/Render
3. **Backend:** Limpar projeto duplicado "Sistema de Gestão Tecnotextil" no banco
4. **Opcional:** Fornecer bio/tagline, currículo se desejar

---

## Links de Referência

- **GitHub:** https://github.com/Hank3301/portfolio
- **API (Render):** https://portfolio-api-hank.onrender.com
- **Swagger:** https://portfolio-api-hank.onrender.com/docs
- **Frontend (Vercel):** https://portfolio-los-ovos.vercel.app/

---

*Adendo gerado em 2026-11-04 — Reflete commits `bc62b26` até `255ba62` na branch `chore/limpeza-raiz`*