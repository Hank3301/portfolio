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

              <div className="prose prose-invert prose-zinc max-w-none space-y-4 text-zinc-300 leading-relaxed">
                <p>
                  Olá! Sou <strong>Hugo Costa de Souza</strong>, desenvolvedor Full-Stack
                  focado em criar aplicações web modernas, escaláveis e bem arquitetadas.
                </p>
                <p>
                  Minha jornada começou com automações em <strong>Python</strong> e
                  evoluiu para o desenvolvimento de sistemas completos — do banco de dados
                  (PostgreSQL, Supabase) à interface (React, Next.js, TypeScript).
                </p>
                <p>
                  Tenho experiência prática com <strong>FastAPI</strong> para APIs
                  assíncronas de alta performance, <strong>SQLAlchemy</strong> para ORM
                  robusto, e <strong>Tailwind CSS</strong> para UIs responsivas e
                  performáticas. Acredito em <strong>clean architecture</strong>,
                  deploy contínuo (CI/CD) e código que escala com o time.
                </p>
                <p>
                  Atualmente, estudo padrões de arquitetura distribuída, message queues,
                  e estratégias de cache para sistemas de alta disponibilidade.
                </p>
              </div>

              {/* Tech highlights */}
              <div className="flex flex-wrap gap-3 pt-4">
                {['Python', 'FastAPI', 'Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind', 'Docker', 'Git'].map((tech) => (
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
              {/* Quick stats card - DISPONIBILIDADE (Item 3: será removido após confirmação do usuário) */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                <h4 className="font-semibold text-white mb-4">Disponibilidade</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden="true" />
                    Aberto a oportunidades (CLT / PJ)
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <span className="h-2 w-2 rounded-full bg-yellow-500" aria-hidden="true" />
                    Freelances & consultoria
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <span className="h-2 w-2 rounded-full bg-blue-500" aria-hidden="true" />
                    Mentoria & code review
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <span className="h-2 w-2 rounded-full bg-purple-500" aria-hidden="true" />
                    Remote-first / Híbrido (SP)
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Contato - Footer CTA (já existe no page.tsx, não duplicamos aqui) */}
    </>
  );
}