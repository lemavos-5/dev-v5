/**
 * Página de Editor de Notas
 * Editor Markdown com painel de entidades relacionadas
 */

import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Save, ArrowLeft, Trash2 } from "lucide-react";

import MainLayout from "@/components/Layout/MainLayout";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { createNote, updateNote, getNote, deleteNote } from "@/services/notes";
import { getEntityContext } from "@/services/entities";
import { NoteResponse, EntityResponse } from "@/types/api";

// ============================================================================
// SCHEMA DE VALIDAÇÃO
// ============================================================================

const noteSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  content: z.string().min(1, "Conteúdo é obrigatório"),
});

type NoteFormData = z.infer<typeof noteSchema>;

// ============================================================================
// COMPONENTE
// ============================================================================

export default function NoteEditor() {
  const { isReady } = useProtectedRoute();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/notes/:id");
  const noteId = params?.id;

  const [note, setNote] = useState<NoteResponse | null>(null);
  const [entities, setEntities] = useState<EntityResponse[]>([]);
  const [isLoading, setIsLoading] = useState(!!noteId);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
  });

  // Carregar nota se em modo edição
  useEffect(() => {
    if (!isReady || !noteId) return;

    const loadNote = async () => {
      try {
        const data = await getNote(noteId);
        setNote(data);
        setValue("title", data.title);
        setValue("content", data.content);

        // Carregar entidades relacionadas
        if (data.entityIds.length > 0) {
          const entityPromises = data.entityIds.map((id) => getEntityContext(id));
          const entityContexts = await Promise.all(entityPromises);
          setEntities(entityContexts.map((ctx) => ctx.entity));
        }
      } catch (err) {
        toast.error("Erro ao carregar nota");
        setLocation("/notes");
      } finally {
        setIsLoading(false);
      }
    };

    loadNote();
  }, [isReady, noteId, setValue, setLocation]);

  const onSubmit = async (data: NoteFormData) => {
    setIsSaving(true);

    try {
      if (noteId) {
        await updateNote(noteId, data);
        toast.success("Nota atualizada!");
      } else {
        const newNote = await createNote(data);
        toast.success("Nota criada!");
        setLocation(`/notes/${newNote.id}`);
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar nota");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!noteId) return;

    if (!confirm("Tem certeza que deseja deletar esta nota?")) return;

    try {
      await deleteNote(noteId);
      toast.success("Nota deletada!");
      setLocation("/notes");
    } catch (err) {
      toast.error("Erro ao deletar nota");
    }
  };

  if (!isReady) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setLocation("/notes")}
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-bold text-foreground">
              {noteId ? "Editar Nota" : "Nova Nota"}
            </h1>
          </div>

          {noteId && (
            <Button
              onClick={handleDelete}
              variant="outline"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Deletar
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor */}
          <div className="lg:col-span-2 space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Title */}
              <div>
                <Input
                  type="text"
                  placeholder="Título da nota..."
                  className="text-xl font-bold bg-card border-border text-foreground placeholder:text-muted-foreground"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-xs text-destructive mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Content */}
              <div>
                <Textarea
                  placeholder="Escreva seu conteúdo em Markdown..."
                  className="min-h-96 font-mono text-sm bg-card border-border text-foreground placeholder:text-muted-foreground"
                  {...register("content")}
                />
                {errors.content && (
                  <p className="text-xs text-destructive mt-1">{errors.content.message}</p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Suporta Markdown: **bold**, *italic*, `code`, # Headings, etc.
                </p>
              </div>

              {/* Save Button */}
              <Button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Nota
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Entidades Relacionadas */}
          <div className="space-y-4">
            <Card className="p-4 border border-border bg-card">
              <h2 className="text-sm font-bold text-foreground mb-3">Entidades Relacionadas</h2>

              {entities.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Nenhuma entidade mencionada nesta nota ainda.
                </p>
              ) : (
                <div className="space-y-2">
                  {entities.map((entity) => (
                    <div
                      key={entity.id}
                      className="p-3 bg-background rounded-lg border border-border/50 hover:border-cyan-600/30 transition-colors cursor-pointer"
                      onClick={() => setLocation(`/entities/${entity.id}`)}
                    >
                      <p className="text-sm font-medium text-foreground">{entity.title}</p>
                      <p className="text-xs text-cyan-400">{entity.type}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Info */}
            <Card className="p-4 border border-border bg-card/50">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Mencione entidades no seu conteúdo usando @nome para criar conexões no Knowledge Graph.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
