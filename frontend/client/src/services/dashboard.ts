/**
 * Serviço de Dashboard
 * Busca estatísticas e limites de uso do usuário
 */

import { apiGet } from "@/services/api";

export interface DashboardStats {
  notesCount: number;
  maxNotes: number;
  entitiesCount: number;
  maxEntities: number;
  habitsCount: number;
  maxHabits: number;
  vaultUsedMB: number;
  maxVaultMB: number;
  recentNotes: Array<{
    id: string;
    title: string;
    updatedAt: string;
  }>;
  topMentions: Array<{
    id: string;
    name: string;
    type: string;
    count: number;
  }>;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiGet<DashboardStats>("/api/stats/summary");
}

export async function getRecentNotes() {
  return apiGet("/api/notes/recent");
}

export async function getTopMentions() {
  return apiGet("/api/entities/top-mentions");
}
