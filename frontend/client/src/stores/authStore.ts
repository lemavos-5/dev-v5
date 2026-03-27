/**
 * Zustand store para gerenciamento de estado de autenticação
 * Responsável por manter o estado do usuário, plano e tokens
 */

import { create } from "zustand";
import { UserContextResponse, PlanType, SubscriptionStatus } from "@/types/api";
import { getStoredTokens, clearTokens, storeTokens } from "@/services/api";

// ============================================================================
// TIPOS
// ============================================================================

export interface AuthState {
  // Estado
  user: UserContextResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Ações
  setUser: (user: UserContextResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  checkAuth: () => boolean;
  openUpgradeModal: () => void;

  // Helpers para plano
  canCreateNote: () => boolean;
  canCreateEntity: () => boolean;
  canCreateHabit: () => boolean;
  getRemainingNotes: () => number;
  getRemainingEntities: () => number;
  getRemainingHabits: () => number;
  isFreePlan: () => boolean;
  isPlusPlan: () => boolean;
  isProPlan: () => boolean;
  isGoldPlan: () => boolean;
}

// ============================================================================
// STORE
// ============================================================================

export const useAuthStore = create<AuthState>((set, get) => ({
  // Estado inicial
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Setters básicos
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      error: null,
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  // Logout
  logout: () => {
    clearTokens();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  // Verificar se tem token válido
  checkAuth: () => {
    const tokens = getStoredTokens();
    return !!tokens?.accessToken;
  },

  // Abrir modal de upgrade
  openUpgradeModal: () => {
    try {
      // Import dinâmico para evitar circular dependency
      import("@/stores/uiStore").then(({ useUIStore }) => {
        useUIStore.getState().setUpgradeModalOpen(true);
      });
    } catch (e) {
      console.error("Error opening upgrade modal:", e);
    }
  },

  // ========================================================================
  // HELPERS PARA PLANO
  // ========================================================================

  canCreateNote: () => {
    const { user } = get();
    if (!user) return false;
    // Contar notas atuais seria feito via API, aqui apenas validamos limite
    return user.maxNotes > 0;
  },

  canCreateEntity: () => {
    const { user } = get();
    if (!user) return false;
    return user.maxEntities > 0;
  },

  canCreateHabit: () => {
    const { user } = get();
    if (!user) return false;
    return user.maxHabits > 0;
  },

  getRemainingNotes: () => {
    const { user } = get();
    return user?.maxNotes ?? 0;
  },

  getRemainingEntities: () => {
    const { user } = get();
    return user?.maxEntities ?? 0;
  },

  getRemainingHabits: () => {
    const { user } = get();
    return user?.maxHabits ?? 0;
  },

  isFreePlan: () => {
    const { user } = get();
    return user?.plan === "FREE";
  },

  isPlusPlan: () => {
    const { user } = get();
    return user?.plan === "PLUS";
  },

  isProPlan: () => {
    const { user } = get();
    return user?.plan === "PRO";
  },

  isGoldPlan: () => {
    const { user } = get();
    return user?.plan === "GOLD";
  },
}));

// ============================================================================
// HOOKS CUSTOMIZADOS
// ============================================================================

export function useUser() {
  return useAuthStore((state) => state.user);
}

export function useIsAuthenticated() {
  return useAuthStore((state) => state.isAuthenticated);
}

export function useAuthLoading() {
  return useAuthStore((state) => state.isLoading);
}

export function useAuthError() {
  return useAuthStore((state) => state.error);
}

export function useUserPlan() {
  return useAuthStore((state) => state.user?.plan);
}

export function useUserLimits() {
  return useAuthStore((state) => ({
    maxNotes: state.user?.maxNotes ?? 0,
    maxEntities: state.user?.maxEntities ?? 0,
    maxHabits: state.user?.maxHabits ?? 0,
    advancedMetrics: state.user?.advancedMetrics ?? false,
  }));
}
