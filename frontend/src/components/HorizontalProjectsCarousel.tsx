'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ProjectCard from './ProjectCard';
import type { Project } from '@/services/api';

interface HorizontalProjectsCarouselProps {
  projects: Project[];
}

export default function HorizontalProjectsCarousel({ projects }: HorizontalProjectsCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Transform: move cards horizontally based on scroll progress
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-100%']);

  // Track when we're in the sticky section
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const isInView = rect.top <= 0 && rect.bottom >= window.innerHeight;
      setIsActive(isInView);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cardWidth = 380; // aprox: w-96 + gap
  const totalWidth = projects.length * cardWidth + (projects.length - 1) * 24; // gap-6 = 24px
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const scrollDistance = totalWidth - viewportWidth + 80; // padding extra

  return (
    <section
      ref={containerRef}
      id="projects"
      className="relative w-full"
      aria-labelledby="projects-title"
      style={{
        height: `${scrollDistance}px`,
        position: 'relative',
      }}
    >
      {/* Sticky wrapper que segura a rolagem horizontal */}
      <div
        className="relative z-10"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          className="w-full max-w-[3000px] px-4"
          style={{ x }}
        >
          {/* Header da seção */}
          <motion.header
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 text-sm font-medium border border-indigo-500/20 mb-4">
              Projetos em Destaque
            </span>
            <h2 id="projects-title" className="text-3xl sm:text-4xl font-bold text-white">
              Projetos em Destaque
            </h2>
            <p className="mt-2 text-zinc-400 max-w-2xl mx-auto">
              Seleção de projetos públicos. Cada card mostra a stack tecnológica e links para código e demo.
            </p>
          </motion.header>

          {/* Grid horizontal dos cards */}
          <ul className="flex gap-6" role="list" aria-label="Projetos em destaque">
            {projects.map((project, index) => (
              <motion.li
                key={project.id}
                style={{ flexShrink: 0, width: '380px' }}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  tech_stack={project.tech_stack}
                  github_url={project.github_url}
                  live_url={project.live_url}
                />
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Indicador visual de scroll horizontal */}
      {isActive && (
        <motion.div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-700 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <svg className="h-5 w-5 text-zinc-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-sm text-zinc-300 font-medium">Role horizontalmente</span>
          <svg className="h-5 w-5 text-zinc-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.div>
      )}
    </section>
  );
}