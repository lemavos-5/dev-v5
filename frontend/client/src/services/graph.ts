/**
 * Serviço de Knowledge Graph
 * Busca dados de nós e links para visualização
 */

import { apiGet } from "@/services/api";

export interface GraphNode {
  id: string;
  label: string;
  type: "NOTE" | "ENTITY" | "PERSON" | "PROJECT" | "CONCEPT" | "HABIT";
  color?: string;
  size?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  label?: string;
  strength?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export async function getGraphData(): Promise<GraphData> {
  return apiGet<GraphData>("/api/entities/graph");
}

export async function getEntityDetails(entityId: string) {
  return apiGet(`/api/entities/${entityId}`);
}

export async function getNoteDetails(noteId: string) {
  return apiGet(`/api/notes/${noteId}`);
}
