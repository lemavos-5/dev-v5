/**
 * Componente de Auth Bootstrap
 * Carrega dados do usuário ao iniciar a aplicação se houver token
 */

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { hasValidToken, getStoredTokens } from "@/services/api";
import { getCurrentUser } from "@/services/auth";

export function AuthBootstrap() {
  const { setUser, setError } = useAuthStore();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        // Se tem token, tenta carregar usuário
        if (hasValidToken()) {
          const user = await getCurrentUser();
          setUser(user);
        }
      } catch (err) {
        console.error("Auth bootstrap failed:", err);
        setError("Erro ao carregar dados do usuário");
      }
    };

    bootstrap();
  }, []); // Roda apenas uma vez no mount

  return null;
}
