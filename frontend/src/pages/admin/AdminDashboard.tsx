import {useState, FormEvent} from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {Button} from '../../components/ui/Button';
import {Input} from '../../components/ui/Input';
import {Textarea} from '../../components/ui/Textarea';
import {ApiProject, listAdminProjects, createProjectApi, updateProjectApi, deleteProjectApi} from '../../services/api';

type ProjectFormData = {
  title: string;
  description: string;
  tech_stack: string[];
  github_url: string | null;
  live_url: string | null;
  is_visible: boolean;
};

export function AdminDashboard() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<ApiProject | null>(null);
  const [formError, setFormError] = useState('');

  const {data: projectsData, isLoading, error} = useQuery({
    queryKey: ['admin-projects'],
    queryFn: listAdminProjects,
  });

  const projects = projectsData?.projects ?? [];

  const createProjectMut = useMutation({
    mutationFn: (data: ProjectFormData) => createProjectApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['admin-projects']});
      queryClient.invalidateQueries({queryKey: ['projects']});
      setShowForm(false);
      setEditingProject(null);
    },
    onError: (err) => setFormError(err instanceof Error ? err.message : 'Erro ao criar projeto'),
  });

  const updateProjectMut = useMutation({
    mutationFn: ({id, data}: {id: string; data: Partial<ProjectFormData>}) => updateProjectApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['admin-projects']});
      queryClient.invalidateQueries({queryKey: ['projects']});
      setEditingProject(null);
    },
    onError: (err) => setFormError(err instanceof Error ? err.message : 'Erro ao atualizar projeto'),
  });

  const deleteProjectMut = useMutation({
    mutationFn: (id: string) => deleteProjectApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['admin-projects']});
      queryClient.invalidateQueries({queryKey: ['projects']});
    },
    onError: (err) => setFormError(err instanceof Error ? err.message : 'Erro ao excluir projeto'),
  });

  const formData = editingProject
    ? {
        title: editingProject.title,
        description: editingProject.description,
        tech_stack: editingProject.tech_stack,
        github_url: editingProject.github_url,
        live_url: editingProject.live_url,
        is_visible: editingProject.is_visible,
      }
    : {
        title: '',
        description: '',
        tech_stack: [''],
        github_url: null,
        live_url: null,
        is_visible: true,
      };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');
    const form = e.currentTarget;
    const formDataObj = new FormData(form);
    const data: ProjectFormData = {
      title: String(formDataObj.get('title') ?? ''),
      description: String(formDataObj.get('description') ?? ''),
      tech_stack: formDataObj.getAll('tech_stack') as string[],
      github_url: formDataObj.get('github_url') ? String(formDataObj.get('github_url')) : null,
      live_url: formDataObj.get('live_url') ? String(formDataObj.get('live_url')) : null,
      is_visible: formDataObj.get('is_visible') === 'on',
    };

    if (editingProject) {
      updateProjectMut.mutate({id: editingProject.id, data});
    } else {
      createProjectMut.mutate(data);
    }
  };

  const startEdit = (p: ApiProject) => {
    setEditingProject(p);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Excluir este projeto? Esta ação não pode ser desfeita.')) {
      deleteProjectMut.mutate(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-display text-2xl text-white">Dashboard de Projetos</h2>
        <Button onClick={() => { setEditingProject(null); setShowForm(true); }}>
          Novo Projeto
        </Button>
      </div>

      {/* Aviso sobre projetos ocultos */}
      <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-[6px] p-4 text-sm text-yellow-200 font-mono">
        ⚠ Aviso: A API pública só retorna projetos com <code className="px-1 bg-yellow-900/30 rounded">is_visible=true</code>.
        Projetos ocultos não aparecem na listagem pública nem neste painel (limitação do backend).
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-[6px] p-4 text-sm text-red-200 font-mono" role="alert">
          Erro ao carregar projetos: {(error as Error).message}
        </div>
      )}

      {formError && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-[6px] p-4 text-sm text-red-200 font-mono" role="alert">
          {formError}
        </div>
      )}

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white/5 rounded" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 text-regolith/60">
          <p className="font-display text-xl text-white mb-2">Nenhum projeto publicado</p>
          <p>Clique em "Novo Projeto" para criar o primeiro.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div key={p.id} className="bg-void-2/60 ring-1 ring-white/10 rounded-[8px] p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-[0.625rem] text-terminal uppercase">
                    {p.tech_stack[0] ?? 'Sem tag'}
                  </span>
                  <h4 className="font-display text-lg text-white mt-1">{p.title}</h4>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => startEdit(p)}>
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-400/10" onClick={() => handleDelete(p.id)}>
                    Excluir
                  </Button>
                </div>
              </div>
              <p className="text-sm text-regolith/70 line-clamp-2">{p.description}</p>
              <div className="flex flex-wrap gap-1">
                {p.tech_stack.map((s: string) => (
                  <span key={s} className="text-xs bg-white/5 px-2 py-1 rounded text-regolith/60">{s}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-1 text-xs text-regolith/50">
                {p.github_url && (
                  <span>GitHub: <a href={p.github_url} target="_blank" rel="noopener" className="underline hover:text-terminal">{p.github_url}</a></span>
                )}
                {p.live_url && (
                  <span>Live: <a href={p.live_url} target="_blank" rel="noopener" className="underline hover:text-terminal">{p.live_url}</a></span>
                )}
                <span>Visível: {p.is_visible ? 'Sim' : 'Não'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ProjectForm
          data={formData}
          onSubmit={handleSubmit}
          onClose={() => { setShowForm(false); setEditingProject(null); setFormError(''); }}
          saving={createProjectMut.isPending || updateProjectMut.isPending}
          editing={!!editingProject}
        />
      )}
    </div>
  );
}

