// src/components/AboutContact.tsx
import { EMAIL, LINKEDIN_URL, GITHUB_URL } from '@/lib/contact';

export default function AboutContact() {
  return (
    <>
      {/* Sobre Mim */}
      <section
        id="about"
        className="py-24 px-4 bg-zinc-950"
        aria-labelledby="about-title"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Texto Sobre Mim */}
            <article className="space-y-6">
              <header className="space-y-4">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 text-sm font-medium border border-indigo-500/20">
                  Sobre Mim
                </span>
                <h2
                  id="about-title"
                  className="text-3xl sm:text-4xl font-bold text-white"
                >
                  Desenvolvedor Full-Stack apaixonado por arquitetura limpa
                </h2>
              </header>

              <div className="space-y-4 text-zinc-300 leading-relaxed">
                <p>
                  Olá! Sou <strong>Hugo Costa de Souza</strong>, desenvolvedor Full-Stack
                  focado em criar aplicações web modernas, escaláveis e bem arquitetadas.
                </p>
                <p>
                  O repositório comprova experiência com <strong>FastAPI</strong> para APIs
                  assíncronas de alta performance, <strong>SQLAlchemy</strong> (async) para ORM
                  robusto com PostgreSQL/Supabase, <strong>Next.js 16</strong> (App Router),
                  <strong>TypeScript</strong> e <strong>Tailwind CSS v4</strong> para UIs responsivas.
                  Deploy contínuo no <strong>Render</strong> (backend) com CI/CD via GitHub Actions.
                </p>
                <p>
                  A arquitetura segue princípios de <strong>clean architecture</strong>:
                  separação de camadas (api, core, crud, models, schemas, services),
                  validação com Pydantic V2, autenticação JWT (Passlib/Bcrypt) e
                  paginação server-side com revalidação ISR (60s) no frontend.
                </p>
              </div>

              {/* Tech highlights */}
              <div className="flex flex-wrap gap-3 pt-4">
                {['Python', 'FastAPI', 'Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind', 'Git'].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-900 border border-zinc-700 text-zinc-300 hover:border-zinc-600 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </article>

            {/* Lado Direito - Tech highlights only (contact card removed - duplicated in page.tsx footer) */}
            <aside className="space-y-6">
              {/* Disponibilidade card removed (Item 3) */}
            </aside>
          </div>
        </div>
      </section>

      {/* Contato - Footer CTA (já existe no page.tsx, não duplicamos aqui) */}
    </>
  );
}