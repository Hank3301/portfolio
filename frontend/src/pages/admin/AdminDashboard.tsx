import {useState} from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {Button} from '../../components/ui/Button';
import {Input} from '../../components/ui/Input';
import {Textarea} from '../../components/ui/Textarea';
import {Project, Skill} from '../../services/api';
import {getProjects, getSkills, createProject, updateProject, deleteProject, createSkill, updateSkill, deleteSkill} from '../../services/api';

export function AdminDashboard() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'projects' | 'skills'>('projects');

  const {data: projects = [], isLoading: projectsLoading} = useQuery({
    queryKey: ['admin-projects'],
    queryFn: getProjects,
  });

  const {data: skills = [], isLoading: skillsLoading} = useQuery({
    queryKey: ['admin-skills'],
    queryFn: getSkills,
  });

  // Project mutations
  const createProjectMut = useMutation({
    mutationFn: createProject,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['admin-projects']}).then(() => queryClient.invalidateQueries({queryKey: ['projects']})),
  });

  const updateProjectMut = useMutation({
    mutationFn: ({id, data}: {id: number; data: Partial<Project>}) => updateProject(id, data),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['admin-projects']}).then(() => queryClient.invalidateQueries({queryKey: ['projects']})),
  });

  const deleteProjectMut = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['admin-projects']}).then(() => queryClient.invalidateQueries({queryKey: ['projects']})),
  });

  // Skill mutations
  const createSkillMut = useMutation({
    mutationFn: createSkill,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['admin-skills']}).then(() => queryClient.invalidateQueries({queryKey: ['skills']})),
  });

  const updateSkillMut = useMutation({
    mutationFn: ({id, data}: {id: number; data: Partial<Skill>}) => updateSkill(id, data),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['admin-skills']}).then(() => queryClient.invalidateQueries({queryKey: ['skills']})),
  });

  const deleteSkillMut = useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['admin-skills']}).then(() => queryClient.invalidateQueries({queryKey: ['skills']})),
  });

  // Forms state
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const projectForm = editingProject || {tag: '', title: '', body: '', stack: [''], link: '#', image: '/media/cards/new.svg'};
  const skillForm = editingSkill || {name: '', years: 1, lines: [''], featured: false, cta: 'Aprofundar →'};

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data: Partial<Project> = {
      tag: formData.get('tag') as string,
      title: formData.get('title') as string,
      body: formData.get('body') as string,
      stack: formData.getAll('stack') as string[],
      link: formData.get('link') as string,
      image: formData.get('image') as string,
    };
    if (editingProject?.id) {
      updateProjectMut.mutate({id: editingProject.id, data});
    } else {
      createProjectMut.mutate(data as Omit<Project, 'id' | 'createdAt' | 'updatedAt'>);
    }
    setEditingProject(null);
    setShowProjectForm(false);
  };

  const handleSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data: Partial<Skill> = {
      name: formData.get('name') as string,
      years: parseInt(formData.get('years') as string, 10),
      lines: formData.getAll('lines') as string[],
      featured: formData.get('featured') === 'on',
      cta: formData.get('cta') as string,
    };
    if (editingSkill?.id) {
      updateSkillMut.mutate({id: editingSkill.id, data});
    } else {
      createSkillMut.mutate(data as Omit<Skill, 'id'>);
    }
    setEditingSkill(null);
    setShowSkillForm(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-white">Dashboard</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setActiveTab('projects')}>Projetos</Button>
          <Button variant="outline" onClick={() => setActiveTab('skills')}>Especialidades</Button>
        </div>
      </div>

      {activeTab === 'projects' && (
        <ProjectManager
          projects={projects}
          loading={projectsLoading}
          onCreate={() => { setEditingProject(null); setShowProjectForm(true); }}
          onEdit={setEditingProject}
          onDelete={(id: number) => { if (confirm('Excluir projeto?')) deleteProjectMut.mutate(id); }}
          formOpen={showProjectForm || !!editingProject}
          onFormClose={() => { setShowProjectForm(false); setEditingProject(null); }}
          formData={projectForm}
          onFormSubmit={handleProjectSubmit}
          saving={createProjectMut.isPending || updateProjectMut.isPending}
        />
      )}

      {activeTab === 'skills' && (
        <SkillManager
          skills={skills}
          loading={skillsLoading}
          onCreate={() => { setEditingSkill(null); setShowSkillForm(true); }}
          onEdit={setEditingSkill}
          onDelete={(id: number) => { if (confirm('Excluir especialidade?')) deleteSkillMut.mutate(id); }}
          formOpen={showSkillForm || !!editingSkill}
          onFormClose={() => { setShowSkillForm(false); setEditingSkill(null); }}
          formData={skillForm}
          onFormSubmit={handleSkillSubmit}
          saving={createSkillMut.isPending || updateSkillMut.isPending}
        />
      )}
    </div>
  );
}

