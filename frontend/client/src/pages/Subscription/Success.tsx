/**
 * Página de Sucesso de Subscription
 * Redireciona para dashboard após pagamento bem-sucedido
 */

import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/stores/authStore";
import { getCurrentUser } from "@/services/auth";
import toast from "react-hot-toast";
import { CheckCircle, Loader2 } from "lucide-react";

export default function SubscriptionSuccess() {
  const [, navigate] = useLocation();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const handleSuccess = async () => {
      try {
        // Re-fetch dados do usuário para atualizar plano
        const updatedUser = await getCurrentUser();
        setUser(updatedUser);
        toast.success("Upgrade realizado com sucesso!");
        
        // Redirecionar para dashboard após 2 segundos
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } catch (error) {
        toast.error("Erro ao atualizar dados. Redirecionando...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    };

    handleSuccess();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Pagamento Confirmado!
        </h1>
        <p className="text-muted-foreground mb-6">
          Seu upgrade foi processado com sucesso. Redirecionando para o dashboard...
        </p>
        <div className="flex justify-center">
          <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
        </div>
      </div>
    </div>
  );
}
