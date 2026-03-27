/**
 * Modal de Upgrade
 * Exibe planos disponíveis e inicia checkout
 */

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Check, Zap } from "lucide-react";

import { useUpgradeModal } from "@/stores/uiStore";
import { useUserPlan } from "@/stores/authStore";
import { getPlans, initiateCheckout } from "@/services/subscriptions";
import { PlanInfo } from "@/types/api";

export default function UpgradeModal() {
  const { open, setOpen } = useUpgradeModal();
  const currentPlan = useUserPlan();
  const [, setLocation] = useLocation();

  const [plans, setPlans] = useState<PlanInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const loadPlans = async () => {
      try {
        const data = await getPlans();
        setPlans(data);
      } catch (err) {
        toast.error("Erro ao carregar planos");
      } finally {
        setIsLoading(false);
      }
    };

    loadPlans();
  }, [open]);

  const handleCheckout = async (planId: string) => {
    setCheckoutLoading(planId);

    try {
      const response = await initiateCheckout(planId);
      // Redirecionar para Stripe
      window.location.href = response.checkoutUrl;
    } catch (err: any) {
      toast.error(err.message || "Erro ao iniciar checkout");
    } finally {
      setCheckoutLoading(null);
    }
  };

  const planOrder = ["FREE", "PLUS", "PRO", "GOLD"];
  const sortedPlans = [...plans].sort(
    (a, b) => planOrder.indexOf(a.plan) - planOrder.indexOf(b.plan)
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground">
            Escolha seu Plano
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Atualize para desbloquear mais recursos e limites
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-500 mx-auto mb-2" />
              <p className="text-muted-foreground">Carregando planos...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-6">
            {sortedPlans.map((plan) => (
              <Card
                key={plan.plan}
                className={`p-4 border transition-colors ${
                  currentPlan === plan.plan
                    ? "border-cyan-600 bg-cyan-600/10"
                    : "border-border hover:border-cyan-600/30"
                }`}
              >
                {/* Plan Name */}
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {plan.plan}
                </h3>

                {/* Price */}
                {plan.monthlyPrice && (
                  <p className="text-2xl font-bold text-cyan-400 mb-4">
                    ${plan.monthlyPrice}
                    <span className="text-xs text-muted-foreground">/mês</span>
                  </p>
                )}

                {/* Features */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-500" />
                    <span className="text-muted-foreground">
                      {plan.limits.maxNotes} notas
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-500" />
                    <span className="text-muted-foreground">
                      {plan.limits.maxEntities} entidades
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-500" />
                    <span className="text-muted-foreground">
                      {plan.limits.maxHabits} hábitos
                    </span>
                  </div>
                  {plan.limits.advancedMetrics && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-cyan-500" />
                      <span className="text-muted-foreground">Métricas avançadas</span>
                    </div>
                  )}
                  {plan.limits.dataExport && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-cyan-500" />
                      <span className="text-muted-foreground">Exportar dados</span>
                    </div>
                  )}
                </div>

                {/* Button */}
                {currentPlan === plan.plan ? (
                  <Button
                    disabled
                    className="w-full bg-cyan-600/20 text-cyan-400 border border-cyan-600/30"
                  >
                    Plano Atual
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleCheckout(plan.plan.toLowerCase())}
                    disabled={checkoutLoading === plan.plan.toLowerCase()}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    {checkoutLoading === plan.plan.toLowerCase() ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Fazer Upgrade
                      </>
                    )}
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
