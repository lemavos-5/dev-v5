/**
 * Página de Listagem de Notas
 */

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Plus, Search, Trash2 } from "lucide-react";
import MainLayout from "@/components/Layout/MainLayout";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { listNotes, deleteNote, searchNotes } from "@/services/notes";
import { NoteSummaryDTO } from "@/types/api";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Notes() {
  const { isReady } = useProtectedRoute();
  const [, setLocation] = useLocation();

  const [notes, setNotes] = useState<NoteSummaryDTO[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<NoteSummaryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isReady) return;

    const loadNotes = async () => {
      try {
        const data = await listNotes();
        setNotes(data);
        setFilteredNotes(data);
      } catch (err) {
        toast.error("Erro ao carregar notas");
      } finally {
        setIsLoading(false);
      }
    };

    loadNotes();
  }, [isReady]);

  // Buscar notas
  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredNotes(notes);
      return;
    }

    try {
      const results = await searchNotes(query);
      setFilteredNotes(results);
    } catch (err) {
      toast.error("Erro ao buscar notas");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta nota?")) return;

    try {
      await deleteNote(id);
      setNotes(notes.filter((n) => n.id !== id));
      setFilteredNotes(filteredNotes.filter((n) => n.id !== id));
      toast.success("Nota deletada!");
    } catch (err) {
      toast.error("Erro ao deletar nota");
    }
  };

  if (!isReady || isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando notas...</p>
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
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Minhas Notas</h1>
            <p className="text-muted-foreground">
              {notes.length} nota{notes.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button
            onClick={() => setLocation("/notes/new")}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Nota
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar notas..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <Card className="p-12 border border-border bg-card text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma nota encontrada</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "Tente uma busca diferente"
                : "Comece criando sua primeira nota"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setLocation("/notes/new")}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Nota
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <Card
                key={note.id}
                className="p-4 border border-border bg-card hover:border-cyan-600/30 transition-colors cursor-pointer group"
                onClick={() => setLocation(`/notes/${note.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-bold text-foreground flex-1 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                    {note.title}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(note.id);
                    }}
                    className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
                  {note.content}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{note.entityIds.length} entidades</span>
                  <span>
                    {formatDistanceToNow(new Date(note.updatedAt), {
                      locale: ptBR,
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
