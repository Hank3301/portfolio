// src/components/AboutContact.tsx
import Link from 'next/link';

// Constantes de contato
const EMAIL = "hcosta547@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/hugo-costa-de-souza-4a7291292/";
const GITHUB_URL = "https://github.com/Hank3301";

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

            {/* Lado Direito - Contato / Links */}
            <aside className="space-y-6">
              <div className="relative p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Vamos conversar?
                </h3>
                <p className="text-zinc-400 mb-6">
                  Estou aberto a oportunidades, freelances, mentorias ou apenas um café
                  virtual para trocar ideias sobre tecnologia.
                </p>

                <div className="space-y-3">
                    <Link
                      href={`mailto:${EMAIL}`}
                      className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-zinc-200 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-200"
                    >
                      <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-xs text-zinc-500 block">E-mail</span>
                        <span className="font-medium">{EMAIL}</span>
                      </div>
                    </Link>

                    <Link
                      href={LINKEDIN_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-zinc-200 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-200"
                    >
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </div>
                      <div>
                        <span className="text-xs text-zinc-500 block">LinkedIn</span>
                        <span className="font-medium">/in/hugo-costa-de-souza-4a7291292</span>
                      </div>
                    </Link>

                  <Link
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-zinc-200 hover:border-zinc-500/50 hover:bg-zinc-700/50 transition-all duration-200"
                  >
                    <div className="p-2 rounded-lg bg-zinc-700/50 text-zinc-400 group-hover:bg-zinc-600/50 transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-500 block">GitHub</span>
                      <span className="font-medium">@Hank3301</span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Quick stats card */}
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

      {/* Contato - Footer CTA (já existe no page.tsx, mas mantemos aqui como referência) */}
      {/* O page.tsx já tem a seção #contact, então não duplicamos aqui */}
    </>
  );
}