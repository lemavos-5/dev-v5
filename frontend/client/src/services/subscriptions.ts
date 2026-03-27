/**
 * Serviço para subscriptions e billing
 */

import { SubscriptionDTO, CheckoutResponse, PlanInfo } from "@/types/api";
import { apiGet, apiPost } from "@/services/api";

// ============================================================================
// OBTER PLANOS
// ============================================================================

export async function getPlans(): Promise<PlanInfo[]> {
  return apiGet<PlanInfo[]>("/api/plans");
}

// ============================================================================
// OBTER SUBSCRIPTION ATUAL
// ============================================================================

export async function getCurrentSubscription(): Promise<SubscriptionDTO> {
  return apiGet<SubscriptionDTO>("/api/subscriptions/me");
}

// ============================================================================
// CHECKOUT
// ============================================================================

/**
 * Criar sessão de checkout do Stripe
 * @param planId - ID do plano a ser contratado
 * @returns URL de redirecionamento para o Stripe
 */
export async function initiateCheckout(planId: string): Promise<CheckoutResponse> {
  const response = await apiPost<CheckoutResponse>("/api/subscriptions/create-session", {
    planId,
  });
  return response;
}

// ============================================================================
// CANCELAR SUBSCRIPTION
// ============================================================================

export async function cancelSubscription(): Promise<SubscriptionDTO> {
  return apiPost<SubscriptionDTO>("/api/subscriptions/cancel", {});
}