function ProjectManager({
  projects,
  loading,
  onCreate,
  onEdit,
  onDelete,
  formOpen,
  onFormClose,
  formData,
  onFormSubmit,
  saving,
}: {
  projects: Project[];
  loading: boolean;
  onCreate: () => void;
  onEdit: (p: Project) => void;
  onDelete: (id: number) => void;
  formOpen: boolean;
  onFormClose: () => void;
  formData: Partial<Project>;
  onFormSubmit: (e: React.FormEvent) => void;
  saving: boolean;
}) {
  if (loading) return <div className="animate-pulse space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 bg-white/5 rounded" />)}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-display text-xl text-white">Projetos ({projects.length})</h3>
        <Button onClick={onCreate}>Novo Projeto</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p: Project) => (
          <div key={p.id ?? p.title} className="bg-void-2/60 ring-1 ring-white/10 rounded-[8px] p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-[0.625rem] text-terminal uppercase">{p.tag}</span>
                <h4 className="font-display text-lg text-white mt-1">{p.title}</h4>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => onEdit(p)}>Editar</Button>
                <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-400/10" onClick={() => onDelete(p.id!)}>Excluir</Button>
              </div>
            </div>
            <p className="text-sm text-regolith/70 line-clamp-2">{p.body}</p>
            <div className="flex flex-wrap gap-1">
              {p.stack.map((s: string) => <span key={s} className="text-xs bg-white/5 px-2 py-1 rounded text-regolith/60">{s}</span>)}
            </div>
          </div>
        ))}
      </div>

      {formOpen && (
        <ProjectForm
          data={formData}
          onSubmit={onFormSubmit}
          onClose={onFormClose}
          saving={saving}
          editing={!!formData.id}
        />
      )}
    </div>
  );
}

function ProjectForm({data, onSubmit, onClose, saving, editing}: {
  data: Partial<Project>;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  saving: boolean;
  editing: boolean;
}) {
  const [stack, setStack] = useState<string[]>(data.stack || ['']);

  const addStack = () => setStack([...stack, '']);
  const removeStack = (i: number) => setStack(stack.filter((_, idx) => idx !== i));
  const updateStack = (i: number, val: string) => setStack(stack.map((s, idx) => idx === i ? val : s));

  return (
    <form onSubmit={onSubmit} className="bg-void-2 ring-1 ring-terminal/60 rounded-[8px] p-6 space-y-4 animate-slide-down">
      <div className="flex justify-between items-center">
        <h4 className="font-display text-lg text-white">{editing ? 'Editar' : 'Novo'} Projeto</h4>
        <button type="button" onClick={onClose} className="text-regolith/50 hover:text-white">✕</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Tag" name="tag" value={data.tag} required />
        <Input label="Título" name="title" value={data.title} required />
      </div>
      <Textarea label="Descrição" name="body" value={data.body} required rows={3} />

      <div>
        <label className="block font-mono text-label text-regolith/60 uppercase mb-2">Stack</label>
        <div className="flex flex-wrap gap-2">
          {stack.map((s: string, i: number) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={s}
                onChange={(e) => updateStack(i, e.target.value)}
                className="flex-1 min-w-[120px] rounded-[4px] bg-white/[0.04] px-3 py-2 text-white ring-1 ring-white/15 outline-none focus:ring-terminal text-sm"
              />
              <button type="button" onClick={() => removeStack(i)} className="px-3 text-red-400 hover:text-red-300">✕</button>
            </div>
          ))}
          <button type="button" onClick={addStack} className="px-3 py-2 text-terminal hover:bg-terminal/10 rounded font-mono text-sm">+ Adicionar tech</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Link" name="link" value={data.link} placeholder="#"/>
        <Input label="Imagem" name="image" value={data.image} placeholder="/media/cards/novo.svg"/>
      </div>

      <div className="flex gap-3 pt-4">
        <Button disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
      </div>
    </form>
  );
}

