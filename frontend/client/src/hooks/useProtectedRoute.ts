/**
 * Hook para verificar autenticação
 * NÃO faz redirecionamento automático - deixa para a página Index.tsx
 */

import { useAuthStore } from "@/stores/authStore";
import { hasValidToken } from "@/services/api";

export function useProtectedRoute() {
  const { user, isAuthenticated } = useAuthStore();

  return {
    isAuthenticated,
    user,
    isReady: !!user && hasValidToken(),
  };
}

export function usePublicRoute() {
  const { user, isAuthenticated } = useAuthStore();

  return {
    isAuthenticated,
    user,
    isReady: !user || !hasValidToken(),
  };
}
