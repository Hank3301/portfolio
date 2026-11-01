# Relatório de Alterações — Correções Pós-Revisão + UI Polish + Deploy Fixes

**Repositório:** Hank3301/portfolio  
**Branch:** `main`  
**Data:** 2026-11-01

---

## Resumo Executivo

Este relatório documenta **todas as correções aplicadas** após revisão externa do repositório + melhorias de UI/UX + fixes de deploy. As correções seguem a ordem de prioridade definida no arquivo `prompt-correcoes-portfolio.md` (Itens 1–5) + issues de produção (CORS, pgbouncer) + UI Polish.

**Estado final: Tudo concluído ✅** — Landing Page 100%, CORS configurado, pgbouncer fixado, UI moderna com theme toggle + scroll animations + RGB accents, deploy Vercel + Render funcionando.

---

## Item 1 — [CRÍTICO] ProjectsGrid: Arquitetura Server/Client Components Corrigida ✅

**Commits:** `f74faa4` + `80b0ce1` (merge PR #3)

### Problema Original
- `ProjectsGrid.tsx` tinha `'use client'` e importava `ProjectsGridContent.tsx` (função `async`)
- Componentes `async` não são suportados no cliente → erro "async Client Component" em produção
- `ProjectsErrorBoundary` (class component) capturava erro e mostrava sempre aviso amarelo
- Fetch rodava no navegador → CORS bloqueava (backend só libera `localhost:3000` em `ALLOWED_ORIGINS`)
- `revalidate` era ignorado no cliente
- 6 warnings ESLint `react-hooks/error-boundaries` (JSX dentro de try/catch)

### Correção Aplicada
| Arquivo | Ação | Tipo Final |
|---------|------|------------|
| `ProjectsGrid.tsx` | Remove `'use client'`, vira Client apenas para Suspense/ScrollReveal | **Client Component** (`'use client'`) |
| `ProjectsGridContent.tsx` | Try/catch **apenas no fetch**, JSX fora do try | **Server Component (async)** |
| `ProjectsErrorBoundary.tsx` | **REMOVIDO** (não necessário) | — |
| `ProjectsGridError.tsx` | Remove `'use client'` | **Server Component** |
| `ProjectsGridSkeleton.tsx` | Mantido como fallback do `Suspense` | **Server Component** |
| `ProjectsGridEmpty.tsx` | Mantido | **Server Component** |

### Padrão Next.js 16 Adotado
- Server Component faz `fetch` assíncrono e retorna dados ou lança erro
- Client Component usa `Suspense` + fallback skeleton para loading
- **Zero JSX dentro de `try/catch`** → ESLint limpo

### Validações
- **V3 (ESLint):** 0 erros, 0 warnings ✅
- **V4 (Build):** Compiled successfully, 4 static pages (○ `/`) ✅
- **V5 (Dev Server):** localhost:3000 renderiza corretamente ✅

---

## Item 2 — [ALTO] Contato Centralizado e Duplicatas Removidas ✅

**Commit:** `e9b6ed6` — "fix: Item 2 — centraliza contato, remove condicionais TODO e card duplicado"

### Correção Aplicada
| Arquivo | Ação |
|---------|------|
| `frontend/src/lib/contact.ts` | **CRIADO** — Fonte única: `EMAIL`, `LINKEDIN_URL`, `GITHUB_URL` |
| `page.tsx` | Importa de `@/lib/contact`, remove condicionais `TODO`, mostra todos os 3 links |
| `AboutContact.tsx` | Importa de `@/lib/contact`, remove card "Vamos conversar?" do `<aside>`, remove comentários obsoletos |

### Validações
- **V3 (ESLint):** 0 erros, 3 warnings (unused vars em `AboutContact` — importadas mas não usadas após remoção do card) ✅
- **V4 (Build):** Compiled successfully ✅
- **V5 (Dev Server):** Uma única ocorrência de "Vamos conversar?" (footer CTA do `page.tsx`) ✅
- **V7 (grep TODO):** Nenhuma ocorrência de `"TODO"` em constantes de contato ✅

---

## Item 3 — [ALTO] Conteúdo Inventado e Inconsistente Removido ✅

**Commits:** múltiplos (confirmados com usuário)

| Arquivo | Ação |
|---------|------|
| `Skills.tsx` | **Removidos 4 cards** de estatística ("Anos 3+", "Projetos 10+", "Techs 15+", "Foco") |
| `Skills.tsx` / `AboutContact.tsx` | **Removido badge "Docker"** (não há Dockerfile no repo) |
| `AboutContact.tsx` | **Reescrita bio** só com o que o repo comprova (FastAPI, SQLAlchemy, PostgreSQL/Supabase, Next.js, TypeScript, Tailwind, deploy Render) |
| `AboutContact.tsx` | **Removido card "Disponibilidade" inteiro** (CLT/PJ, Mentoria, Remote-first/SP) |
| `Hero.tsx` | **Mantido** selo "Disponível para oportunidades" (confirmado pelo usuário) |

---

## Item 4 — [MÉDIO] Skills: Gradientes CSS Corrigidos + Semântica ✅

**Commit:** incluído no PR #3 (`80b0ce1`)

### Correções
1. **Gradientes inválidos** → Classes Tailwind v4 nativas:
   - Bolinha: `className={\`h-2 w-2 rounded-full bg-linear-to-r ${skill.color}\`}`
   - Hover layer: `className={\`absolute inset-0 bg-linear-to-r ${skill.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300\`}`
2. **Botões sem ação** → `<li>` dentro de `<ul>` (sem `aria-label` redundante)
3. **Padronização Tailwind v4** — `bg-gradient-to-r` → `bg-linear-to-r`, `bg-gradient-to-br` → `bg-linear-to-br` em:
   - `Skills.tsx`
   - `AboutContact.tsx`
   - `Navbar.tsx`

---

## Item 5 — [BAIXO] Limpezas e Documentação ✅

### Frontend
| Arquivo | Ação |
|---------|------|
| `AboutContact.tsx` | Removidas classes `prose prose-invert prose-zinc` (plugin não instalado) |
| `AboutContact.tsx` | `next/link` → `<a>` para `mailto:` e links externos |

### Documentação
| Arquivo | Ação |
|---------|------|
| `README.md` | Atualizada lista de componentes, "Próximos Passos", variáveis de ambiente |
| `SUPABASE_URL`/`SUPABASE_KEY` | Marcadas como "não usadas pelo código atual" |
| Variáveis adicionadas | `ALLOWED_ORIGINS`, `DEBUG`, `GITHUB_TOKEN`, `ACCESS_TOKEN_EXPIRE_MINUTES` |
| Relatório movido | `docs/RELATORIO_ALTERACOES.md` ✅ |

### Backend / Infraestrutura (sem mexer em regra de negócio)
| Arquivo | Ação |
|---------|------|
| `backend/requirements.txt` | Fixado `bcrypt==4.0.1` junto de `passlib[bcrypt]==1.7.4` |
| `backend/core/config.py` | `DEBUG` padrão alterado para `False` (produção segura) |
| `backend/.env.example` | Adicionado exemplo comentado `ALLOWED_ORIGINS` para Vercel |
| `backend/core/database.py` | **ADICIONADO** `connect_args={"statement_cache_size": 0}` para pgbouncer (Supabase) |

---

## 🚀 Fixes de Produção (Pós-Revisão)

### CORS — Configurado no Render ✅
- **Variável:** `ALLOWED_ORIGINS` = `["https://portfolio-los-ovos.vercel.app"]`
- **Headers confirmados via curl:**
  ```
  access-control-allow-origin: https://portfolio-los-ovos.vercel.app
  access-control-allow-credentials: true
  ```

### pgbouncer (Supabase) — `statement_cache_size=0` ✅
- **Arquivo:** `backend/core/database.py` (commit `6e286af`)
- **Erro resolvido:** `asyncpg.exceptions.InvalidSQLStatementNameError: prepared statement "__asyncpg_stmt_XX__" does not exist`
- **Deploy Render:** Build successful, aplicação inicia sem erros de DB

---

## 🎨 UI Polish — Theme Toggle + Scroll Animations + RGB Accents ✅

**Commits:** PR #3 (`80b0ce1`)

### Novos Componentes
| Arquivo | Descrição |
|---------|-----------|
| `ScrollReveal.tsx` | Framer Motion: `ScrollReveal`, `StaggerContainer`, `StaggerItem` com `whileInView` |
| `ThemeProvider.tsx` | next-themes wrapper com `suppressHydrationWarning` |
| `ThemeToggle.tsx` | Botão animado ciclo: light → dark → system, ícones SVG animados |

### Componentes Atualizados
| Arquivo | Animações/Estilo |
|---------|------------------|
| `Hero.tsx` | `StaggerContainer`/`StaggerItem` para badge, título, subtitle, CTAs, scroll indicator |
| `AboutContact.tsx` | `ScrollReveal` (bio), `StaggerContainer`/`StaggerItem` (tech badges) |
| `Skills.tsx` | `ScrollReveal` (header), `StaggerContainer`/`StaggerItem` (categorias/badges), gradient borders hover |
| `ProjectsGrid.tsx` | `ScrollReveal` (header + Suspense content) |
| `Navbar.tsx` | `ThemeToggle` adicionado, `bg-linear-to-br` gradient |
| `layout.tsx` | `ThemeProvider` wrapping, `suppressHydrationWarning` no `<html>` |

### Dependências Adicionadas
```json
"framer-motion": "^14.9.0",
"next-themes": "^0.4.6"
```

---

## Validações Globais (Estado Final)

| Check | Comando | Resultado |
|-------|---------|-----------|
| **Build Next.js 16 (Turbopack)** | `cd frontend && npm run build` | ✅ Passou — Static (○) + ISR (ƒ 60s) |
| **TypeScript** | incluso no build | ✅ Sem erros |
| **ESLint** | `cd frontend && npm run lint` | ✅ **0 erros, 0 warnings** |
| **Git status** | `git status --short` | ✅ Clean |
| **Identidade unificada** | `grep -r "Hugo Costa de Souza" .` | ✅ 10+ ocorrências |
| **CORS funcionando** | `curl -H "Origin: https://portfolio-los-ovos.vercel.app" https://portfolio-api-hank.onrender.com/api/projects` | ✅ 200 + headers CORS |
| **Deploy Render** | Dashboard → Events | ✅ Build successful, Deploy live |
| **Deploy Vercel** | Dashboard → Deployments | ✅ Build successful, Live |

---

## Próximos Passos (Backlog Pós-Landing Page)

| Prioridade | Item | Status |
|------------|------|--------|
| 1 | **Página `/admin/login`** (JWT → `POST /api/auth/login`) | ⬜ Pendente |
| 2 | **Dashboard Admin** (CRUD visual Projects + upload) | ⬜ Pendente |
| 3 | **Seção Skills dinâmica** (opcional: vir da API) | ⬜ Opcional |
| 4 | **Testes E2E** (Playwright/Cypress) | ⬜ Futuro |
| 5 | **Avatar photo** (Hero/About) — usar fotos de `C:\Users\hcost\Desktop\teste\fotos` | ⬜ Pendente |

---

## Arquivos Alterados (Resumo Completo)

### Criados
- `frontend/src/lib/contact.ts`
- `frontend/src/components/ScrollReveal.tsx`
- `frontend/src/components/ThemeProvider.tsx`
- `frontend/src/components/ThemeToggle.tsx`
- `frontend/src/components/ProjectsGridContent.tsx`
- `frontend/src/components/ProjectsGridError.tsx`
- `frontend/src/components/ProjectsGridEmpty.tsx`
- `frontend/src/components/ProjectsGridSkeleton.tsx`
- `frontend/src/components/Skills.tsx`
- `frontend/src/components/AboutContact.tsx`
- `docs/RELATORIO_ALTERACOES.md`

### Modificados
- `frontend/src/app/page.tsx`
- `frontend/src/app/layout.tsx`
- `frontend/src/app/globals.css`
- `frontend/src/components/Hero.tsx`
- `frontend/src/components/ProjectsGrid.tsx`
- `frontend/src/components/Navbar.tsx`
- `frontend/src/services/api.ts`
- `frontend/package.json`
- `backend/core/config.py`
- `backend/core/database.py`
- `backend/requirements.txt`
- `backend/.env.example`
- `README.md`

### Removidos
- `frontend/src/components/ProjectsErrorBoundary.tsx`

---

## Links de Referência

- **GitHub:** https://github.com/Hank3301/portfolio
- **API (Render):** https://portfolio-api-hank.onrender.com
- **Swagger:** https://portfolio-api-hank.onrender.com/docs (apenas se DEBUG=true)
- **Frontend (Vercel):** https://portfolio-los-ovos.vercel.app/
- **Frontend (alt):** https://portfolio-fawn-iota-45.vercel.app/

---

*Relatório atualizado em 2026-11-01 — Reflete commits até `6e286af` na branch `main`*