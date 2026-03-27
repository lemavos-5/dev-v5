/**
 * Serviço para métricas e dashboard
 */

import { DashboardMetrics, EntityTimeline } from "@/types/api";
import { apiGet } from "@/services/api";

// ============================================================================
// DASHBOARD METRICS
// ============================================================================

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  return apiGet<DashboardMetrics>("/api/metrics/dashboard");
}

// ============================================================================
// ENTITY TIMELINE
// ============================================================================

export async function getEntityTimeline(entityId: string): Promise<EntityTimeline> {
  return apiGet<EntityTimeline>(`/api/metrics/entities/${entityId}/timeline`);
}

// ============================================================================
// TRACKING TODAY
// ============================================================================

export async function getTrackingToday(): Promise<any[]> {
  return apiGet<any[]>("/api/tracking/today");
}
