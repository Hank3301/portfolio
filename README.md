# Portfólio Full-Stack — Hugo Costa de Souza

Monorepo com backend (FastAPI) e frontend (Next.js 16 + App Router).

---

## Estrutura do Repositório

```
.
├── backend/          # FastAPI — produção no Render
│   ├── api/
│   ├── core/
│   ├── crud/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/         # Next.js 16 — pronto para Vercel
    ├── src/
    │   ├── app/              # App Router (page.tsx, layout.tsx)
    │   ├── components/       # Hero, Navbar, ProjectCard, ProjectsGrid
    │   └── services/         # api.ts (tipos + fetchProjects)
    ├── public/
    ├── package.json
    ├── next.config.ts
    └── tsconfig.json
```

---

## Como Rodar Local

### Backend
```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/macOS
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env      # edite as variáveis necessárias
uvicorn main:app --reload
# http://localhost:8000
# Swagger: http://localhost:8000/docs
```

### Frontend
```bash
cd frontend
npm install
# Crie .env.local com:
# NEXT_PUBLIC_API_URL=https://portfolio-api-hank.onrender.com
npm run dev
# http://localhost:3000
```

---

## Variáveis de Ambiente

### Backend (`backend/.env`)
| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | PostgreSQL (Supabase pooler) |
| `SUPABASE_URL` | URL do projeto Supabase |
| `SUPABASE_KEY` | Service role key do Supabase |
| `SECRET_KEY` | Chave secreta para JWT (32+ chars) |
| `ADMIN_USERNAME` | Usuário admin |
| `ADMIN_PASSWORD_HASH` | Hash bcrypt da senha |
| `GITHUB_USERNAME` | Username GitHub para integração |
| `PYTHON_VERSION` | `3.11.9` (fixo no Render) |

### Frontend (`frontend/.env.local`)
| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_API_URL` | URL da API (ex: `https://portfolio-api-hank.onrender.com`) |

---

## Deploy

| Serviço | Pasta | Build Command | Start Command | Root Directory |
|---------|-------|---------------|---------------|----------------|
| **Render** | `backend/` | `pip install -r requirements.txt` | `uvicorn main:app --host 0.0.0.0 --port $PORT` | `backend/` |
| **Vercel** | `frontend/` | `npm run build` | (automático) | `frontend/` |

> O Render está configurado para fazer deploy automático a partir da branch `main` com `Root Directory: backend/`.

---

## Scripts Úteis

```bash
# Frontend
cd frontend
npm run dev          # desenvolvimento
npm run build        # build de produção
npm run lint         # ESLint

# Backend
cd backend
uvicorn main:app --reload    # desenvolvimento
uvicorn main:app --host 0.0.0.0 --port 8000  # produção local
```

---

## Health Check

- **API**: `https://portfolio-api-hank.onrender.com/api/health`
- **Swagger**: `https://portfolio-api-hank.onrender.com/docs`

---

## Próximos Passos (Frontend)

- [x] Hero Section + Grid de Projetos
- [ ] Seção Skills
- [ ] Deploy na Vercel
- [ ] Login Admin + Dashboard (rotas protegidas JWT)

---

## Licença

MIT — Uso livre para fins educacionais e profissionais.