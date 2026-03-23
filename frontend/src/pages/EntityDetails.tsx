import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEntitiesStore } from '../stores/useEntitiesStore';
import { ArrowLeft, FileText, Users, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { entitiesApi } from '../api/client';

interface EntityContextNote {
  id: string;
  title: string;
}

interface EntityContext {
  entity: {
    id: string;
    userId: string;
    name: string;
    type: string;
    description: string;
  };
  connectedNotes: EntityContextNote[];
}

export default function EntityDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentEntity, connections, deleteEntity, loading } = useEntitiesStore();
  const [entityContext, setEntityContext] = useState<EntityContext | null>(null);
  const [contextLoading, setContextLoading] = useState(false);

  useEffect(() => {
    const loadContext = async () => {
      if (!id) return;
      setContextLoading(true);
      try {
        const { data } = await entitiesApi.getContext(id);
        setEntityContext(data);
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to load entity context');
      }
      setContextLoading(false);
    };

    if (id) {
      loadContext();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    await deleteEntity(id);
    toast.success('Entity deleted');
    navigate('/entities');
  };

  const entity = entityContext?.entity || currentEntity;
  const connectedNotes = entityContext?.connectedNotes || [];
  const loadingState = loading || contextLoading;

  if (loadingState || !entity) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="h-8 w-48 animate-pulse rounded bg-muted mb-4" />
        <div className="h-32 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/entities')} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-smooth">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> Entities
        </button>
        <button onClick={handleDelete}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-smooth">
          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

          <div className="surface-elevated p-6 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{entity.name}</h1>
            {entity.type && (
              <span className="inline-flex rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent mt-2">
                {entity.type}
              </span>
            )}
          </div>
        </div>
        {entity.description && (
          <p className="mt-3 text-sm text-body">{entity.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Related notes */}
        <section>
          <h2 className="flex items-center gap-2 text-sm font-semibold mb-4">
            <FileText className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} /> Related Notes
          </h2>
          {connectedNotes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notes linked to this entity yet.</p>
          ) : (
            <div className="space-y-2">
              {connectedNotes.map((note) => (
                <Link key={note.id} to={`/notes/${note.id}`} className="surface block p-4 transition-smooth hover:shadow-md">
                  <h3 className="text-sm font-medium truncate">{note.title}</h3>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Connections */}
        <section>
          <h2 className="flex items-center gap-2 text-sm font-semibold mb-4">
            <Users className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} /> Connections
          </h2>
          {connections.length === 0 ? (
            <p className="text-sm text-muted-foreground">No connections yet.</p>
          ) : (
            <div className="space-y-2">
              {connections.map((conn) => (
                <Link key={conn.id} to={`/entities/${conn.id}`} className="surface block p-4 transition-smooth hover:shadow-md">
                  <h3 className="text-sm font-medium">{conn.title}</h3>
                  {conn.description && <p className="mt-1 text-xs text-muted-foreground truncate">{conn.description}</p>}
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
