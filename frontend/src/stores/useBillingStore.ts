import { create } from 'zustand';
import { SubscriptionDTO, PlanInfo, CheckoutResponse } from '../types/api';
import apiClient from '../api/client';

interface BillingState {
  subscription: SubscriptionDTO | null;
  plans: PlanInfo[];
  loading: boolean;
  error: string | null;
  fetchSubscription: () => Promise<void>;
  fetchPlans: () => Promise<void>;
  checkout: (priceId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  clearError: () => void;
  setError: (error: string | null) => void;
}

export const useBillingStore = create<BillingState>((set) => ({
  subscription: null,
  plans: [],
  loading: false,
  error: null,

  clearError: () => set({ error: null }),
  setError: (error) => set({ error }),

  fetchSubscription: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiClient.get<SubscriptionDTO>('/subscriptions/me');
      set({ subscription: data, loading: false, error: null });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch subscription';
      set({ loading: false, error: message });
    }
  },

  fetchPlans: async () => {
    try {
      set({ error: null });
      const { data } = await apiClient.get<PlanInfo[]>('/plans');
      set({ plans: data });
    } catch (err: any) {
      console.error('Failed to fetch plans:', err);
      set({ plans: [] });
    }
  },

  checkout: async (priceId) => {
    try {
      set({ error: null });
      const { data } = await apiClient.post<CheckoutResponse>('/subscriptions/checkout', { priceId });
      window.location.href = data.url;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Checkout failed';
      set({ error: message });
      throw err;
    }
  },

  cancelSubscription: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiClient.post<SubscriptionDTO>('/subscriptions/cancel');
      set({ subscription: data, loading: false, error: null });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to cancel subscription';
      set({ loading: false, error: message });
      throw err;
    }
  },
}));
