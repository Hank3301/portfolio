# Portfólio Full-Stack — Hugo Costa de Souza

Monorepo com backend (FastAPI) e frontend (Vite + React 19 + Tailwind v4 + Lenis).

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
├── docs/
│   └── RELATORIO_ALTERACOES.md
└── frontend/         # Vite + React 19 — pronto para Vercel
    ├── src/
    │   ├── components/   # Hero, Projects, Expertise, Contact, Chrome (Header/Footer), UI
    │   ├── hooks/        # useFitText, useReducedMotion, useReveals
    │   ├── lib/          # math, scroll (Lenis), utils, images, contact.ts
    │   ├── pages/        # admin/ (AdminLogin, AdminLayout, AdminDashboard)
    │   ├── services/     # api.ts (tipos + fetch real), queryClient.ts
    │   ├── App.tsx
    │   ├── main.tsx
    │   ├── content.ts    # config estática (brand, nav, hero, intro, expertise, contact)
    │   └── index.css     # Tailwind v4 + variáveis CSS
    ├── public/
    │   ├── layers/{d,m}/*.webp    # camadas parallax desktop/mobile
    │   └── media/cards/m1..m4.webp
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── vercel.json
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
# VITE_API_URL=http://127.0.0.1:8000/api
npm run dev
# http://localhost:3006
```

---

## Variáveis de Ambiente

### Backend (`backend/.env`)
| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | PostgreSQL (Supabase pooler) |
| `SUPABASE_URL` | **Não usada pelo código atual** |
| `SUPABASE_KEY` | **Não usada pelo código atual** |
| `SECRET_KEY` | Chave secreta para JWT (32+ chars) |
| `ADMIN_USERNAME` | Usuário admin |
| `ADMIN_PASSWORD_HASH` | Hash bcrypt da senha |
| `GITHUB_USERNAME` | Username GitHub para integração |
| `PYTHON_VERSION` | `3.11.9` (fixo no Render) |
| `DEBUG` | Modo debug (padrão: `true` dev, `false` produção) |
| `ALLOWED_ORIGINS` | Lista JSON de origens CORS permitidas (ex: `["https://portfolio-los-ovos.vercel.app"]`) |
| `GITHUB_TOKEN` | (Opcional) Token GitHub para integração |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Expiração do token JWT em minutos (padrão: 10080 = 7 dias) |

### Frontend (`frontend/.env.local`)
| Variável | Descrição |
|----------|-----------|
| `VITE_API_URL` | URL da API (ex: `https://portfolio-api-hank.onrender.com/api`) |

---

## Deploy

| Serviço | Pasta | Build Command | Start Command | Root Directory |
|---------|-------|---------------|---------------|----------------|
| **Render** | `backend/` | `pip install -r requirements.txt` | `uvicorn main:app --host 0.0.0.0 --port $PORT` | `backend/` |
| **Vercel** | `frontend/` | `npm run build` | (automático) | `frontend/` |

> O Render está configurado para fazer deploy automático a partir da branch `main` com `Root Directory: backend/`.
> A Vercel deve ser configurada com **Framework Preset: Vite**, **Root Directory: frontend/**, **Build Command: `npm run build`**, **Output Directory: `dist`**.

---

## Scripts Úteis

```bash
# Frontend
cd frontend
npm run dev          # desenvolvimento (porta 3006)
npm run build        # build de produção (gera pasta dist/)
npm run preview      # preview do build (porta 3006)
npm run lint         # TypeScript check (tsc --noEmit)

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

## Próximos Passos

- [x] Frontend Vite + React 19 + Tailwind v4 + Lenis funcional
- [x] Seções públicas usando API real (Hero, Projects, Expertise, Contact)
- [x] Admin Dashboard com CRUD de projetos (JWT, PUT, UUID)
- [ ] Deploy na Vercel (configurar framework Vite)
- [ ] Deploy no Render (configurar CORS para domínio Vercel)

---

## Licença

MIT — Uso livre para fins educacionais e profissionais.