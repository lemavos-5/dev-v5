/**
 * Serviço para gerenciamento de entidades (Knowledge Graph)\n */

import {
  EntityCreateRequest,
  EntityUpdateRequest,
  EntityResponse,
  EntityContextResponse,
  TrackEventRequest,
  TrackingStats,
  GraphDTO,
} from "@/types/api";
import { apiGet, apiPost, apiPut, apiDelete } from "@/services/api";

// ============================================================================
// LISTAR ENTIDADES
// ============================================================================

export async function listEntities(): Promise<EntityResponse[]> {
  return apiGet<EntityResponse[]>("/api/entities");
}

// ============================================================================
// OBTER ENTIDADE
// ============================================================================

export async function getEntity(id: string): Promise<EntityResponse> {
  return apiGet<EntityResponse>(`/api/entities/${id}`);
}

// ============================================================================
// CRIAR ENTIDADE
// ============================================================================

export async function createEntity(data: EntityCreateRequest): Promise<EntityResponse> {
  return apiPost<EntityResponse>("/api/entities", data);
}

// ============================================================================
// ATUALIZAR ENTIDADE
// ============================================================================

export async function updateEntity(
  id: string,
  data: EntityUpdateRequest
): Promise<EntityResponse> {
  return apiPut<EntityResponse>(`/api/entities/${id}`, data);
}

// ============================================================================
// DELETAR ENTIDADE
// ============================================================================

export async function deleteEntity(id: string): Promise<void> {
  await apiDelete(`/api/entities/${id}`);
}

// ============================================================================
// CONTEXTO DE ENTIDADE
// ============================================================================

export async function getEntityContext(id: string): Promise<EntityContextResponse> {
  return apiGet<EntityContextResponse>(`/api/entities/${id}/context`);
}

// ============================================================================
// ENTIDADES CONECTADAS
// ============================================================================

export async function getConnectedEntities(id: string): Promise<EntityResponse[]> {
  return apiGet<EntityResponse[]>(`/api/entities/${id}/connections`);
}

// ============================================================================
// NOTAS QUE MENCIONAM ENTIDADE
// ============================================================================

export async function getEntityNotes(id: string): Promise<any[]> {
  return apiGet<any[]>(`/api/entities/${id}/notes`);
}

// ============================================================================
// TRACKING DE HÁBITOS
// ============================================================================

export async function trackHabit(entityId: string, date?: string): Promise<EntityResponse> {
  const data = date ? { date } : {};
  return apiPost<EntityResponse>(`/api/entities/${entityId}/track`, data);
}

export async function untrackHabit(entityId: string, date: string): Promise<void> {
  await apiDelete(`/api/entities/${entityId}/track?date=${date}`);
}

export async function getHabitStats(entityId: string): Promise<TrackingStats> {
  return apiGet<TrackingStats>(`/api/entities/${entityId}/stats`);
}

export async function getHabitHeatmap(entityId: string): Promise<Record<string, number>> {
  const response = await apiGet<any>(`/api/entities/${entityId}/heatmap`);
  return response.heatmap || {};
}

// ============================================================================
// KNOWLEDGE GRAPH
// ============================================================================

export async function getGraphData(): Promise<GraphDTO> {
  return apiGet<GraphDTO>("/api/graph/data");
}
