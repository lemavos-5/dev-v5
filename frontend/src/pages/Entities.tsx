import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEntitiesStore } from '../stores/useEntitiesStore';
import { EntityType } from '../types/api';
import { Plus, Search, Trash2, User, Briefcase, BookOpen, Lightbulb, Zap } from 'lucide-react';
import { toast } from 'sonner';

// Entity type icons
const ENTITY_ICONS: Record<EntityType, any> = {
  person: User,
  project: Briefcase,
  topic: BookOpen,
  concept: Lightbulb,
  habit: Zap,
};

const ENTITY_COLORS: Record<EntityType, string> = {
  person: 'bg-blue-100 text-blue-700',
  project: 'bg-purple-100 text-purple-700',
  topic: 'bg-green-100 text-green-700',
  concept: 'bg-yellow-100 text-yellow-700',
  habit: 'bg-orange-100 text-orange-700',
};

export default function Entities() {
  const { entities, loading, fetchEntities, createEntity, deleteEntity } = useEntitiesStore();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<EntityType>('person');

  useEffect(() => { fetchEntities(); }, []);

  const filtered = entities.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    if (!title.trim()) return;
    try {
      await createEntity({ title, description: description || undefined, type });
      setTitle(''); setDescription(''); setType('person'); setShowCreate(false);
      toast.success('Entity created');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create entity');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this entity?')) return;
    try {
      await deleteEntity(id);
      toast.success('Entity deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 animate-fade-in">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Entities</h1>
        <button onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-smooth hover:bg-primary/90">
          <Plus className="h-4 w-4" strokeWidth={1.5} /> New Entity
        </button>
      </header>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search entities..."
          className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm outline-none ring-ring focus:ring-2" />
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm" onClick={() => setShowCreate(false)}>
          <div className="w-full max-w-lg rounded-xl bg-card p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">New Entity</h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Type</label>
                <select value={type} onChange={(e) => setType(e.target.value as EntityType)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2">
                  <option value="person">Person</option>
                  <option value="project">Project</option>
                  <option value="topic">Topic</option>
                  <option value="concept">Concept</option>
                  <option value="habit">Habit</option>
                </select>
              </div>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="Entity name" autoFocus
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2" />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)" rows={3}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2 resize-none" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowCreate(false)} className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-muted">Cancel</button>
              <button onClick={handleCreate} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Create</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map((i) => <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="surface-elevated p-12 text-center">
          <Plus className="mx-auto h-10 w-10 text-muted-foreground" strokeWidth={1} />
          <h3 className="mt-3 text-base font-semibold">No entities yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">Track people, projects, and habits.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((entity) => {
            const Icon = entity.type ? ENTITY_ICONS[entity.type] : Plus;
            const colorClass = entity.type ? ENTITY_COLORS[entity.type] : 'bg-gray-100 text-gray-700';
            return (
              <div key={entity.id} className="surface-elevated p-5 transition-smooth hover:shadow-md group">
                <div className="flex items-start justify-between">
                  <Link to={`/entities/${entity.id}`} className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {entity.type && (
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
                          <Icon className="h-3 w-3 mr-1" strokeWidth={2} />
                          {entity.type}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold truncate">{entity.title}</h3>
                    {entity.description && (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{entity.description}</p>
                    )}
                    <p className="mt-2 text-xs text-muted-foreground">
                      Created {new Date(entity.createdAt).toLocaleDateString()}
                    </p>
                  </Link>
                  <button onClick={() => handleDelete(entity.id)}
                    className="ml-3 rounded-md p-1.5 text-muted-foreground opacity-0 transition-smooth hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100">
                    <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
