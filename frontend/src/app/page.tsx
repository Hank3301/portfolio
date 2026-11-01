// src/app/page.tsx
import Hero from '@/components/Hero';
import ProjectsGrid from '@/components/ProjectsGrid';
import Skills from '@/components/Skills';
import AboutContact from '@/components/AboutContact';

// Constantes de contato — alterar quando tiver os valores reais
const EMAIL = "TODO";
const LINKEDIN_URL = "TODO";
const GITHUB_URL = "https://github.com/Hank3301";

export const metadata = {
  title: 'Hugo Costa de Souza | Desenvolvedor Full-Stack',
  description: 'Portfólio de Hugo Costa de Souza — Desenvolvedor Full-Stack especializado em React, Next.js, Python, FastAPI e arquitetura cloud.',
  openGraph: {
    title: 'Hugo Costa de Souza | Desenvolvedor Full-Stack',
    description: 'Portfólio profissional com projetos, skills e experiências em desenvolvimento web full-stack.',
    type: 'website',
  },
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <Hero />
      <ProjectsGrid />
      <Skills />
      <AboutContact />

      {/* Footer CTA */}
      <section id="contact" className="py-20 px-4 scroll-mt-20">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">Vamos conversar?</h2>
          <p className="text-zinc-400">
            Estou aberto a oportunidades, freelances ou apenas um café virtual.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {EMAIL !== "TODO" && (
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                E-mail
              </a>
            )}
            {LINKEDIN_URL !== "TODO" && (
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-zinc-100 bg-zinc-800 rounded-xl border border-zinc-700 hover:bg-zinc-700 transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            )}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-zinc-100 bg-zinc-800 rounded-xl border border-zinc-700 hover:bg-zinc-700 transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}