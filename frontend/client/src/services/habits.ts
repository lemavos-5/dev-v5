/**
 * Serviço de Hábitos
 * Gerencia criação, edição e tracking de hábitos com heatmap
 */

import { apiGet, apiPost, apiPut, apiDelete } from "@/services/api";

export interface HabitEntry {
  date: string; // YYYY-MM-DD
  completed: boolean;
  intensity?: number; // 0-4 para cores do heatmap
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: string;
  entries: HabitEntry[];
  currentStreak: number;
  longestStreak: number;
}

export interface HabitStats {
  totalHabits: number;
  maxHabits: number;
  habits: Habit[];
}

/**
 * Obter todos os hábitos com entries dos últimos 90 dias
 */
export async function getHabits(): Promise<HabitStats> {
  return apiGet<HabitStats>("/api/habits");
}

/**
 * Obter detalhes de um hábito específico
 */
export async function getHabit(habitId: string): Promise<Habit> {
  return apiGet<Habit>(`/api/habits/${habitId}`);
}

/**
 * Criar novo hábito
 */
export async function createHabit(data: {
  name: string;
  description?: string;
  color: string;
}): Promise<Habit> {
  return apiPost<Habit>("/api/habits", data);
}

/**
 * Atualizar hábito
 */
export async function updateHabit(
  habitId: string,
  data: Partial<Habit>
): Promise<Habit> {
  return apiPut<Habit>(`/api/habits/${habitId}`, data);
}

/**
 * Deletar hábito
 */
export async function deleteHabit(habitId: string): Promise<void> {
  return apiDelete(`/api/habits/${habitId}`);
}

/**
 * Marcar hábito como completo em uma data
 */
export async function markHabitComplete(
  habitId: string,
  date: string
): Promise<HabitEntry> {
  return apiPost<HabitEntry>(`/api/habits/${habitId}/complete`, { date });
}

/**
 * Desmarcar hábito em uma data
 */
export async function unmarkHabitComplete(
  habitId: string,
  date: string
): Promise<void> {
  return apiDelete(`/api/habits/${habitId}/complete?date=${date}`);
}

/**
 * Obter streak atual de um hábito
 */
export async function getHabitStreak(habitId: string): Promise<{
  current: number;
  longest: number;
}> {
  return apiGet(`/api/habits/${habitId}/streak`);
}
