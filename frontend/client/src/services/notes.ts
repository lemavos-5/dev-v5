/**
 * Serviço para gerenciamento de notas
 */

import {
  NoteCreateRequest,
  NoteUpdateRequest,
  NoteResponse,
  NoteSummaryDTO,
} from "@/types/api";
import { apiGet, apiPost, apiPut, apiDelete } from "@/services/api";

// ============================================================================
// LISTAR NOTAS
// ============================================================================

export async function listNotes(): Promise<NoteSummaryDTO[]> {
  return apiGet<NoteSummaryDTO[]>("/api/notes");
}

// ============================================================================
// OBTER NOTA
// ============================================================================

export async function getNote(id: string): Promise<NoteResponse> {
  return apiGet<NoteResponse>(`/api/notes/${id}`);
}

// ============================================================================
// CRIAR NOTA
// ============================================================================

export async function createNote(data: NoteCreateRequest): Promise<NoteResponse> {
  return apiPost<NoteResponse>("/api/notes", data);
}

// ============================================================================
// ATUALIZAR NOTA
// ============================================================================

export async function updateNote(
  id: string,
  data: NoteUpdateRequest
): Promise<NoteResponse> {
  return apiPut<NoteResponse>(`/api/notes/${id}`, data);
}

// ============================================================================
// DELETAR NOTA
// ============================================================================

export async function deleteNote(id: string): Promise<void> {
  await apiDelete(`/api/notes/${id}`);
}

// ============================================================================
// BUSCAR NOTAS
// ============================================================================

export async function searchNotes(query: string): Promise<NoteSummaryDTO[]> {
  const response = await apiGet<any>(`/api/search?q=${encodeURIComponent(query)}`);
  return response.notes || [];
}
