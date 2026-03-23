import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotesStore } from '../stores/useNotesStore';
import { useEntitiesStore } from '../stores/useEntitiesStore';
import { Plus, FileText, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Notes() {
  const { notes, loading, fetchNotes, createNote, deleteNote } = useNotesStore();
  const { entities, fetchEntities } = useEntitiesStore();
  const [search, setSearch] = useState('');
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => { fetchNotes(); fetchEntities(); }, []);

  const filtered = notes
    .filter((n) => selectedEntityId ? n.entityIds.includes(selectedEntityId) : true)
    .filter((n) => {
      const noteContent = n.content ?? '';
      const query = search.toLowerCase();
      return (
        n.title.toLowerCase().includes(query) ||
        noteContent.toLowerCase().includes(query)
      );
    });

  const handleCreate = async () => {
    if (!title.trim()) return;
    try {
      const created = await createNote({ title, content });
      setTitle(''); setContent(''); setShowCreate(false);

      if (created.entityIds && created.entityIds.length > 0) {
        const names = entities
          .filter((entity) => created.entityIds.includes(entity.id))
          .map((entity) => entity.name);
        toast.success(`Note created and linked to: ${names.join(', ')}`);
      } else {
        toast.success('Note created');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create note');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNote(id);
      toast.success('Note deleted');
    } catch {
      toast.error('Failed to delete note');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 animate-fade-in">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Notes</h1>
        <button onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-smooth hover:bg-primary/90">
          <Plus className="h-4 w-4" strokeWidth={1.5} /> New Note
        </button>
      </header>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes..."
          className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm outline-none ring-ring focus:ring-2"
        />
      </div>

      {/* Entity filter badges */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button onClick={() => setSelectedEntityId(null)}
          className={`rounded-full px-3 py-1 text-xs ${!selectedEntityId ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
          All entities
        </button>
        {entities.map((entity) => (
          <button key={entity.id} onClick={() => setSelectedEntityId(entity.id)}
            className={`rounded-full px-3 py-1 text-xs ${selectedEntityId === entity.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            {entity.name}
          </button>
        ))}
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm" onClick={() => setShowCreate(false)}>
          <div className="w-full max-w-lg rounded-xl bg-card p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">New Note</h2>
            <div className="space-y-3">
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title" autoFocus
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2" />
              <textarea value={content} onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note..." rows={6}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2 resize-none" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowCreate(false)} className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-muted">Cancel</button>
              <button onClick={handleCreate} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Notes list */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="surface-elevated p-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-muted-foreground" strokeWidth={1} />
          <h3 className="mt-3 text-base font-semibold">No notes yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">Create your first note to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((note) => (
            <div key={note.id} className="surface-elevated flex items-start justify-between p-5 transition-smooth hover:shadow-md group">
              <Link to={`/notes/${note.id}`} className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold truncate">{note.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{note.content ?? 'No preview available'}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </p>
              </Link>
              <button onClick={() => handleDelete(note.id)}
                className="ml-4 rounded-md p-1.5 text-muted-foreground opacity-0 transition-smooth hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100">
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