function SkillManager({
  skills,
  loading,
  onCreate,
  onEdit,
  onDelete,
  formOpen,
  onFormClose,
  formData,
  onFormSubmit,
  saving,
}: {
  skills: Skill[];
  loading: boolean;
  onCreate: () => void;
  onEdit: (s: Skill) => void;
  onDelete: (id: number) => void;
  formOpen: boolean;
  onFormClose: () => void;
  formData: Partial<Skill>;
  onFormSubmit: (e: React.FormEvent) => void;
  saving: boolean;
}) {
  if (loading) return <div className="animate-pulse space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 bg-white/5 rounded" />)}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-display text-xl text-white">Especialidades ({skills.length})</h3>
        <Button onClick={onCreate}>Nova Especialidade</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {skills.map((s: Skill) => (
          <div key={s.id ?? s.name} className="bg-void-2/60 ring-1 ring-white/10 rounded-[8px] p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-display text-lg text-white">{s.name}</h4>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => onEdit(s)}>Editar</Button>
                <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-400/10" onClick={() => onDelete(s.id!)}>Excluir</Button>
              </div>
            </div>
            <p className="text-sm text-regolith/70">{s.years} anos</p>
            <ul className="space-y-1 text-sm text-regolith/60">
              {s.lines.map((l: string) => <li key={l} className="flex gap-2"><span className="mt-1.5 size-1 rounded-full bg-terminal" />{l}</li>)}
            </ul>
          </div>
        ))}
      </div>

      {formOpen && (
        <SkillForm
          data={formData}
          onSubmit={onFormSubmit}
          onClose={onFormClose}
          saving={saving}
          editing={!!formData.id}
        />
      )}
    </div>
  );
}

function SkillForm({data, onSubmit, onClose, saving, editing}: {
  data: Partial<Skill>;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  saving: boolean;
  editing: boolean;
}) {
  const [lines, setLines] = useState<string[]>(data.lines || ['']);

  const addLine = () => setLines([...lines, '']);
  const removeLine = (i: number) => setLines(lines.filter((_, idx) => idx !== i));
  const updateLine = (i: number, val: string) => setLines(lines.map((l, idx) => idx === i ? val : l));

  return (
    <form onSubmit={onSubmit} className="bg-void-2 ring-1 ring-terminal/60 rounded-[8px] p-6 space-y-4 animate-slide-down">
      <div className="flex justify-between items-center">
        <h4 className="font-display text-lg text-white">{editing ? 'Editar' : 'Nova'} Especialidade</h4>
        <button type="button" onClick={onClose} className="text-regolith/50 hover:text-white">✕</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Nome" name="name" value={data.name} required />
        <Input label="Anos" name="years" type="number" value={data.years} required min={0} />
      </div>

      <div>
        <label className="block font-mono text-label text-regolith/60 uppercase mb-2">Linhas</label>
        <div className="space-y-2">
          {lines.map((l: string, i: number) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={l}
                onChange={(e) => updateLine(i, e.target.value)}
                className="flex-1 rounded-[4px] bg-white/[0.04] px-3 py-2 text-white ring-1 ring-white/15 outline-none focus:ring-terminal text-sm"
              />
              <button type="button" onClick={() => removeLine(i)} className="px-3 text-red-400 hover:text-red-300">✕</button>
            </div>
          ))}
          <button type="button" onClick={addLine} className="px-3 py-2 text-terminal hover:bg-terminal/10 rounded font-mono text-sm">+ Adicionar linha</button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 font-mono text-sm text-regolith/70">
          <input type="checkbox" name="featured" checked={data.featured} className="accent-terminal" />
          Destacada (Core focus)
        </label>
      </div>

      <Input label="CTA" name="cta" value={data.cta} placeholder="Aprofundar →"/>

      <div className="flex gap-3 pt-4">
        <Button disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
      </div>
    </form>
  );
}