function ProjectForm({
  data,
  onSubmit,
  onClose,
  saving,
  editing,
}: {
  data: ProjectFormData;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  saving: boolean;
  editing: boolean;
}) {
  const [stack, setStack] = useState<string[]>(data.tech_stack.length > 0 ? data.tech_stack : ['']);

  const addStack = () => setStack([...stack, '']);
  const removeStack = (i: number) => setStack(stack.filter((_, idx) => idx !== i));
  const updateStack = (i: number, val: string) => setStack(stack.map((s, idx) => idx === i ? val : s));

  return (
    <form onSubmit={onSubmit} className="bg-void-2 ring-1 ring-terminal/60 rounded-[8px] p-6 space-y-4 animate-slide-down">
      <div className="flex justify-between items-center">
        <h4 className="font-display text-lg text-white">{editing ? 'Editar' : 'Novo'} Projeto</h4>
        <button type="button" onClick={onClose} className="text-regolith/50 hover:text-white">✕</button>
      </div>

      <Input label="Título" name="title" value={data.title} required />
      <Textarea label="Descrição" name="description" value={data.description} required rows={3} />

      <div>
        <label className="block font-mono text-label text-regolith/60 uppercase mb-2">Stack (tecnologias)</label>
        <div className="flex flex-wrap gap-2">
          {stack.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                name="tech_stack"
                value={s}
                onChange={(e) => updateStack(i, e.target.value)}
                className="flex-1 min-w-[120px] rounded-[4px] bg-white/[0.04] px-3 py-2 text-white ring-1 ring-white/15 outline-none focus:ring-terminal text-sm"
                placeholder={`Tecnologia ${i + 1}`}
              />
              <button type="button" onClick={() => removeStack(i)} className="px-3 text-red-400 hover:text-red-300">✕</button>
            </div>
          ))}
          <button type="button" onClick={addStack} className="px-3 py-2 text-terminal hover:bg-terminal/10 rounded font-mono text-sm">+ Adicionar tech</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input label="URL do GitHub (opcional)" name="github_url" value={data.github_url || ''} placeholder="https://github.com/usuario/repo" />
        <Input label="URL do Projeto (opcional)" name="live_url" value={data.live_url || ''} placeholder="https://meuprojeto.com" />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 font-mono text-sm text-regolith/70">
          <input type="checkbox" name="is_visible" checked={data.is_visible} className="accent-terminal" />
          Projeto visível no portfólio público
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
      </div>
    </form>
  );
}