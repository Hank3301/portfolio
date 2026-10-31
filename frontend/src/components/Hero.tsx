// src/components/Hero.tsx
import Link from 'next/link';

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[85vh] flex items-center justify-center px-4 overflow-hidden bg-radial from-indigo-500/10 via-transparent to-transparent"
      aria-labelledby="hero-title"
    >
      <div className="relative max-w-5xl mx-auto w-full text-center space-y-8">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 text-sm font-medium border border-indigo-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
          </span>
          Disponível para oportunidades
        </span>

        {/* Title */}
        <h1
          id="hero-title"
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white"
        >
          Henrique Costa
          <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-500 to-pink-500">
            Desenvolvedor Full-Stack
          </span>
        </h1>

        {/* Subtitle - sem "código testável" */}
        <p className="text-lg sm:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
          Construo aplicações escaláveis com <strong>React, Next.js, Python & FastAPI</strong>.
          Do banco de dados à interface: arquitetura limpa e deploy contínuo.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="#projects"
            className="group inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            Ver Projetos
            <svg className="group-hover:translate-x-1 transition-transform h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          <Link
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-zinc-100 bg-zinc-800 rounded-xl border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            Entrar em Contato
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
          <svg className="h-6 w-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}