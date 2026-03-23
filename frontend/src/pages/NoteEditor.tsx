import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotesStore } from '../stores/useNotesStore';
import { useEntitiesStore } from '../stores/useEntitiesStore';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { MarkdownEditor } from '../components/Editor';

export default function NoteEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentNote, fetchNoteById, updateNote, deleteNote, clearCurrentNote, loading } = useNotesStore();
  const { entities, fetchEntities } = useEntitiesStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  const connectedEntities = useMemo(() => {
    if (!currentNote) return [];
    return entities.filter((entity) => currentNote.entityIds?.includes(entity.id));
  }, [entities, currentNote]);

  useEffect(() => {
    if (id) {
      fetchNoteById(id);
      fetchEntities();
    }
    return () => {
      clearCurrentNote();
    };
  }, [id]);

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
      setLastSaved(new Date(currentNote.updatedAt));
    }
  }, [currentNote]);

  const save = useCallback(async () => {
    if (!id || !title.trim()) return;
    setSaving(true);
    try {
      const updated = await updateNote(id, { title, content });
      setLastSaved(new Date());

      if (updated.entityIds && updated.entityIds.length > 0) {
        const names = entities
          .filter((entity) => updated.entityIds.includes(entity.id))
          .map((entity) => entity.name);
        toast.success(`Saved and linked to: ${names.join(', ')}`);
      } else {
        toast.success('Saved');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
    setSaving(false);
  }, [id, title, content, updateNote, entities]);

  // Auto-save with debounce
  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    saveTimeoutRef.current = setTimeout(() => {
      if (id && (title.trim() || content.trim())) {
        save();
      }
    }, 2000); // Auto-save every 2 seconds

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [title, content, id, save]);

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('Delete this note?')) return;
    try {
      await deleteNote(id);
      toast.success('Note deleted');
      navigate('/notes');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  if (loading || !currentNote) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <div className="h-8 w-48 animate-pulse rounded bg-muted mb-4" />
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/notes')} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-smooth">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> Back
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {saving ? 'Saving...' : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Not saved'}
          </span>
          <button onClick={handleDelete}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-smooth">
            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="mb-4">
        {connectedEntities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {connectedEntities.map((entity) => (
              <span key={entity.id} className="px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-medium">
                {entity.name}
              </span>
            ))}
          </div>
        )}
        <input
          type="text" value={title} onChange={(e) => setTitle(e.target.value)}
          className="w-full text-2xl font-bold bg-transparent outline-none mb-6 placeholder:text-muted-foreground"
          placeholder="Untitled"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-5">
        <div>
          <MarkdownEditor
            value={content}
            onChange={setContent}
            placeholder="Write your note in markdown..."
            minHeight="400px"
          />
        </div>

        <aside className="rounded-md border border-input bg-background p-4 text-sm">
          <h3 className="font-semibold mb-2">Connected Entities</h3>
          {connectedEntities.length === 0 ? (
            <p className="text-muted-foreground">No entities connected</p>
          ) : (
            <ul className="space-y-1">
              {connectedEntities.map((entity) => (
                <li key={entity.id} className="font-medium text-sm text-foreground">• {entity.name}</li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}
