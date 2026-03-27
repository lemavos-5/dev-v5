/**
 * Página inicial - Redireciona baseado no status de autenticação
 */

import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/stores/authStore";
import { hasValidToken } from "@/services/api";

export default function Index() {
  const [, navigate] = useLocation();
  const { user } = useAuthStore();
  const redirectedRef = useRef(false);

  useEffect(() => {
    // Evita múltiplos redirecionamentos
    if (redirectedRef.current) return;

    // Aguarda um tick para garantir que AuthBootstrap carregou o usuário
    const timer = setTimeout(() => {
      redirectedRef.current = true;
      
      if (hasValidToken() && user) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4" />
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}
