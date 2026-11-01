// src/components/Skills.tsx
const skills = {
  Backend: [
    { name: 'Python', color: 'from-yellow-500 to-orange-500' },
    { name: 'FastAPI', color: 'from-teal-500 to-green-500' },
    { name: 'PostgreSQL', color: 'from-blue-600 to-blue-800' },
    { name: 'Supabase', color: 'from-green-500 to-emerald-600' },
    { name: 'SQLAlchemy', color: 'from-red-500 to-red-700' },
  ],
  Frontend: [
    { name: 'Next.js', color: 'from-zinc-300 to-zinc-500' },
    { name: 'TypeScript', color: 'from-blue-500 to-blue-700' },
    { name: 'Tailwind CSS', color: 'from-cyan-400 to-cyan-600' },
    { name: 'React', color: 'from-cyan-300 to-blue-500' },
  ],
  'Ferramentas & Outros': [
    { name: 'Git', color: 'from-orange-500 to-red-500' },
    { name: 'Render', color: 'from-purple-500 to-purple-700' },
    { name: 'Vercel', color: 'from-zinc-400 to-zinc-600' },
  ],
} as const;

type CategoryKey = keyof typeof skills;

export default function Skills() {
  const categories = Object.keys(skills) as CategoryKey[];

  return (
    <section
      id="skills"
      className="py-24 px-4 bg-zinc-950"
      aria-labelledby="skills-title"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="text-center space-y-4 mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 text-sm font-medium border border-indigo-500/20">
            Stack Tecnológico
          </span>
          <h2
            id="skills-title"
            className="text-3xl sm:text-4xl font-bold text-white"
          >
            Habilidades Técnicas
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Tecnologias que uso no dia a dia para construir aplicações robustas,
            escaláveis e bem arquitetadas.
          </p>
        </header>

        {/* Skills Grid */}
        <div className="space-y-12">
          {categories.map((category) => (
            <article
              key={category}
              className="space-y-6"
            >
              {/* Category Title */}
              <h3 className="text-lg font-semibold text-zinc-200 flex items-center gap-3">
                <span
                  className="h-1 w-10 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full"
                />
                {category}
              </h3>

              {/* Skill Badges */}
              <div className="flex flex-wrap gap-3">
                {skills[category].map((skill) => (
                  <li
                    key={skill.name}
                    className="group relative px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-200 text-sm font-medium transition-all duration-300 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-950 overflow-hidden"
                  >
                    {/* Animated gradient border on hover */}
                    <span
                      className="absolute inset-0 bg-linear-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(90deg, ${skill.color.split(' ')[0].replace('from-', '')}, ${skill.color.split(' ')[1].replace('to-', '')})`,
                      }}
                      aria-hidden="true"
                    />
                    <span className="relative z-10 flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full bg-linear-to-r"
                        style={{
                          background: `linear-gradient(90deg, ${skill.color.split(' ')[0].replace('from-', '')}, ${skill.color.split(' ')[1].replace('to-', '')})`,
                        }}
                        aria-hidden="true"
                      />
                      {skill.name}
                    </span>
                  </li>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}