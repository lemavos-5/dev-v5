/**
 * Página de Cancelamento de Subscription
 * Exibe mensagem quando usuário cancela pagamento
 */

import { useEffect } from "react";
import { useLocation } from "wouter";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SubscriptionCancel() {
  const [, navigate] = useLocation();

  useEffect(() => {
    // Auto-redirecionar para settings após 5 segundos
    const timer = setTimeout(() => {
      navigate("/settings");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <XCircle className="w-16 h-16 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Pagamento Cancelado
        </h1>
        <p className="text-muted-foreground mb-6">
          Você cancelou o processo de pagamento. Nenhuma cobrança foi realizada.
        </p>
        <div className="space-y-3">
          <Button
            onClick={() => navigate("/settings")}
            className="w-full bg-cyan-600 hover:bg-cyan-700"
          >
            Voltar para Settings
          </Button>
          <Button
            onClick={() => navigate("/dashboard")}
            variant="outline"
            className="w-full"
          >
            Ir para Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
