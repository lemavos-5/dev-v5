/**
 * Página de Settings e Billing
 * Gerenciamento de conta, assinatura e preferências
 */

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Zap, LogOut, Trash2, CreditCard } from "lucide-react";

import MainLayout from "@/components/Layout/MainLayout";
import { useAuthStore } from "@/stores/authStore";
import { getCurrentSubscription, cancelSubscription, initiateCheckout, getPlans } from "@/services/subscriptions";
import { logout as logoutService } from "@/services/auth";
import { SubscriptionDTO, PlanInfo } from "@/types/api";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";


// ============================================================================
// SCHEMA DE VALIDAÇÃO
// ============================================================================

const profileSchema = z.object({
  username: z.string().min(3, "Username deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// ============================================================================
// COMPONENTE
// ============================================================================

export default function Settings() {
  const { user, logout: logoutStore } = useAuthStore();
  const [, setLocation] = useLocation();

  const [subscription, setSubscription] = useState<SubscriptionDTO | null>(null);
  const [plans, setPlans] = useState<PlanInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        setValue("username", user.username);
        setValue("email", user.email);

        const [sub, plansData] = await Promise.all([
          getCurrentSubscription(),
          getPlans(),
        ]);
        setSubscription(sub);
        setPlans(plansData);
      } catch (err) {
        toast.error("Erro ao carregar dados");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);

    try {
      // Chamar API para atualizar perfil
      toast.success("Perfil atualizado!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao atualizar perfil");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Tem certeza que deseja cancelar sua assinatura?")) return;

    setIsCanceling(true);

    try {
      await cancelSubscription();
      toast.success("Assinatura cancelada!");
      const sub = await getCurrentSubscription();
      setSubscription(sub);
    } catch (err: any) {
      toast.error(err.message || "Erro ao cancelar assinatura");
    } finally {
      setIsCanceling(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutService();
      logoutStore();
      toast.success("Logout realizado");
      setLocation("/login");
    } catch (err) {
      toast.error("Erro ao fazer logout");
    }
  };

  const handleUpgrade = async (planId: string) => {
    try {
      setCheckoutPlan(planId);
      const response = await initiateCheckout(planId);
      window.location.href = response.checkoutUrl;
    } catch (err: any) {
      toast.error(err.message || "Erro ao iniciar checkout");
    } finally {
      setCheckoutPlan(null);
    }
  };

  if (isLoading || !user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando configurações...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Configurações</h1>
          <p className="text-muted-foreground">Gerencie sua conta e assinatura</p>
        </div>

        {/* Profile Section */}
        <Card className="p-6 border border-border bg-card">
          <h2 className="text-lg font-bold text-foreground mb-4">Perfil</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <div>
              <Label htmlFor="username" className="text-sm font-medium text-foreground">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                className="mt-1 bg-background border-border text-foreground"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-xs text-destructive mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                className="mt-1 bg-background border-border text-foreground"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Save Button */}
            <Button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </form>
        </Card>

        {/* Billing Section */}
        {subscription && (
          <Card className="p-6 border border-border bg-card">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-cyan-500" />
              Assinatura
            </h2>

            <div className="space-y-4">
              {/* Current Plan */}
              <div className="p-4 bg-background rounded-lg border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Plano Atual</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {subscription.effectivePlan}
                </p>
              </div>

              {/* Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-background rounded-lg border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <p className="text-sm font-medium text-foreground capitalize">
                    {subscription.status}
                  </p>
                </div>

                <div className="p-4 bg-background rounded-lg border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Período Atual Termina</p>
                  <p className="text-sm font-medium text-foreground">
                    {formatDistanceToNow(new Date(subscription.currentPeriodEnd), {
                      locale: ptBR,
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>

              {/* Limits */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-background rounded-lg border border-border/50 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Notas</p>
                  <p className="text-lg font-bold text-cyan-400">
                    {subscription.maxNotes}
                  </p>
                </div>
                <div className="p-3 bg-background rounded-lg border border-border/50 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Entidades</p>
                  <p className="text-lg font-bold text-cyan-400">
                    {subscription.maxEntities}
                  </p>
                </div>
                <div className="p-3 bg-background rounded-lg border border-border/50 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Hábitos</p>
                  <p className="text-lg font-bold text-cyan-400">
                    {subscription.maxHabits}
                  </p>
                </div>
              </div>

              {/* Upgrade Button */}
              {subscription.effectivePlan !== "GOLD" && (
                <Button
                  onClick={() => {
                    const nextPlan = plans.find((p) => p.plan !== subscription.effectivePlan);
                    if (nextPlan) handleUpgrade(nextPlan.priceId);
                  }}
                  className="w-full bg-cyan-600 hover:bg-cyan-700"
                  disabled={checkoutPlan !== null}
                >
                  {checkoutPlan ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Redirecionando...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Fazer Upgrade
                    </>
                  )}
                </Button>
              )}

              {/* Cancel Button */}
              {subscription.status === "ACTIVE" && (
                <Button
                  onClick={handleCancelSubscription}
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  disabled={isCanceling}
                >
                  {isCanceling ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Cancelando...
                    </>
                  ) : (
                    "Cancelar Assinatura"
                  )}
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Danger Zone */}
        <Card className="p-6 border border-destructive/30 bg-destructive/5">
          <h2 className="text-lg font-bold text-destructive mb-4">Zona de Perigo</h2>

          <div className="space-y-3">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Fazer Logout
            </Button>

            <Button
              variant="outline"
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Deletar Conta
            </Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
